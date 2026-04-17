<script lang="ts">
	/* eslint-disable svelte/valid-prop-names-in-kit-pages */
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';

	let { error, status } = $props<{
		error: Error | { message?: string };
		status: number;
	}>();

	const title = $derived(status === 404 ? 'Lab not found' : 'Something went wrong');
	const description = $derived(
		status === 404
			? 'That Labs route does not exist. Head back to the experiments overview or open the live Parental Gate Lab.'
			: 'An unexpected issue occurred while loading this Labs page.'
	);
	const details = $derived(error?.message ? String(error.message) : '');
</script>

<SeoHead {title} {description} path="/404" />

<section class="section-shell">
	<div class="section-frame">
		<div class="surface-panel-strong mx-auto grid max-w-4xl gap-6 p-8 sm:p-10">
			<div class="flex flex-wrap items-center gap-3">
				<span class="status-pill status-pill--coming">{status}</span>
				<span class="metric-label">Labs</span>
			</div>

			<div class="space-y-4">
				<h1 class="section-title max-w-3xl">{title}</h1>
				<p class="section-copy">{description}</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<a href={resolve('/')} class="button-base button-primary">Back to Labs</a>
				<a href={resolve('/parental-gate-lab')} class="button-base button-secondary">
					Open Parental Gate Lab
				</a>
			</div>

			{#if details}
				<div class="demo-status demo-status--failure">
					<strong class="block text-[var(--ink)]">Error details</strong>
					<div class="mt-2 break-words whitespace-pre-wrap">{details}</div>
				</div>
			{/if}
		</div>
	</div>
</section>
