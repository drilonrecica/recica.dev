<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { formatColorOutputs, parseColor } from '$lib/tools/color';

	let input = '#1EC8A5';
	$: parsed = parseColor(input);
	$: outputs = parsed.ok ? formatColorOutputs(parsed.value) : null;
</script>

<ToolShell
	title="Color Converter"
	description="Convert between HEX, RGB(A), and HSL(A) locally with a live swatch preview."
	split
	tips={[
		'Supports HEX, RGB(A), and HSL(A) input formats.',
		'HEX output switches to 8-digit notation when alpha is present.',
		'This version intentionally stops at the common web color formats.'
	]}
>
	<div class="surface-panel p-6">
		<div class="space-y-5">
			<TextInput
				id="color-input"
				label="Color value"
				mono
				placeholder="#1EC8A5 or rgb(30, 200, 165)"
				help="Preview updates as you edit the value."
				bind:value={input}
			/>

			{#if parsed.ok}
				<div
					class="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5"
				>
					<div class="field__label">Swatch</div>
					<div
						class="mt-4 h-32 rounded-[14px] border border-[var(--border-strong)]"
						style={`background: rgba(${parsed.value.r}, ${parsed.value.g}, ${parsed.value.b}, ${parsed.value.a})`}
					></div>
				</div>
			{/if}
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${parsed.ok ? 'status-neutral' : 'status-error'}`}>
			{parsed.ok ? 'Color parsed successfully.' : parsed.error}
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#if outputs}
				{#each Object.entries(outputs) as [label, value] (label)}
					<div class="surface-panel p-5">
						<div class="flex items-center justify-between gap-3">
							<div class="field__label">{label.toUpperCase()}</div>
							<CopyButton {value} />
						</div>
						<pre class="mono-surface mt-4 overflow-x-auto p-4">{value}</pre>
					</div>
				{/each}
			{:else}
				<div class="result-empty md:col-span-2">Converted outputs will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
