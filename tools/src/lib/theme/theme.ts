import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ThemePreference } from '$lib/types/theme';

export const THEME_STORAGE_KEY = 'recica-theme';

function isThemePreference(value: string | null): value is ThemePreference {
	return value === 'dark' || value === 'light';
}

function applyTheme(theme: ThemePreference) {
	if (!browser) return;

	const root = document.documentElement;
	root.classList.toggle('dark', theme === 'dark');
	root.dataset.theme = theme;
}

function createThemeStore() {
	const store = writable<ThemePreference>('dark');
	let currentTheme: ThemePreference = 'dark';
	let initialized = false;

	store.subscribe((value) => {
		currentTheme = value;
	});

	return {
		subscribe: store.subscribe,
		init() {
			if (!browser || initialized) return;

			initialized = true;
			const stored = localStorage.getItem(THEME_STORAGE_KEY);
			const theme = isThemePreference(stored) ? stored : 'dark';
			applyTheme(theme);
			store.set(theme);
		},
		set(theme: ThemePreference) {
			store.set(theme);
			applyTheme(theme);

			if (browser) {
				localStorage.setItem(THEME_STORAGE_KEY, theme);
			}
		},
		toggle() {
			const nextTheme: ThemePreference = currentTheme === 'dark' ? 'light' : 'dark';
			this.set(nextTheme);
		}
	};
}

export const theme = createThemeStore();
