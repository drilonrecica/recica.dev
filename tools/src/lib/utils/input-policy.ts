export type InputLimitResult =
	| {
			ok: true;
			actualBytes: number;
			maxBytes: number;
	  }
	| {
			ok: false;
			actualBytes: number;
			maxBytes: number;
			message: string;
	  };

const byteEncoder = new TextEncoder();

export function utf8ByteLength(value: string): number {
	return byteEncoder.encode(value).byteLength;
}

export function formatByteSize(bytes: number): string {
	if (bytes >= 1024 * 1024 && bytes % (1024 * 1024) === 0) {
		return `${bytes / (1024 * 1024)} MiB`;
	}

	if (bytes >= 1024 && bytes % 1024 === 0) {
		return `${bytes / 1024} KiB`;
	}

	return `${bytes} B`;
}

export function checkInputLimit(
	values: readonly string[],
	maxBytes: number,
	label: string
): InputLimitResult {
	const actualBytes = values.reduce((total, value) => total + utf8ByteLength(value), 0);

	if (actualBytes <= maxBytes) {
		return { ok: true, actualBytes, maxBytes };
	}

	return {
		ok: false,
		actualBytes,
		maxBytes,
		message: `${label} is ${formatByteSize(actualBytes)}; the local processing limit is ${formatByteSize(maxBytes)}. Reduce the input to keep this browser tab responsive. Nothing was uploaded or truncated.`
	};
}

export function checkToolInputLimit(toolId: string, values: readonly string[]): InputLimitResult {
	const tool = tools.find((candidate) => candidate.id === toolId);
	if (!tool?.inputPolicy.maxBytes) {
		throw new Error(`Tool does not define a byte input limit: ${toolId}`);
	}

	return checkInputLimit(values, tool.inputPolicy.maxBytes, `${tool.name} input`);
}
import { tools } from '$lib/constants/tools';
