import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { tools } from '$lib/constants/tools';

/**
 * Harmless preferences: favorite and recently used tool IDs.
 * Only tool identifiers are stored, never any input or output.
 */
export const PREFS_STORAGE_KEY = 'recica-tools-prefs';
export const RECENT_LIMIT = 5;

export type ToolPrefs = {
	favorites: string[];
	recents: string[];
};

const knownIds = new Set(tools.map((tool) => tool.id));

export function sanitizePrefs(value: unknown): ToolPrefs {
	const source = (value && typeof value === 'object' ? value : {}) as Partial<ToolPrefs>;
	const clean = (list: unknown) =>
		Array.isArray(list)
			? [...new Set(list.filter((id): id is string => typeof id === 'string' && knownIds.has(id)))]
			: [];
	return {
		favorites: clean(source.favorites),
		recents: clean(source.recents).slice(0, RECENT_LIMIT)
	};
}

export function pushRecent(recents: string[], id: string, limit = RECENT_LIMIT): string[] {
	return [id, ...recents.filter((entry) => entry !== id)].slice(0, limit);
}

export function toggleInList(list: string[], id: string): string[] {
	return list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id];
}

function read(): ToolPrefs {
	if (!browser) return { favorites: [], recents: [] };
	try {
		const raw = localStorage.getItem(PREFS_STORAGE_KEY);
		return sanitizePrefs(raw ? JSON.parse(raw) : null);
	} catch {
		return { favorites: [], recents: [] };
	}
}

function write(prefs: ToolPrefs) {
	if (!browser) return;
	try {
		localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
	} catch {
		// Storage unavailable; keep the in-memory value only.
	}
}

function createPrefsStore() {
	const store = writable<ToolPrefs>({ favorites: [], recents: [] });
	let current: ToolPrefs = { favorites: [], recents: [] };
	let initialized = false;

	store.subscribe((value) => {
		current = value;
	});

	function commit(next: ToolPrefs) {
		store.set(next);
		write(next);
	}

	return {
		subscribe: store.subscribe,
		init() {
			if (!browser || initialized) return;
			initialized = true;
			store.set(read());
		},
		toggleFavorite(id: string) {
			if (!knownIds.has(id)) return;
			commit({ ...current, favorites: toggleInList(current.favorites, id) });
		},
		recordRecent(id: string) {
			if (!knownIds.has(id)) return;
			commit({ ...current, recents: pushRecent(current.recents, id) });
		},
		isFavorite(id: string) {
			return current.favorites.includes(id);
		}
	};
}

export const prefs = createPrefsStore();
