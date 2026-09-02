import { describe, expect, it } from 'vitest';
import { findJsonErrorPosition } from './json-position';

describe('findJsonErrorPosition', () => {
	it('returns null for valid documents', () => {
		for (const input of [
			'{}',
			'[]',
			'{"a":[1,2.5e3,true,null,"x\\n"]}',
			' "s" ',
			'-0',
			'[{"a":{}}]'
		]) {
			expect(findJsonErrorPosition(input)).toBeNull();
		}
	});

	it('points at the offending character', () => {
		expect(findJsonErrorPosition('{"lab":}')?.index).toBe(7);
		expect(findJsonErrorPosition('{"a":1,}')?.index).toBe(7);
		expect(findJsonErrorPosition('[1,2,]')?.index).toBe(5);
		expect(findJsonErrorPosition('{a:1}')?.index).toBe(1);
		expect(findJsonErrorPosition('{"a" 1}')?.index).toBe(5);
		expect(findJsonErrorPosition('{"a":1} x')?.index).toBe(8);
		expect(findJsonErrorPosition('"unterminated')?.index).toBe(12);
		expect(findJsonErrorPosition('[01]')?.index).toBe(2);
		expect(findJsonErrorPosition('{"a":tru}')?.index).toBe(5);
	});

	it('reports truncation at the end', () => {
		const result = findJsonErrorPosition('{"a":');
		expect(result?.message).toMatch(/end of JSON/i);
	});

	it('handles multi-line documents', () => {
		const input = '{\n  "a": 1,\n  "b": \n}';
		expect(findJsonErrorPosition(input)?.index).toBe(input.indexOf('}', 15));
	});
});
