import type { ToolDefinition } from '$lib/types/tool';

const MIB = 1024 * 1024;

const toolCatalog: Array<
	Omit<
		ToolDefinition,
		| 'number'
		| 'directAnswer'
		| 'inputPolicy'
		| 'limitations'
		| 'whenToUse'
		| 'example'
		| 'supportedFormats'
		| 'commonErrors'
		| 'reference'
		| 'reviewedOn'
	>
> = [
	{
		id: 'json',
		name: 'JSON Formatter / Validator',
		route: '/json',
		description: 'Free JSON formatter, validator, and minifier with clear local parse feedback.',
		category: 'Format',
		localOnly: true,
		keywords: ['json', 'validator', 'formatter', 'minify', 'pretty print']
	},
	{
		id: 'base64',
		name: 'Base64 Encoder / Decoder',
		route: '/base64',
		description:
			'Free Base64 encoder and decoder for UTF-8 text with local processing and strict validation.',
		category: 'Encoding',
		localOnly: true,
		keywords: ['base64', 'encode', 'decode', 'utf-8', 'text']
	},
	{
		id: 'qr',
		name: 'QR Code Generator',
		route: '/qr',
		description:
			'Free QR code generator for text, URLs, Wi-Fi, email, phone, and SMS with local PNG and SVG export.',
		category: 'Share',
		localOnly: true,
		keywords: ['qr', 'code', 'generator', 'wifi', 'email', 'phone', 'sms', 'png', 'svg']
	},
	{
		id: 'url',
		name: 'URL Encoder / Decoder',
		route: '/url',
		description:
			'Encode or decode full URLs and URL components without overwriting your source text.',
		category: 'Encoding',
		localOnly: true,
		keywords: ['url', 'encode', 'decode', 'component', 'uri']
	},
	{
		id: 'regex',
		name: 'Regex Tester',
		route: '/regex',
		description: 'Test ECMAScript regex patterns with flags, capture groups, and replace preview.',
		category: 'Text',
		localOnly: true,
		keywords: ['regex', 'regexp', 'pattern', 'replace', 'flags', 'capture groups']
	},
	{
		id: 'timestamp',
		name: 'Timestamp Converter',
		route: '/timestamp',
		description: 'Move cleanly between Unix timestamps, local time, and UTC.',
		category: 'Time',
		localOnly: true,
		keywords: ['timestamp', 'unix', 'epoch', 'utc', 'local time', 'date']
	},
	{
		id: 'password',
		name: 'Password Generator',
		route: '/password',
		description: 'Create strong passwords with secure browser randomness.',
		category: 'Security',
		localOnly: true,
		keywords: ['password', 'secure', 'random', 'generator', 'crypto']
	},
	{
		id: 'diff',
		name: 'Text Diff Checker',
		route: '/diff',
		description: 'Compare two text blocks with readable line and inline changes.',
		category: 'Compare',
		localOnly: true,
		keywords: ['diff', 'compare', 'text', 'changes', 'lines']
	},
	{
		id: 'sql',
		name: 'SQL Formatter / Minifier',
		route: '/sql',
		description:
			'Format or minify SQL locally without executing anything or assuming a specific backend.',
		category: 'Format',
		localOnly: true,
		keywords: ['sql', 'format', 'prettify', 'minify', 'indent', 'query']
	},
	{
		id: 'hash',
		name: 'Hash Generator',
		route: '/hash',
		description: 'Hash text locally with SHA-256, SHA-384, or SHA-512 using Web Crypto.',
		category: 'Security',
		localOnly: true,
		keywords: ['hash', 'sha-256', 'sha-384', 'sha-512', 'digest', 'crypto']
	},
	{
		id: 'uuid',
		name: 'UUID Generator',
		route: '/uuid',
		description: 'Generate UUID v4 or v7 values locally, one at a time or in bulk.',
		category: 'Identity',
		localOnly: true,
		keywords: ['uuid', 'guid', 'v4', 'v7', 'generate', 'id']
	},
	{
		id: 'query',
		name: 'Query String Parser / Builder',
		route: '/query',
		description:
			'Parse raw query strings into editable rows and rebuild them with repeated keys intact.',
		category: 'Encoding',
		localOnly: true,
		keywords: ['query string', 'url params', 'search params', 'parse', 'builder', 'repeated keys']
	},
	{
		id: 'env',
		name: '.env Parser / Viewer',
		route: '/env',
		description:
			'Inspect dotenv text with comments, quoted values, duplicates, and malformed lines surfaced clearly.',
		category: 'Config',
		localOnly: true,
		keywords: ['env', 'dotenv', 'parser', 'viewer', 'environment variables', 'config']
	},
	{
		id: 'jwt',
		name: 'JWT Inspector',
		route: '/jwt',
		description:
			'Decode JWT headers and payloads locally, then inspect claims and key timestamps safely.',
		category: 'Security',
		localOnly: true,
		keywords: ['jwt', 'json web token', 'decode', 'claims', 'header', 'payload', 'exp']
	},
	{
		id: 'markdown',
		name: 'Markdown Previewer',
		route: '/markdown',
		description: 'Write Markdown on the left and review a sanitized local preview on the right.',
		category: 'Preview',
		localOnly: true,
		keywords: ['markdown', 'preview', 'md', 'sanitized', 'render']
	},
	{
		id: 'html',
		name: 'HTML Previewer',
		route: '/html',
		description:
			'Preview HTML in a sandboxed iframe with scripts stripped and unsafe handlers removed.',
		category: 'Preview',
		localOnly: true,
		keywords: ['html', 'preview', 'sandbox', 'iframe', 'sanitize']
	},
	{
		id: 'slug',
		name: 'Slug Generator',
		route: '/slug',
		description: 'Turn titles into clean, lowercase slugs with predictable normalization.',
		category: 'Text',
		localOnly: true,
		keywords: ['slug', 'title', 'normalize', 'seo', 'text']
	},
	{
		id: 'case',
		name: 'Text Case Converter',
		route: '/case',
		description:
			'Convert text into camelCase, PascalCase, snake_case, kebab-case, title case, and more.',
		category: 'Text',
		localOnly: true,
		keywords: ['case', 'camel', 'pascal', 'snake', 'kebab', 'title', 'uppercase', 'lowercase']
	},
	{
		id: 'counter',
		name: 'Word / Character Counter',
		route: '/counter',
		description: 'Count words, characters, lines, paragraphs, and estimated reading time locally.',
		category: 'Text',
		localOnly: true,
		keywords: ['word count', 'character count', 'lines', 'paragraphs', 'reading time', 'text']
	},
	{
		id: 'color',
		name: 'Color Converter',
		route: '/color',
		description:
			'Convert between HEX, RGB(A), and HSL(A) with a live swatch and copy-ready outputs.',
		category: 'Design',
		localOnly: true,
		keywords: ['color', 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'converter']
	},
	{
		id: 'barcode',
		name: 'Barcode Generator',
		route: '/barcode',
		description:
			'Generate practical Code 128, EAN-13, and UPC-A barcodes with local SVG and PNG export.',
		category: 'Share',
		localOnly: true,
		keywords: ['barcode', 'code128', 'ean13', 'upca', 'svg', 'png', 'generator']
	},
	{
		id: 'device',
		name: 'Device / Browser Info',
		route: '/device',
		description:
			'Inspect the current browser environment, including viewport, platform, storage support, and theme preference.',
		category: 'Inspect',
		localOnly: true,
		keywords: ['device', 'browser', 'user agent', 'viewport', 'platform', 'screen', 'storage']
	},
	{
		id: 'robots',
		name: 'robots.txt Parser / Validator',
		route: '/robots',
		description:
			'Parse pasted robots.txt content and surface directives, comments, and malformed lines.',
		category: 'Inspect',
		localOnly: true,
		keywords: ['robots.txt', 'robots', 'parser', 'validator', 'seo', 'crawler']
	},
	{
		id: 'sitemap',
		name: 'Sitemap XML Parser / Validator',
		route: '/sitemap',
		description:
			'Validate pasted sitemap XML and list the URLs or child sitemap locations it contains.',
		category: 'Inspect',
		localOnly: true,
		keywords: ['sitemap', 'xml', 'validator', 'parser', 'urls', 'seo']
	}
];

