<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { parseSitemapXml } from '$lib/tools/sitemap';

	let input = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>https://recica.dev/</loc></url>
	<url><loc>https://recica.dev/tools</loc></url>
</urlset>`;
	$: result = parseSitemapXml(input);
</script>

<ToolShell
	title="Sitemap XML Parser / Validator"
	description="Parse pasted sitemap XML locally, list <loc> entries, and flag structural issues."
	split
	tips={[
		'This tool validates pasted sitemap XML only. It does not fetch remote URLs.',
		'Supports both <urlset> and <sitemapindex> roots.',
		'Structural checks are intentionally practical rather than fully schema-driven.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="sitemap-input"
			label="Sitemap XML"
			rows={18}
			mono
			help="Parsing updates automatically as the XML changes."
			bind:value={input}
		/>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${result.ok ? 'status-neutral' : 'status-error'}`}>
			{result.ok ? `${result.kind} with ${result.urls.length} URLs.` : result.error}
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Extracted locations</div>
			{#if result.ok}
				<div class="mt-5 grid gap-3">
					{#each result.urls as url (url)}
						<div
							class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 font-mono text-sm text-[var(--text)]"
						>
							{url}
						</div>
					{/each}
				</div>
			{:else}
				<div class="result-empty mt-5">Parsed sitemap URLs will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
