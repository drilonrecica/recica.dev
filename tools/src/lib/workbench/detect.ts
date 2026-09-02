/**
 * Content detection for the smart-paste front door.
 *
 * Pure functions over a string. No network, no eval, no side effects.
 * Returns tool suggestions ranked by confidence.
 */
export type Detection = {
	toolId: string;
	label: string;
	confidence: number;
};

const JWT_PATTERN = /^[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HEX_COLOR_PATTERN = /^#?(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNC_COLOR_PATTERN = /^(?:rgba?|hsla?)\(\s*[\d.%\s,/-]+\)$/i;
const TIMESTAMP_PATTERN = /^\d{9,13}$/;
const URL_PATTERN = /^https?:\/\/[^\s]+$/i;
const PERCENT_ENCODED_PATTERN = /%[0-9a-f]{2}/i;
const QUERY_PATTERN = /^\??[^=&\s]+=[^&\s]*(?:&[^=&\s]+=[^&\s]*)*$/;
const BASE64_PATTERN = /^[A-Za-z0-9+/\r\n]+={0,2}$/;
const ENV_LINE_PATTERN = /^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=/;
const ROBOTS_LINE_PATTERN = /^\s*(?:user-agent|disallow|allow|sitemap|crawl-delay)\s*:/i;
const HTML_TAG_PATTERN = /<([a-z][a-z0-9-]*)(?:\s[^>]*)?>[\s\S]*<\/\1>|<!doctype\s+html/i;
const MARKDOWN_LINE_PATTERN = /^(?:#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```|\[[^\]]+\]\([^)]+\)|\|.+\|)/;
const SQL_START_PATTERN = /^\s*(?:select|insert|update|delete|create|alter|drop|with|truncate)\b/i;
const SQL_BODY_PATTERN = /\b(?:from|into|table|set|where|values|join)\b/i;
const REGEX_LITERAL_PATTERN = /^\/.+\/[dgimsuvy]*$/;

function decodeBase64Url(segment: string): string | null {
	try {
		const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
		const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4);
		const binary = atob(withPadding);
		const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
		return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
	} catch {
		return null;
	}
}

function looksPrintable(text: string): boolean {
	if (!text) return false;
	let printable = 0;
	for (const char of text) {
		const code = char.codePointAt(0) ?? 0;
		if (code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)) printable += 1;
	}
	return printable / [...text].length > 0.9;
}

function nonEmptyLines(text: string): string[] {
	return text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'));
}

export function detectContent(raw: string): Detection[] {
	const text = raw.trim();
	if (!text) return [];

	const found = new Map<string, Detection>();
	const add = (toolId: string, label: string, confidence: number) => {
		const existing = found.get(toolId);
		if (!existing || existing.confidence < confidence) {
			found.set(toolId, { toolId, label, confidence });
		}
	};

	const singleLine = !text.includes('\n');
	const lines = nonEmptyLines(text);

	// Structured data first.
	if (text.startsWith('{') || text.startsWith('[')) {
		try {
			JSON.parse(text);
			add('json', 'Format or validate as JSON', 0.96);
		} catch {
			add('json', 'Looks like JSON with an error. Find it', 0.7);
		}
	}

	if (singleLine && JWT_PATTERN.test(text)) {
		const header = decodeBase64Url(text.split('.')[0] ?? '');
		let confidence = 0.7;
		if (header) {
			try {
				const parsed = JSON.parse(header) as Record<string, unknown>;
				if (parsed && typeof parsed === 'object' && ('alg' in parsed || 'typ' in parsed)) {
					confidence = 0.98;
				}
			} catch {
				// Not a JSON header; keep the pattern-only confidence.
			}
		}
		add('jwt', 'Inspect as a JWT', confidence);
	}

	if (singleLine && UUID_PATTERN.test(text)) {
		add('uuid', 'Looks like a UUID. Generate more', 0.8);
	}

	if (singleLine && TIMESTAMP_PATTERN.test(text)) {
		add(
			'timestamp',
			'Convert as a Unix timestamp',
			text.length === 10 || text.length === 13 ? 0.92 : 0.7
		);
	}

	if (singleLine && (HEX_COLOR_PATTERN.test(text) || FUNC_COLOR_PATTERN.test(text))) {
		add('color', 'Convert as a color', FUNC_COLOR_PATTERN.test(text) ? 0.95 : 0.85);
	}

	if (singleLine && URL_PATTERN.test(text)) {
		add('url', 'Encode or decode as a URL', 0.9);
		if (text.includes('?') && text.includes('=')) {
			add('query', 'Parse the query string', 0.75);
		}
		add('qr', 'Make a QR code', 0.5);
	} else if (singleLine && QUERY_PATTERN.test(text) && text.includes('=')) {
		add('query', 'Parse as a query string', 0.85);
	} else if (singleLine && PERCENT_ENCODED_PATTERN.test(text) && !/\s/.test(text)) {
		add('url', 'URL decode', 0.7);
	}

	if (singleLine && text.length >= 8 && text.length % 4 === 0 && BASE64_PATTERN.test(text)) {
		let confidence = 0.5;
		try {
			const decoded = new TextDecoder('utf-8', { fatal: true }).decode(
				Uint8Array.from(atob(text), (char) => char.charCodeAt(0))
			);
			if (looksPrintable(decoded)) confidence = 0.88;
		} catch {
			// Binary or invalid; keep the low confidence.
		}
		if (!found.has('jwt') && !found.has('uuid') && !found.has('timestamp')) {
			add('base64', 'Decode as Base64', confidence);
		}
	}

	if (
		lines.length >= 1 &&
		lines.filter((line) => ENV_LINE_PATTERN.test(line)).length / lines.length >= 0.6 &&
		!found.has('query')
	) {
		add('env', 'Inspect as a .env file', lines.length > 1 ? 0.88 : 0.6);
	}

	if (
		lines.length >= 1 &&
		lines.filter((line) => ROBOTS_LINE_PATTERN.test(line)).length / lines.length >= 0.6
	) {
		add('robots', 'Validate as robots.txt', 0.95);
	}

	if (/<(?:urlset|sitemapindex)\b/i.test(text)) {
		add('sitemap', 'Validate as a sitemap', 0.95);
	} else if (HTML_TAG_PATTERN.test(text)) {
		add('html', 'Preview as HTML', 0.82);
	}

	if (
		lines.some((line) => MARKDOWN_LINE_PATTERN.test(line)) &&
		!found.has('robots') &&
		!found.has('env')
	) {
		add('markdown', 'Preview as Markdown', 0.7);
	}

	if (SQL_START_PATTERN.test(text) && SQL_BODY_PATTERN.test(text)) {
		add('sql', 'Format as SQL', 0.88);
	}

	if (singleLine && REGEX_LITERAL_PATTERN.test(text)) {
		add('regex', 'Test as a regular expression', 0.72);
	}

	// Generic fallbacks for any text.
	if (singleLine && text.length <= 120) {
		add('case', 'Change the case', 0.3);
		add('slug', 'Make a slug', 0.25);
	}
	add('counter', 'Count words and characters', 0.2);
	add('hash', 'Hash it', 0.15);

	return [...found.values()].sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}
