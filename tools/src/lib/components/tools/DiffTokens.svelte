<script lang="ts">
	import type { DiffToken } from '$lib/tools/diff';

	export let tokens: DiffToken[] = [];
	export let side: 'left' | 'right' = 'left';
</script>

<span class="rows__value">
	{#each tokens as token, index (`${token.type}-${index}-${token.value}`)}
		<span
			class={token.type === 'context'
				? ''
				: side === 'left'
					? 'diff__token--removed'
					: 'diff__token--added'}>{token.value}</span
		>
	{/each}
</span>

<style>
	.diff__token--removed {
		background: var(--err-soft);
		outline: 1px solid var(--err);
		border-radius: 1px;
	}

	.diff__token--added {
		background: var(--ok-soft);
		outline: 1px solid var(--ok);
		border-radius: 1px;
	}
</style>
