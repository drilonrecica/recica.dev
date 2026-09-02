<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import type { Base64Action } from '$lib/tools/base64';
	import { decodeBase64, encodeBase64 } from '$lib/tools/base64';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced, timed } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	let input = $state('Recica Tools');
	let output = $state('');
	let action = $state<Base64Action>('encode');
	let message = $state('Choose Encode or Decode. Output follows as you type.');
	let tone = $state<'idle' | 'ok' | 'error'>('idle');
	let fieldError = $state<string | undefined>(undefined);
	let durationMs = $state<number | null>(null);

	function run(next: Base64Action) {
		if (!input.trim()) {
			output = '';
			message = 'Enter text to encode or decode.';
			tone = 'idle';
			fieldError = undefined;
			durationMs = null;
			return;
		}
		const limit = checkToolInputLimit('base64', [input]);
		if (!limit.ok) {
			output = '';
			message = limit.message;
			fieldError = limit.message;
			tone = 'error';
			durationMs = null;
			return;
		}
		const { result, durationMs: elapsed } = timed(() =>
			next === 'encode' ? encodeBase64(input) : decodeBase64(input)
		);
		if (!result.ok) {
			output = '';
			message = result.error;
			fieldError = result.error;
			tone = 'error';
			durationMs = null;
			return;
		}
		output = result.output;
		durationMs = elapsed;
		message = next === 'encode' ? 'Encoded output ready.' : 'Decoded output ready.';
		tone = 'ok';
		fieldError = undefined;
	}

	const live = createDebounced(() => run(action), 150);

	function choose(next: Base64Action) {
		action = next;
		live.cancel();
		run(next);
	}

	onMount(() => {
		run(action);
		const cleanup = setupToolPage({
			toolId: 'base64',
			onHandoff: (payload) => {
				input = payload;
				run(action);
			},
			shortcuts: [
				{
					keys: STANDARD_SHORTCUTS.run,
					label: 'Run the current action',
					handler: () => run(action)
				},
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy output',
					handler: () => void copyText(output)
				},
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
						run(action);
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
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Action">
			<button type="button" aria-pressed={action === 'encode'} onclick={() => choose('encode')}>
				Encode
			</button>
			<button type="button" aria-pressed={action === 'decode'} onclick={() => choose('decode')}>
				Decode
			</button>
		</div>
	{/snippet}

	<div class="workbench__pane">
		<CodeField
			id="base64-input"
			label="Source"
			bind:value={input}
			rows={16}
			maxBytes={5 * 1024 * 1024}
			accept=".txt,text/plain"
			help="Source text stays unchanged if decoding fails."
			error={fieldError}
			wrap
			oninput={() => live.call()}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="base64-output"
			label={action === 'encode' ? 'Encoded' : 'Decoded'}
			value={output}
			empty="Encoded or decoded output will appear here."
			filename={action === 'encode' ? 'encoded.txt' : 'decoded.txt'}
			wrap
			gutter={false}
			from="base64"
		/>
	</div>

	{#snippet status()}
		<StatusLine {tone} {message} {input} {durationMs} hint="⌘/Ctrl+Enter runs" />
	{/snippet}
</Workbench>
