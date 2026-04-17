export type TimestampUnit = 'auto' | 'seconds' | 'milliseconds';
export type TimezoneMode = 'local' | 'utc';

export type ParsedTimeResult = {
	date: Date;
	milliseconds: number;
	seconds: number;
	unit: 'seconds' | 'milliseconds';
	utcIso: string;
};

function toParts(date: Date, timezone: TimezoneMode) {
	return timezone === 'utc'
		? {
				year: date.getUTCFullYear(),
				month: date.getUTCMonth() + 1,
				day: date.getUTCDate(),
				hours: date.getUTCHours(),
				minutes: date.getUTCMinutes(),
				seconds: date.getUTCSeconds()
			}
		: {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
				hours: date.getHours(),
				minutes: date.getMinutes(),
				seconds: date.getSeconds()
			};
}

function pad(value: number) {
	return String(value).padStart(2, '0');
}

export function detectTimestampUnit(value: number) {
	return Math.abs(value) >= 1_000_000_000_000 ? 'milliseconds' : 'seconds';
}

export function parseTimestampInput(input: string, unit: TimestampUnit = 'auto') {
	const raw = input.trim();

	if (!/^-?\d+$/.test(raw)) {
		return {
			ok: false as const,
			error: 'Enter a whole Unix timestamp in seconds or milliseconds.'
		};
	}

	const numericValue = Number(raw);

	if (!Number.isSafeInteger(numericValue)) {
		return { ok: false as const, error: 'Timestamp is outside the supported safe integer range.' };
	}

	const resolvedUnit = unit === 'auto' ? detectTimestampUnit(numericValue) : unit;
	const milliseconds = resolvedUnit === 'seconds' ? numericValue * 1000 : numericValue;
	const date = new Date(milliseconds);

	if (Number.isNaN(date.getTime())) {
		return { ok: false as const, error: 'Timestamp could not be converted into a valid date.' };
	}

	return {
		ok: true as const,
		value: {
			date,
			milliseconds,
			seconds: Math.trunc(milliseconds / 1000),
			unit: resolvedUnit,
			utcIso: date.toISOString()
		} satisfies ParsedTimeResult
	};
}

export function parseDateTimeInput(input: string, timezone: TimezoneMode) {
	const match = input.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);

	if (!match) {
		return { ok: false as const, error: 'Pick a valid date and time before converting.' };
	}

	const [, year, month, day, hour, minute, second = '0'] = match;
	const numericYear = Number(year);
	const numericMonth = Number(month);
	const numericDay = Number(day);
	const numericHour = Number(hour);
	const numericMinute = Number(minute);
	const numericSecond = Number(second);

	const milliseconds =
		timezone === 'utc'
			? Date.UTC(
					numericYear,
					numericMonth - 1,
					numericDay,
					numericHour,
					numericMinute,
					numericSecond
				)
			: new Date(
					numericYear,
					numericMonth - 1,
					numericDay,
					numericHour,
					numericMinute,
					numericSecond
				).getTime();

	const date = new Date(milliseconds);

	if (Number.isNaN(date.getTime())) {
		return { ok: false as const, error: 'Date value could not be converted.' };
	}

	return {
		ok: true as const,
		value: {
			date,
			milliseconds,
			seconds: Math.trunc(milliseconds / 1000),
			unit: 'milliseconds',
			utcIso: date.toISOString()
		} satisfies ParsedTimeResult
	};
}

export function toDateTimeInputValue(date: Date, timezone: TimezoneMode) {
	const parts = toParts(date, timezone);
	return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hours)}:${pad(parts.minutes)}`;
}

export function formatLocalDisplay(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: 'full',
		timeStyle: 'medium'
	}).format(date);
}
