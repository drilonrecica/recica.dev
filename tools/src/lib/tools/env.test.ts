import { describe, expect, it } from 'vitest';
import { parseDotenv } from '$lib/tools/env';

describe('env tools', () => {
	it('parses entries, comments, and duplicates', () => {
		const result = parseDotenv('# note\nFOO=bar\nFOO="baz"\nexport NAME=Recica');
		expect(result.entryCount).toBe(3);
		expect(result.duplicateCount).toBe(1);
		expect(result.errorCount).toBe(0);
	});

	it('flags malformed rows', () => {
		const result = parseDotenv('BAD LINE');
		expect(result.errorCount).toBe(1);
		expect(result.rows[0]).toMatchObject({ kind: 'error' });
	});

	it('handles quoted escapes, literal quotes, inline comments, and blank lines', () => {
		const result = parseDotenv(
			[
				'',
				'DOUBLE="line\\nnext\\t\\"quoted\\"\\\\tail"',
				"SINGLE='literal value'",
				'PLAIN=value # explanation',
				'EMPTY=',
				''
			].join('\r\n')
		);

		expect(result.errorCount).toBe(0);
		expect(result.rows).toEqual([
			expect.objectContaining({
				kind: 'entry',
				key: 'DOUBLE',
				value: 'line\nnext\t"quoted"\\tail',
				quoted: true
			}),
			expect.objectContaining({
				kind: 'entry',
				key: 'SINGLE',
				value: 'literal value',
				quoted: true
			}),
			expect.objectContaining({ kind: 'entry', key: 'PLAIN', value: 'value', quoted: false }),
			expect.objectContaining({ kind: 'entry', key: 'EMPTY', value: '', quoted: false })
		]);
	});

	it.each([
		['1INVALID=value', 'Invalid environment variable name.'],
		['DOUBLE="unterminated', 'Unterminated double-quoted value.'],
		["SINGLE='unterminated", 'Unterminated single-quoted value.']
	])('reports %s', (input, message) => {
		const result = parseDotenv(input);
		expect(result.rows[0]).toMatchObject({ kind: 'error', message });
		expect(result.errorCount).toBe(1);
	});
});
