<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { buildQueryString, parseQueryString } from '$lib/tools/query';

	type Row = { id: number; key: string; value: string };

	let input = '?tag=json&tag=tools&mode=full+url';
	let rows: Row[] = [];
	let error = '';
	let nextId = 1;

	function parseSource() {
		const parsed = parseQueryString(input);
		if (!parsed.ok) {
			error = parsed.error;
			rows = [];
			return;
		}

		error = '';
		rows = parsed.entries.map((entry) => ({ id: nextId++, ...entry }));
	}

	function addRow() {
		rows = [...rows, { id: nextId++, key: '', value: '' }];
	}

	function removeRow(id: number) {
		rows = rows.filter((row) => row.id !== id);
	}

	$: builtQuery = buildQueryString(rows);
</script>

<ToolShell
	title="Query String Parser / Builder"
	description="Parse raw query strings into editable key/value rows and rebuild the query locally."
	split
	tips={[
		'Repeated keys are preserved as separate rows.',
		'Parsing catches malformed percent-encoded input.',
		'Built output uses standard URL component encoding and starts with a leading ?.'
	]}
>
	<div class="space-y-6">
		<div class="surface-panel p-6">
			<TextArea
				id="query-input"
				label="Raw query string"
				rows={10}
				mono
				help="Paste with or without the leading ?."
				bind:value={input}
			/>

			<div class="mt-5 flex flex-wrap gap-3">
				<Button on:click={parseSource}>Parse</Button>
				<Button variant="ghost" on:click={addRow}>Add row</Button>
			</div>
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Entries</div>
					<div class="field__help">Edit rows directly after parsing.</div>
				</div>
			</div>

			{#if rows.length}
				<div class="mt-5 grid gap-3">
					{#each rows as row (row.id)}
						<div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
							<input class="input-base mono" bind:value={row.key} placeholder="key" />
							<input class="input-base mono" bind:value={row.value} placeholder="value" />
							<Button variant="ghost" on:click={() => removeRow(row.id)}>Remove</Button>
						</div>
					{/each}
				</div>
			{:else}
				<div class="result-empty mt-5">Parsed query entries will appear here.</div>
			{/if}
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${error ? 'status-error' : 'status-neutral'}`}>
			{error || `${rows.length} row${rows.length === 1 ? '' : 's'} ready.`}
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Built query string</div>
					<div class="field__help">Rebuilt from the editable rows on the left.</div>
				</div>
				<CopyButton value={builtQuery} />
			</div>

			{#if builtQuery}
				<pre class="mono-surface mt-5 overflow-x-auto p-5">{builtQuery}</pre>
			{:else}
				<div class="result-empty mt-5">Built output will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
