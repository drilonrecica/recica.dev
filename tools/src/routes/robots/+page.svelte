<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { parseRobotsTxt } from '$lib/tools/robots';

	let input = 'User-agent: *\nDisallow: /admin\nSitemap: https://recica.dev/sitemap.xml\nBad line';
	$: parsed = parseRobotsTxt(input);
</script>

<ToolShell
	title="robots.txt Parser / Validator"
	description="Parse pasted robots.txt content locally and flag malformed or unknown directives."
	split
	tips={[
		'This tool validates pasted content only. It does not fetch remote URLs.',
		'Unknown directives and malformed rows are flagged inline.',
		'Useful for quick inspection before publishing robots.txt changes.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="robots-input"
			label="robots.txt content"
			rows={18}
			mono
			help="Parsing updates automatically as the content changes."
			bind:value={input}
		/>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${parsed.errorCount ? 'status-error' : 'status-neutral'}`}>
			{parsed.directiveCount} directives · {parsed.errorCount} errors
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Parsed rows</div>
			{#if parsed.rows.length}
				<div class="mt-5 grid gap-3">
					{#each parsed.rows as row (row.line)}
						<div
							class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
						>
							<div class="tool-code">Line {row.line}</div>
							{#if row.kind === 'directive'}
								<div class="mt-2 font-mono text-sm text-[var(--text)]">
									{row.directive}: {row.value}
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
				<div class="result-empty mt-5">Parsed robots.txt rows will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
