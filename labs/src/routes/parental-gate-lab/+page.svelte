<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { criteriaMeta } from '$lib/data/parental-gate/criteria';
	import { parentalGateCopy } from '$lib/data/parental-gate/copy';
	import { parentalGateFaq } from '$lib/data/parental-gate/faq';
	import { parentalGatePatterns } from '$lib/data/parental-gate/patterns';
	import { recommendationQuestions } from '$lib/data/parental-gate/recommendationRules';
	import { sortPatternsByCriterion } from '$lib/utils/parental-gate/compare';
	import {
		buildRecommendation,
		isRecommendationComplete
	} from '$lib/utils/parental-gate/recommendation';
	import {
		buildBreadcrumbSchema,
		buildFaqSchema,
		buildPersonSchema,
		buildWebApplicationSchema,
		buildWebPageSchema,
		buildWebsiteSchema
	} from '$lib/utils/seo';
	import type {
		CriterionKey,
		RecommendationAnswers,
		RecommendationResult
	} from '$lib/types/parental-gate';
	import { onDestroy } from 'svelte';

	const title = 'Parental Gate Lab — Compare UX Patterns for Kids & Family Apps';
	const description =
		'Compare six parental gate UX patterns for kids and family apps. Try live demos, review accessibility and implementation tradeoffs, and get a practical recommendation for settings, purchases, subscriptions, and other adult-only flows.';

	const patterns = parentalGatePatterns;
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

	const shapeChoices = [
		{ id: 'amber-square', label: 'Amber square', color: 'Amber', shape: 'Square' },
		{ id: 'teal-circle', label: 'Teal circle', color: 'Teal', shape: 'Circle' },
		{ id: 'blue-triangle', label: 'Blue triangle', color: 'Blue', shape: 'Triangle' },
		{ id: 'amber-circle', label: 'Amber circle', color: 'Amber', shape: 'Circle' },
		{ id: 'teal-square', label: 'Teal square', color: 'Teal', shape: 'Square' },
		{ id: 'blue-circle', label: 'Blue circle', color: 'Blue', shape: 'Circle' }
	];

	const dragChoices = [
		{ id: 'ticket', label: 'Ticket' },
		{ id: 'key', label: 'Key' },
		{ id: 'gear', label: 'Gear' }
	];

	const patternOptions = [
		{ id: 'option-a', label: 'Circle · Triangle · Circle' },
		{ id: 'option-b', label: 'Triangle · Square · Triangle' },
		{ id: 'option-c', label: 'Circle · Square · Triangle' },
		{ id: 'option-d', label: 'Square · Circle · Square' }
	];

	const patternTags: Record<string, string> = {
		'math-gate': 'Settings + purchases',
		'hold-to-confirm': 'Frequent confirmations',
		'drag-and-drop': 'Touch-first adult areas',
		'shape-color-recognition': 'Low-literacy flows',
		'text-challenge': 'High-risk actions',
		'pattern-matching': 'General restricted flows'
	};

	const patternMotifs: Record<string, { label: string; className: string }> = {
		'math-gate': { label: '1+1', className: 'pattern-motif--math' },
		'hold-to-confirm': { label: 'Hold', className: 'pattern-motif--hold' },
		'drag-and-drop': { label: 'Drag', className: 'pattern-motif--drag' },
		'shape-color-recognition': { label: 'Shape', className: 'pattern-motif--shape' },
		'text-challenge': { label: 'Type', className: 'pattern-motif--text' },
		'pattern-matching': { label: 'Match', className: 'pattern-motif--pattern' }
	};

	const patternNameById = new Map(patterns.map((pattern) => [pattern.id, pattern.name]));

	const compactPatternRows = patterns.map((pattern) => ({
		id: pattern.id,
		slug: pattern.slug,
		name: pattern.name,
		bestFor: patternTags[pattern.id] ?? pattern.bestFor,
		strength: pattern.strengths[0],
		watchOut: pattern.weaknesses[0],
		note: pattern.accessibilityNotes[0] ?? pattern.implementationNotes[0],
		signals: buildPatternSignals(pattern)
	}));

	let activePatternId = patterns[0]?.id ?? 'math-gate';
	let activeStatus: 'idle' | 'in-progress' | 'success' | 'failure' = 'idle';
	let activeMessage = buildIdleMessage(activePatternId);

	let mathAnswer = '';
	let holdProgress = 0;
	let holdTimer: ReturnType<typeof setInterval> | null = null;
	let holdComplete = false;
	let dragFallbackSelection = 'key';
	let shapeSelection = '';
	let textAnswer = '';
	let patternSelection = '';
	let compareCriterion: CriterionKey = 'childResistance';
	let recommendationAnswers: RecommendationAnswers = {};
	let recommendation: RecommendationResult | null = null;
	let recommendationError = '';

	$: activePattern = patterns.find((pattern) => pattern.id === activePatternId) ?? patterns[0];
	$: sortedPatterns = sortPatternsByCriterion(patterns, compareCriterion);
	$: compareMeta =
		criteriaMeta.find((criterion) => criterion.key === compareCriterion) ?? criteriaMeta[0]!;

	onDestroy(() => {
		clearHoldTimer();
	});

	function openDemo(patternId: string) {
		activePatternId = patternId;
		resetActiveDemo();
	}

	function resetActiveDemo() {
		clearHoldTimer();
		activeStatus = 'idle';
		mathAnswer = '';
		holdProgress = 0;
		holdComplete = false;
		dragFallbackSelection = 'key';
		shapeSelection = '';
		textAnswer = '';
		patternSelection = '';
		activeMessage = buildIdleMessage(activePatternId);
	}

	function setStatus(status: 'idle' | 'in-progress' | 'success' | 'failure', message: string) {
		activeStatus = status;
		activeMessage = message;
	}

	function submitMathGate() {
		if (mathAnswer.trim() === '12') {
			setStatus(
				'success',
				'Correct. This pattern stays compact, but it leans on reading and numeracy.'
			);
			return;
		}

		setStatus(
			'failure',
			'Incorrect answer. Math gates are easy to retry, but they are not for every audience.'
		);
	}

	function clearHoldTimer() {
		if (holdTimer) {
			clearInterval(holdTimer);
			holdTimer = null;
		}
	}

	function startHold() {
		if (holdTimer || holdComplete) {
			return;
		}

		setStatus('in-progress', 'Keep holding until the track completes.');
		holdTimer = setInterval(() => {
			holdProgress = Math.min(holdProgress + 8, 100);

			if (holdProgress >= 100) {
				holdComplete = true;
				clearHoldTimer();
				setStatus('success', 'Completed. It is fast for adults, but resistance is lighter.');
			}
		}, 100);
	}

	function stopHold() {
		if (!holdTimer && !holdComplete) {
			return;
		}

		if (!holdComplete) {
			clearHoldTimer();
			setStatus(
				'failure',
				'Released too soon. This only works when the timing feedback is obvious.'
			);
			holdProgress = 0;
		}
	}

	function handleDrop(candidateId: string) {
		if (candidateId === 'key') {
			setStatus(
				'success',
				'Correct. Drag gates add resistance, but only if the fallback path is solid.'
			);
			return;
		}

		setStatus('failure', 'Wrong item. Precision-heavy gates need forgiving retries.');
	}

	function submitDragFallback() {
		handleDrop(dragFallbackSelection);
	}

	function chooseShape(optionId: string) {
		shapeSelection = optionId;

		if (optionId === 'amber-square') {
			setStatus(
				'success',
				'Correct. Recognition patterns help when reading should not be required.'
			);
			return;
		}

		setStatus('failure', 'Not quite. Recognition gates should not rely on color alone.');
	}

	function submitTextGate() {
		if (textAnswer.trim().toLowerCase() === 'unlock') {
			setStatus(
				'success',
				'Correct. Typed gates create stronger intent, but they are slower on mobile.'
			);
			return;
		}

		setStatus(
			'failure',
			'Incorrect. Typed gates work best when the action is rare enough to justify the friction.'
		);
	}

	function choosePattern(optionId: string) {
		patternSelection = optionId;

		if (optionId === 'option-a') {
			setStatus(
				'success',
				'Correct. Pattern matching can feel distinctive without becoming noisy.'
			);
			return;
		}

		setStatus('failure', 'Not the matching pattern. The rule needs to stay obvious once seen.');
	}

	function setRecommendationAnswer(questionId: string, value: string) {
		recommendationAnswers = {
			...recommendationAnswers,
			[questionId]: value
		};
	}

	function submitRecommendation() {
		recommendationError = '';

		if (!isRecommendationComplete(recommendationAnswers)) {
			recommendation = null;
			recommendationError = 'Answer all six questions to generate a recommendation.';
			return;
		}

		recommendation = buildRecommendation(recommendationAnswers);
	}

	function resetRecommendation() {
		recommendationAnswers = {};
		recommendation = null;
		recommendationError = '';
	}

	function handleDragStart(event: DragEvent, candidateId: string) {
		event.dataTransfer?.setData('text/plain', candidateId);
	}

	function handleDropEvent(event: DragEvent) {
		event.preventDefault();
		const candidateId = event.dataTransfer?.getData('text/plain');

		if (!candidateId) {
			return;
		}

		handleDrop(candidateId);
	}

	function buildIdleMessage(patternId: string) {
		return `${patternNameById.get(patternId) ?? 'This pattern'} is active. Try the demo below or switch patterns.`;
	}

	function buildPatternSignals(pattern: (typeof patterns)[number]) {
		const signals: string[] = [];

		if (pattern.criteriaScores.accessibility >= 4) {
			signals.push('Access');
		}

		if (pattern.criteriaScores.speed >= 4) {
			signals.push('Fast');
		}

		if (pattern.recommendationTags.includes('low-literacy')) {
			signals.push('Low literacy');
		}

		if (
			pattern.interactionConstraints.includes('limited-precision') ||
			pattern.interactionConstraints.includes('motor-sensitive')
		) {
			signals.push('Precision');
		}

		if (pattern.recommendationTags.includes('high-risk')) {
			signals.push('High risk');
		}

		return [...new Set(signals)].slice(0, 3);
	}

	function buildScoreWidth(score: number) {
		return `${Math.max(0, Math.min(score, 5)) * 20}%`;
	}
