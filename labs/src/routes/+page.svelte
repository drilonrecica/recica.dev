<script lang="ts">
	import { resolve } from '$app/paths';
	import ExperimentCard from '$lib/components/experiments/ExperimentCard.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { featuredExperiments, liveExperimentCount } from '$lib/data/experiments';
	import {
		buildCollectionPageSchema,
		buildItemListSchema,
		buildPersonSchema,
		buildWebsiteSchema
	} from '$lib/utils/seo';

	const title = 'Labs by Drilon Recica — Public Product Experiments, UX Labs, and Prototypes';
	const description =
		'Public product experiments by Drilon Reçica, including Parental Gate Lab, interactive UX references, and concept work around mobile products, product engineering, and privacy-first tools.';

	const aboutCopy =
		'Labs is where interaction studies and product concepts go public before they harden into products.';

	const nextExperiments = [
		'Privacy-first mobile analytics and crash reporting',
		'Family-app UX references and interaction studies',
		'Selected product engineering concept work'
	];

	const experimentPresentation: Record<
		string,
		{
			metaTags: string[];
			previewVariant: 'parental-gate' | 'analytics-concept';
			detailPoints?: string[];
		}
	> = {
		'parental-gate-lab': {
			metaTags: ['UX / Mobile'],
			previewVariant: 'parental-gate'
		},
		'mobile-analytics-crash-reporting': {
			metaTags: ['Concept', 'Privacy / Mobile'],
			previewVariant: 'analytics-concept',
			detailPoints: [
				'Anonymous-first event model',
				'Crash grouping and release health',
				'Mobile-first self-hosted deployment'
			]
		}
	};

	const primaryExperiment = featuredExperiments[0];
	const secondaryExperiment = featuredExperiments[1];
</script>

<SeoHead
	{title}
	{description}
	path="/"
	socialImagePath="/og-labs.svg"
	socialImageAlt="Labs by Drilon Recica homepage preview"
	schemaBuilder={(origin) => [
		buildWebsiteSchema(origin, description),
		buildCollectionPageSchema(origin, '/', title, description),
		buildItemListSchema(
			origin,
			'Featured Labs Experiments',
			featuredExperiments.map((experiment) => ({
				name: experiment.title,
				path: experiment.ctaHref ?? '/',
				description: experiment.summary
			}))
		),
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
						Interesting experiments. Useful prototypes.
					</h1>
					<p class="max-w-3xl text-lg leading-8 text-[var(--ink-soft)] sm:text-xl">
						A place for interaction studies, product references, and early tools that are far enough
						along to open, test, compare, and learn from in public.
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

			<div class="hero-poster hero-poster--labs-home hero-enter min-h-[26rem] p-6 sm:p-8">
				<svg class="route-motif route-motif--trace" viewBox="0 0 640 520" aria-hidden="true">
					<g class="route-motif__base">
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
					</g>

					<g class="route-trace">
						<path
							class="route-trace__line route-trace__line--primary"
							d="M102 110C142 110 176 142 176 182V232C176 264 202 290 234 290H408C452 290 488 326 488 370V396"
							pathLength="100"
							stroke-width="4"
							fill="none"
						/>
						<path
							class="route-trace__line route-trace__line--secondary"
							d="M118 386H320C358 386 390 354 390 316V180"
							pathLength="100"
							stroke-width="3"
							fill="none"
						/>
						<circle class="route-trace__node route-trace__node--one" cx="102" cy="110" r="12" />
						<circle class="route-trace__node route-trace__node--two" cx="390" cy="180" r="10" />
						<circle class="route-trace__node route-trace__node--three" cx="320" cy="386" r="10" />
						<circle class="route-trace__node route-trace__node--four" cx="488" cy="396" r="12" />
					</g>
				</svg>

				<div class="relative z-10 flex h-full flex-col justify-between gap-6">
					<div class="space-y-4">
						<span class="status-pill status-pill--live">Parental Gate Lab · Live</span>
						<p
							class="font-display text-4xl font-semibold tracking-[-0.06em] text-[var(--ink)] sm:text-5xl"
						>
							Start with a live product lab. Then scan the next concept.
						</p>
						<p class="max-w-xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
							Parental Gate Lab is already interactive. The next concept explores privacy-first
							mobile telemetry for teams that want useful signal without dashboard sprawl.
						</p>
					</div>

					<p class="text-sm leading-7 text-[var(--ink-soft)]">
						Useful for product, UX, and engineering teams who want concrete references instead of
						abstract inspiration.
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
			<h2 class="section-title">One live lab, one concept in motion.</h2>
			<p class="section-copy">
				Start with the interactive reference. Then scan the next concept taking shape.
			</p>
		</div>

		<div class="lab-grid lab-grid--featured mt-6">
			{#if primaryExperiment}
				<ExperimentCard
					experiment={primaryExperiment}
					featured={true}
					metaTags={experimentPresentation[primaryExperiment.slug]?.metaTags ?? []}
					previewVariant={experimentPresentation[primaryExperiment.slug]?.previewVariant ?? null}
					detailPoints={experimentPresentation[primaryExperiment.slug]?.detailPoints ?? []}
				/>
			{/if}

			{#if secondaryExperiment}
				<ExperimentCard
					experiment={secondaryExperiment}
					metaTags={experimentPresentation[secondaryExperiment.slug]?.metaTags ?? []}
					previewVariant={experimentPresentation[secondaryExperiment.slug]?.previewVariant ?? null}
					detailPoints={experimentPresentation[secondaryExperiment.slug]?.detailPoints ?? []}
				/>
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
						Concrete experiments with clear constraints and honest status.
					</h2>
					<p class="section-copy max-w-2xl">{aboutCopy}</p>
				</div>

				<div class="grid gap-5">
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
