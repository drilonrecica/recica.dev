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

	it('generates UPC-A check digits and accepts valid complete values', () => {
		const generated = generateBarcode('upca', '03600029145');
		expect(generated.ok).toBe(true);
		if (!generated.ok) return;
		expect(generated.text).toBe('036000291452');

		expect(generateBarcode('upca', generated.text).ok).toBe(true);
	});

	it('rejects incorrect check digits', () => {
		expect(generateBarcode('ean13', '5901234123450')).toEqual({
			ok: false,
			error: 'EAN-13 check digit is invalid.'
		});
		expect(generateBarcode('upca', '036000291453')).toEqual({
			ok: false,
			error: 'UPC-A check digit is invalid.'
		});
	});

	it('rejects empty and non-printable Code 128 input while escaping labels', () => {
		expect(generateBarcode('code128', '')).toEqual({
			ok: false,
			error: 'Enter text to generate a barcode.'
		});
		expect(generateBarcode('code128', 'line\nbreak')).toEqual({
			ok: false,
			error: 'Code 128 supports printable ASCII characters in this version.'
		});

		const escaped = generateBarcode('code128', '<&">');
		expect(escaped.ok).toBe(true);
		if (!escaped.ok) return;
		expect(escaped.svg).toContain('&lt;&amp;&quot;&gt;');
	});
});
