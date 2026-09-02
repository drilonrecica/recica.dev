<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import SendTo from '$lib/components/workbench/SendTo.svelte';
	import { createMarkdownPreviewDocument, renderMarkdown } from '$lib/tools/markdown';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state('# Recica Lab\n\n- Practical tools\n- Local-first defaults\n- Clean output');
	const limit = $derived(checkToolInputLimit('markdown', [input]));
	const preview = $derived(createMarkdownPreviewDocument(limit.ok ? input : ''));
	const html = $derived(limit.ok ? renderMarkdown(input) : '');

	onMount(() =>
		setupToolPage({
			toolId: 'markdown',
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
	title="Markdown Previewer"
	description="Preview sanitized Markdown locally in a split editor and preview workspace."
	split
	tips={[
		'Markdown is rendered into a sandboxed preview document.',
		'Raw HTML is escaped rather than executed.',
		'This version focuses on practical Markdown syntax rather than full CommonMark coverage.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="markdown-input"
			label="Markdown"
			bind:value={input}
			rows={22}
			maxBytes={2 * 1024 * 1024}
			accept=".md,.markdown,.txt,text/markdown,text/plain"
			help="Preview updates automatically as you edit."
			error={limit.ok ? undefined : limit.message}
			wrap
		/>
	</div>

	<div class="workbench__pane">
		<div class="codefield__bar">
			<div class="field__label">Preview</div>
			<div class="codefield__tools">
				<SendTo from="markdown" payload={html} label="Send HTML to" />
			</div>
		</div>
		<iframe title="Markdown preview" class="preview-frame" sandbox="allow-scripts" srcdoc={preview}
		></iframe>
	</div>

	{#snippet status()}
		<StatusLine
			tone={limit.ok ? 'ok' : 'error'}
			message={limit.ok ? 'Preview is sandboxed and sanitized.' : limit.message}
			{input}
		/>
	{/snippet}
</Workbench>
