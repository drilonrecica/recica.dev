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

	it.each([
		['#abc', { r: 170, g: 187, b: 204, a: 1 }],
		['#abcd', { r: 170, g: 187, b: 204, a: 0.867 }],
		['rgba(12, 34, 56, 0.25)', { r: 12, g: 34, b: 56, a: 0.25 }],
		['rgb(255, 0, 128)', { r: 255, g: 0, b: 128, a: 1 }],
		['hsl(0, 100%, 50%)', { r: 255, g: 0, b: 0, a: 1 }],
		['hsl(60, 100%, 50%)', { r: 255, g: 255, b: 0, a: 1 }],
		['hsl(120, 100%, 50%)', { r: 0, g: 255, b: 0, a: 1 }],
		['hsl(180, 100%, 50%)', { r: 0, g: 255, b: 255, a: 1 }],
		['hsl(240, 100%, 50%)', { r: 0, g: 0, b: 255, a: 1 }],
		['hsl(300, 100%, 50%)', { r: 255, g: 0, b: 255, a: 1 }],
		['hsla(-60, 100%, 50%, 0.5)', { r: 255, g: 0, b: 255, a: 0.5 }]
	])('parses %s', (input, expected) => {
		expect(parseColor(input)).toEqual({ ok: true, value: expected });
	});

	it.each([
		'',
		'#12',
		'#ggg',
		'rgb(1, 2)',
		'rgb(nope, 2, 3)',
		'rgb(256, 2, 3)',
		'rgba(1, 2, 3, 2)',
		'hsl(1, 2%)',
		'hsl(nope, 20%, 30%)',
		'hsl(1, 101%, 20%)',
		'hsla(1, 20%, 30%, -1)'
	])('rejects malformed or out-of-range input: %s', (input) => {
		expect(parseColor(input).ok).toBe(false);
	});

	it('formats alpha, hue sectors, and grayscale consistently', () => {
		expect(formatColorOutputs({ r: 255, g: 0, b: 0, a: 0.5 })).toMatchObject({
			hex: '#FF000080',
			hsl: 'hsl(0, 100%, 50%)',
			hsla: 'hsla(0, 100%, 50%, 0.5)'
		});
		expect(formatColorOutputs({ r: 0, g: 255, b: 0, a: 1 }).hsl).toBe('hsl(120, 100%, 50%)');
		expect(formatColorOutputs({ r: 0, g: 0, b: 255, a: 1 }).hsl).toBe('hsl(240, 100%, 50%)');
		expect(formatColorOutputs({ r: 128, g: 128, b: 128, a: 1 }).hsl).toBe('hsl(0, 0%, 50.2%)');
	});
});
