<script lang="ts">
	import './layout.css';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import SearchPanel from '$lib/components/layout/SearchPanel.svelte';
	import { searchTools } from '$lib/search/tools';
	import { theme } from '$lib/theme/theme';
	import { goto, afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import type { ToolDefinition } from '$lib/types/tool';
	import { onMount, tick } from 'svelte';

	let { children } = $props();
	let searchOpen = $state(false);
	let searchQuery = $state('');
	let searchResults: ToolDefinition[] = $derived(searchTools(searchQuery).slice(0, 7));
	let searchButtonEl = $state<HTMLButtonElement | null>(null);
	let lastFocusedElement = $state<HTMLElement | null>(null);

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
		lastFocusedElement =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		searchOpen = true;
	}

	afterNavigate(() => {
		void closeSearch({ restoreFocus: false });
	});

	onMount(() => {
		theme.init();

		const handleKeydown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			const isTypingTarget =
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target?.isContentEditable;

			if (
				event.key === '/' &&
				!event.metaKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!isTypingTarget
			) {
				event.preventDefault();
				openSearch();
			}

			if (event.key === 'Escape' && searchOpen) {
				void closeSearch();
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#0b0f14" />
	<meta name="color-scheme" content="dark light" />
</svelte:head>

<div class="min-h-screen bg-[var(--bg)] text-[var(--text)]">
	<a href="#main-content" class="skip-link">Skip to content</a>

	<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
		<div
			class="absolute inset-x-0 top-[-12rem] h-[28rem] bg-[radial-gradient(circle_at_top,rgba(30,200,165,0.16),transparent_54%)]"
		></div>
		<div
			class="absolute top-[20%] right-[-6rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(77,163,255,0.16),transparent_68%)] blur-3xl"
		></div>
	</div>

	<div inert={searchOpen}>
		<Header bind:searchButtonEl pathname={$page.url.pathname} {searchOpen} on:search={openSearch} />

		<main
			id="main-content"
			class="mx-auto w-full max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 lg:pt-28"
		>
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
</div>
