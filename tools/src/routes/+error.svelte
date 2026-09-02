<script lang="ts">
	/* eslint-disable svelte/valid-prop-names-in-kit-pages */
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';

	export let error: Error | { message?: string };
	export let status: number;

	const title = status === 404 ? 'Page not found' : 'Something went wrong';
	const description =
		status === 404
			? 'That URL does not exist on this site. Let’s get you back to the toolbox.'
			: 'An unexpected issue occurred while loading this page. Refresh or return to the homepage to continue.';
	const details = error?.message ? String(error.message) : '';
</script>

<SeoHead {title} {description} noindex={true} omitCanonical={true} />

<section class="mx-auto grid min-h-[60vh] w-full max-w-3xl content-center gap-4 py-12">
	<p class="kicker kicker--accent">{status}</p>
	<h1 class="text-3xl font-semibold">{title}</h1>
	<p class="workbench__desc">{description}</p>
	{#if details}
		<pre class="output__body output__frame output__frame--plain">{details}</pre>
	{/if}
	<div class="flex flex-wrap gap-2">
		<a href={resolve('/')} class="button-base button-primary">Back to home</a>
		<button type="button" on:click={() => history.back()} class="button-base button-secondary">
			Go back
		</button>
	</div>
</section>
