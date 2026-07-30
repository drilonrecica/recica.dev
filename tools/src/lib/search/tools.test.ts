import { describe, expect, it } from 'vitest';
import { tools } from '$lib/constants/tools';
import { searchTools } from '$lib/search/tools';

describe('tool search', () => {
	it('returns the catalog unchanged for an empty query', () => {
		expect(searchTools('   ')).toEqual(tools);
	});

	it('ranks exact names and normalizes punctuation and accents', () => {
		expect(searchTools('JSON Formatter / Validator')[0]?.id).toBe('json');
		expect(searchTools('base-64')[0]?.id).toBe('base64');
		expect(searchTools('dévice browser')[0]?.id).toBe('device');
	});

	it('finds category, description, keyword, and multi-token matches', () => {
		expect(searchTools('security').map((tool) => tool.id)).toEqual(
			expect.arrayContaining(['password', 'hash', 'jwt'])
		);
		expect(searchTools('pretty print')[0]?.id).toBe('json');
		expect(searchTools('repeated keys')[0]?.id).toBe('query');
		expect(searchTools('browser information')[0]?.id).toBe('device');
	});

	it('returns no entries for an unrelated query', () => {
		expect(searchTools('qzxwvkjp')).toEqual([]);
	});
});