const operationalDetails: Record<string, Pick<ToolDefinition, 'inputPolicy' | 'limitations'>> = {
	json: {
		inputPolicy: { label: '3 MiB input', maxBytes: 3 * MIB },
		limitations: ['Strict JSON only; comments and JSON5 syntax are not accepted.']
	},
	base64: {
		inputPolicy: { label: '5 MiB input', maxBytes: 5 * MIB },
		limitations: ['Decoding accepts standard Base64 text and returns UTF-8 text.']
	},
	qr: {
		inputPolicy: { label: '4,000 character hard ceiling' },
		limitations: ['Capacity also depends on the selected preset and QR error-correction overhead.']
	},
	url: {
		inputPolicy: { label: '5 MiB input', maxBytes: 5 * MIB },
		limitations: ['Full-URL and component modes follow native browser URI encoding rules.']
	},
	regex: {
		inputPolicy: { label: '1 MiB test text', maxBytes: MIB },
		limitations: [
			'Uses ECMAScript RegExp syntax and runs synchronously in the current browser tab.'
		]
	},
	timestamp: {
		inputPolicy: { label: 'One timestamp per conversion' },
		limitations: ['Accepts whole Unix timestamps in seconds or milliseconds within the Date range.']
	},
	password: {
		inputPolicy: { label: '128 characters per password' },
		limitations: ['Generated values are not stored; save them in a trusted password manager.']
	},
	diff: {
		inputPolicy: { label: '512 KiB combined input', maxBytes: 512 * 1024 },
		limitations: [
			'Compares text only; patch export and merge conflict resolution are out of scope.'
		]
	},
	sql: {
		inputPolicy: { label: '2 MiB input', maxBytes: 2 * MIB },
		limitations: ['Formats text without executing or validating against a database schema.']
	},
	hash: {
		inputPolicy: { label: '5 MiB input', maxBytes: 5 * MIB },
		limitations: ['Creates one-way SHA-2 digests; it does not encrypt or store the source text.']
	},
	uuid: {
		inputPolicy: { label: '50 UUIDs per action' },
		limitations: ['Generates UUID v4 or v7 values only, using browser cryptographic randomness.']
	},
	query: {
		inputPolicy: { label: '5 MiB input', maxBytes: 5 * MIB },
		limitations: ['Works with query-string data and does not request or validate the target URL.']
	},
	env: {
		inputPolicy: { label: '1 MiB input', maxBytes: MIB },
		limitations: ['Displays pasted dotenv text locally but does not evaluate variable expansion.']
	},
	jwt: {
		inputPolicy: { label: '1 MiB token', maxBytes: MIB },
		limitations: [
			'Decoding is not signature verification and does not prove a token is trustworthy.'
		]
	},
	markdown: {
		inputPolicy: { label: '2 MiB input', maxBytes: 2 * MIB },
		limitations: ['Renders a supported Markdown subset and sanitizes the generated HTML.']
	},
	html: {
		inputPolicy: { label: '1 MiB input', maxBytes: MIB },
		limitations: ['Scripts and unsafe handlers are stripped before sandboxed iframe rendering.']
	},
	slug: {
		inputPolicy: { label: '1 MiB input', maxBytes: MIB },
		limitations: [
			'Normalization is opinionated and may remove punctuation or unsupported characters.'
		]
	},
	case: {
		inputPolicy: { label: '1 MiB input', maxBytes: MIB },
		limitations: [
			'Word-boundary detection is optimized for common Latin-script identifiers and prose.'
		]
	},
	counter: {
		inputPolicy: { label: '2 MiB input', maxBytes: 2 * MIB },
		limitations: ['Reading time is an estimate and language-specific word boundaries can vary.']
	},
	color: {
		inputPolicy: { label: 'One CSS color value' },
		limitations: ['Accepts supported HEX, RGB(A), and HSL(A) forms; named colors are out of scope.']
	},
	barcode: {
		inputPolicy: { label: 'Format-specific barcode length' },
		limitations: [
			'EAN-13 and UPC-A require valid numeric lengths; Code 128 supports practical text.'
		]
	},
	device: {
		inputPolicy: { label: 'No user input' },
		limitations: [
			'Reports only browser-exposed capabilities and cannot identify physical hardware.'
		]
	},
	robots: {
		inputPolicy: { label: '1 MiB input', maxBytes: MIB },
		limitations: ['Checks syntax and grouping but does not simulate every crawler implementation.']
	},
	sitemap: {
		inputPolicy: { label: '3 MiB input', maxBytes: 3 * MIB },
		limitations: ['Parses sitemap XML text without fetching listed URLs or nested sitemap files.']
	}
};

