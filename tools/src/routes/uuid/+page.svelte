<script lang="ts">
	import { onMount } from 'svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import type { UuidVersion } from '$lib/tools/uuid';
	import { generateUuidBatch } from '$lib/tools/uuid';
	import { copyText } from '$lib/utils/clipboard';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	let version = $state<UuidVersion>('v4');
	let count = $state('5');
	let output = $state<string[]>(generateUuidBatch('v4', 5));
	let error = $state('');

	function regenerate() {
		const parsedCount = Number(count);
		if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 50) {
			error = 'Enter a whole number between 1 and 50.';
			return;
		}
		error = '';
		output = generateUuidBatch(version, parsedCount);
	}

	function chooseVersion(next: UuidVersion) {
		version = next;
		regenerate();
	}

	const outputText = $derived(output.join('\n'));

	onMount(() =>
		setupToolPage({
			toolId: 'uuid',
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Generate a new batch', handler: regenerate },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy all',
					handler: () => void copyText(outputText)
				}
			]
		})
	);
</script>

<Workbench
	title="UUID Generator"
	description="Generate secure UUID v4 and v7 values locally, including practical bulk generation."
	split
	tips={[
		'v4 is fully random. v7 is time-ordered and easier to sort chronologically.',
		'Bulk output is generated locally in the browser.',
		'Count is intentionally capped to keep the UI quick and readable.'
	]}
>
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Version">
			<button type="button" aria-pressed={version === 'v4'} onclick={() => chooseVersion('v4')}
				>v4</button
			>
			<button type="button" aria-pressed={version === 'v7'} onclick={() => chooseVersion('v7')}
				>v7</button
			>
		</div>
		<button type="button" class="button-base button-primary" onclick={regenerate}>Generate</button>
	{/snippet}

	<div class="workbench__pane">
		<TextInput
			id="uuid-count"
			label="Count"
			error={error || undefined}
			type="number"
			inputmode="numeric"
			help="Choose between 1 and 50 IDs per batch."
			bind:value={count}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="uuid-output"
			label="Output"
			value={outputText}
			empty="Generated UUIDs will appear here."
			filename={`uuid-${version}.txt`}
			from="uuid"
			help="One UUID per line. Copy all or download the batch."
		/>
	</div>

	{#snippet status()}
		<StatusLine
			tone={error ? 'error' : 'ok'}
			message={error || `${output.length} UUID${output.length === 1 ? '' : 's'} ready.`}
			cells={[{ label: 'version', value: version }]}
		/>
	{/snippet}
</Workbench>
