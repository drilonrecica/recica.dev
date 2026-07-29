import { describe, expect, it } from 'vitest';
import { evaluateRegex } from '$lib/tools/regex';

describe('regex tools', () => {
	it('returns matches and replace preview', () => {
		const result = evaluateRegex('(json)', 'gi', 'JSON json', '<$1>');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		const firstMatch = result.matches[0];
		if (!firstMatch) {
			throw new Error('Expected at least one regex match.');
		}
		expect(result.matches).toHaveLength(2);
		expect(firstMatch.groups).toEqual(['JSON']);
		expect(result.replaced).toBe('<JSON> <json>');
	});

	it('reports invalid patterns', () => {
		const result = evaluateRegex('([a-z', 'g', 'abc', '');
		expect(result.ok).toBe(false);
	});

	it('supports non-global and named optional groups', () => {
		const result = evaluateRegex('(?<word>json)(?<suffix>-xml)?', 'i', 'JSON json', '$<word>');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.matches).toHaveLength(1);
		expect(result.matches[0]).toMatchObject({
			index: 0,
			end: 4,
			text: 'JSON',
			groups: ['JSON', ''],
			namedGroups: { word: 'JSON', suffix: '' }
		});
		expect(result.replaced).toBe('JSON json');
	});

	it('advances safely after zero-width global matches', () => {
		const result = evaluateRegex('(?=a)', 'g', 'aa', '-');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.matches.map((match) => match.index)).toEqual([0, 1]);
	});
});
