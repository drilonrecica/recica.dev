export const parentalGateCopy = {
	hero: {
		title: 'Parental Gate Lab',
		subtitle: 'Compare UX patterns for kids and family apps.',
		description:
			'Try six parental gate patterns, compare the tradeoffs, and get a practical recommendation for adult-only flows in kids and family apps.',
		status: 'Compare patterns, use the fit finder, and review implementation guidance.'
	},
	intro: {
		eyebrow: 'Overview',
		title: 'A parental gate is intentional friction, not a magic wall.',
		description:
			'A parental gate adds deliberate friction to adult-only actions. The right one blocks accidental child access without making adults fight the product.'
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
			'Use the patterns for the fast read. Use these notes when implementation and accessibility decide the final choice.'
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
