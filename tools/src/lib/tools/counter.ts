export type TextCounts = {
	characters: number;
	charactersNoSpaces: number;
	words: number;
	lines: number;
	paragraphs: number;
	readingMinutes: number;
};

export function countText(input: string): TextCounts {
	const trimmed = input.trim();
	const words = trimmed ? (trimmed.match(/\S+/g)?.length ?? 0) : 0;

	return {
		characters: input.length,
		charactersNoSpaces: input.replace(/\s/g, '').length,
		words,
		lines: input ? input.split(/\r\n|\r|\n/).length : 0,
		paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0,
		readingMinutes: words === 0 ? 0 : Math.max(1, Math.ceil(words / 200))
	};
}
