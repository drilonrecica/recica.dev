<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { tools } from '$lib/constants/tools';
	import { SITE_ORIGIN } from '$lib/utils/site-indexing';
	import { buildBreadcrumbSchema, buildToolSchema } from '$lib/utils/seo';

	export let title = '';
	export let seoTitle = '';
	export let description = '';
	export let localOnly = true;
	export let split = false;
	export let contentClass = '';
	export let tips: string[] = [];

	$: currentTool = tools.find((tool) => tool.route === $page.url.pathname);
	$: layoutClass = split
		? `grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] ${contentClass}`
		: `mx-auto max-w-3xl ${contentClass}`;
	$: schemas = currentTool
		? [
				buildToolSchema(SITE_ORIGIN, currentTool, description, seoTitle || title),
				buildBreadcrumbSchema(SITE_ORIGIN, [
					{ name: 'Home', path: '/' },
					{ name: title, path: currentTool.route }
				])
			]
		: [];
	$: relatedTools = currentTool
		? tools
				.filter((tool) => tool.id !== currentTool?.id && tool.category === currentTool?.category)
				.slice(0, 3)
		: [];
</script>

<SeoHead
	title={seoTitle || title}
	{description}
	keywords={currentTool?.keywords ?? []}
	imageAlt={`${seoTitle || title} preview card`}
	{schemas}
/>

<section class="mx-auto w-full max-w-6xl space-y-6">
	<header class="space-y-4">
		<div class="flex flex-wrap items-center gap-3">
			<div class="kicker">Utility Switchboard</div>
			{#if currentTool}
				<span class="tool-code">TL-{String(currentTool.number).padStart(2, '0')}</span>
				<span class="tool-code">{currentTool.route}</span>
			{/if}
		</div>
		<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-3xl space-y-3">
				<h1 class="text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">
					{title}
				</h1>
				<p class="prose-note max-w-2xl">{description}</p>
			</div>
			{#if localOnly}
				<div class="status-pill status-accent">Runs locally in your browser</div>
			{/if}
		</div>
	</header>

	{#if currentTool}
		<div class="switchboard-readout" aria-label="Tool operating contract">
			<div>
				<div class="tool-code">PROCESS</div>
				<p>{currentTool.directAnswer}</p>
			</div>
			<div>
				<div class="tool-code">TRANSFER</div>
				<p>None. Input and output remain in this browser tab.</p>
			</div>
			<div>
				<div class="tool-code">LIMIT</div>
				<p>{currentTool.inputPolicy.label}</p>
			</div>
		</div>
	{/if}

	<div class={layoutClass}>
		<slot />
	</div>

	{#if tips.length}
		<aside class="surface-panel p-5">
			<div class="kicker">Usage Notes</div>
			<ul class="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-secondary)]">
				{#each tips as tip (tip)}
					<li>{tip}</li>
				{/each}
			</ul>
		</aside>
	{/if}

	{#if currentTool}
		<aside class="surface-panel p-5">
			<div class="kicker">Constraints</div>
			<ul class="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-secondary)]">
				{#each currentTool.limitations as limitation (limitation)}
					<li>{limitation}</li>
				{/each}
				<li>
					The visible limit protects responsiveness; processing remains local and oversized input is
					never silently truncated.
				</li>
			</ul>
		</aside>

		<section class="grid gap-4 lg:grid-cols-2" aria-label="Tool reference">
			<div class="surface-panel p-5">
				<div class="kicker">When to use it</div>
				<p class="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
					{currentTool.whenToUse}
				</p>
			</div>
			<div class="surface-panel p-5">
				<div class="kicker">Example</div>
				<p class="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{currentTool.example}</p>
			</div>
			<div class="surface-panel p-5">
				<div class="kicker">Supported formats</div>
				<ul class="mt-4 flex flex-wrap gap-2">
					{#each currentTool.supportedFormats as format (format)}
						<li class="status-pill">{format}</li>
					{/each}
				</ul>
			</div>
			<div class="surface-panel p-5">
				<div class="kicker">Common errors</div>
				<ul class="mt-4 grid gap-2 text-sm leading-6 text-[var(--text-secondary)]">
					{#each currentTool.commonErrors as error (error)}
						<li>{error}</li>
					{/each}
				</ul>
			</div>
		</section>

		<div
			class="surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<div class="kicker">Reference</div>
				<svelte:element
					this={"a"}
					class="mt-3 inline-block text-sm font-semibold text-[var(--primary)] hover:underline"
					href={currentTool.reference.href}
					target="_blank"
					rel="noreferrer"
				>
					{currentTool.reference.label}
				</svelte:element>
				<div class="mt-2 text-xs text-[var(--text-muted)]">
					Substantively reviewed <time datetime={currentTool.reviewedOn}>29 July 2026</time>
				</div>
			</div>
			{#if relatedTools.length}
				<nav aria-label="Related tools">
					<div class="kicker">Related tools</div>
					<div class="mt-3 flex flex-wrap gap-3">
						{#each relatedTools as tool (tool.id)}
							<a
								class="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)]"
								href={resolve(tool.route)}
							>
								TL-{String(tool.number).padStart(2, '0')}
								{tool.name}
							</a>
						{/each}
					</div>
				</nav>
			{/if}
		</div>
	{/if}
</section>
