import type { ToolDefinition } from '$lib/types/tool';

export type SearchState = {
	query: string;
	open: boolean;
	filteredTools: ToolDefinition[];
};