</script>

<SeoHead
	{title}
	{description}
	path="/parental-gate-lab"
	socialImagePath="/og-parental-gate.svg"
	socialImageAlt="Parental Gate Lab social preview"
	keywords={[
		'parental gate ux',
		'kids app parental gate',
		'family app ux',
		'parental gate patterns',
		'parental gate accessibility'
	]}
	schemaBuilder={(origin) => [
		buildWebsiteSchema(origin, description),
		buildWebPageSchema(origin, '/parental-gate-lab', title, description),
		buildWebApplicationSchema(
			origin,
			'/parental-gate-lab',
			'Parental Gate Lab',
			description,
			'/og-parental-gate.svg'
		),
		buildFaqSchema(parentalGateFaq),
		buildBreadcrumbSchema(origin, [
			{ name: 'Labs', path: '/' },
			{ name: 'Parental Gate Lab', path: '/parental-gate-lab' }
		]),
		buildPersonSchema()
	]}
/>

<section class="section-shell">
	<div class="section-frame pt-6 sm:pt-10">
		<div class="lab-grid lab-grid--hero">
			<div class="hero-enter grid gap-7">
				<div class="route-divider">Family app UX</div>

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

			<div class="hero-poster hero-enter min-h-[28rem] overflow-hidden p-6 sm:p-8">
				<svg class="route-motif" viewBox="0 0 640 560" aria-hidden="true">
					<path
						d="M108 118H248C286 118 316 148 316 186V234C316 264 340 288 370 288H428C474 288 510 324 510 370V410"
						stroke-width="3"
						fill="none"
					/>
					<path d="M108 414H254C286 414 312 388 312 356V236" stroke-width="2.4" fill="none" />
					<path d="M448 118C478 118 502 142 502 172V214" stroke-width="2" fill="none" />
					<circle cx="108" cy="118" r="12" fill="var(--accent)" stroke="none" />
					<circle cx="510" cy="410" r="14" fill="var(--accent-secondary)" stroke="none" />
					<circle cx="312" cy="236" r="10" fill="var(--accent)" stroke="none" />
					<circle cx="448" cy="118" r="10" fill="var(--accent-secondary)" stroke="none" />
				</svg>

				<div class="relative z-10 flex h-full flex-col justify-between gap-6">
					<div class="space-y-4">
						<span class="status-pill status-pill--live">Product + UX reference</span>
						<p
							class="font-display text-4xl font-semibold tracking-[-0.06em] text-[var(--ink)] sm:text-5xl"
						>
							Intentional friction, compared in one place.
						</p>
						<p class="max-w-xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
							Start with the live patterns. Use the fit finder when the tradeoffs are less obvious.
						</p>
					</div>

					<p class="text-sm leading-7 text-[var(--ink-soft)]">
						Settings, purchases, subscriptions, and other adult-only surfaces in family-facing
						products.
					</p>
				</div>
			</div>
		</div>

		<div class="quick-start-strip hero-enter mt-6">
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

