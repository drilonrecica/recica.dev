<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { ToolDefinition } from '$lib/types/tool';

	export let open = false;
	export let query = '';
	export let results: ToolDefinition[] = [];

	const dispatch = createEventDispatcher<{
		close: void;
		choose: ToolDefinition;
		querychange: string;
	}>();

	let inputEl: HTMLInputElement | null = null;
	let activeIndex = 0;

	$: if (open) {
		tick().then(() => inputEl?.focus());
	}

	$: if (!open) {
		activeIndex = 0;
	}

	$: if (activeIndex > results.length - 1) {
		activeIndex = Math.max(results.length - 1, 0);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			dispatch('close');
			return;
		}

		if (!results.length) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = (activeIndex + 1) % results.length;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = activeIndex === 0 ? results.length - 1 : activeIndex - 1;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			const selectedTool = results[activeIndex];
			if (selectedTool) {
				dispatch('choose', selectedTool);
			}
		}
	}
</script>

{#if open}
	<div class="fixed inset-0 z-40 px-3 py-20 md:px-6">
		<button
			type="button"
			class="absolute inset-0 bg-[rgba(7,10,14,0.4)] backdrop-blur-sm md:bg-transparent"
			aria-label="Close tool search"
			on:click={() => dispatch('close')}
		></button>
		<div
			class="surface-panel-elevated relative mx-auto w-full max-w-2xl overflow-hidden md:mt-2 md:max-w-[31rem]"
			role="dialog"
			aria-modal="true"
			aria-label="Tool search"
		>
			<div class="border-b border-[var(--border-subtle)] p-4">
				<div class="kicker">Tool Search</div>
				<div class="mt-3">
					<input
						bind:this={inputEl}
						value={query}
						on:input={(event) =>
							dispatch('querychange', (event.currentTarget as HTMLInputElement).value)}
						on:keydown={handleKeydown}
						class="input-base"
						placeholder="Search tools by name, task, or keyword"
						aria-label="Search tools"
					/>
				</div>
			</div>

			<div class="max-h-[60vh] overflow-y-auto p-2">
				{#if results.length}
					<ul class="grid gap-1">
						{#each results as tool, index (tool.id)}
							<li>
								<button
									type="button"
									class={`w-full rounded-[14px] border p-3 text-left transition ${
										index === activeIndex
											? 'border-[var(--border-strong)] bg-[var(--surface-strong)]'
											: 'border-transparent bg-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--surface)]'
									}`}
									on:mouseenter={() => (activeIndex = index)}
									on:click={() => dispatch('choose', tool)}
								>
									<div class="flex items-center justify-between gap-3">
										<div class="text-sm font-semibold text-[var(--text)]">{tool.name}</div>
										<div class="tool-code">{tool.route}</div>
									</div>
									<div class="mt-1 text-sm text-[var(--text-secondary)]">{tool.description}</div>
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="result-empty min-h-[14rem]">
						<div>
							<div class="text-base font-semibold text-[var(--text)]">
								No tool matches that query.
							</div>
							<div class="mt-2 text-sm text-[var(--text-muted)]">
								Try a broader keyword like json, timestamp, slug, or password.
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
