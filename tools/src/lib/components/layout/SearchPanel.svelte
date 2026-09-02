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
	let dialogEl: HTMLDivElement | null = null;
	let activeIndex = 0;
	const dialogTitleId = 'tool-search-title';
	const dialogDescriptionId = 'tool-search-description';

	$: if (open) {
		tick().then(() => inputEl?.focus());
	}

	$: if (!open) {
		activeIndex = 0;
	}

	$: if (activeIndex > results.length - 1) {
		activeIndex = Math.max(results.length - 1, 0);
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
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

	function handleDialogKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			dispatch('close');
			return;
		}

		if (event.key !== 'Tab' || !dialogEl) {
			return;
		}

		const focusableElements = [
			...dialogEl.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		].filter((element) => !element.hasAttribute('hidden'));

		if (!focusableElements.length) {
			return;
		}

		const first = focusableElements[0];
		const last = focusableElements[focusableElements.length - 1];
		const active = document.activeElement;

		if (!event.shiftKey && active === last) {
			event.preventDefault();
			first?.focus();
		}

		if (event.shiftKey && active === first) {
			event.preventDefault();
			last?.focus();
		}
	}
</script>

{#if open}
	<div class="dialog-scrim">
		<button
			type="button"
			tabindex="-1"
			aria-hidden="true"
			class="dialog-scrim__bg"
			on:click={() => dispatch('close')}
		></button>
		<div
			bind:this={dialogEl}
			id="tool-search-dialog"
			class="dialog"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby={dialogTitleId}
			aria-describedby={dialogDescriptionId}
			on:keydown={handleDialogKeydown}
		>
			<div class="dialog__head">
				<div>
					<div class="kicker" id={dialogTitleId}>Tool Search</div>
					<p class="mt-1 text-sm text-[var(--ink-muted)]" id={dialogDescriptionId}>
						Search by name, task, or keyword. Arrow keys move, Enter opens.
					</p>
				</div>
				<button
					type="button"
					class="button-base button-ghost"
					aria-label="Close tool search"
					on:click={() => dispatch('close')}
				>
					Close
				</button>
			</div>
			<div class="px-4 pb-3">
				<input
					bind:this={inputEl}
					value={query}
					on:input={(event) =>
						dispatch('querychange', (event.currentTarget as HTMLInputElement).value)}
					on:keydown={handleInputKeydown}
					class="input-base mono"
					placeholder="Search tools by name, task, or keyword…"
					aria-label="Search tools"
				/>
			</div>

			<div class="dialog__body">
				{#if results.length}
					<ul class="grid gap-1">
						{#each results as tool, index (tool.id)}
							<li>
								<button
									type="button"
									class="dialog__row"
									on:mouseenter={() => (activeIndex = index)}
									on:click={() => dispatch('choose', tool)}
									aria-current={index === activeIndex ? 'true' : undefined}
								>
									<span>
										<strong>{tool.name}</strong>
										<p>{tool.description}</p>
									</span>
									<span class="tool-code">{tool.route}</span>
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="result-empty">
						<div>
							<div class="text-base font-semibold text-[var(--ink)]">
								No tool matches that query.
							</div>
							<div class="mt-2 text-sm">
								Try a broader keyword like json, timestamp, slug, or password.
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
