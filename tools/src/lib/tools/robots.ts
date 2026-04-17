export type RobotsRow =
	| { line: number; kind: 'comment'; value: string }
	| { line: number; kind: 'directive'; directive: string; value: string }
	| { line: number; kind: 'error'; value: string; message: string };

export type RobotsParseResult = {
	rows: RobotsRow[];
	directiveCount: number;
	errorCount: number;
};

const VALID_DIRECTIVES = new Set([
	'user-agent',
	'allow',
	'disallow',
	'sitemap',
	'host',
	'crawl-delay',
	'clean-param'
]);

export function parseRobotsTxt(input: string): RobotsParseResult {
	const rows: RobotsRow[] = [];
	let directiveCount = 0;
	let errorCount = 0;

	for (const [index, originalLine] of input.split(/\r\n|\r|\n/).entries()) {
		const line = originalLine.trim();
		if (!line) continue;

		const lineNumber = index + 1;
		if (line.startsWith('#')) {
			rows.push({ line: lineNumber, kind: 'comment', value: line });
			continue;
		}

		const separator = line.indexOf(':');
		if (separator === -1) {
			errorCount += 1;
			rows.push({
				line: lineNumber,
				kind: 'error',
				value: originalLine,
				message: 'Missing ":" separator.'
			});
			continue;
		}

		const directive = line.slice(0, separator).trim().toLowerCase();
		const value = line.slice(separator + 1).trim();

		if (!VALID_DIRECTIVES.has(directive)) {
			errorCount += 1;
			rows.push({
				line: lineNumber,
				kind: 'error',
				value: originalLine,
				message: 'Unknown robots.txt directive.'
			});
			continue;
		}

		directiveCount += 1;
		rows.push({ line: lineNumber, kind: 'directive', directive, value });
	}

	return { rows, directiveCount, errorCount };
}
