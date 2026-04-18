<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ExperimentDefinition } from '$lib/types/experiments';

	export let experiment: ExperimentDefinition;
	export let featured = false;
	export let metaTags: string[] = [];
	export let detailPoints: string[] = [];
	export let previewVariant: 'parental-gate' | 'analytics-concept' | null = null;

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
		{#each metaTags as tag (tag)}
			<span class="metric-label">{tag}</span>
		{/each}
	</div>

	{#if previewVariant}
		<div class={`experiment-preview experiment-preview--${previewVariant}`} aria-hidden="true">
			{#if previewVariant === 'parental-gate'}
				<svg class="experiment-preview__svg" viewBox="0 0 560 240" preserveAspectRatio="none">
					<rect x="18" y="24" width="524" height="192" rx="28" />
					<rect
						class="preview-block preview-block--accent"
						x="46"
						y="52"
						width="150"
						height="48"
						rx="18"
					/>
					<rect
						class="preview-block preview-block--muted"
						x="214"
						y="52"
						width="120"
						height="48"
						rx="18"
					/>
					<rect
						class="preview-block preview-block--muted"
						x="350"
						y="52"
						width="164"
						height="48"
						rx="18"
					/>
					<rect
						class="preview-line preview-line--strong"
						x="46"
						y="126"
						width="220"
						height="12"
						rx="6"
					/>
					<rect
						class="preview-line preview-line--soft"
						x="46"
						y="150"
						width="174"
						height="12"
						rx="6"
					/>
					<rect
						class="preview-line preview-line--soft"
						x="46"
						y="174"
						width="146"
						height="12"
						rx="6"
					/>
					<rect
						class="preview-bar preview-bar--one"
						x="320"
						y="132"
						width="40"
						height="52"
						rx="12"
					/>
					<rect
						class="preview-bar preview-bar--two"
						x="374"
						y="118"
						width="40"
						height="66"
						rx="12"
					/>
					<rect
						class="preview-bar preview-bar--three"
						x="428"
						y="96"
						width="40"
						height="88"
						rx="12"
					/>
					<circle class="preview-node preview-node--one" cx="460" cy="70" r="10" />
					<circle class="preview-node preview-node--two" cx="492" cy="92" r="8" />
					<path class="preview-trace" d="M334 92C362 72 394 70 424 84C448 96 474 114 506 118" />
				</svg>
			{:else if previewVariant === 'analytics-concept'}
				<svg class="experiment-preview__svg" viewBox="0 0 560 240" preserveAspectRatio="none">
					<rect x="18" y="24" width="524" height="192" rx="28" />
					<path class="preview-gridline" d="M58 164H500" />
					<path class="preview-gridline" d="M58 126H500" />
					<path class="preview-gridline" d="M58 88H500" />
					<rect
						class="preview-bar preview-bar--one"
						x="78"
						y="116"
						width="56"
						height="48"
						rx="14"
					/>
					<rect
						class="preview-bar preview-bar--two"
						x="154"
						y="92"
						width="56"
						height="72"
						rx="14"
					/>
					<rect
						class="preview-bar preview-bar--three"
						x="230"
						y="64"
						width="56"
						height="100"
						rx="14"
					/>
					<rect
						class="preview-bar preview-bar--four"
						x="306"
						y="84"
						width="56"
						height="80"
						rx="14"
					/>
					<rect
						class="preview-bar preview-bar--five"
						x="382"
						y="132"
						width="56"
						height="32"
						rx="14"
					/>
					<path
						class="preview-trace preview-trace--analytics"
						d="M82 98C118 88 154 80 190 82C228 84 268 108 304 114C346 122 388 108 438 72"
					/>
					<circle class="preview-node preview-node--one" cx="82" cy="98" r="8" />
					<circle class="preview-node preview-node--two" cx="190" cy="82" r="8" />
					<circle class="preview-node preview-node--three" cx="304" cy="114" r="8" />
					<circle class="preview-node preview-node--four" cx="438" cy="72" r="10" />
				</svg>
			{/if}
		</div>
	{/if}

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
		{#if detailPoints.length}
			<ul class="summary-list summary-list--compact">
				{#each detailPoints as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
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
