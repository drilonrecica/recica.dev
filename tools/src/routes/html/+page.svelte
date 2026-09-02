<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { createHtmlPreviewDocument } from '$lib/tools/html';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state(`<main style="font-family: system-ui; padding: 24px;">
	<h1>Recica Preview</h1>
	<p>Scripts are blocked and event handlers are stripped.</p>
	<button onclick="alert('blocked')">Blocked action</button>
</main>`);
	const limit = $derived(checkToolInputLimit('html', [input]));
	const preview = $derived(createHtmlPreviewDocument(limit.ok ? input : ''));

	onMount(() =>
		setupToolPage({
			toolId: 'html',
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
	title="HTML Previewer"
	description="Preview pasted HTML locally in a sandboxed iframe without allowing arbitrary script execution."
	split
	tips={[
		'Preview rendering happens in a restricted iframe.',
		'Script tags, event handlers, and javascript: URLs are stripped before rendering.',
		'Useful for quick markup checks, not for full app simulation.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="html-input"
			label="HTML"
			bind:value={input}
			rows={22}
			maxBytes={1024 * 1024}
			accept=".html,.htm,.txt,text/html,text/plain"
			help="Preview updates automatically as you edit."
			error={limit.ok ? undefined : limit.message}
		/>
	</div>

	<div class="workbench__pane">
		<div class="codefield__bar"><div class="field__label">Preview</div></div>
		<iframe title="HTML preview" class="preview-frame" sandbox="allow-scripts" srcdoc={preview}
		></iframe>
	</div>

	{#snippet status()}
		<StatusLine
			tone={limit.ok ? 'ok' : 'error'}
			message={limit.ok ? 'Preview is sandboxed and scripts are blocked.' : limit.message}
			{input}
		/>
	{/snippet}
</Workbench>
