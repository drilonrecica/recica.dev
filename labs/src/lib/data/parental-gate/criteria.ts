import type { CriterionKey } from '$lib/types/parental-gate';

export const criteriaMeta: Array<{
	key: CriterionKey;
	label: string;
	description: string;
	highIsBetter: boolean;
	shortLabel: string;
}> = [
	{
		key: 'childResistance',
		label: 'Child resistance',
		description: 'How reliably the pattern slows or blocks accidental child-driven access.',
		highIsBetter: true,
		shortLabel: 'Resistance'
	},
	{
		key: 'parentFriction',
		label: 'Parent friction',
		description: 'How much effort the pattern asks from the adult user every time it appears.',
		highIsBetter: false,
		shortLabel: 'Friction'
	},
	{
		key: 'accessibility',
		label: 'Accessibility',
		description: 'How well the interaction can be adapted for adults with varied access needs.',
		highIsBetter: true,
		shortLabel: 'Access'
	},
	{
		key: 'complexity',
		label: 'Implementation complexity',
		description: 'How much engineering and QA work the pattern usually introduces.',
		highIsBetter: false,
		shortLabel: 'Complexity'
	},
	{
		key: 'speed',
		label: 'Parent speed',
		description: 'How fast an adult can clear the gate once they understand it.',
		highIsBetter: true,
		shortLabel: 'Speed'
	},
	{
		key: 'breadth',
		label: 'Context breadth',
		description:
			'How broadly the pattern fits settings, purchases, account changes, and similar flows.',
		highIsBetter: true,
		shortLabel: 'Breadth'
	}
];
