<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import type { UuidVersion } from '$lib/tools/uuid';
	import { generateUuidBatch } from '$lib/tools/uuid';

	let version: UuidVersion = 'v4';
	let count = '5';
	let output = generateUuidBatch(version, 5);
	let error = '';

	function regenerate() {
		const parsedCount = Number(count);
		if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 50) {
			error = 'Enter a whole number between 1 and 50.';
			return;
		}

		error = '';
		output = generateUuidBatch(version, parsedCount);
	}

	$: outputText = output.join('\n');
</script>

<ToolShell
	title="UUID Generator"
	description="Generate secure UUID v4 and v7 values locally, including practical bulk generation."
	split
	tips={[
		'v4 is fully random. v7 is time-ordered and easier to sort chronologically.',
		'Bulk output is generated locally in the browser.',
		'Count is intentionally capped to keep the UI quick and readable.'
	]}
>
	<div class="surface-panel p-6">
		<div class="space-y-5">
			<div class="field">
				<div class="field__label">Version</div>
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						class={`button-base ${version === 'v4' ? 'button-secondary' : 'button-ghost'}`}
						on:click={() => (version = 'v4')}
					>
						v4
					</button>
					<button
						type="button"
						class={`button-base ${version === 'v7' ? 'button-secondary' : 'button-ghost'}`}
						on:click={() => (version = 'v7')}
					>
						v7
					</button>
				</div>
			</div>

			<TextInput
				id="uuid-count"
				label="Count"
				type="number"
				inputmode="numeric"
				help="Choose between 1 and 50 IDs per batch."
				bind:value={count}
			/>

			<Button on:click={regenerate}>Generate</Button>
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${error ? 'status-error' : 'status-neutral'}`}>
			{error || `${output.length} UUID${output.length === 1 ? '' : 's'} ready.`}
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Output</div>
					<div class="field__help">Copy one by one or copy the full batch.</div>
				</div>
				<CopyButton value={outputText} label="Copy all" />
			</div>

			<div class="mt-5 grid gap-3">
				{#each output as value (value)}
					<div
						class="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
					>
						<div class="font-mono text-sm text-[var(--text)]">{value}</div>
						<CopyButton {value} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</ToolShell>
