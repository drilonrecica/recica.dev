export type Diagnostic = {
	line: number;
	column?: number;
	message: string;
	severity?: 'error' | 'warning';
};

export type TextPosition = { line: number; column: number };

/** 1-based line and column for a 0-based character index. */
export function positionFromIndex(text: string, index: number): TextPosition {
	const clamped = Math.max(0, Math.min(index, text.length));
	let line = 1;
	let lastBreak = -1;
	for (let i = 0; i < clamped; i += 1) {
		if (text.charCodeAt(i) === 10) {
			line += 1;
			lastBreak = i;
		}
	}
	return { line, column: clamped - lastBreak };
}

export function countLines(text: string): number {
	if (!text) return 1;
	let count = 1;
	for (let i = 0; i < text.length; i += 1) {
		if (text.charCodeAt(i) === 10) count += 1;
	}
	return count;
}

export function diagnosticFromParts(
	message: string,
	line?: number | null,
	column?: number | null,
	severity: Diagnostic['severity'] = 'error'
): Diagnostic | null {
	if (!line || line < 1) return null;
	const diagnostic: Diagnostic = { line, message, severity };
	if (column && column > 0) diagnostic.column = column;
	return diagnostic;
}

export function diagnosticsForLines(
	lines: readonly number[],
	message: (line: number) => string,
	severity: Diagnostic['severity'] = 'error'
): Diagnostic[] {
	return lines
		.filter((line) => line > 0)
		.map((line) => ({ line, message: message(line), severity }));
}
