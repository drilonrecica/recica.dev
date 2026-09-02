<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import { createEventDispatcher } from 'svelte';

	export let pathname = '/';
	export let searchOpen = false;
	export let searchButtonEl: HTMLButtonElement | null = null;

	const dispatch = createEventDispatcher<{ search: void }>();

	$: homeActive = pathname === '/';
</script>

<header class="app-header">
	<div class="app-header__shell">
		<a href={resolve('/')} class="brand" aria-label="Recica Tools home">
			<span class="brand__mark" aria-hidden="true">RT</span>
			<span>Recica Tools</span>
			<span class="brand__sub">Private browser utilities</span>
		</a>

		<nav class="app-nav" aria-label="Primary">
			<a
				href={resolve('/')}
				class="app-nav__link hidden sm:inline-flex"
				aria-current={homeActive ? 'page' : undefined}
			>
				Tools
			</a>
			<a
				href={resolve('/privacy')}
				class="app-nav__link hidden sm:inline-flex"
				aria-current={pathname === '/privacy' ? 'page' : undefined}
			>
				Privacy
			</a>
			<button
				bind:this={searchButtonEl}
				type="button"
				class={`button-base ${searchOpen ? 'button-secondary' : 'button-ghost'}`}
				aria-controls="tool-search-dialog"
				aria-expanded={searchOpen}
				aria-haspopup="dialog"
				on:click={() => dispatch('search')}
			>
				<span>Search</span>
				<kbd class="kbd" aria-hidden="true">/</kbd>
			</button>
			<ThemeToggle />
		</nav>
	</div>
</header>
