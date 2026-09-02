import { describe, expect, it } from 'vitest';
import {
	countLines,
	diagnosticFromParts,
	diagnosticsForLines,
	positionFromIndex
} from './diagnostics';

describe('diagnostics', () => {
	it('maps character indexes to 1-based line and column', () => {
		expect(positionFromIndex('abc', 0)).toEqual({ line: 1, column: 1 });
		expect(positionFromIndex('ab\ncd', 3)).toEqual({ line: 2, column: 1 });
		expect(positionFromIndex('ab\ncd', 4)).toEqual({ line: 2, column: 2 });
		expect(positionFromIndex('ab', 99)).toEqual({ line: 1, column: 3 });
	});

	it('counts lines including the last unterminated one', () => {
		expect(countLines('')).toBe(1);
		expect(countLines('a')).toBe(1);
		expect(countLines('a\nb\n')).toBe(3);
	});

	it('builds diagnostics only with a valid line', () => {
		expect(diagnosticFromParts('x', 0)).toBeNull();
		expect(diagnosticFromParts('x', 2, 5)).toEqual({
			line: 2,
			column: 5,
			message: 'x',
			severity: 'error'
		});
		expect(diagnosticFromParts('x', 2, 0)).toEqual({ line: 2, message: 'x', severity: 'error' });
		expect(diagnosticsForLines([1, 0, 3], (line) => `bad ${line}`, 'warning')).toEqual([
			{ line: 1, message: 'bad 1', severity: 'warning' },
			{ line: 3, message: 'bad 3', severity: 'warning' }
		]);
	});
});
