<script lang="ts">
	import { resolve } from '$app/paths';
	import { parentalGateCopy } from '$lib/data/parental-gate/copy';
	import { parentalGateFaq } from '$lib/data/parental-gate/faq';
	import { parentalGatePatterns } from '$lib/data/parental-gate/patterns';

	const implementationThemes = [
		'Model gate state explicitly: idle, in progress, success, failure, and reset.',
		'Keep prompts predictable so friction comes from intention, not surprise difficulty.',
		'Design recovery paths so adults can retry quickly when they miss the interaction.'
	];

	const antiPatterns = [
		'CAPTCHA-style distortion that punishes adults more than it blocks children.',
		'Color-only or precision-only gates with no accessible fallback path.',
		'Friction so heavy that parents stop trusting the product.',
		'Randomized interactions with no predictable difficulty ceiling.'
	];

	function buildPatternSignals(pattern: (typeof parentalGatePatterns)[number]) {
		const signals: string[] = [];
		if (pattern.criteriaScores.accessibility >= 4) signals.push('Access');
		if (pattern.criteriaScores.speed >= 4) signals.push('Fast');
		if (pattern.recommendationTags.includes('low-literacy')) signals.push('Low literacy');
		if (
			pattern.interactionConstraints.includes('limited-precision') ||
			pattern.interactionConstraints.includes('motor-sensitive')
		) {
			signals.push('Precision');
		}
		if (pattern.recommendationTags.includes('high-risk')) signals.push('High risk');
		return [...new Set(signals)].slice(0, 3);
	}

	const compactPatternRows = parentalGatePatterns.map((pattern) => ({
		id: pattern.id,
		slug: pattern.slug,
		name: pattern.name,
		bestFor: pattern.bestFor,
		strength: pattern.strengths[0],
		watchOut: pattern.weaknesses[0],
		note: pattern.accessibilityNotes[0] ?? pattern.implementationNotes[0],
		signals: buildPatternSignals(pattern)
	}));
</script>

<section class="section-shell" id="guidance" data-testid="guidance-section">
	<div class="section-frame">
		<div class="route-divider">Practical guidance</div>
		<div class="mt-5 space-y-4">
			<h2 class="section-title">The patterns, reduced to what helps you choose and ship one.</h2>
			<p class="section-copy">
				Use the rows for the quick read. Use the notes below when implementation or accessibility is
				what decides the final choice.
			</p>
		</div>

		<div class="surface-panel-strong mt-6 p-4 sm:p-6" data-testid="pattern-rows">
			{#each compactPatternRows as row (row.id)}
				<article class="pattern-row" data-testid={`pattern-row-${row.slug}`}>
					<div class="pattern-row__main">
						<h3 class="font-display text-2xl font-semibold tracking-[-0.05em] text-[var(--ink)]">
							{row.name}
						</h3>
						<p class="pattern-row__tag">{row.bestFor}</p>
						<div class="pattern-signal-row">
							{#each row.signals as signal (signal)}
								<span class="pattern-signal">{signal}</span>
							{/each}
						</div>
					</div>
					<div class="pattern-row__detail">
						<span class="eyebrow">Strength</span>
						<p>{row.strength}</p>
					</div>
					<div class="pattern-row__detail">
						<span class="eyebrow">Watch-out</span>
						<p>{row.watchOut}</p>
					</div>
					<div class="pattern-row__detail">
						<span class="eyebrow">Note</span>
						<p>{row.note}</p>
					</div>
				</article>
			{/each}
		</div>

		<div class="lab-grid lab-grid--two mt-6">
			<div class="surface-panel p-6">
				<div class="space-y-5">
					<div>
						<p class="eyebrow">Implementation themes</p>
						<ul class="summary-list mt-3">
							{#each implementationThemes as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
					<div class="guidance-divider pt-5">
						<p class="eyebrow">Accessibility + anti-patterns</p>
						<div class="warning-band mt-3">
							{#each antiPatterns as item (item)}
								<article class="warning-band__item">
									<strong>Avoid this</strong>
									<p>{item}</p>
								</article>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<div class="surface-panel p-6" id="faq">
				<p class="eyebrow">FAQ</p>
				<div class="compact-faq mt-4">
					{#each parentalGateFaq as item (item.question)}
						<article class="compact-faq__item">
							<h3 class="font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
								{item.question}
							</h3>
							<p class="mt-2 text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
								{item.answer}
							</p>
						</article>
					{/each}
				</div>
			</div>
		</div>

		<div class="surface-panel minimal-cta-strip mt-6 p-5 sm:p-6">
			<div class="minimal-cta-strip__content">
				<div class="space-y-2">
					<p class="eyebrow">{parentalGateCopy.about.eyebrow}</p>
					<p class="max-w-2xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
						{parentalGateCopy.about.description}
					</p>
				</div>
				<div class="flex flex-wrap gap-3">
					<a href={resolve('/')} class="button-base button-primary">
						{parentalGateCopy.about.ctaPrimary}
					</a>
					<a href="https://recica.dev" class="button-base button-secondary" rel="noreferrer">
						{parentalGateCopy.about.ctaSecondary}
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
