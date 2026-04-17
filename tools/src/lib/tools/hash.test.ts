import { describe, expect, it } from 'vitest';
import { hashText } from '$lib/tools/hash';

describe('hash tools', () => {
	it('hashes text with sha-256', async () => {
		await expect(hashText('abc', 'SHA-256')).resolves.toBe(
			'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
		);
	});

	it('hashes empty text with sha-512', async () => {
		await expect(hashText('', 'SHA-512')).resolves.toBe(
			'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
		);
	});
});
