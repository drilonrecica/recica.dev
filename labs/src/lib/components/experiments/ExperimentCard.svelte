<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ExperimentDefinition } from '$lib/types/experiments';

	export let experiment: ExperimentDefinition;
	export let featured = false;

	$: supportingNote = experiment.isLive
		? experiment.whyItExists
		: (experiment.futurePotential ?? experiment.whyItExists);
</script>

<article
	class={`experiment-card ${featured ? 'experiment-card--featured' : ''} ${experiment.visualTheme === 'product-dark' ? 'experiment-card--dark' : ''}`}
	data-testid={`experiment-card-${experiment.slug}`}
>
	<div class="flex flex-wrap items-center gap-3">
		<span class={`status-pill ${experiment.isLive ? 'status-pill--live' : 'status-pill--coming'}`}>
			{experiment.isLive ? 'Live Prototype' : 'Coming Soon'}
		</span>
		<span class="metric-label">{experiment.year}</span>
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
		{#if supportingNote}
			<p class="text-sm leading-7 text-[var(--ink-soft)]">
				<strong class="text-[var(--ink)]"
					>{experiment.isLive ? 'Why this one:' : 'What it could become:'}</strong
				>
				{supportingNote}
			</p>
		{/if}
	</div>

	<div class="flex flex-wrap items-center gap-3">
		{#if experiment.ctaHref}
			<a href={resolve(experiment.ctaHref)} class="button-base button-primary">
				{experiment.ctaLabel}
			</a>
		{:else}
			<span class="button-base button-disabled" aria-disabled="true">{experiment.ctaLabel}</span>
		{/if}
		<span class="text-sm text-[var(--ink-soft)]">
			{experiment.isLive ? 'Interactive now' : 'Concept preview'}
		</span>
	</div>
</article>
