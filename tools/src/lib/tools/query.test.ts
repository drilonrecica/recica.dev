import { describe, expect, it } from 'vitest';
import { buildQueryString, parseQueryString } from '$lib/tools/query';

describe('query tools', () => {
	it('parses and rebuilds repeated keys', () => {
		const result = parseQueryString('?tag=one&tag=two&mode=full+url');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.entries).toEqual([
			{ key: 'tag', value: 'one' },
			{ key: 'tag', value: 'two' },
			{ key: 'mode', value: 'full url' }
		]);
		expect(buildQueryString(result.entries)).toBe('?tag=one&tag=two&mode=full%20url');
	});

	it('fails on malformed percent-encoding', () => {
		expect(parseQueryString('?bad=%E0%A4%A')).toEqual({
			ok: false,
			error: 'Could not parse this query string. Check for malformed percent-encoded values.'
		});
	});
});
