<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ExperimentDefinition } from '$lib/types/experiments';

	export let experiment: ExperimentDefinition;
	export let featured = false;

	$: entryCode = experiment.isLive
		? `Study ${String(experiment.sortOrder).padStart(2, '0')}`
		: `Note ${String(experiment.sortOrder).padStart(2, '0')}`;
	$: statusLabel = experiment.isLive ? 'Published' : 'In progress';
</script>

<article
	class={`experiment-card notebook-entry ${featured ? 'experiment-card--featured' : ''}`}
	data-testid={`experiment-card-${experiment.slug}`}
>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<span class="metric-label">{entryCode}</span>
		<span class={`status-pill ${experiment.isLive ? 'status-pill--live' : 'status-pill--coming'}`}>
			{statusLabel}
		</span>
	</div>

	<div class="space-y-4">
		<div class="space-y-2">
			<h3
				class="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl"
			>
				{experiment.title}
			</h3>
			<p class="text-base leading-8 text-[var(--ink-soft)] sm:text-lg">{experiment.oneLiner}</p>
		</div>

		<p class="max-w-2xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
			{experiment.summary}
		</p>

		<div class="notebook-entry__finding">
			<span class="eyebrow">{experiment.isLive ? 'Research question' : 'Working hypothesis'}</span>
			<p>{experiment.whyItExists}</p>
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		{#if experiment.ctaHref}
			<a href={resolve(experiment.ctaHref)} class="button-base button-primary">
				{experiment.ctaLabel}
			</a>
			<span class="text-sm text-[var(--ink-soft)]">Interactive study</span>
		{:else}
			<span class="text-sm leading-7 text-[var(--ink-soft)]">
				No public route until the note supports a useful test.
			</span>
		{/if}
	</div>
</article>
