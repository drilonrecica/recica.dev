<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import SendTo from '$lib/components/workbench/SendTo.svelte';
	import { parseDotenv } from '$lib/tools/env';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import type { Diagnostic } from '$lib/workbench/diagnostics';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state(
		'# App config\nAPI_URL="https://recica.dev"\nDEBUG=true\nAPI_URL=https://duplicate.dev\nBROKEN LINE'
	);
	const limit = $derived(checkToolInputLimit('env', [input]));
	const parsed = $derived(parseDotenv(limit.ok ? input : ''));
	const diagnostics = $derived.by((): Diagnostic[] =>
		parsed.rows.flatMap((row): Diagnostic[] => {
			if (row.kind === 'error')
				return [{ line: row.line, message: row.message, severity: 'error' }];
			if (row.kind === 'entry' && row.duplicate)
				return [{ line: row.line, message: `Duplicate key ${row.key}`, severity: 'warning' }];
			return [];
		})
	);
	const keysOnly = $derived(
		parsed.rows
			.filter((row) => row.kind === 'entry')
			.map((row) => (row.kind === 'entry' ? row.key : ''))
			.join('\n')
	);

	onMount(() =>
		setupToolPage({
			toolId: 'env',
			onHandoff: (payload) => {
				input = payload;
			},
			shortcuts: [
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
					}
				}
			]
		})
	);
</script>

<Workbench
	title=".env Parser / Viewer"
	description="Parse pasted dotenv content into readable rows, highlighting duplicates, comments, and malformed lines."
	split
	tips={[
		'Supports plain KEY=value lines plus optional export prefixes.',
		'Quoted and unquoted values are shown clearly.',
		'Duplicate keys and malformed rows are marked in the gutter and listed on the right.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="env-input"
			label="dotenv text"
			bind:value={input}
			rows={18}
			maxBytes={1024 * 1024}
			accept=".env,.txt,text/plain"
			help="Parsing updates locally as the source changes."
			error={limit.ok ? undefined : limit.message}
			{diagnostics}
		/>
	</div>

	<div class="workbench__pane">
		<div class="codefield__bar">
			<div class="field__label">Rows</div>
			<div class="codefield__tools">
				<SendTo from="env" payload={keysOnly} label="Send keys to" />
			</div>
		</div>
		{#if parsed.rows.length}
			<ol class="rows" aria-label="Parsed rows">
				{#each parsed.rows as row (row.line)}
					<li
						data-tone={row.kind === 'error'
							? 'error'
							: row.kind === 'entry' && row.duplicate
								? 'warn'
								: row.kind === 'comment'
									? 'muted'
									: undefined}
					>
						<span class="rows__line">{row.line}</span>
						<span class="rows__kind">
							{row.kind === 'entry'
								? row.duplicate
									? 'duplicate'
									: row.quoted
										? 'quoted'
										: 'entry'
								: row.kind}
						</span>
						<span>
							{#if row.kind === 'entry'}
								<span class="rows__value">{row.key}={row.value}</span>
							{:else if row.kind === 'comment'}
								<span class="rows__value">{row.value}</span>
							{:else}
								<span class="rows__value">{row.value}</span>
								<div class="rows__note">{row.message}</div>
							{/if}
						</span>
					</li>
				{/each}
			</ol>
		{:else}
			<div class="result-empty">Parsed rows will appear here.</div>
		{/if}
	</div>

	{#snippet status()}
		<StatusLine
			tone={!limit.ok || parsed.errorCount ? 'error' : parsed.duplicateCount ? 'warn' : 'ok'}
			message={limit.ok
				? `${parsed.entryCount} entries · ${parsed.duplicateCount} duplicates · ${parsed.errorCount} errors`
				: limit.message}
			{input}
		/>
	{/snippet}
</Workbench>
