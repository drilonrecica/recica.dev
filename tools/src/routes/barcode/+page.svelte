<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import type { BarcodeFormat } from '$lib/tools/barcode';
	import { generateBarcode } from '$lib/tools/barcode';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	const formats: Array<[BarcodeFormat, string]> = [
		['code128', 'Code 128'],
		['ean13', 'EAN-13'],
		['upca', 'UPC-A']
	];

	let format = $state<BarcodeFormat>('code128');
	let input = $state('Recica-128');
	let svg = $state('');
	let text = $state('');
	let error = $state('');
	let message = $state('Choose a barcode type and generate the preview.');

	function seedInput(next: BarcodeFormat) {
		format = next;
		input = next === 'code128' ? 'Recica-128' : next === 'ean13' ? '590123412345' : '03600029145';
	}

	function generate() {
		const result = generateBarcode(format, input);
		if (!result.ok) {
			error = result.error;
			svg = '';
			text = '';
			return;
		}
		error = '';
		svg = result.svg;
		text = result.text;
		message = 'Barcode preview ready.';
	}

	function downloadSvg() {
		if (!svg) return;
		const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `recica-${format}.svg`;
		link.click();
		URL.revokeObjectURL(url);
	}

	async function downloadPng() {
		if (!browser || !svg) return;
		const image = new Image();
		const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error('PNG export failed.'));
			image.src = url;
		});
		const canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext('2d')?.drawImage(image, 0, 0);
		const link = document.createElement('a');
		link.href = canvas.toDataURL('image/png');
		link.download = `recica-${format}.png`;
		link.click();
	}

	const previewUrl = $derived(
		svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : ''
	);

	onMount(() =>
		setupToolPage({
			toolId: 'barcode',
			onHandoff: (value) => {
				input = value;
			},
			shortcuts: [{ keys: STANDARD_SHORTCUTS.run, label: 'Generate', handler: generate }]
		})
	);
</script>

<Workbench
	title="Barcode Generator"
	description="Generate practical one-dimensional barcodes locally, including Code 128, EAN-13, and UPC-A, with SVG and PNG export."
	split
	tips={[
		'Code 128 uses printable ASCII in this first version.',
		'EAN-13 and UPC-A accept values with or without the final check digit.',
		'Exports are generated locally from the rendered SVG.'
	]}
>
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Format">
			{#each formats as [id, label] (id)}
				<button type="button" aria-pressed={format === id} onclick={() => seedInput(id)}
					>{label}</button
				>
			{/each}
		</div>
		<button type="button" class="button-base button-primary" onclick={generate}>Generate</button>
	{/snippet}

	<div class="workbench__pane">
		<TextInput
			id="barcode-input"
			label="Value"
			error={error || undefined}
			mono
			help="Input requirements depend on the selected barcode format."
			bind:value={input}
		/>
		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				class="button-base button-secondary"
				onclick={downloadSvg}
				disabled={!svg}>Download SVG</button
			>
			<button type="button" class="button-base button-ghost" onclick={downloadPng} disabled={!svg}
				>Download PNG</button
			>
		</div>
	</div>

	<div class="workbench__pane">
		<div class="codefield__bar"><div class="field__label">Preview</div></div>
		{#if previewUrl}
			<div
				class="preview-frame grid place-items-center overflow-auto p-6"
				style="min-height: 12rem; height: auto"
			>
				<img src={previewUrl} alt={`Preview of ${text}`} class="max-w-full" />
			</div>
		{:else}
			<div class="result-empty">Generated barcode preview will appear here.</div>
		{/if}
	</div>

	{#snippet status()}
		<StatusLine
			tone={error ? 'error' : svg ? 'ok' : 'idle'}
			message={error || message}
			cells={[{ label: 'format', value: format }]}
		/>
	{/snippet}
</Workbench>
