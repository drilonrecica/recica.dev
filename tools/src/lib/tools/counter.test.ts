import { describe, expect, it } from 'vitest';
import { countText } from '$lib/tools/counter';

describe('counter tools', () => {
	it('counts words, lines, and paragraphs', () => {
		expect(countText('One two\nThree\n\nFour five')).toEqual({
			characters: 24,
			charactersNoSpaces: 19,
			words: 5,
			lines: 4,
			paragraphs: 2,
			readingMinutes: 1
		});
	});
});
