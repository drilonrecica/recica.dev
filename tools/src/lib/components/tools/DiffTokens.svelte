<script lang="ts">
	import type { DiffToken } from '$lib/tools/diff';

	export let tokens: DiffToken[] = [];
	export let side: 'left' | 'right' = 'left';
</script>

<p class="font-mono text-sm leading-7 break-words whitespace-pre-wrap text-[var(--text)]">
	{#each tokens as token, index (`${token.type}-${index}-${token.value}`)}
		<span
			class={`rounded px-0.5 ${
				token.type === 'context'
					? ''
					: side === 'left'
						? 'bg-[rgba(240,95,109,0.16)] text-[var(--text)]'
						: 'bg-[rgba(47,212,122,0.14)] text-[var(--text)]'
			}`}
		>
			{token.value}
		</span>
	{/each}
</p>
