export const parentalGateCopy = {
	hero: {
		kicker: 'Live prototype',
		title: 'Parental Gate Lab',
		subtitle: 'Compare UX patterns for kids and family apps.',
		description:
			'Try six parental gate patterns, compare the tradeoffs, and get a practical recommendation based on risk, frequency, literacy, and accessibility needs.',
		status: 'Interactive reference · local recommendation helper'
	},
	intro: {
		eyebrow: 'Overview',
		title: 'A parental gate is intentional friction, not a magic wall.',
		description:
			'The goal is simple: enough resistance to slow accidental child access without making adults resent the product.'
	},
	demos: {
		eyebrow: 'Demos',
		title: 'Try the patterns live.',
		description:
			'Each pattern is judged the same way: resistance, parent effort, accessibility, speed, complexity, and breadth of fit.'
	},
	compare: {
		eyebrow: 'Compare',
		title: 'See the tradeoffs side by side.',
		description:
			'This is not a universal ranking. It is a fast read on where each pattern is naturally strong and where it starts to break down.'
	},
	recommendation: {
		eyebrow: 'Recommendation',
		title: 'Find a stronger first fit.',
		description: 'Answer six product questions and get one primary fit plus one backup option.'
	},
	guidance: {
		eyebrow: 'Guidance',
		title: 'Guidance for shipping, not just choosing.',
		description:
			'The demos are the fast path. These notes cover the implementation and accessibility details that usually settle the final decision.'
	},
	about: {
		eyebrow: 'About this lab',
		title: 'Built as a public product and UX reference.',
		description:
			'This experiment comes out of real mobile product work: family-facing flows, constrained screens, and the recurring need to protect adult-only actions without drifting into bad UX.',
		ctaPrimary: 'Back to Labs',
		ctaSecondary: 'Back to recica.dev'
	}
} as const;
