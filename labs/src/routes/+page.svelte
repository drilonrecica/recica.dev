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

	const title = 'Research Notebook — Product and UX Experiments by Drilon Reçica';
	const description =
		'A selective public research notebook for product questions, interactive UX studies, and prototypes by Drilon Reçica.';
</script>

<SeoHead
	{title}
	{description}
	path="/"
	socialImagePath="/og-labs.svg"
	socialImageAlt="Labs by Drilon Recica homepage preview"
	keywords={[
		'product research notebook',
		'ux experiments',
		'interactive prototypes',
		'Drilon Recica labs'
	]}
	schemaBuilder={(origin) => [
		buildWebsiteSchema(origin, description),
		buildCollectionPageSchema(origin, '/', title, description),
		buildItemListSchema(
			origin,
			'Published studies and research notes',
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
		<div class="route-divider">Notebook index / 2026</div>
		<div class="lab-grid lab-grid--hero mt-6">
			<div class="grid gap-7">
				<div class="space-y-5">
					<p class="eyebrow">Research Notebook</p>
					<h1
						class="font-display max-w-[10ch] text-[clamp(3.4rem,8vw,7rem)] leading-[0.88] font-bold tracking-[-0.08em] text-[var(--ink)]"
						data-testid="labs-home-hero"
					>
						Product questions, tested in public.
					</h1>
					<p class="max-w-3xl text-lg leading-8 text-[var(--ink-soft)] sm:text-xl">
						A selective record of interaction studies, decision tools, and product hypotheses.
						Published work is usable now; unfinished thinking stays visibly unfinished.
					</p>
				</div>

				<div class="flex flex-wrap gap-3">
					<a href="#experiments" class="button-base button-primary">Read the notebook</a>
					<a href={resolve('/parental-gate-lab')} class="button-base button-secondary">
						Open Study 01
					</a>
				</div>
			</div>

			<aside class="notebook-index" aria-label="Notebook status">
				<div>
					<span class="metric-label">Published studies</span>
					<strong>{liveExperimentCount.toString().padStart(2, '0')}</strong>
				</div>
				<div>
					<span class="metric-label">Open notes</span>
					<strong>01</strong>
				</div>
				<div>
					<span class="metric-label">Method</span>
					<p>
						State the question. Build the smallest useful test. Record constraints and tradeoffs.
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>

<section class="section-shell" id="experiments" data-testid="labs-home-section-featured">
	<div class="section-frame">
		<div class="route-divider">Studies and notes</div>
		<div class="mt-5 max-w-3xl space-y-4">
			<h2 class="section-title">One published study. One note still taking shape.</h2>
			<p class="section-copy">
				Labs stays intentionally small: work earns a route only when there is enough substance to
				test, compare, or use.
			</p>
		</div>

		<div class="lab-grid lab-grid--featured mt-8">
			{#each featuredExperiments as experiment (experiment.slug)}
				<ExperimentCard {experiment} featured={experiment.isLive} />
			{/each}
		</div>
	</div>
</section>

<section class="section-shell" id="about" data-testid="labs-home-section-bridge">
	<div class="section-frame">
		<div class="notebook-policy">
			<div>
				<p class="eyebrow">Notebook policy</p>
				<h2 class="section-title mt-3 text-[clamp(2.3rem,4vw,4rem)]">
					Useful evidence over a crowded experiment gallery.
				</h2>
			</div>
			<div class="grid gap-5 text-base leading-8 text-[var(--ink-soft)]">
				<p>
					Every published study identifies its question, exposes the working prototype, and keeps
					limitations visible. Concepts remain notes until they can support a meaningful interaction
					or decision.
				</p>
				<p>
					Labs has no accounts, analytics, uploads, persistence, or hidden research telemetry.
					Current experiments run entirely in the browser.
				</p>
			</div>
		</div>
	</div>
</section>