const toolGuidance: Record<
	string,
	Pick<ToolDefinition, 'whenToUse' | 'example' | 'supportedFormats' | 'commonErrors' | 'reference'>
> = {
	json: {
		whenToUse: 'Use it to inspect API responses, configuration objects, and copied JSON payloads.',
		example:
			'Format {"local":true} into an indented object, or validate it without producing output.',
		supportedFormats: ['Strict JSON text', 'UTF-8 strings'],
		commonErrors: ['Trailing commas', 'Unquoted keys', 'Comments or incomplete values'],
		reference: { label: 'RFC 8259 — JSON', href: 'https://www.rfc-editor.org/rfc/rfc8259' }
	},
	base64: {
		whenToUse:
			'Use it when a UTF-8 text value needs standard Base64 transport encoding or decoding.',
		example: 'Encode “Recica Tools” as UmVjaWNhIFRvb2xz and decode it back to text.',
		supportedFormats: ['Standard Base64', 'UTF-8 text'],
		commonErrors: ['Base64URL characters', 'Invalid padding', 'Decoded bytes that are not UTF-8'],
		reference: {
			label: 'RFC 4648 — Base-N encodings',
			href: 'https://www.rfc-editor.org/rfc/rfc4648'
		}
	},
	qr: {
		whenToUse: 'Use it to turn short structured values into a scannable code for nearby devices.',
		example:
			'Create a Wi-Fi code from an SSID, security mode, and password, then export SVG or PNG.',
		supportedFormats: ['Text', 'URL', 'Wi-Fi', 'Email', 'Phone', 'SMS'],
		commonErrors: [
			'Payload exceeds QR capacity',
			'Missing preset fields',
			'Unsupported content size'
		],
		reference: {
			label: 'ISO/IEC 18004 — QR Code',
			href: 'https://www.iso.org/standard/83389.html'
		}
	},
	url: {
		whenToUse: 'Use it before placing a URL or value inside a path, query parameter, or fragment.',
		example: 'Encode “JSON formatter” as JSON%20formatter in component mode.',
		supportedFormats: ['Full URL', 'URL component', 'UTF-8 text'],
		commonErrors: [
			'Malformed percent escapes',
			'Using full-URL mode for a component',
			'Double encoding'
		],
		reference: { label: 'WHATWG URL Standard', href: 'https://url.spec.whatwg.org/' }
	},
	regex: {
		whenToUse: 'Use it to test an ECMAScript pattern against sample text before adding it to code.',
		example:
			'Test (json) with gi flags against two lines and inspect both matches and replacement output.',
		supportedFormats: ['ECMAScript pattern', 'JavaScript flags', 'Replacement string'],
		commonErrors: [
			'Unclosed groups or classes',
			'Duplicate flags',
			'Unexpected global-match behavior'
		],
		reference: {
			label: 'ECMAScript RegExp specification',
			href: 'https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects'
		}
	},
	timestamp: {
		whenToUse: 'Use it to translate Unix epoch values into readable local and UTC dates.',
		example: 'Convert 1715342400 seconds to 2024-05-10T12:00:00.000Z.',
		supportedFormats: ['Unix seconds', 'Unix milliseconds', 'ISO 8601 output'],
		commonErrors: [
			'Non-integer input',
			'Seconds mistaken for milliseconds',
			'Date outside browser range'
		],
		reference: {
			label: 'ECMAScript Date objects',
			href: 'https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-objects'
		}
	},
	password: {
		whenToUse: 'Use it to create a new random password with an explicit length and character mix.',
		example: 'Generate a 24-character value using uppercase, lowercase, numbers, and symbols.',
		supportedFormats: ['8–128 characters', 'Selectable character groups'],
		commonErrors: [
			'No character groups enabled',
			'Unsupported browser randomness',
			'Length outside bounds'
		],
		reference: {
			label: 'Web Cryptography API',
			href: 'https://www.w3.org/TR/WebCryptoAPI/'
		}
	},
	diff: {
		whenToUse:
			'Use it to compare two versions of plain text and locate additions, removals, and edits.',
		example: 'Compare a configuration before and after a change to isolate modified lines.',
		supportedFormats: ['Plain text', 'UTF-8 text blocks', 'Line and inline changes'],
		commonErrors: [
			'Combined input over the limit',
			'Binary content',
			'Large generated single lines'
		],
		reference: {
			label: 'GNU Diffutils manual',
			href: 'https://www.gnu.org/software/diffutils/manual/diffutils.html'
		}
	},
	sql: {
		whenToUse:
			'Use it to make a pasted query easier to read or compact before copying it elsewhere.',
		example: 'Format a SELECT with WHERE and ORDER BY clauses onto readable lines.',
		supportedFormats: ['Common SQL statements', 'Quoted strings', 'Line and block comments'],
		commonErrors: ['Dialect-specific syntax', 'Unclosed quotes', 'Expecting schema validation'],
		reference: { label: 'ISO/IEC 9075 — SQL', href: 'https://www.iso.org/standard/76583.html' }
	},
	hash: {
		whenToUse: 'Use it to calculate a reproducible SHA-2 digest for a text value.',
		example: 'Hash the same release note twice with SHA-256 and compare the hexadecimal digests.',
		supportedFormats: ['SHA-256', 'SHA-384', 'SHA-512', 'UTF-8 text'],
		commonErrors: [
			'Confusing hashing with encryption',
			'Text encoding differences',
			'Web Crypto unavailable'
		],
		reference: {
			label: 'NIST FIPS 180-4 — Secure Hash Standard',
			href: 'https://csrc.nist.gov/pubs/fips/180-4/upd1/final'
		}
	},
	uuid: {
		whenToUse:
			'Use it to create one or more local identifiers for fixtures, records, or prototypes.',
		example: 'Generate three time-ordered UUID v7 values for local test records.',
		supportedFormats: ['UUID v4', 'UUID v7', '1–50 values'],
		commonErrors: [
			'Count outside bounds',
			'Unsupported secure randomness',
			'Expecting database uniqueness checks'
		],
		reference: { label: 'RFC 9562 — UUIDs', href: 'https://www.rfc-editor.org/rfc/rfc9562' }
	},
	query: {
		whenToUse:
			'Use it to inspect repeated query parameters or rebuild them without manual escaping.',
		example: 'Parse ?tag=json&tag=tools into two editable rows and rebuild the same repeated keys.',
		supportedFormats: ['Leading ? optional', 'Repeated keys', 'Percent-encoded UTF-8'],
		commonErrors: [
			'Malformed percent escapes',
			'Confusing + with a literal plus',
			'Oversized row data'
		],
		reference: {
			label: 'WHATWG URLSearchParams',
			href: 'https://url.spec.whatwg.org/#urlsearchparams'
		}
	},
	env: {
		whenToUse:
			'Use it to review pasted dotenv configuration structure without loading it into a process.',
		example: 'Surface a duplicate API_URL key and a malformed line before committing a template.',
		supportedFormats: ['KEY=value', 'Quoted values', 'export prefix', 'Comments'],
		commonErrors: ['Missing equals sign', 'Duplicate keys', 'Invalid variable names'],
		reference: {
			label: 'dotenv format reference',
			href: 'https://github.com/motdotla/dotenv#readme'
		}
	},
	jwt: {
		whenToUse: 'Use it to inspect public JWT claims and timestamps while debugging token shape.',
		example: 'Decode header and payload JSON, then check whether the exp timestamp is in the past.',
		supportedFormats: ['Three-part compact JWT', 'Base64URL JSON header and payload'],
		commonErrors: ['Wrong segment count', 'Malformed Base64URL', 'Assuming decoded means verified'],
		reference: {
			label: 'RFC 7519 — JSON Web Token',
			href: 'https://www.rfc-editor.org/rfc/rfc7519'
		}
	},
	markdown: {
		whenToUse:
			'Use it to review common Markdown structure and links before publishing plain-text content.',
		example: 'Preview headings, lists, emphasis, links, quotes, and fenced code blocks.',
		supportedFormats: ['Headings', 'Lists', 'Links', 'Emphasis', 'Quotes', 'Fenced code'],
		commonErrors: [
			'Expecting raw HTML execution',
			'Unsupported extensions',
			'Unclosed code fences'
		],
		reference: { label: 'CommonMark specification', href: 'https://spec.commonmark.org/' }
	},
	html: {
		whenToUse:
			'Use it for a quick visual check of isolated markup that should not execute scripts.',
		example: 'Preview a main element with headings, text, and inline presentation styles.',
		supportedFormats: ['HTML fragments', 'Inline CSS', 'Sandboxed document preview'],
		commonErrors: [
			'Scripts are removed',
			'Event handlers are stripped',
			'Script-scheme URLs are blocked'
		],
		reference: { label: 'WHATWG HTML Standard', href: 'https://html.spec.whatwg.org/' }
	},
	slug: {
		whenToUse: 'Use it to create a predictable path segment from a title or label.',
		example: 'Convert “Recica Dév: JSON Validator” to recica-dev-json-validator.',
		supportedFormats: ['Unicode text input', 'Lowercase ASCII-style output'],
		commonErrors: [
			'Meaningful punctuation removed',
			'Empty normalized output',
			'Language-specific transliteration'
		],
		reference: {
			label: 'Unicode Normalization Forms',
			href: 'https://unicode.org/reports/tr15/'
		}
	},
	case: {
		whenToUse: 'Use it to translate words between common prose and identifier naming styles.',
		example:
			'Convert “Recica JSON formatter” into camelCase, PascalCase, snake_case, and kebab-case.',
		supportedFormats: ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'Title Case'],
		commonErrors: ['Acronym boundaries', 'Locale-specific casing', 'Punctuation-only input'],
		reference: { label: 'Unicode text segmentation', href: 'https://unicode.org/reports/tr29/' }
	},
	counter: {
		whenToUse: 'Use it to measure the shape and approximate reading length of pasted prose.',
		example: 'Count words, lines, paragraphs, and estimated minutes for a draft document.',
		supportedFormats: ['Plain text', 'Unicode whitespace', 'Multi-paragraph prose'],
		commonErrors: [
			'Language-specific word boundaries',
			'Reading-time assumptions',
			'Oversized input'
		],
		reference: {
			label: 'Unicode text segmentation',
			href: 'https://unicode.org/reports/tr29/'
		}
	},
	color: {
		whenToUse: 'Use it to translate a CSS color into equivalent HEX, RGB(A), and HSL(A) values.',
		example: 'Enter #109c84 and copy its RGB and HSL representations.',
		supportedFormats: ['HEX', 'RGB(A)', 'HSL(A)'],
		commonErrors: ['Channel outside range', 'Malformed alpha value', 'Unsupported named colors'],
		reference: { label: 'CSS Color Module Level 4', href: 'https://www.w3.org/TR/css-color-4/' }
	},
	barcode: {
		whenToUse: 'Use it to create a standards-aware barcode graphic for a known identifier.',
		example: 'Generate an EAN-13 symbol from a valid 12- or 13-digit product number.',
		supportedFormats: ['Code 128', 'EAN-13', 'UPC-A', 'SVG', 'PNG'],
		commonErrors: ['Wrong numeric length', 'Invalid check digit', 'Unsupported Code 128 character'],
		reference: { label: 'GS1 barcode standards', href: 'https://www.gs1.org/standards/barcodes' }
	},
	device: {
		whenToUse: 'Use it to inspect the capabilities and viewport values this browser exposes.',
		example: 'Check viewport dimensions, color scheme, online status, and storage API support.',
		supportedFormats: ['Browser APIs', 'Viewport and screen values', 'Capability flags'],
		commonErrors: ['Privacy-reduced values', 'Unsupported APIs', 'Values changing after resize'],
		reference: {
			label: 'W3C Device and Sensors specifications',
			href: 'https://www.w3.org/das/'
		}
	},
	robots: {
		whenToUse:
			'Use it to inspect a robots.txt draft for recognizable directives and malformed lines.',
		example: 'Parse a User-agent group with Disallow and Sitemap directives before deployment.',
		supportedFormats: [
			'RFC 9309 directives',
			'Comments',
			'Sitemap and common extension directives'
		],
		commonErrors: [
			'Missing colon',
			'Unknown directive',
			'Assuming syntax guarantees crawler behavior'
		],
		reference: {
			label: 'RFC 9309 — Robots Exclusion Protocol',
			href: 'https://www.rfc-editor.org/rfc/rfc9309'
		}
	},
	sitemap: {
		whenToUse: 'Use it to verify the basic structure and listed locations of pasted sitemap XML.',
		example: 'Inspect a urlset and list every loc value without requesting any of the URLs.',
		supportedFormats: ['urlset', 'sitemapindex', 'Namespaced loc elements'],
		commonErrors: ['Wrong root element', 'Unclosed root', 'Missing loc entries'],
		reference: { label: 'Sitemaps XML protocol', href: 'https://www.sitemaps.org/protocol.html' }
	}
};

export const tools: ToolDefinition[] = toolCatalog.map((tool, index) => {
	const details = operationalDetails[tool.id];
	const guidance = toolGuidance[tool.id];

	if (!details || !guidance) {
		throw new Error(`Missing tool contract for: ${tool.id}`);
	}

	return {
		...tool,
		...details,
		...guidance,
		number: index + 1,
		directAnswer: tool.description,
		reviewedOn: '2026-07-29'
	};
});

export const featuredToolIds = ['json', 'base64', 'qr'] as const;
