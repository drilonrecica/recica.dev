<script lang="ts">
	import './layout.css';
	import '@fontsource/inter/latin-400.css';
	import '@fontsource/inter/latin-500.css';
	import '@fontsource/inter/latin-600.css';
	import '@fontsource/jetbrains-mono/latin-400.css';
	import '@fontsource/jetbrains-mono/latin-700.css';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import SearchPanel from '$lib/components/layout/SearchPanel.svelte';
	import Shortcuts from '$lib/components/workbench/Shortcuts.svelte';
	import { searchTools } from '$lib/search/tools';
	import { theme } from '$lib/theme/theme';
	import { registerShortcut } from '$lib/workbench/keyboard';
	import { goto, afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import type { ToolDefinition } from '$lib/types/tool';
	import { onMount, tick } from 'svelte';

	let { children } = $props();
	let searchOpen = $state(false);
	let shortcutsOpen = $state(false);
	let searchQuery = $state('');
	let searchResults: ToolDefinition[] = $derived(searchTools(searchQuery).slice(0, 7));
	let searchButtonEl = $state<HTMLButtonElement | null>(null);
	let lastFocusedElement = $state<HTMLElement | null>(null);

	const resolvedTheme = theme.resolved;

	async function closeSearch(options: { restoreFocus?: boolean } = {}) {
		const { restoreFocus = true } = options;
		searchOpen = false;
		searchQuery = '';

		if (restoreFocus) {
			const focusTarget = lastFocusedElement ?? searchButtonEl;
			lastFocusedElement = null;
			await tick();
			if (focusTarget && document.contains(focusTarget)) {
				focusTarget.focus();
			}
			return;
		}

		lastFocusedElement = null;
	}

	async function chooseTool(tool: ToolDefinition) {
		await closeSearch({ restoreFocus: false });
		await goto(resolve(tool.route));
	}

	function handleQueryChange(event: CustomEvent<string>) {
		searchQuery = event.detail;
	}

	function openSearch() {
		if (shortcutsOpen) shortcutsOpen = false;
		lastFocusedElement =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		searchOpen = true;
	}

	function openShortcuts() {
		if (searchOpen) void closeSearch({ restoreFocus: false });
		lastFocusedElement =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		shortcutsOpen = true;
	}

	async function closeShortcuts() {
		shortcutsOpen = false;
		const focusTarget = lastFocusedElement;
		lastFocusedElement = null;
		await tick();
		if (focusTarget && document.contains(focusTarget)) focusTarget.focus();
	}

	afterNavigate(() => {
		void closeSearch({ restoreFocus: false });
		shortcutsOpen = false;
	});

	onMount(() => {
		theme.init();

		const unregister = [
			registerShortcut({
				keys: '/',
				label: 'Search tools',
				scope: 'global',
				handler: openSearch
			}),
			registerShortcut({
				keys: 'Mod+k',
				label: 'Search tools',
				scope: 'global',
				handler: openSearch
			}),
			registerShortcut({
				keys: '?',
				label: 'Show keyboard shortcuts',
				scope: 'global',
				handler: openShortcuts
			})
		];

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			if (searchOpen) void closeSearch();
			else if (shortcutsOpen) void closeShortcuts();
		};
		window.addEventListener('keydown', handleEscape);

		return () => {
			unregister.forEach((fn) => fn());
			window.removeEventListener('keydown', handleEscape);
		};
	});

	const modalOpen = $derived(searchOpen || shortcutsOpen);
</script>

<svelte:head>
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f6f7f5" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0c0f0e" />
	<meta name="color-scheme" content={$resolvedTheme === 'dark' ? 'dark light' : 'light dark'} />
</svelte:head>

<a href="#main-content" class="skip-link">Skip to content</a>

<div inert={modalOpen}>
	<Header bind:searchButtonEl pathname={$page.url.pathname} {searchOpen} on:search={openSearch} />

	<main id="main-content" class="app-main">
		{@render children()}
	</main>

	<Footer />
</div>

<SearchPanel
	open={searchOpen}
	query={searchQuery}
	results={searchResults}
	on:close={() => closeSearch()}
	on:choose={(event) => chooseTool(event.detail)}
	on:querychange={handleQueryChange}
/>

<Shortcuts open={shortcutsOpen} onclose={closeShortcuts} />
