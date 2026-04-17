export type Base64Action = 'encode' | 'decode';

export type Base64TransformResult = { ok: true; output: string } | { ok: false; error: string };

const ASCII_WHITESPACE = /[\t\n\f\r ]+/g;
const DATA_URL_PREFIX = /^data:.*;base64,/i;
const STANDARD_BASE64_CHARACTERS = /^[A-Za-z0-9+/=]+$/;

function bytesToBinary(bytes: Uint8Array): string {
	let binary = '';
	const chunkSize = 0x8000;

	for (let index = 0; index < bytes.length; index += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
	}

	return binary;
}

function binaryToBytes(binary: string): Uint8Array {
	const bytes = new Uint8Array(binary.length);

	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}

	return bytes;
}

function normalizeBase64Input(input: string): Base64TransformResult {
	const trimmed = input.trim();

	if (DATA_URL_PREFIX.test(trimmed)) {
		return {
			ok: false,
			error: 'Data URLs are not supported. Paste raw Base64 text only.'
		};
	}

	const compact = input.replace(ASCII_WHITESPACE, '');
	if (!compact) {
		return {
			ok: false,
			error: 'Enter Base64 text to decode.'
		};
	}

	if (/[-_]/.test(compact) || !STANDARD_BASE64_CHARACTERS.test(compact)) {
		return {
			ok: false,
			error: 'Could not decode this value. Use standard Base64 text only.'
		};
	}

	if (/=[A-Za-z0-9+/]/.test(compact)) {
		return {
			ok: false,
			error: 'Could not decode this value. Use standard Base64 text only.'
		};
	}

	const unpadded = compact.replace(/=+$/, '');
	const paddingLength = compact.length - unpadded.length;
	if (paddingLength > 2) {
		return {
			ok: false,
			error: 'Could not decode this value. Use standard Base64 text only.'
		};
	}

	const remainder = unpadded.length % 4;
	if (remainder === 1) {
		return {
			ok: false,
			error: 'Could not decode this value. The Base64 length is invalid.'
		};
	}

	const requiredPadding = remainder === 0 ? 0 : 4 - remainder;
	if (paddingLength !== 0 && paddingLength !== requiredPadding) {
		return {
			ok: false,
			error: 'Could not decode this value. Use standard Base64 text only.'
		};
	}

	return {
		ok: true,
		output: `${unpadded}${'='.repeat(requiredPadding)}`
	};
}

export function encodeBase64(input: string): Base64TransformResult {
	const encoded = btoa(bytesToBinary(new TextEncoder().encode(input)));
	return { ok: true, output: encoded };
}

export function decodeBase64(input: string): Base64TransformResult {
	const normalized = normalizeBase64Input(input);
	if (!normalized.ok) {
		return normalized;
	}

	try {
		const decodedBinary = atob(normalized.output);
		const decoded = new TextDecoder('utf-8', { fatal: true }).decode(binaryToBytes(decodedBinary));
		return { ok: true, output: decoded };
	} catch (error) {
		if (error instanceof TypeError) {
			return {
				ok: false,
				error: 'Decoded bytes are not valid UTF-8 text.'
			};
		}

		return {
			ok: false,
			error: 'Could not decode this value. Use standard Base64 text only.'
		};
	}
}
