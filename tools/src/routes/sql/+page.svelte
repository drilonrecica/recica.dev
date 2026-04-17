<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { formatSql, minifySql } from '$lib/tools/sql';

	let input = 'select id, name from users where active = 1 order by name';
	let output = '';
	let status = 'Choose Format or Minify.';

	function run(action: 'format' | 'minify') {
		output = action === 'format' ? formatSql(input) : minifySql(input);
		status = action === 'format' ? 'Formatted SQL ready.' : 'Minified SQL ready.';
	}
</script>

<ToolShell
	title="SQL Formatter / Minifier"
	description="Format and minify SQL text locally without executing, linting, or validating queries."
	split
	tips={[
		'This tool formats query text only. It does not execute SQL.',
		'Formatting is intentionally practical rather than dialect-perfect.',
		'Quoted strings are preserved while whitespace and clauses are normalized.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="sql-input"
			label="SQL source"
			rows={18}
			mono
			help="Paste any SQL text block."
			bind:value={input}
		/>

		<div class="mt-5 flex flex-wrap gap-3">
			<Button on:click={() => run('format')}>Format</Button>
			<Button variant="secondary" on:click={() => run('minify')}>Minify</Button>
		</div>
	</div>

	<div class="space-y-4">
		<div class="status-pill status-neutral">{status}</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Output</div>
					<div class="field__help">Formatting is text-only and safe to copy.</div>
				</div>
				<CopyButton value={output} />
			</div>

			{#if output}
				<pre class="mono-surface mt-5 overflow-x-auto p-5">{output}</pre>
			{:else}
				<div class="result-empty mt-5">Formatted SQL will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
