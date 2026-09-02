<script lang="ts">
	import { tick } from 'svelte';
	import { formatChord, listShortcuts, type ShortcutDefinition } from '$lib/workbench/keyboard';

	let {
		open = false,
		onclose
	}: {
		open?: boolean;
		onclose: () => void;
	} = $props();

	let dialogEl = $state<HTMLDivElement | null>(null);
	let closeEl = $state<HTMLButtonElement | null>(null);
	let shortcuts = $state<ShortcutDefinition[]>([]);

	$effect(() => {
		if (open) {
			shortcuts = listShortcuts();
			tick().then(() => closeEl?.focus());
		}
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			onclose();
			return;
		}
		if (event.key !== 'Tab' || !dialogEl) return;
		const focusable = [
			...dialogEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
			)
		];
		if (!focusable.length) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		} else if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		}
	}

	type Row = { label: string; chords: string[] };

	function groupByLabel(items: ShortcutDefinition[]): Row[] {
		const rows: Row[] = [];
		for (const item of items) {
			let row = rows.find((candidate) => candidate.label === item.label);
			if (!row) {
				row = { label: item.label, chords: [] };
				rows.push(row);
			}
			if (!row.chords.includes(item.keys)) row.chords.push(item.keys);
		}
		return rows;
	}

	const globalShortcuts = $derived(
		groupByLabel(shortcuts.filter((item) => item.scope === 'global'))
	);
	const toolShortcuts = $derived(groupByLabel(shortcuts.filter((item) => item.scope === 'tool')));
</script>

{#if open}
	<div class="dialog-scrim">
		<button
			type="button"
			tabindex="-1"
			aria-hidden="true"
			class="dialog-scrim__bg"
			onclick={onclose}
		></button>
		<div
			bind:this={dialogEl}
			class="dialog"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="shortcuts-title"
			onkeydown={handleKeydown}
		>
			<div class="dialog__head">
				<div>
					<div class="kicker" id="shortcuts-title">Keyboard shortcuts</div>
					<p class="mt-1 text-sm text-[var(--ink-muted)]">
						Shortcuts work anywhere on the page; Mod chords also work inside inputs.
					</p>
				</div>
				<button
					bind:this={closeEl}
					type="button"
					class="button-base button-ghost"
					aria-label="Close shortcuts"
					onclick={onclose}>Close</button
				>
			</div>
			<div class="dialog__body">
				{#if toolShortcuts.length}
					<div class="kicker px-2 pt-2">This tool</div>
					<div class="shortcuts">
						{#each toolShortcuts as item (item.label)}
							<div>
								<span>{item.label}</span>
								<span>
									{#each item.chords as chord, index (chord)}
										{#if index > 0}<span class="tool-code">or</span>{/if}
										{#each formatChord(chord) as key (key)}
											<kbd class="kbd">{key}</kbd>
										{/each}
									{/each}
								</span>
							</div>
						{/each}
					</div>
				{/if}
				<div class="kicker px-2 pt-2">Everywhere</div>
				<div class="shortcuts">
					{#each globalShortcuts as item (item.label)}
						<div>
							<span>{item.label}</span>
							<span>
								{#each item.chords as chord, index (chord)}
									{#if index > 0}<span class="tool-code">or</span>{/if}
									{#each formatChord(chord) as key (key)}
										<kbd class="kbd">{key}</kbd>
									{/each}
								{/each}
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
