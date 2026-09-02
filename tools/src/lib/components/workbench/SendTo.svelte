<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { handoffTargetsFor, stageHandoff } from '$lib/workbench/handoff';
	import type { ToolRoute } from '$lib/types/tool';

	let {
		from,
		payload,
		label = 'Send to'
	}: {
		from: string;
		payload: string;
		label?: string;
	} = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);
	const targets = $derived(handoffTargetsFor(from));

	async function choose(toolId: string, route: ToolRoute) {
		open = false;
		stageHandoff({ toolId, payload, from });
		await goto(resolve(route));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			event.stopPropagation();
			open = false;
		}
	}

	function handleWindowClick(event: MouseEvent) {
		if (open && rootEl && !rootEl.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window onclick={handleWindowClick} />

{#if targets.length}
	<div class="menu" bind:this={rootEl} onkeydown={handleKeydown} role="presentation">
		<button
			type="button"
			class="button-base button-ghost"
			aria-haspopup="menu"
			aria-expanded={open}
			disabled={!payload}
			onclick={() => (open = !open)}
		>
			{label} <span aria-hidden="true">▾</span>
		</button>
		{#if open}
			<div class="menu__list" role="menu" aria-label={label}>
				{#each targets as target (target.toolId)}
					<button
						type="button"
						class="menu__item"
						role="menuitem"
						onclick={() => choose(target.toolId, target.tool.route)}
					>
						<span>{target.label}</span>
						<span class="tool-code">{target.tool.route}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
