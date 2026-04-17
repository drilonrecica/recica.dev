import { expect, test } from 'vitest';
import { criteriaKeys } from '$lib/types/parental-gate';
import { parentalGatePatterns } from './patterns';

test('ships exactly six parental gate patterns for v1', () => {
	expect.hasAssertions();
	expect(parentalGatePatterns).toHaveLength(6);
});

test('keeps criteria scores within the expected 1-5 range', () => {
	expect.hasAssertions();

	for (const pattern of parentalGatePatterns) {
		for (const key of criteriaKeys) {
			const score = pattern.criteriaScores[key];
			expect(score).toBeGreaterThanOrEqual(1);
			expect(score).toBeLessThanOrEqual(5);
		}
	}
});

test('includes non-empty strengths, weaknesses, and accessibility notes', () => {
	expect.hasAssertions();

	for (const pattern of parentalGatePatterns) {
		expect(pattern.strengths.length).toBeGreaterThan(0);
		expect(pattern.weaknesses.length).toBeGreaterThan(0);
		expect(pattern.accessibilityNotes.length).toBeGreaterThan(0);
	}
});
