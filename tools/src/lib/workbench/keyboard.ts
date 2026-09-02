import { browser } from '$app/environment';

export type ShortcutScope = 'global' | 'tool';

export type ShortcutDefinition = {
	/** Key chord such as "Mod+Enter", "Mod+Shift+C", "/", "?" */
	keys: string;
	label: string;
	scope: ShortcutScope;
	/** Fire even while typing in an input or textarea. Defaults to true for Mod chords. */
	allowInInput?: boolean;
	handler: (event: KeyboardEvent) => void;
};

type ParsedChord = { key: string; mod: boolean; shift: boolean; alt: boolean };

const registry = new Map<symbol, ShortcutDefinition>();
let listening = false;

export function parseChord(keys: string): ParsedChord {
	const parts = keys.split('+').map((part) => part.trim());
	const key = parts.pop() ?? '';
	return {
		key: key.length === 1 ? key : key.toLowerCase(),
		mod: parts.some((part) => part.toLowerCase() === 'mod'),
		shift: parts.some((part) => part.toLowerCase() === 'shift'),
		alt: parts.some((part) => part.toLowerCase() === 'alt')
	};
}

export function isTypingTarget(target: EventTarget | null): boolean {
	return (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	);
}

function dialogIsOpen(): boolean {
	return Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));
}

export function matchesChord(event: KeyboardEvent, chord: ParsedChord): boolean {
	const mod = event.metaKey || event.ctrlKey;
	if (chord.mod !== mod) return false;
	if (chord.shift !== event.shiftKey) return false;
	if (chord.alt !== event.altKey) return false;
	const eventKey = event.key.length === 1 ? event.key : event.key.toLowerCase();
	// Shifted single characters ("?") arrive already shifted; compare case-insensitively.
	return eventKey.toLowerCase() === chord.key.toLowerCase();
}

function handleKeydown(event: KeyboardEvent) {
	if (event.defaultPrevented) return;
	const typing = isTypingTarget(event.target);
	const modal = dialogIsOpen();

	for (const definition of registry.values()) {
		const chord = parseChord(definition.keys);
		if (!matchesChord(event, chord)) continue;
		const allowInInput = definition.allowInInput ?? chord.mod;
		if (typing && !allowInInput) continue;
		// Inside a modal only its own global shortcuts (Escape handling) apply.
		if (modal && definition.scope === 'tool') continue;
		event.preventDefault();
		definition.handler(event);
		return;
	}
}

function ensureListener() {
	if (!browser || listening) return;
	listening = true;
	window.addEventListener('keydown', handleKeydown);
}

export function registerShortcut(definition: ShortcutDefinition): () => void {
	const id = Symbol(definition.keys);
	registry.set(id, definition);
	ensureListener();
	return () => {
		registry.delete(id);
	};
}

export function listShortcuts(): ShortcutDefinition[] {
	return [...registry.values()];
}

export function isApplePlatform(): boolean {
	if (!browser) return false;
	return /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
}

export function formatChord(keys: string, apple = isApplePlatform()): string[] {
	return keys.split('+').map((part) => {
		const lower = part.toLowerCase();
		if (lower === 'mod') return apple ? '⌘' : 'Ctrl';
		if (lower === 'shift') return apple ? '⇧' : 'Shift';
		if (lower === 'alt') return apple ? '⌥' : 'Alt';
		if (lower === 'enter') return 'Enter';
		if (lower === 'escape') return 'Esc';
		return part;
	});
}
