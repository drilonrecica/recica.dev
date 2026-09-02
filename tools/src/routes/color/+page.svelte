<script lang="ts">
	import { onMount } from 'svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { formatColorOutputs, parseColor } from '$lib/tools/color';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state('#0F7A4C');
	const parsed = $derived(parseColor(input));
	const outputs = $derived(parsed.ok ? Object.entries(formatColorOutputs(parsed.value)) : []);
	const swatch = $derived(
		parsed.ok
			? `rgba(${parsed.value.r}, ${parsed.value.g}, ${parsed.value.b}, ${parsed.value.a})`
			: ''
	);

	onMount(() =>
		setupToolPage({
			toolId: 'color',
			onHandoff: (value) => {
				input = value;
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
	title="Color Converter"
	description="Convert between HEX, RGB(A), and HSL(A) locally with a live swatch preview."
	split
	tips={[
		'Supports HEX, RGB(A), and HSL(A) input formats.',
		'HEX output switches to 8-digit notation when alpha is present.',
		'This version intentionally stops at the common web color formats.'
	]}
>
	<div class="workbench__pane">
		<TextInput
			id="color-input"
			label="Color value"
			error={parsed.ok ? undefined : parsed.error}
			mono
			placeholder="#0F7A4C or rgb(15, 122, 76)"
			help="Preview updates as you edit the value."
			bind:value={input}
		/>
		<div class="codefield__bar"><div class="field__label">Swatch</div></div>
		<div
			class="preview-frame"
			style={`min-height: 8rem; height: 8rem; background: ${swatch || 'transparent'}`}
			aria-hidden="true"
		></div>
	</div>

	<div class="workbench__pane">
		{#if outputs.length}
			{#each outputs as [label, value] (label)}
				<OutputPane
					id={`color-${label}`}
					label={label.toUpperCase()}
					{value}
					filename={`${label}.txt`}
					gutter={false}
					wrap
					from="color"
				/>
			{/each}
		{:else}
			<div class="result-empty">Converted outputs will appear here.</div>
		{/if}
	</div>

	{#snippet status()}
		<StatusLine
			tone={parsed.ok ? 'ok' : 'error'}
			message={parsed.ok ? 'Color parsed successfully.' : parsed.error}
			{input}
		/>
	{/snippet}
</Workbench>
