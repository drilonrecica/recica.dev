<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { parseSitemapXml } from '$lib/tools/sitemap';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>https://recica.dev/</loc></url>
	<url><loc>https://recica.dev/tools</loc></url>
</urlset>`);
	const limit = $derived(checkToolInputLimit('sitemap', [input]));
	const result = $derived(
		limit.ok ? parseSitemapXml(input) : ({ ok: false, error: limit.message } as const)
	);
	const urls = $derived(result.ok ? result.urls.join('\n') : '');

	onMount(() =>
		setupToolPage({
			toolId: 'sitemap',
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
	title="Sitemap XML Parser / Validator"
	description="Parse pasted sitemap XML locally, list <loc> entries, and flag structural issues."
	split
	tips={[
		'This tool validates pasted sitemap XML only. It does not fetch remote URLs.',
		'Supports both <urlset> and <sitemapindex> roots.',
		'Structural checks are intentionally practical rather than fully schema-driven.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="sitemap-input"
			label="Sitemap XML"
			bind:value={input}
			rows={18}
			maxBytes={2 * 1024 * 1024}
			accept=".xml,.txt,application/xml,text/xml,text/plain"
			help="Parsing updates automatically as the XML changes."
			error={result.ok ? undefined : result.error}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="sitemap-output"
			label="Extracted locations"
			value={urls}
			empty="Parsed sitemap URLs will appear here."
			filename="sitemap-urls.txt"
			wrap
			from="sitemap"
		/>
	</div>

	{#snippet status()}
		<StatusLine
			tone={result.ok ? 'ok' : 'error'}
			message={result.ok ? `${result.kind} with ${result.urls.length} URLs.` : result.error}
			{input}
		/>
	{/snippet}
</Workbench>
