<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { parseRobotsTxt } from '$lib/tools/robots';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import type { Diagnostic } from '$lib/workbench/diagnostics';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state(
		'User-agent: *\nDisallow: /admin\nSitemap: https://recica.dev/sitemap.xml\nBad line'
	);
	const limit = $derived(checkToolInputLimit('robots', [input]));
	const parsed = $derived(parseRobotsTxt(limit.ok ? input : ''));
	const diagnostics = $derived.by((): Diagnostic[] =>
		parsed.rows.flatMap((row): Diagnostic[] =>
			row.kind === 'error' ? [{ line: row.line, message: row.message, severity: 'error' }] : []
		)
	);

	onMount(() =>
		setupToolPage({
			toolId: 'robots',
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
	title="robots.txt Parser / Validator"
	description="Parse pasted robots.txt content locally and flag malformed or unknown directives."
	split
	tips={[
		'This tool validates pasted content only. It does not fetch remote URLs.',
		'Unknown directives and malformed rows are marked in the gutter and listed on the right.',
		'Useful for quick inspection before publishing robots.txt changes.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="robots-input"
			label="robots.txt content"
			bind:value={input}
			rows={18}
			maxBytes={1024 * 1024}
			accept=".txt,text/plain"
			help="Parsing updates automatically as the content changes."
			error={limit.ok ? undefined : limit.message}
			{diagnostics}
		/>
	</div>

	<div class="workbench__pane">
		<div class="codefield__bar"><div class="field__label">Parsed rows</div></div>
		{#if parsed.rows.length}
			<ol class="rows" aria-label="Parsed rows">
				{#each parsed.rows as row (row.line)}
					<li
						data-tone={row.kind === 'error'
							? 'error'
							: row.kind === 'comment'
								? 'muted'
								: undefined}
					>
						<span class="rows__line">{row.line}</span>
						<span class="rows__kind">{row.kind}</span>
						<span>
							{#if row.kind === 'directive'}
								<span class="rows__value">{row.directive}: {row.value}</span>
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
			<div class="result-empty">Parsed robots.txt rows will appear here.</div>
		{/if}
	</div>

	{#snippet status()}
		<StatusLine
			tone={!limit.ok || parsed.errorCount ? 'error' : 'ok'}
			message={limit.ok
				? `${parsed.directiveCount} directives · ${parsed.errorCount} errors`
				: limit.message}
			{input}
		/>
	{/snippet}
</Workbench>
