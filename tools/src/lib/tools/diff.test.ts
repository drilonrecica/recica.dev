import { describe, expect, it } from 'vitest';
import { buildDiffModel } from '$lib/tools/diff';

describe('diff tools', () => {
	it('returns empty output when both sides are empty', () => {
		expect(buildDiffModel('', '')).toEqual([]);
	});

	it('detects changed and added lines', () => {
		const rows = buildDiffModel('alpha\nbeta\n', 'alpha\nbravo\ncharlie\n');
		expect(rows.some((row) => row.kind === 'changed')).toBe(true);
		expect(rows.some((row) => row.kind === 'added')).toBe(true);
	});
});
