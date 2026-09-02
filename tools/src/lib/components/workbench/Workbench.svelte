<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { tools } from '$lib/constants/tools';
	import { SITE_ORIGIN } from '$lib/utils/site-indexing';
	import { buildBreadcrumbSchema, buildToolSchema } from '$lib/utils/seo';
	import { prefs } from '$lib/workbench/prefs';

	let {
		title = '',
		seoTitle = '',
		description = '',
		split = false,
		wide = false,
		tips = [],
		children,
		actions = undefined,
		status = undefined
	}: {
		title?: string;
		seoTitle?: string;
		description?: string;
		split?: boolean;
		wide?: boolean;
		tips?: string[];
		children: Snippet;
		actions?: Snippet;
		status?: Snippet;
	} = $props();

	const currentTool = $derived(tools.find((tool) => tool.route === $page.url.pathname));
	const schemas = $derived(
		currentTool
			? [
					buildToolSchema(SITE_ORIGIN, currentTool, description, seoTitle || title),
					buildBreadcrumbSchema(SITE_ORIGIN, [
						{ name: 'Home', path: '/' },
						{ name: title, path: currentTool.route }
					])
				]
			: []
	);
	const relatedTools = $derived(
		currentTool
			? tools
					.filter((tool) => tool.id !== currentTool.id && tool.category === currentTool.category)
					.slice(0, 3)
			: []
	);
	const favorite = $derived(currentTool ? $prefs.favorites.includes(currentTool.id) : false);

	onMount(() => {
		prefs.init();
		if (currentTool) prefs.recordRecent(currentTool.id);
	});
</script>

<SeoHead
	title={seoTitle || title}
	{description}
	keywords={currentTool?.keywords ?? []}
	imageAlt={`${seoTitle || title} preview card`}
	{schemas}
/>

<article class={`workbench${wide ? ' workbench--wide' : ''}`}>
	<header class="workbench__head">
		<div>
			<div class="workbench__title">
				<h1>{title}</h1>
				{#if currentTool}
					<span class="tool-code">{currentTool.category}</span>
					<span class="tool-code">{currentTool.route}</span>
				{/if}
			</div>
			<p class="workbench__desc mt-1">{description}</p>
		</div>
		{#if currentTool}
			<div class="workbench__meta">
				<dl class="workbench__contract" aria-label="Tool operating contract">
					<div class="status-pill status-accent">
						<dt class="sr-only">Transfer</dt>
						<dd>Local only</dd>
					</div>
					<div class="status-pill">
						<dt class="sr-only">Limit</dt>
						<dd>{currentTool.inputPolicy.label}</dd>
					</div>
				</dl>
				<button
					type="button"
					class="star"
					aria-pressed={favorite}
					aria-label="Favorite this tool"
					title={favorite ? 'Remove from favorites' : 'Add to favorites'}
					onclick={() => currentTool && prefs.toggleFavorite(currentTool.id)}
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="h-4 w-4"
						fill={favorite ? 'currentColor' : 'none'}
						stroke="currentColor"
						stroke-width="1.6"
					>
						<path
							d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 16.8 6.7 19.6l1.1-5.8L3.5 9.7l5.9-.8z"
						/>
					</svg>
				</button>
			</div>
		{/if}
	</header>

	{#if actions}
		<div class="workbench__actions">{@render actions()}</div>
	{/if}

	<div class={`workbench__body${split ? ' workbench__body--split' : ''}`}>
		{@render children()}
	</div>

	{#if status}
		{@render status()}
	{/if}

	{#if currentTool}
		<section class="about" aria-label="About this tool">
			<div data-span="2">
				<h2>How it works</h2>
				<p>{currentTool.directAnswer}</p>
				<p class="mt-2">{currentTool.whenToUse}</p>
			</div>
			<div>
				<h2>Example</h2>
				<p>{currentTool.example}</p>
			</div>
			{#if tips.length}
				<div>
					<h2>Notes</h2>
					<ul>
						{#each tips as tip (tip)}<li>{tip}</li>{/each}
					</ul>
				</div>
			{/if}
			<div>
				<h2>Constraints</h2>
				<ul>
					{#each currentTool.limitations as limitation (limitation)}<li>{limitation}</li>{/each}
					<li>
						Limit: {currentTool.inputPolicy.label}. Nothing is uploaded or silently truncated.
					</li>
				</ul>
			</div>
			<div>
				<h2>Common errors</h2>
				<ul>
					{#each currentTool.commonErrors as item (item)}<li>{item}</li>{/each}
				</ul>
			</div>
			<div>
				<h2>When to use it</h2>
				<p>{currentTool.whenToUse}</p>
				<p class="mt-2">Formats: {currentTool.supportedFormats.join(', ')}.</p>
			</div>
			<div>
				<h2>Reference</h2>
				<p>
					<svelte:element
						this={'a'}
						href={currentTool.reference.href}
						target="_blank"
						rel="noreferrer">{currentTool.reference.label}</svelte:element
					>
				</p>
				<p class="mt-2">
					Substantively reviewed <time datetime={currentTool.reviewedOn}>29 July 2026</time>.
				</p>
			</div>
			{#if relatedTools.length}
				<div>
					<h2>Related tools</h2>
					<ul>
						{#each relatedTools as tool (tool.id)}
							<li><a href={resolve(tool.route)}>{tool.name}</a></li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>
	{/if}
</article>
