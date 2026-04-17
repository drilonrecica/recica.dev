import { describe, expect, it } from 'vitest';
import { decodeBase64, encodeBase64 } from '$lib/tools/base64';

describe('base64 tools', () => {
	it('encodes utf-8 text', () => {
		expect(encodeBase64('Recica Tools')).toEqual({
			ok: true,
			output: 'UmVjaWNhIFRvb2xz'
		});
	});

	it('decodes utf-8 text', () => {
		expect(decodeBase64('UmVjaWNhIFRvb2xz')).toEqual({
			ok: true,
			output: 'Recica Tools'
		});
	});

	it('round-trips unicode correctly', () => {
		const encoded = encodeBase64('Zażółć gęślą jaźń');
		expect(encoded.ok).toBe(true);
		if (!encoded.ok) return;

		expect(decodeBase64(encoded.output)).toEqual({
			ok: true,
			output: 'Zażółć gęślą jaźń'
		});
	});

	it('accepts wrapped input and restores missing padding', () => {
		expect(decodeBase64('U3BsaXQgbGluZQ\n')).toEqual({
			ok: true,
			output: 'Split line'
		});
	});

	it('fails on invalid characters and url-safe input', () => {
		expect(decodeBase64('abc_def')).toEqual({
			ok: false,
			error: 'Could not decode this value. Use standard Base64 text only.'
		});
		expect(decodeBase64('abc-def')).toEqual({
			ok: false,
			error: 'Could not decode this value. Use standard Base64 text only.'
		});
	});

	it('fails when padding cannot be repaired', () => {
		expect(decodeBase64('abcde')).toEqual({
			ok: false,
			error: 'Could not decode this value. The Base64 length is invalid.'
		});
	});

	it('fails on decoded bytes that are not valid utf-8', () => {
		expect(decodeBase64('//8=')).toEqual({
			ok: false,
			error: 'Decoded bytes are not valid UTF-8 text.'
		});
	});

	it('rejects prefixed data urls', () => {
		expect(decodeBase64('data:text/plain;base64,SGVsbG8=')).toEqual({
			ok: false,
			error: 'Data URLs are not supported. Paste raw Base64 text only.'
		});
	});
});
