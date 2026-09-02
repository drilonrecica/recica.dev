<script lang="ts">
	import { onMount } from 'svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { slugify } from '$lib/tools/slug';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	let input = $state('');
	let output = $state('');
	let limitError = $state('');

	function run() {
		const limit = checkToolInputLimit('slug', [input]);
		limitError = limit.ok ? '' : limit.message;
		output = limit.ok ? slugify(input) : '';
	}

	const live = createDebounced(run, 120);

	onMount(() => {
		const cleanup = setupToolPage({
			toolId: 'slug',
			onHandoff: (payload) => {
				input = payload;
				run();
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.copy, label: 'Copy slug', handler: () => void copyText(output) },
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
						run();
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
	title="Slug Generator"
	description="Generate clean lowercase slugs with Unicode normalization, diacritic stripping, and collapsed separators."
	tips={[
		'Numbers are preserved by default.',
		'Repeated punctuation and spaces collapse into a single hyphen.',
		'The generated slug updates as you type.'
	]}
>
	<div class="workbench__pane">
		<TextInput
			id="slug-input"
			label="Source title"
			error={limitError || undefined}
			placeholder="Recica Tools: JSON Formatter / Validator"
			help="Normalization happens locally and immediately."
			bind:value={input}
			on:input={() => live.call()}
		/>
		<OutputPane
			id="slug-output"
			label="Slug"
			value={output}
			empty="Enter a title to generate a slug."
			filename="slug.txt"
			gutter={false}
			wrap
			from="slug"
		/>
	</div>

	{#snippet status()}
		<StatusLine
			tone={limitError ? 'error' : output ? 'ok' : 'idle'}
			message={limitError || (output ? 'Slug ready.' : 'Type a title to begin.')}
			{input}
		/>
	{/snippet}
</Workbench>
