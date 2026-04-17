<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { parseDotenv } from '$lib/tools/env';

	let input =
		'# App config\nAPI_URL="https://recica.dev"\nDEBUG=true\nAPI_URL=https://duplicate.dev\nBROKEN LINE';
	$: parsed = parseDotenv(input);
</script>

<ToolShell
	title=".env Parser / Viewer"
	description="Parse pasted dotenv content into readable rows, highlighting duplicates, comments, and malformed lines."
	split
	tips={[
		'Supports plain KEY=value lines plus optional export prefixes.',
		'Quoted and unquoted values are shown clearly.',
		'Duplicate keys and malformed rows are flagged inline.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="env-input"
			label="dotenv text"
			rows={18}
			mono
			help="Parsing updates locally as the source changes."
			bind:value={input}
		/>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${parsed.errorCount ? 'status-error' : 'status-neutral'}`}>
			{parsed.entryCount} entries · {parsed.duplicateCount} duplicates · {parsed.errorCount} errors
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Rows</div>
			{#if parsed.rows.length}
				<div class="mt-5 grid gap-3">
					{#each parsed.rows as row (row.line)}
						<div
							class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
						>
							<div class="tool-code">Line {row.line}</div>
							{#if row.kind === 'entry'}
								<div class="mt-2 font-mono text-sm text-[var(--text)]">{row.key}={row.value}</div>
								<div class="mt-2 text-sm text-[var(--text-secondary)]">
									{row.quoted ? 'quoted' : 'unquoted'}{row.duplicate ? ' · duplicate key' : ''}
								</div>
							{:else if row.kind === 'comment'}
								<div class="mt-2 text-sm text-[var(--text-secondary)]">{row.value}</div>
							{:else}
								<div class="mt-2 text-sm text-[var(--error)]">{row.message}</div>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<div class="result-empty mt-5">Parsed rows will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
