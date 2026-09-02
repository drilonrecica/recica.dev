import { takeHandoff } from '$lib/workbench/handoff';
import { registerShortcut, type ShortcutDefinition } from '$lib/workbench/keyboard';

export type ToolShortcut = Omit<ShortcutDefinition, 'scope'>;

/**
 * Wires a tool page into the workbench: consumes a staged hand-off payload
 * (once) and registers tool-scoped shortcuts. Call inside onMount and return
 * the cleanup function.
 */
export function setupToolPage(options: {
	toolId: string;
	onHandoff?: (payload: string) => void;
	shortcuts?: ToolShortcut[];
}): () => void {
	const handoff = takeHandoff(options.toolId);
	if (handoff && options.onHandoff) {
		options.onHandoff(handoff.payload);
	}

	const unregister = (options.shortcuts ?? []).map((shortcut) =>
		registerShortcut({ ...shortcut, scope: 'tool' })
	);

	return () => {
		unregister.forEach((fn) => fn());
	};
}

export const STANDARD_SHORTCUTS = {
	run: 'Mod+Enter',
	copy: 'Mod+Shift+C',
	clear: 'Mod+Shift+X'
} as const;
