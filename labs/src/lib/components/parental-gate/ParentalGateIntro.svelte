<script lang="ts">
	import { resolve } from '$app/paths';
	import { parentalGateCopy } from '$lib/data/parental-gate/copy';

	const quickStartLinks = [
		{
			label: 'Try patterns',
			href: '/parental-gate-lab#demos',
			description: 'Open the six live demos and start with the pattern that feels closest.'
		},
		{
			label: 'Compare tradeoffs',
			href: '/parental-gate-lab#compare',
			description: 'Scan the matrix when the right pattern is not obvious at first glance.'
		},
		{
			label: 'Get a recommendation',
			href: '/parental-gate-lab#recommendation',
			description: 'Use the six-question helper for one primary fit and one backup.'
		}
	] as const;

	const whatItIsPoints = [
		'Used for settings, purchases, subscriptions, and other adult-only surfaces.',
		'Choose the pattern based on risk, frequency, literacy, and accessibility.',
		'The best gate is clear for adults and resistant to accidental child access.'
	];
</script>

<section class="section-shell">
	<div class="section-frame pt-6 sm:pt-10">
		<div class="lab-grid lab-grid--hero">
			<div class="grid gap-7">
				<div class="route-divider">Published study / 01</div>

				<div class="space-y-5">
					<h1
						class="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] font-bold tracking-[-0.08em] text-[var(--ink)]"
					>
						{parentalGateCopy.hero.title}
					</h1>
					<p class="max-w-3xl text-xl leading-8 text-[var(--ink)]/90 sm:text-2xl">
						{parentalGateCopy.hero.subtitle}
					</p>
					<p class="max-w-3xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
						{parentalGateCopy.hero.description}
					</p>
				</div>

				<div class="flex flex-wrap gap-3">
					<a href="#demos" class="button-base button-primary">Try the patterns</a>
					<a href="#recommendation" class="button-base button-secondary">Find a good fit</a>
					<a href={resolve('/')} class="button-base button-tertiary">Back to Labs</a>
				</div>

				<p class="hero-note text-sm leading-7 text-[var(--ink-soft)]">
					<span class="status-pill status-pill--live">6 live patterns</span>
					<span>{parentalGateCopy.hero.status}</span>
				</p>
			</div>

			<aside class="notebook-index" aria-label="Study record">
				<div>
					<span class="metric-label">Question</span>
					<p>Which parental gate pattern best matches a family app’s risk and audience?</p>
				</div>
				<div>
					<span class="metric-label">Method</span>
					<p>Interact with six patterns, compare scored tradeoffs, then test the fit finder.</p>
				</div>
				<div>
					<span class="metric-label">Scope</span>
					<p>Settings, purchases, subscriptions, and other adult-only product surfaces.</p>
				</div>
			</aside>
		</div>

		<div class="quick-start-strip mt-6">
			{#each quickStartLinks as item (item.href)}
				<a href={resolve(item.href)} class="quick-start-card">
					<span class="eyebrow">{item.label}</span>
					<strong>{item.label}</strong>
					<span>{item.description}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="section-shell" id="overview">
	<div class="section-frame">
		<div class="route-divider">{parentalGateCopy.intro.eyebrow}</div>
		<div class="lab-grid lab-grid--two mt-5">
			<div class="space-y-4">
				<h2 class="section-title">{parentalGateCopy.intro.title}</h2>
				<p class="section-copy">{parentalGateCopy.intro.description}</p>
			</div>

			<ul class="summary-list summary-list--spacious">
				{#each whatItIsPoints as point (point)}
					<li>{point}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
