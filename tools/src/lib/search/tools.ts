import { tools } from '$lib/constants/tools';
import type { ToolDefinition } from '$lib/types/tool';

function normalize(value: string) {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

function scoreTool(tool: ToolDefinition, query: string) {
	if (!query) return 0;

	const name = normalize(tool.name);
	const description = normalize(tool.description);
	const category = normalize(tool.category);
	const keywords = tool.keywords.map(normalize);
	let score = 0;

	if (name === query) score += 160;
	if (name.startsWith(query)) score += 120;
	if (name.includes(query)) score += 90;
	if (category.includes(query)) score += 35;
	if (description.includes(query)) score += 30;

	for (const keyword of keywords) {
		if (keyword === query) score += 90;
		else if (keyword.startsWith(query)) score += 60;
		else if (keyword.includes(query)) score += 40;
	}

	for (const token of query.split(' ')) {
		if (!token) continue;
		if (name.includes(token)) score += 18;
		if (description.includes(token)) score += 6;
		if (keywords.some((keyword) => keyword.includes(token))) score += 10;
	}

	return score;
}

export function searchTools(query: string) {
	const normalized = normalize(query);

	if (!normalized) {
		return [...tools];
	}

	return [...tools]
		.map((tool) => ({ tool, score: scoreTool(tool, normalized) }))
		.filter((entry) => entry.score > 0)
		.sort(
			(left, right) => right.score - left.score || left.tool.name.localeCompare(right.tool.name)
		)
		.map((entry) => entry.tool);
}
