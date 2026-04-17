import { expect, test } from 'vitest';
import { buildRecommendation, isRecommendationComplete, scorePatterns } from './recommendation';

test('identifies a high-risk purchase flow as a text challenge fit', () => {
	expect.hasAssertions();

	const answers = {
		risk: 'high',
		frequency: 'rare',
		literacy: 'yes',
		accessibility: 'important',
		touch: 'avoid',
		surface: 'purchase'
	};

	expect(isRecommendationComplete(answers)).toBe(true);

	const result = buildRecommendation(answers);

	expect(result.primary.id).toBe('text-challenge');
	expect(result.backup.id).toBe('math-gate');
	expect(result.rationale.length).toBeGreaterThan(1);
});

test('keeps score ordering deterministic for frequent low-risk settings flows', () => {
	expect.hasAssertions();

	const answers = {
		risk: 'low',
		frequency: 'frequent',
		literacy: 'no',
		accessibility: 'critical',
		touch: 'avoid',
		surface: 'settings'
	};

	const scores = scorePatterns(answers);

	expect(scores[0]?.patternId).toBe('hold-to-confirm');
	expect(scores[1]?.patternId).toBe('shape-color-recognition');
});
