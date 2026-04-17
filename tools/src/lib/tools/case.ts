export type CaseOutput = {
	camel: string;
	pascal: string;
	snake: string;
	kebab: string;
	title: string;
	upper: string;
	lower: string;
};

function splitWords(input: string) {
	return input
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word.toLowerCase());
}

function capitalize(word: string) {
	const [firstCharacter = ''] = word;
	return word ? `${firstCharacter.toUpperCase()}${word.slice(1)}` : '';
}

export function convertCase(input: string): CaseOutput {
	const words = splitWords(input);
	const joined = words.join(' ');

	return {
		camel: words.length ? `${words[0]}${words.slice(1).map(capitalize).join('')}` : '',
		pascal: words.map(capitalize).join(''),
		snake: words.join('_'),
		kebab: words.join('-'),
		title: words.map(capitalize).join(' '),
		upper: joined.toUpperCase(),
		lower: joined.toLowerCase()
	};
}
