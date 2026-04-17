<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ToolDefinition } from '$lib/types/tool';

	export let tool: ToolDefinition;
	export let featured = false;
</script>

<a
	href={resolve(tool.route)}
	class={`group block overflow-hidden rounded-[16px] border transition duration-150 hover:-translate-y-1 ${
		featured
			? 'surface-panel-elevated p-5'
			: 'surface-panel p-4 hover:border-[var(--border-strong)]'
	}`}
>
	<div class="flex items-start justify-between gap-4">
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="status-pill">{tool.category}</span>
				{#if tool.localOnly}
					<span class="tool-code">local</span>
				{/if}
			</div>
			<h3
				class={`font-semibold tracking-tight text-[var(--text)] ${featured ? 'text-xl' : 'text-lg'}`}
			>
				{tool.name}
			</h3>
		</div>
		<span class="tool-code transition group-hover:text-[var(--primary)]">{tool.route}</span>
	</div>
	<p class="mt-3 max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">{tool.description}</p>
</a>
