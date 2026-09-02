<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { buildQueryString, parseQueryString } from '$lib/tools/query';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	type Row = { id: number; key: string; value: string };

	let input = $state('?tag=json&tag=tools&mode=full+url');
	let rows = $state<Row[]>([]);
	let fieldError = $state<string | undefined>(undefined);
	let nextId = 1;

	function parseSource() {
		const limit = checkToolInputLimit('query', [input]);
		if (!limit.ok) {
			fieldError = limit.message;
			rows = [];
			return;
		}
		const parsed = parseQueryString(input);
		if (!parsed.ok) {
			fieldError = parsed.error;
			rows = [];
			return;
		}
		fieldError = undefined;
		rows = parsed.entries.map((entry) => ({ id: nextId++, ...entry }));
	}

	function addRow() {
		rows = [...rows, { id: nextId++, key: '', value: '' }];
	}

	function removeRow(id: number) {
		rows = rows.filter((row) => row.id !== id);
	}

	const built = $derived(buildQueryString(rows));
	const live = createDebounced(parseSource, 150);

	onMount(() => {
		parseSource();
		const cleanup = setupToolPage({
			toolId: 'query',
			onHandoff: (value) => {
				input = value;
				parseSource();
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Parse now', handler: parseSource },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy built query',
					handler: () => void copyText(built)
				},
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
						parseSource();
					}
				}
			]
		});
		return () => {
			live.cancel();
			cleanup();
		};
	});
</script>

<Workbench
	title="Query String Parser / Builder"
	description="Parse raw query strings into editable key/value rows and rebuild the query locally."
	split
	tips={[
		'Repeated keys are preserved as separate rows.',
		'Parsing catches malformed percent-encoded input.',
		'Built output uses standard URL component encoding and starts with a leading ?.'
	]}
>
	{#snippet actions()}
		<button type="button" class="button-base button-primary" onclick={parseSource}>Parse</button>
		<button type="button" class="button-base button-ghost" onclick={addRow}>Add row</button>
	{/snippet}

	<div class="workbench__pane">
		<CodeField
			id="query-input"
			label="Raw query string"
			bind:value={input}
			rows={6}
			maxBytes={5 * 1024 * 1024}
			help="Paste with or without the leading ?. Rows update as you type."
			error={fieldError}
			wrap
			oninput={() => live.call()}
		/>
		<div class="codefield__bar">
			<div class="field__label">Entries</div>
			<span class="workbench__note">Edit rows directly; the built query follows.</span>
		</div>
		{#if rows.length}
			<div class="grid gap-2">
				{#each rows as row (row.id)}
					<div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
						<input
							class="input-base mono"
							bind:value={row.key}
							placeholder="key"
							aria-label="Key"
						/>
						<input
							class="input-base mono"
							bind:value={row.value}
							placeholder="value"
							aria-label="Value"
						/>
						<button
							type="button"
							class="button-base button-ghost"
							onclick={() => removeRow(row.id)}
						>
							Remove
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<div class="result-empty">Parsed query entries will appear here.</div>
		{/if}
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="query-output"
			label="Built query string"
			value={built}
			empty="Built output will appear here."
			filename="query.txt"
			gutter={false}
			wrap
			from="query"
		/>
	</div>

	{#snippet status()}
		<StatusLine
			tone={fieldError ? 'error' : rows.length ? 'ok' : 'idle'}
			message={fieldError ?? `${rows.length} row${rows.length === 1 ? '' : 's'} ready.`}
			{input}
		/>
	{/snippet}
</Workbench>
