import { describe, expect, it } from 'vitest';
import { transformUrl } from '$lib/tools/url';

describe('url tools', () => {
	it('encodes full urls without over-encoding separators', () => {
		const result = transformUrl('https://recica.dev/tools?name=json formatter', 'full', 'encode');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.output).toContain('https://');
		expect(result.output).toContain('json%20formatter');
	});

	it('may return the same output for already-valid full urls', () => {
		const result = transformUrl('https://example.com?a=1&b=2', 'full', 'encode');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.output).toBe('https://example.com?a=1&b=2');
	});

	it('decodes url components', () => {
		const result = transformUrl('json%20formatter', 'component', 'decode');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.output).toBe('json formatter');
	});

	it('returns an error on malformed decode input', () => {
		const result = transformUrl('%E0%A4%A', 'component', 'decode');
		expect(result.ok).toBe(false);
	});
});
