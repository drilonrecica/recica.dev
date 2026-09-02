/** Small helpers for live, debounced tool execution with timing. */

export type Debounced = {
	call: () => void;
	flush: () => void;
	cancel: () => void;
};

export function createDebounced(fn: () => void, delay = 150): Debounced {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return {
		call() {
			clearTimeout(timer);
			timer = setTimeout(() => {
				timer = undefined;
				fn();
			}, delay);
		},
		flush() {
			if (timer === undefined) return;
			clearTimeout(timer);
			timer = undefined;
			fn();
		},
		cancel() {
			clearTimeout(timer);
			timer = undefined;
		}
	};
}

export function timed<T>(fn: () => T): { result: T; durationMs: number } {
	const now = () =>
		typeof performance !== 'undefined' && typeof performance.now === 'function'
			? performance.now()
			: Date.now();
	const start = now();
	const result = fn();
	return { result, durationMs: now() - start };
}

export function formatDuration(durationMs: number | null | undefined): string {
	if (durationMs === null || durationMs === undefined) return '';
	if (durationMs < 1) return '<1 ms';
	if (durationMs < 1000) return `${Math.round(durationMs)} ms`;
	return `${(durationMs / 1000).toFixed(2)} s`;
}
