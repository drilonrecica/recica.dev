import { describe, expect, it } from 'vitest';
import { generateBarcode } from '$lib/tools/barcode';

describe('barcode tools', () => {
	it('generates code128 svg', () => {
		const result = generateBarcode('code128', 'Recica');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.svg).toContain('<svg');
	});

	it('computes ean13 check digits for 12-digit input', () => {
		const result = generateBarcode('ean13', '590123412345');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.text).toBe('5901234123457');
	});

	it('rejects invalid upca input', () => {
		expect(generateBarcode('upca', '123')).toEqual({
			ok: false,
			error: 'UPC-A accepts 11 digits plus an optional check digit.'
		});
	});
});
