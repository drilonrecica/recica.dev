<script lang="ts">
	import { resolve } from '$app/paths';

	export let pathname = '/';

	$: isProject = pathname.startsWith('/parental-gate-lab');
</script>

<header class="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
	<div class="chrome-shell mx-auto max-w-7xl">
		<div
			class="surface-nav flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
		>
			<div class="flex items-center gap-3">
				<a href={resolve('/')} class="inline-flex items-center gap-3 text-[var(--ink)]">
					<span class="brand-mark" aria-hidden="true"></span>
					<span class="min-w-0">
						<span class="font-display block text-lg font-semibold tracking-[-0.03em]">
							Labs by Drilon Recica
						</span>
						<span class="block text-xs text-[var(--ink-soft)]">
							{isProject ? 'Interactive product lab' : 'Experiments, prototypes, and concept work'}
						</span>
					</span>
				</a>
			</div>

			<nav
				class="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 text-sm text-[var(--ink-soft)] lg:justify-center"
				aria-label="Primary"
			>
				{#if isProject}
					<a href="#overview" class="nav-chip shrink-0">Overview</a>
					<a href="#demos" class="nav-chip shrink-0">Demos</a>
					<a href="#compare" class="nav-chip shrink-0">Compare</a>
					<a href="#recommendation" class="nav-chip shrink-0">Recommendation</a>
					<a href="#guidance" class="nav-chip shrink-0">Guidance</a>
					<a href="#faq" class="nav-chip shrink-0">FAQ</a>
				{:else}
					<a href={resolve('/')} class="nav-chip shrink-0" aria-current="page">Home</a>
					<a href="#experiments" class="nav-chip shrink-0">Experiments</a>
					<a href="#about" class="nav-chip shrink-0">About</a>
				{/if}
			</nav>

			<div class="flex items-center gap-2 lg:justify-end">
				{#if isProject}
					<a href={resolve('/')} class="button-base button-secondary">Back to Labs</a>
				{/if}
				<a href="https://recica.dev" class="button-base button-primary" rel="noreferrer">
					Back to recica.dev
				</a>
			</div>
		</div>
	</div>
</header>
