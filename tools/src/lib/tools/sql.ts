const KEYWORDS = [
	'select',
	'from',
	'where',
	'group by',
	'order by',
	'having',
	'limit',
	'offset',
	'insert into',
	'values',
	'update',
	'set',
	'delete from',
	'inner join',
	'left join',
	'right join',
	'full join',
	'cross join',
	'join',
	'on',
	'and',
	'or',
	'union all',
	'union'
];

function protectStrings(input: string) {
	const strings: string[] = [];
	const protectedSql = input.replace(/'([^']|'')*'|"([^"]|"")*"/g, (match) => {
		strings.push(match);
		return `__SQL_STRING_${strings.length - 1}__`;
	});

	return { protectedSql, strings };
}

function restoreStrings(input: string, strings: string[]) {
	return input.replace(
		/__SQL_STRING_(\d+)__/g,
		(match, index: string) => strings[Number(index)] ?? match
	);
}

export function minifySql(input: string) {
	const { protectedSql, strings } = protectStrings(input);
	const minified = protectedSql
		.replace(/\s+/g, ' ')
		.replace(/\s*,\s*/g, ', ')
		.replace(/\(\s+/g, '(')
		.replace(/\s+\)/g, ')')
		.trim();

	return restoreStrings(minified, strings);
}

export function formatSql(input: string) {
	const { protectedSql, strings } = protectStrings(minifySql(input));
	let formatted = protectedSql;

	for (const keyword of KEYWORDS.sort((left, right) => right.length - left.length)) {
		const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
		formatted = formatted.replace(pattern, keyword.toUpperCase());
	}

	formatted = formatted
		.replace(
			/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM|UNION ALL|UNION)\b/g,
			'\n$1'
		)
		.replace(/\b(INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|JOIN|ON|AND|OR)\b/g, '\n  $1')
		.replace(/,\s*/g, ',\n  ')
		.replace(/\n{2,}/g, '\n')
		.trim();

	return restoreStrings(formatted, strings);
}
