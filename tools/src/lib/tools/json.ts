export type JsonErrorDetails = {
	message: string;
	line?: number;
	column?: number;
};

function toLineAndColumn(input: string, position: number) {
	const lines = input.slice(0, position).split('\n');
	return {
		line: lines.length,
		column: lines.at(-1)?.length ? lines.at(-1)!.length + 1 : 1
	};
}

export function extractJsonError(input: string, error: unknown): JsonErrorDetails {
	const message =
		error instanceof Error
			? error.message
			: 'Invalid JSON input. Please check the syntax and try again.';
	const match = message.match(/position\s+(\d+)/i);

	if (!match) {
		return { message };
	}

	const position = Number(match[1]);

	if (!Number.isFinite(position)) {
		return { message };
	}

	return {
		message,
		...toLineAndColumn(input, position)
	};
}

export function validateJson(input: string) {
	try {
		JSON.parse(input);
		return { ok: true as const };
	} catch (error) {
		return { ok: false as const, error: extractJsonError(input, error) };
	}
}

export function formatJson(input: string) {
	const parsed = JSON.parse(input);
	return JSON.stringify(parsed, null, 2);
}

export function minifyJson(input: string) {
	const parsed = JSON.parse(input);
	return JSON.stringify(parsed);
}
