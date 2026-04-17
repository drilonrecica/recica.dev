export type EnvRow =
	| {
			line: number;
			kind: 'comment';
			value: string;
	  }
	| {
			line: number;
			kind: 'entry';
			key: string;
			value: string;
			quoted: boolean;
			duplicate: boolean;
	  }
	| {
			line: number;
			kind: 'error';
			value: string;
			message: string;
	  };

export type EnvParseResult = {
	rows: EnvRow[];
	entryCount: number;
	duplicateCount: number;
	errorCount: number;
};

function unescapeDoubleQuoted(value: string) {
	return value
		.replace(/\\n/g, '\n')
		.replace(/\\r/g, '\r')
		.replace(/\\t/g, '\t')
		.replace(/\\"/g, '"')
		.replace(/\\\\/g, '\\');
}

export function parseDotenv(input: string): EnvParseResult {
	const rows: EnvRow[] = [];
	const seen = new Set<string>();
	let entryCount = 0;
	let duplicateCount = 0;
	let errorCount = 0;

	for (const [index, originalLine] of input.split(/\r\n|\r|\n/).entries()) {
		const lineNumber = index + 1;
		const trimmed = originalLine.trim();

		if (!trimmed) {
			continue;
		}

		if (trimmed.startsWith('#')) {
			rows.push({ line: lineNumber, kind: 'comment', value: trimmed });
			continue;
		}

		const content = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
		const separator = content.indexOf('=');

		if (separator === -1) {
			errorCount += 1;
			rows.push({
				line: lineNumber,
				kind: 'error',
				value: originalLine,
				message: 'Missing "=" separator.'
			});
			continue;
		}

		const key = content.slice(0, separator).trim();
		let rawValue = content.slice(separator + 1).trim();

		if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
			errorCount += 1;
			rows.push({
				line: lineNumber,
				kind: 'error',
				value: originalLine,
				message: 'Invalid environment variable name.'
			});
			continue;
		}

		let quoted = false;
		let value: string;

		if (rawValue.startsWith('"')) {
			if (rawValue.length < 2 || !rawValue.endsWith('"')) {
				errorCount += 1;
				rows.push({
					line: lineNumber,
					kind: 'error',
					value: originalLine,
					message: 'Unterminated double-quoted value.'
				});
				continue;
			}

			value = unescapeDoubleQuoted(rawValue.slice(1, -1));
			quoted = true;
		} else if (rawValue.startsWith("'")) {
			if (rawValue.length < 2 || !rawValue.endsWith("'")) {
				errorCount += 1;
				rows.push({
					line: lineNumber,
					kind: 'error',
					value: originalLine,
					message: 'Unterminated single-quoted value.'
				});
				continue;
			}

			value = rawValue.slice(1, -1);
			quoted = true;
		} else {
			const inlineComment = rawValue.search(/\s+#/);
			if (inlineComment !== -1) {
				rawValue = rawValue.slice(0, inlineComment).trimEnd();
			}
			value = rawValue;
		}

		const duplicate = seen.has(key);
		seen.add(key);
		entryCount += 1;
		if (duplicate) {
			duplicateCount += 1;
		}

		rows.push({
			line: lineNumber,
			kind: 'entry',
			key,
			value,
			quoted,
			duplicate
		});
	}

	return {
		rows,
		entryCount,
		duplicateCount,
		errorCount
	};
}
