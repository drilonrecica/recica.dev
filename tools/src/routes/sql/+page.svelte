<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { formatSql, minifySql } from '$lib/tools/sql';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced, timed } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	type Mode = 'format' | 'minify';

	let input = $state('select id, name from users where active = 1 order by name');
	let output = $state('');
	let mode = $state<Mode>('format');
	let message = $state('Paste SQL. Output follows the selected mode.');
	let tone = $state<'idle' | 'ok' | 'error'>('idle');
	let fieldError = $state<string | undefined>(undefined);
	let durationMs = $state<number | null>(null);

	function run(action: Mode) {
		if (!input.trim()) {
			output = '';
			message = 'Paste SQL. Output follows the selected mode.';
			tone = 'idle';
			fieldError = undefined;
			durationMs = null;
			return;
		}
		const limit = checkToolInputLimit('sql', [input]);
		if (!limit.ok) {
			output = '';
			message = limit.message;
			fieldError = limit.message;
			tone = 'error';
			durationMs = null;
			return;
		}
		const { result, durationMs: elapsed } = timed(() =>
			action === 'format' ? formatSql(input) : minifySql(input)
		);
		output = result;
		durationMs = elapsed;
		message = action === 'format' ? 'Formatted SQL ready.' : 'Minified SQL ready.';
		tone = 'ok';
		fieldError = undefined;
	}

	const live = createDebounced(() => run(mode), 150);

	function choose(next: Mode) {
		mode = next;
		live.cancel();
		run(next);
	}

	onMount(() => {
		run(mode);
		const cleanup = setupToolPage({
			toolId: 'sql',
			onHandoff: (payload) => {
				input = payload;
				run(mode);
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Run the current mode', handler: () => run(mode) },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy output',
					handler: () => void copyText(output)
				},
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
						run(mode);
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
	title="SQL Formatter / Minifier"
	description="Format and minify SQL text locally without executing, linting, or validating queries."
	split
	tips={[
		'This tool formats query text only. It does not execute SQL.',
		'Formatting is intentionally practical rather than dialect-perfect.',
		'Quoted strings are preserved while whitespace and clauses are normalized.'
	]}
>
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Mode">
			<button type="button" aria-pressed={mode === 'format'} onclick={() => choose('format')}>
				Format
			</button>
			<button type="button" aria-pressed={mode === 'minify'} onclick={() => choose('minify')}>
				Minify
			</button>
		</div>
	{/snippet}

	<div class="workbench__pane">
		<CodeField
			id="sql-input"
			label="SQL source"
			bind:value={input}
			rows={18}
			maxBytes={2 * 1024 * 1024}
			accept=".sql,.txt,text/plain"
			help="Paste any SQL text block or drop a .sql file."
			error={fieldError}
			oninput={() => live.call()}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="sql-output"
			label={mode === 'format' ? 'Formatted' : 'Minified'}
			value={output}
			empty="Formatted SQL will appear here."
			filename={mode === 'format' ? 'formatted.sql' : 'minified.sql'}
			from="sql"
		/>
	</div>

	{#snippet status()}
		<StatusLine {tone} {message} {input} {durationMs} hint="⌘/Ctrl+Enter runs" />
	{/snippet}
</Workbench>
