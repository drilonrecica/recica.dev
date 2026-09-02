/**
 * Locates the first syntax error in a JSON document.
 *
 * JSON.parse error messages differ between engines and often omit the
 * position, so the gutter marker uses this small recursive-descent scanner
 * instead. It follows RFC 8259 strictly and returns the 0-based index of the
 * offending character, or null when the input parses.
 */
export type JsonErrorPosition = { index: number; message: string };

const WHITESPACE = new Set([' ', '\t', '\n', '\r']);

export function findJsonErrorPosition(input: string): JsonErrorPosition | null {
	let i = 0;
	const length = input.length;

	const fail = (message: string, index = i): JsonErrorPosition => ({
		index: Math.min(index, Math.max(length - 1, 0)),
		message
	});

	function skipWhitespace() {
		while (i < length && WHITESPACE.has(input[i] ?? '')) i += 1;
	}

	function parseValue(): JsonErrorPosition | null {
		skipWhitespace();
		if (i >= length) return fail('Unexpected end of JSON input');
		const char = input[i];
		if (char === '{') return parseObject();
		if (char === '[') return parseArray();
		if (char === '"') return parseString();
		if (char === '-' || (char !== undefined && char >= '0' && char <= '9')) return parseNumber();
		if (input.startsWith('true', i)) {
			i += 4;
			return null;
		}
		if (input.startsWith('false', i)) {
			i += 5;
			return null;
		}
		if (input.startsWith('null', i)) {
			i += 4;
			return null;
		}
		return fail(`Unexpected token '${char}'`);
	}

	function parseObject(): JsonErrorPosition | null {
		i += 1;
		skipWhitespace();
		if (input[i] === '}') {
			i += 1;
			return null;
		}
		for (;;) {
			skipWhitespace();
			if (input[i] !== '"') {
				return i >= length
					? fail('Unexpected end of JSON input')
					: fail('Expected a double-quoted property name');
			}
			const keyError = parseString();
			if (keyError) return keyError;
			skipWhitespace();
			if (input[i] !== ':') {
				return i >= length
					? fail('Unexpected end of JSON input')
					: fail("Expected ':' after property name");
			}
			i += 1;
			const valueError = parseValue();
			if (valueError) return valueError;
			skipWhitespace();
			if (input[i] === ',') {
				i += 1;
				continue;
			}
			if (input[i] === '}') {
				i += 1;
				return null;
			}
			return i >= length
				? fail('Unexpected end of JSON input')
				: fail("Expected ',' or '}' after property value");
		}
	}

	function parseArray(): JsonErrorPosition | null {
		i += 1;
		skipWhitespace();
		if (input[i] === ']') {
			i += 1;
			return null;
		}
		for (;;) {
			const valueError = parseValue();
			if (valueError) return valueError;
			skipWhitespace();
			if (input[i] === ',') {
				i += 1;
				continue;
			}
			if (input[i] === ']') {
				i += 1;
				return null;
			}
			return i >= length
				? fail('Unexpected end of JSON input')
				: fail("Expected ',' or ']' after array element");
		}
	}

	function parseString(): JsonErrorPosition | null {
		i += 1;
		while (i < length) {
			const char = input[i];
			if (char === '"') {
				i += 1;
				return null;
			}
			if (char === '\\') {
				const next = input[i + 1];
				if (next === undefined) return fail('Unterminated string', i);
				if ('"\\/bfnrt'.includes(next)) {
					i += 2;
					continue;
				}
				if (next === 'u') {
					const hex = input.slice(i + 2, i + 6);
					if (!/^[0-9a-fA-F]{4}$/.test(hex)) return fail('Bad Unicode escape', i);
					i += 6;
					continue;
				}
				return fail('Bad escaped character', i + 1);
			}
			if ((char?.charCodeAt(0) ?? 0) < 0x20)
				return fail('Bad control character in string literal', i);
			i += 1;
		}
		return fail('Unterminated string', length);
	}

	function parseNumber(): JsonErrorPosition | null {
		const start = i;
		if (input[i] === '-') i += 1;
		if (input[i] === '0') {
			i += 1;
		} else if (input[i] !== undefined && input[i]! >= '1' && input[i]! <= '9') {
			while (input[i] !== undefined && input[i]! >= '0' && input[i]! <= '9') i += 1;
		} else {
			return fail('No number after minus sign', i);
		}
		if (input[i] === '.') {
			i += 1;
			if (!(input[i] !== undefined && input[i]! >= '0' && input[i]! <= '9'))
				return fail('Unterminated fractional number', i);
			while (input[i] !== undefined && input[i]! >= '0' && input[i]! <= '9') i += 1;
		}
		if (input[i] === 'e' || input[i] === 'E') {
			i += 1;
			if (input[i] === '+' || input[i] === '-') i += 1;
			if (!(input[i] !== undefined && input[i]! >= '0' && input[i]! <= '9'))
				return fail('Exponent part is missing a number', i);
			while (input[i] !== undefined && input[i]! >= '0' && input[i]! <= '9') i += 1;
		}
		void start;
		return null;
	}

	const error = parseValue();
	if (error) return error;
	skipWhitespace();
	if (i < length) return fail('Unexpected non-whitespace character after JSON');
	return null;
}
