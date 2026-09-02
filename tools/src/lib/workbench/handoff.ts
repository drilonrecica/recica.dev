import { tools } from '$lib/constants/tools';
import type { ToolDefinition } from '$lib/types/tool';

/**
 * In-memory hand-off between tools.
 *
 * A tool stages a payload, navigates, and the destination takes it exactly
 * once on mount. Nothing is written to the URL, storage, or caches, so the
 * privacy contract (input never leaves browser memory) holds across the hop.
 */
export type Handoff = {
	toolId: string;
	payload: string;
	from?: string;
};

export type HandoffTarget = {
	toolId: string;
	label: string;
};

let current: Handoff | null = null;

export function stageHandoff(handoff: Handoff): void {
	current = handoff;
}

export function peekHandoff(): Handoff | null {
	return current;
}

export function takeHandoff(toolId: string): Handoff | null {
	if (!current || current.toolId !== toolId) return null;
	const taken = current;
	current = null;
	return taken;
}

export function clearHandoff(): void {
	current = null;
}

const anyText: HandoffTarget[] = [
	{ toolId: 'hash', label: 'Hash it' },
	{ toolId: 'counter', label: 'Count words and characters' },
	{ toolId: 'diff', label: 'Compare with another text' },
	{ toolId: 'base64', label: 'Base64 encode' },
	{ toolId: 'url', label: 'URL encode' }
];

const targetsBySource: Record<string, HandoffTarget[]> = {
	jwt: [{ toolId: 'json', label: 'Format the payload' }, ...anyText],
	base64: [
		{ toolId: 'json', label: 'Format as JSON' },
		{ toolId: 'jwt', label: 'Inspect as JWT' },
		{ toolId: 'url', label: 'URL decode or encode' },
		{ toolId: 'query', label: 'Parse as query string' },
		{ toolId: 'hash', label: 'Hash it' },
		{ toolId: 'counter', label: 'Count words and characters' }
	],
	url: [
		{ toolId: 'query', label: 'Parse the query string' },
		{ toolId: 'qr', label: 'Make a QR code' },
		{ toolId: 'base64', label: 'Base64 encode' },
		{ toolId: 'hash', label: 'Hash it' }
	],
	query: [
		{ toolId: 'url', label: 'Encode or decode' },
		{ toolId: 'base64', label: 'Base64 encode' },
		{ toolId: 'counter', label: 'Count words and characters' }
	],
	json: [
		{ toolId: 'base64', label: 'Base64 encode' },
		{ toolId: 'url', label: 'URL encode as a component' },
		{ toolId: 'hash', label: 'Hash it' },
		{ toolId: 'diff', label: 'Compare with another JSON' },
		{ toolId: 'counter', label: 'Count characters' }
	],
	sql: [
		{ toolId: 'diff', label: 'Compare with another query' },
		{ toolId: 'hash', label: 'Hash it' },
		{ toolId: 'counter', label: 'Count characters' }
	],
	env: [
		{ toolId: 'case', label: 'Convert key casing' },
		{ toolId: 'hash', label: 'Hash it' },
		{ toolId: 'counter', label: 'Count lines' }
	],
	markdown: [
		{ toolId: 'html', label: 'Preview the HTML' },
		{ toolId: 'slug', label: 'Make a slug' },
		{ toolId: 'counter', label: 'Count words' }
	],
	html: [
		{ toolId: 'counter', label: 'Count characters' },
		{ toolId: 'hash', label: 'Hash it' }
	],
	case: [
		{ toolId: 'slug', label: 'Make a slug' },
		{ toolId: 'url', label: 'URL encode' },
		{ toolId: 'base64', label: 'Base64 encode' },
		{ toolId: 'hash', label: 'Hash it' }
	],
	slug: [
		{ toolId: 'case', label: 'Change case' },
		{ toolId: 'url', label: 'URL encode' },
		{ toolId: 'qr', label: 'Make a QR code' }
	],
	uuid: [
		{ toolId: 'qr', label: 'Make a QR code' },
		{ toolId: 'barcode', label: 'Make a barcode' },
		{ toolId: 'hash', label: 'Hash it' },
		{ toolId: 'case', label: 'Change case' }
	],
	hash: [
		{ toolId: 'case', label: 'Change case' },
		{ toolId: 'qr', label: 'Make a QR code' }
	],
	password: [{ toolId: 'hash', label: 'Hash it' }],
	regex: [
		{ toolId: 'diff', label: 'Compare with the source' },
		{ toolId: 'counter', label: 'Count matches as text' },
		{ toolId: 'hash', label: 'Hash it' }
	],
	device: [
		{ toolId: 'json', label: 'Format as JSON' },
		{ toolId: 'hash', label: 'Hash it' }
	],
	robots: [{ toolId: 'counter', label: 'Count lines' }],
	sitemap: [
		{ toolId: 'counter', label: 'Count URLs' },
		{ toolId: 'hash', label: 'Hash the list' }
	],
	counter: [],
	diff: [],
	color: [{ toolId: 'qr', label: 'Make a QR code' }],
	timestamp: [{ toolId: 'qr', label: 'Make a QR code' }],
	qr: [],
	barcode: []
};

export type ResolvedHandoffTarget = HandoffTarget & { tool: ToolDefinition };

export function handoffTargetsFor(sourceToolId: string): ResolvedHandoffTarget[] {
	const targets = targetsBySource[sourceToolId] ?? anyText;
	return targets
		.filter((target) => target.toolId !== sourceToolId)
		.map((target) => {
			const tool = tools.find((candidate) => candidate.id === target.toolId);
			return tool ? { ...target, tool } : null;
		})
		.filter((target): target is ResolvedHandoffTarget => target !== null);
}
