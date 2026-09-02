import { describe, expect, it, vi } from 'vitest';
import { createDebounced, formatDuration, timed } from './live';

describe('live helpers', () => {
	it('debounces and can flush or cancel', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = createDebounced(fn, 100);
		debounced.call();
		debounced.call();
		expect(fn).not.toHaveBeenCalled();
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
		debounced.call();
		debounced.flush();
		expect(fn).toHaveBeenCalledTimes(2);
		debounced.call();
		debounced.cancel();
		vi.advanceTimersByTime(200);
		expect(fn).toHaveBeenCalledTimes(2);
		vi.useRealTimers();
	});

	it('times a synchronous function and formats durations', () => {
		const { result, durationMs } = timed(() => 21 * 2);
		expect(result).toBe(42);
		expect(durationMs).toBeGreaterThanOrEqual(0);
		expect(formatDuration(null)).toBe('');
		expect(formatDuration(0.4)).toBe('<1 ms');
		expect(formatDuration(12.6)).toBe('13 ms');
		expect(formatDuration(1500)).toBe('1.50 s');
	});
});
