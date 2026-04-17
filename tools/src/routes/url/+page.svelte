<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import type { UrlAction, UrlMode } from '$lib/tools/url';
	import { transformUrl } from '$lib/tools/url';

	let input = 'https://recica.dev/tools?name=JSON formatter&mode=full url';
	let output = '';
	let error = '';
	let mode: UrlMode = 'component';
	let lastAction = 'Choose Encode or Decode.';

	$: modeHelp =
		mode === 'full'
			? 'Preserves URL structure. Good for normalizing a complete URL without encoding separators like : / ? & =.'
			: 'Encodes the entire string. Use this when embedding a URL or value inside another URL, query string, or fragment.';

	function runTransform(action: UrlAction) {
		const result = transformUrl(input, mode, action);
		if (!result.ok) {
			error = result.error;
			return;
		}

		error = '';
		output = result.output;

		if (action === 'encode' && mode === 'full' && result.output === input) {
			lastAction =
				'No visible change. Full URL mode preserves reserved URL characters. Use Component mode to percent-encode the entire string.';
			return;
		}

		lastAction = action === 'encode' ? 'Encoded output ready.' : 'Decoded output ready.';
	}
</script>

<ToolShell
	title="URL Encoder / Decoder"
	description="Encode or decode either full URLs or individual URL components without destroying the source text."
	split
	tips={[
		'Full URL mode leaves reserved URL characters intact where appropriate.',
		'Component mode is meant for query values, fragments, and other partial strings.',
		'Decode errors leave the source input untouched.'
	]}
>
	<div class="surface-panel p-6">
		<div class="space-y-4">
			<div class="field">
				<div class="field__label">Mode</div>
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						class={`button-base ${mode === 'full' ? 'button-secondary' : 'button-ghost'}`}
						on:click={() => (mode = 'full')}
					>
						Full URL
					</button>
					<button
						type="button"
						class={`button-base ${mode === 'component' ? 'button-secondary' : 'button-ghost'}`}
						on:click={() => (mode = 'component')}
					>
						Component / whole string
					</button>
				</div>
				<div class="field__help">{modeHelp}</div>
			</div>

			<TextArea
				id="url-input"
				label="Source"
				rows={16}
				mono
				help="Source text remains unchanged if decoding fails."
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
					<div class="field__help">Mode determines which native encode/decode function runs.</div>
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
