import type { ExperimentDefinition } from '$lib/types/experiments';

export const experiments: ExperimentDefinition[] = [
	{
		slug: 'parental-gate-lab',
		title: 'Parental Gate Lab',
		shortTitle: 'Parental Gate',
		status: 'live',
		type: 'interactive-lab',
		oneLiner: 'Try, compare, and evaluate parental gate patterns for apps used by kids and adults.',
		summary:
			'A hands-on reference for product teams building settings, purchase, and account flows that need intentional friction without punishing parents.',
		featured: true,
		year: 2026,
		ctaLabel: 'Open Parental Gate Lab',
		ctaHref: '/parental-gate-lab',
		visualTheme: 'product-dark',
		isLive: true,
		isComingSoon: false,
		sortOrder: 1,
		homeVisibility: 'featured',
		descriptionLong:
			'Interactive parental gate patterns, tradeoff scoring, recommendation logic, and implementation guidance for family-facing apps.',
		whyItExists:
			'Most parental gate examples stop at visuals. This lab focuses on tradeoffs, accessibility, implementation realities, and product fit.',
		futurePotential:
			'This can expand into deeper family-app UX references, talks, and premium pattern guidance later.'
	},
	{
		slug: 'mobile-analytics-crash-reporting',
		title: 'Mobile Analytics + Crash Reporting',
		shortTitle: 'Analytics Concept',
		status: 'coming-soon',
		type: 'concept',
		oneLiner:
			'A privacy-first mobile telemetry concept for teams that want useful signals without data sprawl.',
		summary:
			'Exploring crash reporting, release health, and analytics fundamentals for mobile products that need practical insight and cleaner defaults.',
		featured: false,
		year: 2026,
		ctaLabel: 'Coming Soon',
		visualTheme: 'editorial-light',
		isLive: false,
		isComingSoon: true,
		sortOrder: 2,
		homeVisibility: 'teaser',
		descriptionLong:
			'A concept exploration around product analytics and crash visibility that keeps privacy and signal quality ahead of dashboard noise.',
		whyItExists:
			'Many teams need better mobile insight without adopting heavy, privacy-hostile analytics stacks.',
		futurePotential:
			'This may become a deeper concept page, prototype, or standalone product depending on the shape of the idea.'
	}
];

export const featuredExperiments = experiments
	.filter((experiment) => experiment.homeVisibility !== 'hidden')
	.sort((left, right) => left.sortOrder - right.sortOrder);

export const liveExperimentCount = experiments.filter((experiment) => experiment.isLive).length;
