<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { tools } from '$lib/constants/tools';
	import { resolveSiteOrigin } from '$lib/utils/site-indexing';
	import { buildBreadcrumbSchema, buildToolSchema } from '$lib/utils/seo';

	export let title = '';
	export let seoTitle = '';
	export let description = '';
	export let localOnly = true;
	export let split = false;
	export let contentClass = '';
	export let tips: string[] = [];

	$: currentTool = tools.find((tool) => tool.route === $page.url.pathname);
	$: canonicalOrigin = resolveSiteOrigin(env.PUBLIC_SITE_URL, $page.url);
	$: layoutClass = split
		? `grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] ${contentClass}`
		: `mx-auto max-w-3xl ${contentClass}`;
	$: schemas = currentTool
		? [
				buildToolSchema(canonicalOrigin, currentTool, description, seoTitle || title),
				buildBreadcrumbSchema(canonicalOrigin, [
					{ name: 'Home', path: '/' },
					{ name: title, path: currentTool.route }
				])
			]
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
		<div class="kicker">Tool</div>
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
</section>
