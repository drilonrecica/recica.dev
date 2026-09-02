<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { inspectJwt } from '$lib/tools/jwt';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced, timed } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	const exampleJwtSections = [
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
		'eyJzdWIiOiIxMjMiLCJuYW1lIjoiUmVjaWNhIiwiZXhwIjo0MTAyNDQ0ODAwfQ',
		'signature'
	];

	let input = $state(exampleJwtSections.join('.'));
	let fieldError = $state<string | undefined>(undefined);
	let message = $state('Paste a JWT. It is decoded locally as you type.');
	let tone = $state<'idle' | 'ok' | 'error'>('idle');
	let header = $state('');
	let payload = $state('');
	let timestamps = $state<Array<{ key: string; iso: string; expired?: boolean }>>([]);
	let signatureLength = $state(0);
	let durationMs = $state<number | null>(null);

	function reset() {
		header = '';
		payload = '';
		timestamps = [];
		signatureLength = 0;
		durationMs = null;
	}

	function inspect() {
		if (!input.trim()) {
			reset();
			message = 'Paste a JWT. It is decoded locally as you type.';
			tone = 'idle';
			fieldError = undefined;
			return;
		}
		const limit = checkToolInputLimit('jwt', [input]);
		if (!limit.ok) {
			reset();
			message = limit.message;
			fieldError = limit.message;
			tone = 'error';
			return;
		}
		const { result, durationMs: elapsed } = timed(() => inspectJwt(input));
		if (!result.ok) {
			reset();
			message = result.error;
			fieldError = result.error;
			tone = 'error';
			return;
		}
		fieldError = undefined;
		message = 'JWT decoded locally. No verification was performed.';
		tone = 'ok';
		header = JSON.stringify(result.header, null, 2);
		payload = JSON.stringify(result.payload, null, 2);
		timestamps = result.timestamps;
		signatureLength = result.signatureLength;
		durationMs = elapsed;
	}

	const live = createDebounced(inspect, 150);

	onMount(() => {
		inspect();
		const cleanup = setupToolPage({
			toolId: 'jwt',
			onHandoff: (value) => {
				input = value;
				inspect();
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Inspect now', handler: inspect },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy payload',
					handler: () => void copyText(payload)
				},
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
						inspect();
					}
				}
			]
		});
		return () => {
			live.cancel();
			cleanup();
		};
	});
</script>

<Workbench
	title="JWT Inspector"
	description="Decode JWT headers and payloads locally, with timestamp interpretation, without claiming signature verification."
	split
	tips={[
		'This tool decodes and inspects only. It does not verify signatures.',
		'Header and payload must be valid Base64URL-encoded UTF-8 JSON.',
		'Send the payload to the JSON formatter or any other tool from the output menu.'
	]}
>
	{#snippet actions()}
		<button type="button" class="button-base button-primary" onclick={inspect}>Inspect</button>
	{/snippet}

	<div class="workbench__pane">
		<CodeField
			id="jwt-input"
			label="JWT"
			bind:value={input}
			rows={10}
			maxBytes={1024 * 1024}
			accept=".txt,.jwt,text/plain"
			help="Paste a complete header.payload.signature token."
			error={fieldError}
			wrap
			oninput={() => live.call()}
		/>
		{#if timestamps.length}
			<dl class="metrics" aria-label="Token timestamps">
				{#each timestamps as item (item.key)}
					<div>
						<dt>
							{item.key}{item.key === 'exp' ? (item.expired ? ' · expired' : ' · valid') : ''}
						</dt>
						<dd class="text-sm">{item.iso}</dd>
					</div>
				{/each}
				<div>
					<dt>signature</dt>
					<dd class="text-sm">{signatureLength} chars</dd>
				</div>
			</dl>
		{/if}
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="jwt-payload"
			label="Payload"
			value={payload}
			empty="Decoded payload will appear here."
			filename="jwt-payload.json"
			mime="application/json"
			from="jwt"
		/>
		<OutputPane
			id="jwt-header"
			label="Header"
			value={header}
			empty="Decoded header will appear here."
			filename="jwt-header.json"
			mime="application/json"
		/>
	</div>

	{#snippet status()}
		<StatusLine {tone} {message} {input} {durationMs} hint="⌘/Ctrl+Enter inspects" />
	{/snippet}
</Workbench>
