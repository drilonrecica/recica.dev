<script lang="ts">
	import { browser } from '$app/environment';
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import type { BarcodeFormat } from '$lib/tools/barcode';
	import { generateBarcode } from '$lib/tools/barcode';

	let format: BarcodeFormat = 'code128';
	let input = 'Recica-128';
	let svg = '';
	let text = '';
	let error = '';
	let status = 'Choose a barcode type and generate the preview.';

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
		status = 'Barcode preview ready.';
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
		const context = canvas.getContext('2d');
		context?.drawImage(image, 0, 0);

		const link = document.createElement('a');
		link.href = canvas.toDataURL('image/png');
		link.download = `recica-${format}.png`;
		link.click();
	}

	$: previewUrl = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : '';
</script>

<ToolShell
	title="Barcode Generator"
	description="Generate practical one-dimensional barcodes locally, including Code 128, EAN-13, and UPC-A, with SVG and PNG export."
	split
	tips={[
		'Code 128 uses printable ASCII in this first version.',
		'EAN-13 and UPC-A accept values with or without the final check digit.',
		'Exports are generated locally from the rendered SVG.'
	]}
>
	<div class="surface-panel p-6">
		<div class="space-y-5">
			<div class="field">
				<div class="field__label">Format</div>
				<div class="flex flex-wrap gap-2">
					{#each [['code128', 'Code 128'], ['ean13', 'EAN-13'], ['upca', 'UPC-A']] as option (option[0])}
						<button
							type="button"
							class={`button-base ${format === option[0] ? 'button-secondary' : 'button-ghost'}`}
							on:click={() => seedInput(option[0] as BarcodeFormat)}
						>
							{option[1]}
						</button>
					{/each}
				</div>
			</div>

			<TextInput
				id="barcode-input"
				label="Value"
				mono
				help="Input requirements depend on the selected barcode format."
				bind:value={input}
			/>

			<div class="flex flex-wrap gap-3">
				<Button on:click={generate}>Generate</Button>
				<Button variant="secondary" on:click={downloadSvg} disabled={!svg}>Download SVG</Button>
				<Button variant="ghost" on:click={downloadPng} disabled={!svg}>Download PNG</Button>
			</div>
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${error ? 'status-error' : 'status-neutral'}`}>
			{error || status}
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Preview</div>
			{#if previewUrl}
				<div
					class="mt-5 overflow-auto rounded-[18px] border border-[var(--border-subtle)] bg-white p-6"
				>
					<img src={previewUrl} alt={`Preview of ${text}`} class="mx-auto max-w-full" />
				</div>
			{:else}
				<div class="result-empty mt-5">Generated barcode preview will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
