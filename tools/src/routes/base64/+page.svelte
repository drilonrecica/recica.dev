<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import type { Base64Action } from '$lib/tools/base64';
	import { decodeBase64, encodeBase64 } from '$lib/tools/base64';

	let input = 'Recica Tools';
	let output = '';
	let error = '';
	let lastAction = 'Choose Encode or Decode.';

	function runTransform(action: Base64Action) {
		if (!input.trim()) {
			error = 'Enter text to encode or decode.';
			output = '';
			return;
		}

		const result = action === 'encode' ? encodeBase64(input) : decodeBase64(input);
		if (!result.ok) {
			error = result.error;
			output = '';
			return;
		}

		error = '';
		output = result.output;
		lastAction = action === 'encode' ? 'Encoded output ready.' : 'Decoded output ready.';
	}
</script>

<ToolShell
	title="Base64 Encoder / Decoder"
	seoTitle="Free Base64 Encoder / Decoder"
	description="Free Base64 encoder and decoder for UTF-8 text. Encode or decode locally without altering the source input."
	split
	tips={[
		'This tool supports standard Base64 only. Base64URL and data URLs are intentionally rejected.',
		'Decode accepts pasted wrapped Base64 text and restores missing padding when it is unambiguous.',
		'If decoded bytes are not valid UTF-8 text, the tool fails clearly instead of guessing.'
	]}
>
	<div class="surface-panel p-6">
		<div class="space-y-4">
			<TextArea
				id="base64-input"
				label="Source"
				rows={16}
				mono
				help="Source text stays unchanged if decoding fails."
				bind:value={input}
			/>
		</div>

		<div class="mt-5 flex flex-wrap gap-3">
			<Button on:click={() => runTransform('encode')}>Encode</Button>
			<Button variant="secondary" on:click={() => runTransform('decode')}>Decode</Button>
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${error ? 'status-error' : 'status-neutral'}`}>
			{error || lastAction}
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Output</div>
					<div class="field__help">Output is always plain text with no line wrapping.</div>
				</div>
				<CopyButton value={output} />
			</div>

			{#if output}
				<pre class="mono-surface mt-5 overflow-x-auto p-5">{output}</pre>
			{:else}
				<div class="result-empty mt-5">Encoded or decoded output will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
