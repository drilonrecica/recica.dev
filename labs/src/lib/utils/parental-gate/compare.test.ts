import { expect, test } from 'vitest';
import { parentalGatePatterns } from '$lib/data/parental-gate/patterns';
import { sortPatternsByCriterion } from './compare';

test('sorts child resistance from strongest to weakest', () => {
	expect.hasAssertions();

	const sorted = sortPatternsByCriterion(parentalGatePatterns, 'childResistance');

	expect(sorted[0]?.id).toBe('drag-and-drop');
	expect(sorted.at(-1)?.id).toBe('hold-to-confirm');
});

test('sorts parent friction from lowest friction to highest friction', () => {
	expect.hasAssertions();

	const sorted = sortPatternsByCriterion(parentalGatePatterns, 'parentFriction');

	expect(sorted[0]?.id).toBe('hold-to-confirm');
	expect(sorted.at(-1)?.id).toBe('text-challenge');
});
