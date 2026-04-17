<script lang="ts">
	import { resolve } from '$app/paths';
	import ExperimentCard from '$lib/components/experiments/ExperimentCard.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { featuredExperiments, liveExperimentCount } from '$lib/data/experiments';
	import { buildCollectionPageSchema, buildPersonSchema, buildWebsiteSchema } from '$lib/utils/seo';

	const title = 'Labs by Drilon Recica — Experiments, Prototypes, and Product Explorations';
	const description =
		'The public experimentation layer of the Recica ecosystem: interactive prototypes, product explorations, and concept work with one live experiment today.';
	const origin = 'https://labs.recica.dev';

	const aboutPoints = [
		'Labs sits between the flagship site and the stable tools layer: earlier than a finished product, but real enough to open and use.',
		'Only the experiments that show product taste, interaction judgment, and engineering depth make it onto the homepage.'
	];

	const nextExperiments = [
		'Privacy-first mobile analytics and crash reporting',
		'Family-app UX references and interaction studies',
		'Selected product engineering concept work'
	];

	const primaryExperiment = featuredExperiments[0];
	const secondaryExperiment = featuredExperiments[1];
</script>

<SeoHead
	{title}
	{description}
	path="/"
	socialImagePath="/og-labs.svg"
	schema={[
		buildWebsiteSchema(origin, description),
		buildCollectionPageSchema(origin, description),
		buildPersonSchema()
	]}
/>

<section class="section-shell" data-testid="labs-home-section-hero">
	<div class="section-frame pt-6 sm:pt-10">
		<div class="lab-grid lab-grid--hero">
			<div class="hero-enter grid gap-7">
				<div class="route-divider">Home</div>

				<div class="space-y-5">
					<p class="eyebrow">Labs by Drilon Recica</p>
					<h1
						class="font-display text-[clamp(3.4rem,8vw,7rem)] leading-[0.88] font-bold tracking-[-0.08em] text-[var(--ink)]"
						data-testid="labs-home-hero"
					>
						Public product experiments.
					</h1>
					<p class="max-w-3xl text-lg leading-8 text-[var(--ink-soft)] sm:text-xl">
						The exploratory layer of the Recica ecosystem: interactive references, useful
						prototypes, and product ideas that are still early enough to stay sharp, but real
						enough to test, compare, and learn from in public.
					</p>
				</div>

				<div class="flex flex-wrap gap-3">
					<a href="#experiments" class="button-base button-primary">Explore experiments</a>
					<a href={resolve('/parental-gate-lab')} class="button-base button-secondary">
						Open Parental Gate Lab
					</a>
				</div>

				<p class="hero-note text-sm leading-7 text-[var(--ink-soft)]">
					<span class="status-pill status-pill--live">{liveExperimentCount} live experiment</span>
					<span>More is in progress.</span>
				</p>
			</div>

			<div class="hero-poster hero-enter min-h-[26rem] p-6 sm:p-8">
				<svg class="route-motif" viewBox="0 0 640 520" aria-hidden="true">
					<path
						d="M102 110C142 110 176 142 176 182V232C176 264 202 290 234 290H408C452 290 488 326 488 370V396"
						stroke-width="3"
						fill="none"
					/>
					<path d="M118 386H320C358 386 390 354 390 316V180" stroke-width="2.4" fill="none" />
					<path d="M222 92H500V180" stroke-width="1.8" fill="none" stroke-dasharray="10 10" />
					<circle cx="102" cy="110" r="12" fill="var(--accent)" stroke="none" />
					<circle cx="488" cy="396" r="12" fill="var(--accent-secondary)" stroke="none" />
					<circle cx="390" cy="180" r="8" fill="var(--accent)" stroke="none" />
					<circle cx="320" cy="386" r="8" fill="var(--accent-secondary)" stroke="none" />
				</svg>

				<div class="relative z-10 flex h-full flex-col justify-between gap-6">
					<div class="space-y-4">
						<span class="status-pill status-pill--live">Parental Gate Lab · Live</span>
						<p
							class="font-display text-4xl font-semibold tracking-[-0.06em] text-[var(--ink)] sm:text-5xl"
						>
							One strong experiment now. One strong concept close behind.
						</p>
						<p class="max-w-xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
							The first public lab is already interactive. The next one explores privacy-first
							mobile telemetry without dashboard bloat.
						</p>
					</div>

					<p class="text-sm leading-7 text-[var(--ink-soft)]">
						Ideas stay here while they are still sharp enough to teach something.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section-shell" id="experiments" data-testid="labs-home-section-featured">
	<div class="section-frame">
		<div class="route-divider">Featured experiments</div>
		<div class="mt-5 space-y-4">
			<h2 class="section-title">A small front page, with the right experiments doing the work.</h2>
			<p class="section-copy">
				One live interactive lab and one concept teaser are enough to show where the work is going.
			</p>
		</div>

		<div class="lab-grid lab-grid--featured mt-6">
			{#if primaryExperiment}
				<ExperimentCard experiment={primaryExperiment} featured={true} />
			{/if}

			{#if secondaryExperiment}
				<ExperimentCard experiment={secondaryExperiment} />
			{/if}
		</div>

		<p class="mt-4 text-sm leading-7 text-[var(--ink-soft)]">More experiments are in motion.</p>
	</div>
</section>

<section class="section-shell" id="about" data-testid="labs-home-section-bridge">
	<div class="section-frame">
		<div class="surface-panel-strong home-bridge p-6 sm:p-8">
			<div class="lab-grid lab-grid--two">
				<div class="space-y-4">
					<p class="eyebrow">About Labs</p>
					<h2 class="section-title text-[clamp(2.3rem,4vw,4rem)]">
						Small by design. Useful from day one.
					</h2>
					<p class="section-copy max-w-2xl">
						Labs is where ideas get tested in public before they harden into stable tools or fade
						out for good.
					</p>
				</div>

				<div class="grid gap-5">
					<div class="compact-list">
						{#each aboutPoints as point (point)}
							<p class="compact-list__item">{point}</p>
						{/each}
					</div>

					<div class="home-bridge__next">
						<p class="eyebrow">What’s next</p>
						<ul class="summary-list mt-3">
							{#each nextExperiments as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
