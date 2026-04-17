import { diffLines, diffWords } from 'diff';

export type DiffToken = {
	value: string;
	type: 'context' | 'added' | 'removed';
};

export type DiffLine = {
	kind: 'context' | 'added' | 'removed' | 'changed';
	left: string;
	right: string;
	leftTokens: DiffToken[];
	rightTokens: DiffToken[];
};

function splitLines(value: string) {
	const normalized = value.replace(/\r/g, '');
	const lines = normalized.split('\n');

	if (lines.at(-1) === '') {
		lines.pop();
	}

	return lines;
}

function buildWordTokens(left: string, right: string) {
	const changes = diffWords(left, right);
	const leftTokens: DiffToken[] = [];
	const rightTokens: DiffToken[] = [];

	for (const change of changes) {
		if (change.added) {
			rightTokens.push({ value: change.value, type: 'added' });
			continue;
		}

		if (change.removed) {
			leftTokens.push({ value: change.value, type: 'removed' });
			continue;
		}

		leftTokens.push({ value: change.value, type: 'context' });
		rightTokens.push({ value: change.value, type: 'context' });
	}

	return { leftTokens, rightTokens };
}

function buildLine(kind: DiffLine['kind'], left: string, right: string): DiffLine {
	if (kind === 'changed') {
		const { leftTokens, rightTokens } = buildWordTokens(left, right);
		return { kind, left, right, leftTokens, rightTokens };
	}

	return {
		kind,
		left,
		right,
		leftTokens: left ? [{ value: left, type: kind === 'removed' ? 'removed' : 'context' }] : [],
		rightTokens: right ? [{ value: right, type: kind === 'added' ? 'added' : 'context' }] : []
	};
}

export function buildDiffModel(left: string, right: string) {
	if (!left && !right) {
		return [];
	}

	const parts = diffLines(left, right);
	const rows: DiffLine[] = [];

	for (let index = 0; index < parts.length; index += 1) {
		const part = parts[index];
		if (!part) continue;
		const nextPart = parts[index + 1];

		if (part.removed && nextPart?.added) {
			const removedLines = splitLines(part.value);
			const addedLines = splitLines(nextPart.value);
			const lineCount = Math.max(removedLines.length, addedLines.length);

			for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
				const removedLine = removedLines[lineIndex] ?? '';
				const addedLine = addedLines[lineIndex] ?? '';

				if (removedLine && addedLine) {
					rows.push(buildLine('changed', removedLine, addedLine));
				} else if (removedLine) {
					rows.push(buildLine('removed', removedLine, ''));
				} else if (addedLine) {
					rows.push(buildLine('added', '', addedLine));
				}
			}

			index += 1;
			continue;
		}

		const partLines = splitLines(part.value);

		for (const line of partLines) {
			if (part.added) {
				rows.push(buildLine('added', '', line));
			} else if (part.removed) {
				rows.push(buildLine('removed', line, ''));
			} else {
				rows.push(buildLine('context', line, line));
			}
		}
	}

	return rows;
}