<section class="section-shell" id="demos">
	<div class="section-frame">
		<div class="route-divider">Demos</div>
		<div class="mt-5 space-y-4">
			<h2 class="section-title">Start with the patterns that feel closest to your product.</h2>
			<p class="section-copy">
				Open a pattern, then use the shared panel to feel the tradeoffs quickly.
			</p>
		</div>

		<div class="lab-grid lab-grid--three mt-6" data-testid="demo-grid">
			{#each patterns as pattern (pattern.id)}
				<article
					class={`demo-card ${pattern.id === activePatternId ? 'demo-card--active' : ''}`}
					aria-current={pattern.id === activePatternId ? 'true' : undefined}
				>
					<div class="space-y-3">
						<div class="demo-card__header">
							<div
								class={`pattern-motif ${patternMotifs[pattern.id]?.className ?? ''}`}
								aria-hidden="true"
							>
								{patternMotifs[pattern.id]?.label ?? 'Lab'}
							</div>

							<div class="space-y-2">
								<div class="flex flex-wrap items-center gap-3">
									<h3
										class="font-display text-2xl font-semibold tracking-[-0.05em] text-[var(--ink)]"
									>
										{pattern.name}
									</h3>
									{#if pattern.id === activePatternId}
										<span class="status-pill status-pill--live">Active pattern</span>
									{/if}
								</div>
								<span class="tag-pill">{patternTags[pattern.id] ?? pattern.bestFor}</span>
							</div>
						</div>

						<p class="text-sm leading-7 text-[var(--ink-soft)]">{pattern.summary}</p>
					</div>

					<div class="flex flex-wrap gap-2 text-xs">
						<span class="score-pill">Resistance {pattern.criteriaScores.childResistance}/5</span>
						<span class="score-pill">Speed {pattern.criteriaScores.speed}/5</span>
					</div>

					<p class="demo-card__watch-out">
						<strong>Watch-out:</strong>
						{pattern.weaknesses[0]}
					</p>

					<button
						type="button"
						class="button-base button-secondary"
						on:click={() => openDemo(pattern.id)}
						data-testid={`open-demo-${pattern.slug}`}
					>
						Try it
					</button>
				</article>
			{/each}
		</div>

		<div class="demo-panel mt-6" data-testid="demo-panel">
			{#if activePattern}
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="space-y-2">
						<p class="eyebrow">Active demo</p>
						<h3 class="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--ink)]">
							{activePattern.name}
						</h3>
						<p class="max-w-2xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
							{activePattern.description}
						</p>
					</div>

					<button type="button" class="button-base button-tertiary" on:click={resetActiveDemo}>
						Reset demo
					</button>
				</div>

				<div class="mt-6 grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
					<div class="space-y-5">
						{#if activePattern.demoType === 'math'}
							<div class="surface-panel rounded-[24px] p-5">
								<p class="eyebrow">Solve the prompt</p>
								<p
									class="font-display mt-3 text-5xl font-semibold tracking-[-0.08em] text-[var(--ink)]"
								>
									7 + 5 = ?
								</p>
								<div class="mt-5 flex flex-col gap-3 sm:flex-row">
									<input
										class="input-shell"
										type="text"
										inputmode="numeric"
										placeholder="Enter the answer"
										bind:value={mathAnswer}
										data-testid="math-answer"
									/>
									<button
										type="button"
										class="button-base button-primary"
										on:click={submitMathGate}
									>
										Submit
									</button>
								</div>
							</div>
						{:else if activePattern.demoType === 'hold'}
							<div class="surface-panel rounded-[24px] p-5">
								<p class="eyebrow">Hold to confirm</p>
								<p class="mt-3 text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
									Hold the button until the progress track completes. Keyboard users can hold Space
									or Enter on the same button.
								</p>
								<div class="mt-5 space-y-4">
									<button
										type="button"
										class="button-base button-primary w-full sm:w-auto"
										on:pointerdown={startHold}
										on:pointerup={stopHold}
										on:pointerleave={stopHold}
										on:keydown={(event) => {
											if (event.key === ' ' || event.key === 'Enter') {
												event.preventDefault();
												startHold();
											}
										}}
										on:keyup={(event) => {
											if (event.key === ' ' || event.key === 'Enter') {
												event.preventDefault();
												stopHold();
											}
										}}
										data-testid="hold-trigger"
									>
										Hold to unlock
									</button>
									<div class="progress-track" aria-hidden="true">
										<div class="progress-fill" style={`width: ${holdProgress}%`}></div>
									</div>
								</div>
							</div>
						{:else if activePattern.demoType === 'drag'}
							<div class="surface-panel rounded-[24px] p-5">
								<p class="eyebrow">Move the correct item into the gate</p>
								<div class="mt-5 grid gap-4 sm:grid-cols-3">
									{#each dragChoices as choice (choice.id)}
										<button
											type="button"
											draggable="true"
											class="drag-item"
											on:dragstart={(event) => handleDragStart(event, choice.id)}
											data-testid={`drag-item-${choice.id}`}
										>
											{choice.label}
										</button>
									{/each}
								</div>
								<button
									type="button"
									class="drag-target mt-5 flex items-center justify-center p-6 text-center text-sm leading-7 text-[var(--ink-soft)]"
									on:dragover={(event) => event.preventDefault()}
									on:drop={handleDropEvent}
									data-testid="drag-target"
								>
									Drop the item that should unlock the adult settings area.
								</button>

								<div class="mt-6 border-t border-[var(--line)] pt-5">
									<p class="eyebrow">Accessible fallback</p>
									<div class="mt-3 flex flex-wrap gap-3">
										{#each dragChoices as choice (choice.id)}
											<button
												type="button"
												class={`fallback-chip ${dragFallbackSelection === choice.id ? 'fallback-chip--selected' : ''}`}
												on:click={() => (dragFallbackSelection = choice.id)}
												data-testid={`fallback-select-${choice.id}`}
											>
												{choice.label}
											</button>
										{/each}
									</div>
									<button
										type="button"
										class="button-base button-secondary mt-4"
										on:click={submitDragFallback}
										data-testid="drag-fallback-submit"
									>
										Place selected item in gate
									</button>
								</div>
							</div>
						{:else if activePattern.demoType === 'shape'}
							<div class="surface-panel rounded-[24px] p-5">
								<p class="eyebrow">Prompt</p>
								<p class="mt-3 text-lg font-semibold text-[var(--ink)]">Select the amber square.</p>
								<div class="mt-5 grid gap-3 sm:grid-cols-3">
									{#each shapeChoices as option (option.id)}
										<button
											type="button"
											class={`icon-pick ${shapeSelection === option.id ? 'icon-pick--selected' : ''}`}
											on:click={() => chooseShape(option.id)}
											data-testid={`shape-option-${option.id}`}
										>
											<span>{option.label}</span>
										</button>
									{/each}
								</div>
							</div>
						{:else if activePattern.demoType === 'text'}
							<div class="surface-panel rounded-[24px] p-5">
								<p class="eyebrow">Type the prompt exactly</p>
								<p class="mt-3 text-lg font-semibold text-[var(--ink)]">Type the word “unlock”.</p>
								<div class="mt-5 flex flex-col gap-3 sm:flex-row">
									<input
										class="input-shell"
										type="text"
										placeholder="unlock"
										bind:value={textAnswer}
										data-testid="text-answer"
									/>
									<button
										type="button"
										class="button-base button-primary"
										on:click={submitTextGate}
									>
										Submit
									</button>
								</div>
							</div>
						{:else if activePattern.demoType === 'pattern'}
							<div class="surface-panel rounded-[24px] p-5">
								<p class="eyebrow">Reference pattern</p>
								<p class="mt-3 text-lg font-semibold text-[var(--ink)]">
									Circle · Triangle · Circle
								</p>
								<div class="mt-5 grid gap-3 sm:grid-cols-2">
									{#each patternOptions as option (option.id)}
										<button
											type="button"
											class={`pattern-option ${patternSelection === option.id ? 'pattern-option--selected' : ''}`}
											on:click={() => choosePattern(option.id)}
											data-testid={`pattern-option-${option.id}`}
										>
											{option.label}
										</button>
									{/each}
								</div>
							</div>
						{/if}

						<div
							class={`demo-status demo-status--${activeStatus}`}
							data-testid="demo-status"
							role="status"
							aria-live="polite"
							aria-atomic="true"
						>
							{activeMessage}
						</div>
					</div>

					<div class="surface-panel rounded-[24px] p-5">
						<p class="eyebrow">At a glance</p>
						<div class="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
							<p><strong class="text-[var(--ink)]">Best for:</strong> {activePattern.bestFor}</p>
							<p>
								<strong class="text-[var(--ink)]">Strength:</strong>
								{activePattern.strengths[0]}
							</p>
							<p>
								<strong class="text-[var(--ink)]">Watch-out:</strong>
								{activePattern.weaknesses[0]}
							</p>
							<div class="flex flex-wrap gap-2">
								<span class="score-pill"
									>Resistance {activePattern.criteriaScores.childResistance}</span
								>
								<span class="score-pill">Access {activePattern.criteriaScores.accessibility}</span>
								<span class="score-pill">Speed {activePattern.criteriaScores.speed}</span>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<section class="section-shell" id="compare" data-testid="fit-finder-section">
	<div class="section-frame">
		<div class="route-divider">Fit finder</div>
		<div class="mt-5 space-y-4">
			<h2 class="section-title">
				Compare quickly, then use the helper when the decision is less obvious.
			</h2>
			<p class="section-copy">
				The table gives you the fast scan. The six-question helper gives you a stronger first fit.
			</p>
		</div>

		<div class="surface-panel-strong mt-6 p-5 sm:p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p class="eyebrow">Compare</p>
					<p class="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
						Sort one criterion, scan the tradeoffs, then use the helper if two options still feel
						close.
					</p>
				</div>

				<label class="grid gap-2 text-sm text-[var(--ink-soft)]">
					<span>Sort by</span>
					<select class="select-shell" bind:value={compareCriterion} data-testid="compare-sort">
						{#each criteriaMeta as criterion (criterion.key)}
							<option value={criterion.key}>{criterion.label}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="compare-context mt-5">
				<p class="compare-context__label">
					{compareMeta.label}
					<span>{compareMeta.highIsBetter ? 'Higher is better' : 'Lower is better'}</span>
				</p>
				<p class="text-sm leading-7 text-[var(--ink-soft)]">{compareMeta.description}</p>
			</div>

			<div class="mt-6 hidden overflow-x-auto md:block">
				<table class="compare-table" data-testid="compare-table">
					<thead>
						<tr>
							<th class="compare-table__sticky-column">Pattern</th>
							<th>Best for</th>
							{#each criteriaMeta as criterion (criterion.key)}
								<th class:compare-highlight={criterion.key === compareCriterion}>
									{criterion.shortLabel}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each sortedPatterns as pattern (pattern.id)}
							<tr data-testid={`compare-row-${pattern.slug}`}>
								<td class="compare-table__sticky-column">
									<div class="compare-highlight font-display text-lg tracking-[-0.04em]">
										{pattern.name}
									</div>
								</td>
								<td>{pattern.bestFor}</td>
								{#each criteriaMeta as criterion (criterion.key)}
									<td class:compare-highlight={criterion.key === compareCriterion}>
										<div class="score-cell">
											<span class="score-meter">{pattern.criteriaScores[criterion.key]}</span>
											<div class="score-bar" aria-hidden="true">
												<div
													class="score-bar__fill"
													style={`width: ${buildScoreWidth(pattern.criteriaScores[criterion.key])}`}
												></div>
											</div>
										</div>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="compare-card-grid mt-6 grid gap-4 md:hidden">
				{#each sortedPatterns as pattern (pattern.id)}
					<article class="compare-card" data-testid={`compare-card-${pattern.slug}`}>
						<div class="space-y-2">
							<div class="flex flex-wrap items-center justify-between gap-3">
								<h3
									class="font-display text-2xl font-semibold tracking-[-0.05em] text-[var(--ink)]"
								>
									{pattern.name}
								</h3>
								<span class="tag-pill">{pattern.bestFor}</span>
							</div>
						</div>

						<div class="compare-card__scores">
							{#each criteriaMeta as criterion (criterion.key)}
								<div class="compare-card__score">
									<div class="flex items-center justify-between gap-3">
										<span>{criterion.shortLabel}</span>
										<strong>{pattern.criteriaScores[criterion.key]}/5</strong>
									</div>
									<div class="score-bar" aria-hidden="true">
										<div
											class="score-bar__fill"
											style={`width: ${buildScoreWidth(pattern.criteriaScores[criterion.key])}`}
										></div>
									</div>
								</div>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</div>

		<div id="recommendation" class="lab-grid lab-grid--two mt-6">
			<div class="surface-panel p-5 sm:p-6">
				<div class="space-y-2">
					<p class="eyebrow">Recommendation</p>
					<p class="text-sm leading-7 text-[var(--ink-soft)]">
						Answer six product questions for one primary pattern and one backup option.
					</p>
				</div>

				<div class="qa-grid mt-5">
					{#each recommendationQuestions as question (question.id)}
						<section class="qa-card qa-card--compact">
							<h3 class="font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
								{question.prompt}
							</h3>

							<div class="grid gap-2">
								{#each question.options as option (option.value)}
									<button
										type="button"
										class={`answer-option answer-option--compact justify-start text-left ${recommendationAnswers[question.id] === option.value ? 'answer-option--selected' : ''}`}
										on:click={() => setRecommendationAnswer(question.id, option.value)}
										data-testid={`answer-${question.id}-${option.value}`}
									>
										<span>
											<strong class="block text-[var(--ink)]">{option.label}</strong>
											<span class="mt-1 block text-sm leading-6 text-[var(--ink-soft)]">
												{option.description}
											</span>
										</span>
									</button>
								{/each}
							</div>
						</section>
					{/each}
				</div>

				<div class="mt-5 flex flex-wrap gap-3">
					<button type="button" class="button-base button-primary" on:click={submitRecommendation}>
						Recommend a pattern
					</button>
					<button type="button" class="button-base button-tertiary" on:click={resetRecommendation}>
						Reset answers
					</button>
				</div>
			</div>

			<div class="surface-panel-strong p-6 sm:p-8" data-testid="recommendation-panel">
				<p class="sr-only" aria-live="polite" aria-atomic="true">
					{#if recommendation}
						Primary recommendation {recommendation.primary.name}. Backup option {recommendation
							.backup.name}.
					{:else if recommendationError}
						{recommendationError}
					{/if}
				</p>
				{#if recommendation}
					<div class="space-y-6">
						<div class="space-y-3">
							<p class="eyebrow">Primary recommendation</p>
							<h3 class="font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink)]">
								{recommendation.primary.name}
							</h3>
							<p class="text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
								{recommendation.primary.bestFor}
							</p>
						</div>

						<div class="result-card">
							<div class="result-card__section">
								<p class="eyebrow">Backup option</p>
								<p
									class="font-display mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]"
								>
									{recommendation.backup.name}
								</p>
								<p class="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
									Safer fallback if the primary feels too heavy in practice.
								</p>
							</div>
						</div>

						<div>
							<p class="eyebrow">Why this fit</p>
							<ul class="summary-list mt-3">
								{#each recommendation.rationale as item (item)}
									<li>{item}</li>
								{/each}
							</ul>
						</div>

						<div>
							<p class="eyebrow">Watch-outs</p>
							<ul class="summary-list summary-list--warning mt-3">
								{#each recommendation.watchOuts as item (item)}
									<li>{item}</li>
								{/each}
							</ul>
						</div>

						<div class="result-card">
							<div class="result-card__section">
								<p class="eyebrow">Reference notes</p>
								<div class="result-note-grid mt-3">
									<div class="result-note">
										<strong>Accessibility note</strong>
										<p>{recommendation.primary.accessibilityNotes[0]}</p>
									</div>
									<div class="result-note">
										<strong>Implementation note</strong>
										<p>{recommendation.primary.implementationNotes[0]}</p>
									</div>
								</div>
							</div>

							<div class="result-card__section result-card__section--breakdown">
								<p class="eyebrow">Score breakdown</p>
								<div class="score-breakdown mt-3">
									{#each recommendation.scoreBreakdown.slice(0, 3) as item (item.patternId)}
										<div class="score-breakdown__row">
											<div class="flex items-center justify-between gap-3">
												<span>{patternNameById.get(item.patternId) ?? item.patternId}</span>
												<strong>{item.score}</strong>
											</div>
											<div class="score-bar" aria-hidden="true">
												<div
													class="score-bar__fill"
													style={`width: ${Math.min(Math.max(item.score, 0), 20) * 5}%`}
												></div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="space-y-4">
						<p class="eyebrow">Advisory output</p>
						<h3 class="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--ink)]">
							Answer the questions to get a primary fit and a backup.
						</h3>
						<p class="text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
							The helper runs locally and returns one primary fit plus one backup.
						</p>

						{#if recommendationError}
							<div class="demo-status demo-status--failure">{recommendationError}</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

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
