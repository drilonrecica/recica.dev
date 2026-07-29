<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { createMarkdownPreviewDocument } from '$lib/tools/markdown';
	import { checkToolInputLimit } from '$lib/utils/input-policy';

	let input = '# Recica Lab\n\n- Practical tools\n- Local-first defaults\n- Clean output';
	$: limit = checkToolInputLimit('markdown', [input]);
	$: preview = createMarkdownPreviewDocument(limit.ok ? input : '');
</script>

<ToolShell
	title="Markdown Previewer"
	description="Preview sanitized Markdown locally in a split editor and preview workspace."
	split
	tips={[
		'Markdown is rendered into a sandboxed preview document.',
		'Raw HTML is escaped rather than executed.',
		'This version focuses on practical Markdown syntax rather than full CommonMark coverage.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="markdown-input"
			label="Markdown"
			rows={22}
			mono
			help="Preview updates automatically as you edit."
			bind:value={input}
		/>
	</div>

	<div class="space-y-4">
		<div
			class={`status-pill ${limit.ok ? 'status-neutral' : 'status-error'}`}
			role="status"
			aria-live="polite"
			aria-atomic="true"
		>
			{limit.ok ? 'Markdown preview is sandboxed and sanitized.' : limit.message}
		</div>

		<div class="surface-panel p-4">
			<div class="field__label px-2 pt-2">Preview</div>
			<iframe
				title="Markdown preview"
				class="mt-4 h-[38rem] w-full rounded-[14px] border border-[var(--border-subtle)] bg-white"
				sandbox="allow-scripts"
				srcdoc={preview}
			></iframe>
		</div>
	</div>
</ToolShell>
