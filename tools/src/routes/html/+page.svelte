<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { createHtmlPreviewDocument } from '$lib/tools/html';

	let input = `<main style="font-family: system-ui; padding: 24px;">
	<h1>Recica Preview</h1>
	<p>Scripts are blocked and event handlers are stripped.</p>
	<button onclick="alert('blocked')">Blocked action</button>
</main>`;
	$: preview = createHtmlPreviewDocument(input);
</script>

<ToolShell
	title="HTML Previewer"
	description="Preview pasted HTML locally in a sandboxed iframe without allowing arbitrary script execution."
	split
	tips={[
		'Preview rendering happens in a restricted iframe.',
		'Script tags, event handlers, and javascript: URLs are stripped before rendering.',
		'Useful for quick markup checks, not for full app simulation.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="html-input"
			label="HTML"
			rows={22}
			mono
			help="Preview updates automatically as you edit."
			bind:value={input}
		/>
	</div>

	<div class="space-y-4">
		<div class="status-pill status-neutral">HTML preview is sandboxed and scripts are blocked.</div>

		<div class="surface-panel p-4">
			<div class="field__label px-2 pt-2">Preview</div>
			<iframe
				title="HTML preview"
				class="mt-4 h-[38rem] w-full rounded-[14px] border border-[var(--border-subtle)] bg-white"
				sandbox=""
				srcdoc={preview}
			></iframe>
		</div>
	</div>
</ToolShell>
