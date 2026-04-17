import { describe, expect, it } from 'vitest';
import { generatePassword, validatePasswordOptions } from '$lib/tools/password';

describe('password tools', () => {
	it('rejects empty character-set selection', () => {
		expect(
			validatePasswordOptions({
				length: 20,
				uppercase: false,
				lowercase: false,
				numbers: false,
				symbols: false
			})
		).toBeTruthy();
	});

	it('generates a password with one character from each enabled set', () => {
		const password = generatePassword({
			length: 20,
			uppercase: true,
			lowercase: true,
			numbers: true,
			symbols: true
		});

		expect(password).toHaveLength(20);
		expect(/[A-Z]/.test(password)).toBe(true);
		expect(/[a-z]/.test(password)).toBe(true);
		expect(/[0-9]/.test(password)).toBe(true);
		expect(/[^A-Za-z0-9]/.test(password)).toBe(true);
	});
});
