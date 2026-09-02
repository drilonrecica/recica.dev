<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { convertCase } from '$lib/tools/case';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state('Recica JSON formatter');
	const limit = $derived(checkToolInputLimit('case', [input]));
	const output = $derived(convertCase(limit.ok ? input : ''));
	const entries = $derived(Object.entries(output));

	onMount(() =>
		setupToolPage({
			toolId: 'case',
			onHandoff: (payload) => {
				input = payload;
			},
			shortcuts: [
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear input',
					handler: () => {
						input = '';
					}
				}
			]
		})
	);
</script>

<Workbench
	title="Text Case Converter"
	description="Convert text into common developer-facing naming styles without leaving the browser."
	tips={[
		'Handles spaces, hyphens, underscores, and mixed camel/Pascal case reasonably.',
		'Output is generated from normalized words rather than copied punctuation.',
		'This version focuses on practical naming conversions rather than locale-aware title rules.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="case-input"
			label="Source text"
			bind:value={input}
			rows={5}
			maxBytes={1024 * 1024}
			accept=".txt,text/plain"
			help="Outputs update as you type."
			error={limit.ok ? undefined : limit.message}
			wrap
		/>
		<div class="grid gap-4 md:grid-cols-2">
			{#each entries as [label, value] (label)}
				<OutputPane
					id={`case-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
					{label}
					{value}
					empty="Enter text to convert it."
					filename={`${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`}
					gutter={false}
					wrap
					from="case"
				/>
			{/each}
		</div>
	</div>

	{#snippet status()}
		<StatusLine
			tone={limit.ok ? (input ? 'ok' : 'idle') : 'error'}
			message={limit.ok ? `${entries.length} styles generated as you type.` : limit.message}
			{input}
		/>
	{/snippet}
</Workbench>
