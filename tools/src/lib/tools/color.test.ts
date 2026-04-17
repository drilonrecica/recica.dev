import { describe, expect, it } from 'vitest';
import { formatColorOutputs, parseColor } from '$lib/tools/color';

describe('color tools', () => {
	it('parses hex and formats outputs', () => {
		const result = parseColor('#1EC8A5');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(formatColorOutputs(result.value)).toMatchObject({
			hex: '#1EC8A5',
			rgb: 'rgb(30, 200, 165)'
		});
	});

	it('rejects invalid colors', () => {
		expect(parseColor('oops')).toEqual({
			ok: false,
			error: 'Could not parse this color. Use HEX, RGB(A), or HSL(A).'
		});
	});
});
