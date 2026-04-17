<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import { createEventDispatcher } from 'svelte';

	export let pathname = '/';
	export let searchOpen = false;

	const dispatch = createEventDispatcher<{ search: void }>();

	$: homeActive = pathname === '/';
</script>

<header
	class="fixed inset-x-0 top-0 z-30 border-b border-[var(--border-subtle)] bg-[color:var(--bg)]/84 backdrop-blur-xl"
>
	<div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
		<div class="flex items-center gap-4">
			<a href={resolve('/')} class="group flex items-center gap-3">
				<img
					src="/recica-tools-logo.jpg"
					alt="Recica Tools Logo"
					class="h-10 w-10 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elevated)]"
				/>
				<div>
					<div class="text-sm font-semibold tracking-[0.14em] text-[var(--text)] uppercase">
						Recica Tools
					</div>
					<div class="text-xs text-[var(--text-muted)]">
						Practical tools, built in the Recica Lab.
					</div>
				</div>
			</a>
			<a
				href={resolve('/')}
				class={`hidden text-sm font-medium transition-colors sm:inline-flex ${
					homeActive
						? 'text-[var(--text)]'
						: 'text-[var(--text-secondary)] hover:text-[var(--text)]'
				}`}
			>
				Tools
			</a>
		</div>

		<div class="flex items-center gap-2">
			<button
				type="button"
				class={`button-base ${searchOpen ? 'button-secondary' : 'button-ghost'} min-w-[8.5rem]`}
				on:click={() => dispatch('search')}
			>
				<span>Search</span>
				<span class="tool-code">/</span>
			</button>
			<ThemeToggle />
		</div>
	</div>
</header>
