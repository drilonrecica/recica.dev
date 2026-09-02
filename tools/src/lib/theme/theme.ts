import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ResolvedTheme, ThemePreference } from '$lib/types/theme';

export const THEME_STORAGE_KEY = 'recica-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export function isThemeOverride(value: string | null): value is ResolvedTheme {
	return value === 'dark' || value === 'light';
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
	if (preference === 'system') return systemDark ? 'dark' : 'light';
	return preference;
}

function applyTheme(preference: ThemePreference) {
	if (!browser) return;
	const root = document.documentElement;
	if (preference === 'system') {
		delete root.dataset.theme;
	} else {
		root.dataset.theme = preference;
	}
}

function readStoredOverride(): string | null {
	try {
		return localStorage.getItem(THEME_STORAGE_KEY);
	} catch {
		return null;
	}
}

function systemPrefersDark(): boolean {
	return browser ? window.matchMedia(DARK_QUERY).matches : false;
}

/**
 * Theme preference store.
 *
 * `system` follows the OS and stores nothing. Only an explicit light/dark
 * override is written to localStorage, matching the privacy contract that
 * theme preference is the only persisted setting of its kind.
 */
function createThemeStore() {
	const preference = writable<ThemePreference>('system');
	const resolved = writable<ResolvedTheme>('light');
	let current: ThemePreference = 'system';
	let initialized = false;

	function sync() {
		resolved.set(resolveTheme(current, systemPrefersDark()));
	}

	preference.subscribe((value) => {
		current = value;
		sync();
	});

	return {
		subscribe: preference.subscribe,
		resolved: { subscribe: resolved.subscribe },
		init() {
			if (!browser || initialized) return;
			initialized = true;

			const stored = readStoredOverride();
			const next: ThemePreference = isThemeOverride(stored) ? stored : 'system';
			applyTheme(next);
			preference.set(next);

			const media = window.matchMedia(DARK_QUERY);
			media.addEventListener('change', sync);
		},
		set(next: ThemePreference) {
			preference.set(next);
			applyTheme(next);
			if (!browser) return;
			try {
				if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
				else localStorage.setItem(THEME_STORAGE_KEY, next);
			} catch {
				// Storage may be unavailable; the in-memory preference still applies.
			}
		},
		toggle() {
			const currentResolved = resolveTheme(current, systemPrefersDark());
			this.set(currentResolved === 'dark' ? 'light' : 'dark');
		}
	};
}

export const theme = createThemeStore();
