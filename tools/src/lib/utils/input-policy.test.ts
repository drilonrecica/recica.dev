import { describe, expect, it } from 'vitest';
import {
	checkInputLimit,
	checkToolInputLimit,
	formatByteSize,
	utf8ByteLength
} from '$lib/utils/input-policy';

describe('input policy helpers', () => {
	it('measures UTF-8 bytes rather than JavaScript string length', () => {
		expect(utf8ByteLength('abc')).toBe(3);
		expect(utf8ByteLength('Reçica')).toBe(7);
		expect(utf8ByteLength('🧰')).toBe(4);
	});

	it('accepts input at the exact limit', () => {
		expect(checkInputLimit(['éé'], 4, 'JSON input')).toEqual({
			ok: true,
			actualBytes: 4,
			maxBytes: 4
		});
	});

	it('adds multiple inputs before checking a combined limit', () => {
		expect(checkInputLimit(['left', 'right'], 8, 'Diff input')).toMatchObject({
			ok: false,
			actualBytes: 9,
			maxBytes: 8
		});
	});

	it('reports actual and maximum sizes without truncating the source', () => {
		const source = 'abcdef';
		const result = checkInputLimit([source], 5, 'JSON input');

		expect(result).toEqual({
			ok: false,
			actualBytes: 6,
			maxBytes: 5,
			message:
				'JSON input is 6 B; the local processing limit is 5 B. Reduce the input to keep this browser tab responsive. Nothing was uploaded or truncated.'
		});
		expect(source).toBe('abcdef');
	});

	it('formats binary byte sizes for visible limits', () => {
		expect(formatByteSize(512)).toBe('512 B');
		expect(formatByteSize(512 * 1024)).toBe('512 KiB');
		expect(formatByteSize(3 * 1024 * 1024)).toBe('3 MiB');
	});

	it('resolves byte limits from the tool registry', () => {
		expect(checkToolInputLimit('json', ['x'.repeat(3 * 1024 * 1024)])).toMatchObject({
			ok: true,
			maxBytes: 3 * 1024 * 1024
		});
		expect(() => checkToolInputLimit('device', ['anything'])).toThrow('byte input limit');
	});
});
