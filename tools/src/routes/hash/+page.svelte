<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import type { HashAlgorithm } from '$lib/tools/hash';
	import { hashText } from '$lib/tools/hash';

	let algorithm: HashAlgorithm = 'SHA-256';
	let input = 'Recica Tools';
	let output = '';
	let error = '';
	let status = 'Choose an algorithm and hash the input.';

	async function runHash() {
		try {
			output = await hashText(input, algorithm);
			error = '';
			status = 'Digest ready.';
		} catch {
			error = 'Hashing is unavailable in this browser.';
			output = '';
		}
	}
</script>

<ToolShell
	title="Hash Generator"
	description="Generate SHA-256, SHA-384, and SHA-512 digests locally with the Web Crypto API."
	split
	tips={[
		'Empty input is valid and hashes to the correct digest for the empty string.',
		'Output is lowercase hexadecimal.',
		'Legacy hashes such as MD5 and SHA-1 are intentionally excluded.'
	]}
>
	<div class="surface-panel p-6">
		<div class="space-y-5">
			<div class="field">
				<div class="field__label">Algorithm</div>
				<div class="flex flex-wrap gap-2">
					{#each ['SHA-256', 'SHA-384', 'SHA-512'] as option (option)}
						<button
							type="button"
							class={`button-base ${algorithm === option ? 'button-secondary' : 'button-ghost'}`}
							on:click={() => (algorithm = option as HashAlgorithm)}
						>
							{option}
						</button>
					{/each}
				</div>
			</div>

			<TextArea
				id="hash-input"
				label="Source"
				rows={14}
				mono
				help="Hashing happens locally in your browser."
				bind:value={input}
			/>

			<Button on:click={runHash}>Hash</Button>
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${error ? 'status-error' : 'status-neutral'}`}>
			{error || status}
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Digest</div>
					<div class="field__help">Hex output is stable and copy-ready.</div>
				</div>
				<CopyButton value={output} />
			</div>

			{#if output}
				<pre class="mono-surface mt-5 overflow-x-auto p-5">{output}</pre>
			{:else}
				<div class="result-empty mt-5">The generated hash will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
