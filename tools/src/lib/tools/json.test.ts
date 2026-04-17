import { describe, expect, it } from 'vitest';
import { extractJsonError, formatJson, minifyJson, validateJson } from '$lib/tools/json';

describe('json tools', () => {
	it('formats valid json', () => {
		expect(formatJson('{"lab":"recica","tools":7}')).toContain('\n  "lab": "recica"');
	});

	it('minifies valid json', () => {
		expect(minifyJson('{\n  "lab": "recica"\n}')).toBe('{"lab":"recica"}');
	});

	it('extracts line and column on invalid json', () => {
		const result = validateJson('{\n  "lab": true,\n  \n');
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error.line).toBeGreaterThan(1);
		expect(result.error.column).toBeGreaterThan(0);
	});

	it('preserves error messaging for direct extraction', () => {
		const error = extractJsonError(
			'{"a":}',
			new SyntaxError('Unexpected token } in JSON at position 5')
		);
		expect(error.line).toBe(1);
		expect(error.column).toBe(6);
	});
});
