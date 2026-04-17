export type QueryEntry = {
	key: string;
	value: string;
};

export type QueryParseResult = { ok: true; entries: QueryEntry[] } | { ok: false; error: string };

function decodePart(value: string) {
	return decodeURIComponent(value.replace(/\+/g, ' '));
}

export function parseQueryString(input: string): QueryParseResult {
	const trimmed = input.trim().replace(/^\?/, '');
	if (!trimmed) {
		return { ok: true, entries: [] };
	}

	try {
		const entries = trimmed
			.split('&')
			.filter(Boolean)
			.map((segment) => {
				const separator = segment.indexOf('=');
				const rawKey = separator === -1 ? segment : segment.slice(0, separator);
				const rawValue = separator === -1 ? '' : segment.slice(separator + 1);

				return {
					key: decodePart(rawKey),
					value: decodePart(rawValue)
				};
			});

		return { ok: true, entries };
	} catch {
		return {
			ok: false,
			error: 'Could not parse this query string. Check for malformed percent-encoded values.'
		};
	}
}

export function buildQueryString(entries: QueryEntry[]) {
	const filtered = entries.filter((entry) => entry.key !== '' || entry.value !== '');
	if (!filtered.length) {
		return '';
	}

	return `?${filtered
		.map((entry) => `${encodeURIComponent(entry.key)}=${encodeURIComponent(entry.value)}`)
		.join('&')}`;
}
