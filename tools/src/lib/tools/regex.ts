export type RegexMatch = {
	index: number;
	end: number;
	text: string;
	groups: string[];
	namedGroups: Record<string, string>;
};

export type RegexResult =
	| { ok: true; matches: RegexMatch[]; replaced: string }
	| { ok: false; error: string };

function toRegexMatch(match: RegExpExecArray): RegexMatch {
	return {
		index: match.index,
		end: match.index + match[0].length,
		text: match[0],
		groups: match.slice(1).map((group) => group ?? ''),
		namedGroups: Object.fromEntries(
			Object.entries(match.groups ?? {}).map(([key, value]) => [key, value ?? ''])
		)
	};
}

export function evaluateRegex(
	pattern: string,
	flags: string,
	source: string,
	replacement: string
): RegexResult {
	try {
		const regex = new RegExp(pattern, flags);
		const matches: RegexMatch[] = [];

		if (flags.includes('g')) {
			const globalRegex = new RegExp(pattern, flags);
			let match = globalRegex.exec(source);

			while (match) {
				matches.push(toRegexMatch(match));
				if (match[0] === '') {
					globalRegex.lastIndex += 1;
				}
				match = globalRegex.exec(source);
			}
		} else {
			const match = regex.exec(source);
			if (match) {
				matches.push(toRegexMatch(match));
			}
		}

		return {
			ok: true,
			matches,
			replaced: source.replace(regex, replacement)
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : 'Invalid regular expression.'
		};
	}
}
