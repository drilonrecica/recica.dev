import { describe, expect, it } from 'vitest';
import {
	detectTimestampUnit,
	parseDateTimeInput,
	parseTimestampInput,
	toDateTimeInputValue
} from '$lib/tools/timestamp';

describe('timestamp tools', () => {
	it('detects seconds vs milliseconds', () => {
		expect(detectTimestampUnit(1_715_342_400)).toBe('seconds');
		expect(detectTimestampUnit(1_715_342_400_000)).toBe('milliseconds');
	});

	it('parses timestamp input', () => {
		const result = parseTimestampInput('1715342400', 'seconds');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.value.milliseconds).toBe(1715342400000);
		expect(result.value.utcIso).toBe('2024-05-10T12:00:00.000Z');
	});

	it('parses utc datetime-local input', () => {
		const result = parseDateTimeInput('2024-05-10T12:00', 'utc');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.value.seconds).toBe(1715342400);
	});

	it('formats datetime-local strings for utc', () => {
		expect(toDateTimeInputValue(new Date('2024-05-10T12:00:00.000Z'), 'utc')).toBe(
			'2024-05-10T12:00'
		);
	});
});
