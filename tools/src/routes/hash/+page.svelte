<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import type { HashAlgorithm } from '$lib/tools/hash';
	import { hashText } from '$lib/tools/hash';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	const algorithms: HashAlgorithm[] = ['SHA-256', 'SHA-384', 'SHA-512'];

	let algorithm = $state<HashAlgorithm>('SHA-256');
	let input = $state('Recica Tools');
	let output = $state('');
	let message = $state('Digest updates as you type.');
	let tone = $state<'idle' | 'ok' | 'error'>('idle');
	let fieldError = $state<string | undefined>(undefined);
	let durationMs = $state<number | null>(null);
	let runId = 0;

	async function run() {
		const limit = checkToolInputLimit('hash', [input]);
		if (!limit.ok) {
			output = '';
			message = limit.message;
			fieldError = limit.message;
			tone = 'error';
			durationMs = null;
			return;
		}
		const id = ++runId;
		const start = performance.now();
		try {
			const digest = await hashText(input, algorithm);
			if (id !== runId) return;
			output = digest;
			durationMs = performance.now() - start;
			message = `${algorithm} digest ready.`;
			tone = 'ok';
			fieldError = undefined;
		} catch {
			if (id !== runId) return;
			output = '';
			message = 'Hashing is unavailable in this browser.';
			fieldError = message;
			tone = 'error';
			durationMs = null;
		}
	}

	const live = createDebounced(() => void run(), 150);

	function chooseAlgorithm(next: HashAlgorithm) {
		algorithm = next;
		live.cancel();
		void run();
	}

	onMount(() => {
		void run();
		const cleanup = setupToolPage({
			toolId: 'hash',
			onHandoff: (payload) => {
				input = payload;
				void run();
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Hash now', handler: () => void run() },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy digest',
					handler: () => void copyText(output)
				},
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
						void run();
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
	title="Hash Generator"
	description="Generate SHA-256, SHA-384, and SHA-512 digests locally with the Web Crypto API."
	split
	tips={[
		'Empty input is valid and hashes to the correct digest for the empty string.',
		'Output is lowercase hexadecimal.',
		'Legacy hashes such as MD5 and SHA-1 are intentionally excluded.'
	]}
>
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Algorithm">
			{#each algorithms as option (option)}
				<button
					type="button"
					aria-pressed={algorithm === option}
					onclick={() => chooseAlgorithm(option)}
				>
					{option}
				</button>
			{/each}
		</div>
		<button type="button" class="button-base button-ghost" onclick={() => void run()}>Hash</button>
	{/snippet}

	<div class="workbench__pane">
		<CodeField
			id="hash-input"
			label="Source"
			bind:value={input}
			rows={14}
			maxBytes={5 * 1024 * 1024}
			help="Hashing happens locally in your browser."
			error={fieldError}
			wrap
			oninput={() => live.call()}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="hash-output"
			label="Digest"
			value={output}
			empty="The generated hash will appear here."
			filename={`${algorithm.toLowerCase()}.txt`}
			gutter={false}
			wrap
			from="hash"
		/>
	</div>

	{#snippet status()}
		<StatusLine
			{tone}
			{message}
			{input}
			{durationMs}
			cells={[{ label: 'algorithm', value: algorithm }]}
		/>
	{/snippet}
</Workbench>
