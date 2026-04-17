<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { convertCase } from '$lib/tools/case';

	let input = 'Recica JSON formatter';
	$: output = convertCase(input);
</script>

<ToolShell
	title="Text Case Converter"
	description="Convert text into common developer-facing naming styles without leaving the browser."
	tips={[
		'Handles spaces, hyphens, underscores, and mixed camel/Pascal case reasonably.',
		'Output is generated from normalized words rather than copied punctuation.',
		'This version focuses on practical naming conversions rather than locale-aware title rules.'
	]}
>
	<div class="space-y-6">
		<div class="surface-panel p-6">
			<TextArea
				id="case-input"
				label="Source text"
				rows={8}
				help="Outputs update as you type."
				bind:value={input}
			/>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#each Object.entries(output) as [label, value] (label)}
				<div class="surface-panel p-5">
					<div class="flex items-center justify-between gap-3">
						<div class="field__label">{label}</div>
						<CopyButton {value} />
					</div>
					{#if value}
						<pre class="mono-surface mt-4 overflow-x-auto p-4">{value}</pre>
					{:else}
						<div class="result-empty mt-4 min-h-[8rem]">Enter text to convert it.</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</ToolShell>
