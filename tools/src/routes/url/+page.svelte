<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import type { UrlAction, UrlMode } from '$lib/tools/url';
	import { transformUrl } from '$lib/tools/url';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced, timed } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	let input = $state('https://recica.dev/tools?name=JSON formatter&mode=full url');
	let output = $state('');
	let mode = $state<UrlMode>('component');
	let action = $state<UrlAction>('encode');
	let message = $state('Choose a mode and an action. Output follows as you type.');
	let tone = $state<'idle' | 'ok' | 'error' | 'warn'>('idle');
	let fieldError = $state<string | undefined>(undefined);
	let durationMs = $state<number | null>(null);

	const modeHelp = $derived(
		mode === 'full'
			? 'Full URL preserves structure and reserved separators like : / ? & =.'
			: 'Component encodes the entire string. Use it for query values, fragments, or nested URLs.'
	);

	function run(nextAction: UrlAction) {
		if (!input.trim()) {
			output = '';
			message = 'Enter a URL or value.';
			tone = 'idle';
			fieldError = undefined;
			durationMs = null;
			return;
		}
		const limit = checkToolInputLimit('url', [input]);
		if (!limit.ok) {
			output = '';
			message = limit.message;
			fieldError = limit.message;
			tone = 'error';
			durationMs = null;
			return;
		}
		const { result, durationMs: elapsed } = timed(() => transformUrl(input, mode, nextAction));
		if (!result.ok) {
			message = result.error;
			fieldError = result.error;
			tone = 'error';
			durationMs = null;
			return;
		}
		output = result.output;
		durationMs = elapsed;
		fieldError = undefined;
		if (nextAction === 'encode' && mode === 'full' && result.output === input) {
			message =
				'No visible change. Full URL mode preserves reserved characters; use Component to encode everything.';
			tone = 'warn';
			return;
		}
		message = nextAction === 'encode' ? 'Encoded output ready.' : 'Decoded output ready.';
		tone = 'ok';
	}

	const live = createDebounced(() => run(action), 150);

	function chooseAction(next: UrlAction) {
		action = next;
		live.cancel();
		run(next);
	}

	function chooseMode(next: UrlMode) {
		mode = next;
		live.cancel();
		run(action);
	}

	onMount(() => {
		run(action);
		const cleanup = setupToolPage({
			toolId: 'url',
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
	title="URL Encoder / Decoder"
	description="Encode or decode either full URLs or individual URL components without destroying the source text."
	split
	tips={[
		'Full URL mode leaves reserved URL characters intact where appropriate.',
		'Component mode is meant for query values, fragments, and other partial strings.',
		'Decode errors leave the source input untouched.'
	]}
>
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Mode">
			<button type="button" aria-pressed={mode === 'full'} onclick={() => chooseMode('full')}>
				Full URL
			</button>
			<button
				type="button"
				aria-pressed={mode === 'component'}
				onclick={() => chooseMode('component')}
			>
				Component / whole string
			</button>
		</div>
		<div class="seg" role="group" aria-label="Action">
			<button
				type="button"
				aria-pressed={action === 'encode'}
				onclick={() => chooseAction('encode')}
			>
				Encode
			</button>
			<button
				type="button"
				aria-pressed={action === 'decode'}
				onclick={() => chooseAction('decode')}
			>
				Decode
			</button>
		</div>
		<span class="workbench__note">{modeHelp}</span>
	{/snippet}

	<div class="workbench__pane">
		<CodeField
			id="url-input"
			label="Source"
			bind:value={input}
			rows={12}
			maxBytes={5 * 1024 * 1024}
			accept=".txt,text/plain"
			help="Source text remains unchanged if decoding fails."
			error={fieldError}
			wrap
			oninput={() => live.call()}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="url-output"
			label={action === 'encode' ? 'Encoded' : 'Decoded'}
			value={output}
			empty="Encoded or decoded output will appear here."
			filename={action === 'encode' ? 'encoded.txt' : 'decoded.txt'}
			wrap
			gutter={false}
			from="url"
		/>
	</div>

	{#snippet status()}
		<StatusLine {tone} {message} {input} {durationMs} hint="⌘/Ctrl+Enter runs" />
	{/snippet}
</Workbench>
