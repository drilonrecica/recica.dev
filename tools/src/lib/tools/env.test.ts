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
});
