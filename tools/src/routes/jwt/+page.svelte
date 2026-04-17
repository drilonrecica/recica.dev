<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { inspectJwt } from '$lib/tools/jwt';

	let input =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiUmVjaWNhIiwiZXhwIjo0MTAyNDQ0ODAwfQ.signature';
	let error = '';
	let status = 'Paste a JWT and inspect it locally.';
	let header = '';
	let payload = '';
	let timestamps: Array<{ key: string; iso: string; expired?: boolean }> = [];
	let signatureLength = 0;

	function inspect() {
		const result = inspectJwt(input);
		if (!result.ok) {
			error = result.error;
			header = '';
			payload = '';
			timestamps = [];
			signatureLength = 0;
			return;
		}

		error = '';
		status = 'JWT decoded locally. No verification was performed.';
		header = JSON.stringify(result.header, null, 2);
		payload = JSON.stringify(result.payload, null, 2);
		timestamps = result.timestamps;
		signatureLength = result.signatureLength;
	}
</script>

<ToolShell
	title="JWT Inspector"
	description="Decode JWT headers and payloads locally, with timestamp interpretation, without claiming signature verification."
	split
	tips={[
		'This tool decodes and inspects only. It does not verify signatures.',
		'Header and payload must be valid Base64URL-encoded UTF-8 JSON.',
		'Useful for quickly checking claims, expiry, and token shape.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="jwt-input"
			label="JWT"
			rows={16}
			mono
			help="Paste a complete header.payload.signature token."
			bind:value={input}
		/>

		<div class="mt-5 flex flex-wrap gap-3">
			<Button on:click={inspect}>Inspect</Button>
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${error ? 'status-error' : 'status-neutral'}`}>
			{error || status}
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Header</div>
			<div class="mt-3 flex justify-end">
				<CopyButton value={header} />
			</div>
			{#if header}
				<pre class="mono-surface mt-4 overflow-x-auto p-4">{header}</pre>
			{:else}
				<div class="result-empty mt-4">Decoded header will appear here.</div>
			{/if}
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Payload</div>
			<div class="mt-3 flex justify-end">
				<CopyButton value={payload} />
			</div>
			{#if payload}
				<pre class="mono-surface mt-4 overflow-x-auto p-4">{payload}</pre>
				<div class="mt-4 text-sm text-[var(--text-secondary)]">
					Signature length: {signatureLength} characters
				</div>
			{:else}
				<div class="result-empty mt-4">Decoded payload will appear here.</div>
			{/if}
		</div>

		{#if timestamps.length}
			<div class="surface-panel p-6">
				<div class="field__label">Token timestamps</div>
				<div class="mt-4 grid gap-3">
					{#each timestamps as item (item.key)}
						<div
							class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
						>
							<div class="tool-code">{item.key}</div>
							<div class="mt-2 font-mono text-sm text-[var(--text)]">{item.iso}</div>
							{#if item.key === 'exp'}
								<div class="mt-2 text-sm text-[var(--text-secondary)]">
									{item.expired ? 'Expired' : 'Not expired'}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</ToolShell>
