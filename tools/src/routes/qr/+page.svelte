<script lang="ts">
	import { browser } from '$app/environment';
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import type {
		QrBuildResult,
		QrErrorCorrection,
		QrPresetId,
		QrPresetValueMap,
		QrRenderOptions,
		QrWifiSecurity
	} from '$lib/tools/qr';
	import { buildQrPayload, renderQrCanvas, renderQrSvg } from '$lib/tools/qr';
	import { onDestroy, tick } from 'svelte';

	type QrExportSize = 256 | 384 | 512;
	type QrMargin = 0 | 1 | 2 | 4;
	const PREVIEW_SIZE = 320;

	const presetOptions: Array<{ id: QrPresetId; label: string; blurb: string }> = [
		{
			id: 'text',
			label: 'Text',
			blurb: 'Free text, notes, snippets, or anything you want to share quickly.'
		},
		{
			id: 'url',
			label: 'URL',
			blurb: 'Normalize and encode a full absolute URL as a plain QR payload.'
		},
		{
			id: 'wifi',
			label: 'Wi-Fi',
			blurb: 'Generate a network QR code with SSID, security, password, and hidden-network support.'
		},
		{
			id: 'email',
			label: 'Email',
			blurb: 'Create a mailto QR code with optional subject and body.'
		},
		{
			id: 'phone',
			label: 'Phone',
			blurb: 'Generate a tap-to-call QR code from a normalized phone number.'
		},
		{
			id: 'sms',
			label: 'SMS',
			blurb: 'Create an SMS QR code with a recipient number and optional prefilled message.'
		}
	];

	const securityOptions: QrWifiSecurity[] = ['WPA/WPA2', 'WEP', 'None'];
	const sizeOptions: QrExportSize[] = [256, 384, 512];
	const marginOptions: QrMargin[] = [0, 1, 2, 4];
	const errorCorrectionOptions: Array<{ id: QrErrorCorrection; label: string }> = [
		{ id: 'L', label: 'L' },
		{ id: 'M', label: 'M' },
		{ id: 'Q', label: 'Q' },
		{ id: 'H', label: 'H' }
	];

	let presetValues: QrPresetValueMap = {
		text: {
			preset: 'text',
			text: 'https://recica.dev'
		},
		url: {
			preset: 'url',
			url: 'https://recica.dev/tools?tool=qr'
		},
		wifi: {
			preset: 'wifi',
			ssid: '',
			security: 'WPA/WPA2',
			password: '',
			hidden: false
		},
		email: {
			preset: 'email',
			email: '',
			subject: '',
			body: ''
		},
		phone: {
			preset: 'phone',
			phone: ''
		},
		sms: {
			preset: 'sms',
			phone: '',
			message: ''
		}
	};

	let activePreset: QrPresetId = 'text';
	let advancedOpen = false;
	let exportSize: QrExportSize = 384;
	let margin: QrMargin = 1;
	let errorCorrectionLevel: QrErrorCorrection = 'M';
	let payload = '';
	let svgMarkup = '';
	let renderError = '';
	let statusMessage = 'Choose a preset and fill the required fields.';
	let fieldErrors: Record<string, string> = {};
	let buildResult: QrBuildResult = buildQrPayload(activePreset, presetValues[activePreset]);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	let renderId = 0;
	let canvas: HTMLCanvasElement | null = null;

	function clearCanvas() {
		if (!canvas) return;
		const context = canvas.getContext('2d');
		context?.clearRect(0, 0, canvas.width, canvas.height);
	}

	function updateBuildState() {
		buildResult = buildQrPayload(activePreset, presetValues[activePreset]);
		fieldErrors = buildResult.ok ? {} : buildResult.fieldErrors;
		payload = buildResult.ok ? buildResult.payload : '';

		if (!buildResult.ok) {
			renderError = '';
			svgMarkup = '';
			statusMessage = buildResult.message || 'Choose a preset and fill the required fields.';
		}
	}

	async function syncPreview() {
		updateBuildState();

		if (!buildResult.ok) {
			clearCanvas();
			return;
		}

		const requestId = ++renderId;
		const previewOptions: QrRenderOptions = {
			errorCorrectionLevel,
			margin,
			width: PREVIEW_SIZE
		};
		const exportOptions: QrRenderOptions = {
			errorCorrectionLevel,
			margin,
			width: exportSize
		};
		renderError = '';
		svgMarkup = '';
		statusMessage = 'Rendering preview locally.';

		await tick();

		if (!canvas) return;

		const [canvasResult, svgResult] = await Promise.all([
			renderQrCanvas(payload, previewOptions, canvas),
			renderQrSvg(payload, exportOptions)
		]);

		if (requestId !== renderId) return;

		if (!canvasResult.ok) {
			clearCanvas();
			renderError = canvasResult.message;
			statusMessage = renderError;
			return;
		}

		if (!svgResult.ok) {
			clearCanvas();
			renderError = svgResult.message;
			statusMessage = renderError;
			return;
		}

		renderError = '';
		svgMarkup = svgResult.value;
		statusMessage = 'Payload ready. Preview and exports are generated locally.';
	}

	function schedulePreview() {
		if (!browser) return;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			void syncPreview();
		}, 180);
	}

	function setPreset(preset: QrPresetId) {
		activePreset = preset;
		schedulePreview();
	}

	function updateWifiSecurity(next: QrWifiSecurity) {
		presetValues.wifi.security = next;
		if (next === 'None') {
			presetValues.wifi.password = '';
		}
		schedulePreview();
	}

	function toggleHiddenNetwork(next: boolean) {
		presetValues.wifi.hidden = next;
		schedulePreview();
	}

	async function downloadPng() {
		if (!canvas || !payload || renderError) return;

		const exportCanvas = document.createElement('canvas');
		const exportOptions: QrRenderOptions = {
			errorCorrectionLevel,
			margin,
			width: exportSize
		};
		const exportResult = await renderQrCanvas(payload, exportOptions, exportCanvas);
		if (!exportResult.ok) {
			renderError = exportResult.message;
			statusMessage = renderError;
			return;
		}

		const link = document.createElement('a');
		link.href = exportCanvas.toDataURL('image/png');
		link.download = `recica-qr-${activePreset}.png`;
		link.click();
	}

	function downloadSvg() {
		if (!svgMarkup || !payload || renderError) return;

		const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `recica-qr-${activePreset}.svg`;
		link.click();
		URL.revokeObjectURL(url);
	}

	$: activePresetCopy = presetOptions.find((option) => option.id === activePreset);
	$: previewHint =
		exportSize === 256 ? 'Compact export' : exportSize === 384 ? 'Balanced export' : 'Large export';
	$: previewSignature = JSON.stringify({
		activePreset,
		values: presetValues[activePreset],
		exportSize,
		margin,
		errorCorrectionLevel
	});
	$: if (browser && previewSignature) {
		schedulePreview();
	}

	onDestroy(() => {
		clearTimeout(debounceTimer);
	});
</script>

<ToolShell
	title="QR Code Generator"
	seoTitle="Free QR Code Generator"
	description="Free QR code generator for text, URLs, Wi-Fi credentials, email links, phone numbers, and SMS payloads. Runs locally in your browser with PNG and SVG export."
	split
	tips={[
		'Presets generate the final payload locally before rendering the QR code.',
		'PNG and SVG exports use the same QR payload and render settings.',
		'Visual styling, logo overlays, and scanning are intentionally out of scope.'
	]}
>
	<div class="space-y-6">
		<div class="surface-panel p-6">
			<div class="field">
				<div class="field__label">Preset</div>
				<div class="flex flex-wrap gap-2">
					{#each presetOptions as option (option.id)}
						<button
							type="button"
							class={`button-base ${activePreset === option.id ? 'button-secondary' : 'button-ghost'}`}
							on:click={() => setPreset(option.id)}
						>
							{option.label}
						</button>
					{/each}
				</div>
				<div class="field__help">{activePresetCopy?.blurb}</div>
			</div>
		</div>

		<div class="surface-panel p-6">
			<div class="space-y-5">
				{#if activePreset === 'text'}
					<TextArea
						id="qr-text"
						label="Text"
						rows={10}
						placeholder="Paste notes, a URL, or anything else here."
						help="Text is used as-is after validation."
						error={fieldErrors.text}
						bind:value={presetValues.text.text}
					/>
				{:else if activePreset === 'url'}
					<TextInput
						id="qr-url"
						label="URL"
						type="url"
						placeholder="https://recica.dev"
						help="Use a full absolute URL. The payload is normalized before rendering."
						error={fieldErrors.url}
						autocomplete="url"
						inputmode="url"
						bind:value={presetValues.url.url}
					/>
				{:else if activePreset === 'wifi'}
					<div class="grid gap-5">
						<TextInput
							id="qr-wifi-ssid"
							label="SSID"
							placeholder="Recica Lab"
							help="Network name exactly as devices should see it."
							error={fieldErrors.ssid}
							bind:value={presetValues.wifi.ssid}
						/>

						<div class="field">
							<div class="field__label">Security</div>
							<div class="flex flex-wrap gap-2">
								{#each securityOptions as option (option)}
									<button
										type="button"
										class={`button-base ${presetValues.wifi.security === option ? 'button-secondary' : 'button-ghost'}`}
										on:click={() => updateWifiSecurity(option)}
									>
										{option}
									</button>
								{/each}
							</div>
							<div class="field__help">WPA/WPA2 is the normal default for modern networks.</div>
						</div>

						{#if presetValues.wifi.security !== 'None'}
							<TextInput
								id="qr-wifi-password"
								label="Password"
								type="text"
								placeholder="Network password"
								help="Used only in the Wi-Fi payload. Nothing leaves the browser."
								error={fieldErrors.password}
								bind:value={presetValues.wifi.password}
							/>
						{/if}

						<div class="field">
							<div class="field__label">Network visibility</div>
							<Toggle
								checked={presetValues.wifi.hidden}
								label="Hidden network"
								hint="H:true"
								on:change={(event) => toggleHiddenNetwork(event.detail)}
							/>
							<div class="field__help">
								Enable this only if the SSID is hidden from normal scans.
							</div>
						</div>
					</div>
				{:else if activePreset === 'email'}
					<div class="grid gap-5">
						<TextInput
							id="qr-email"
							label="Email"
							type="email"
							placeholder="hello@recica.dev"
							help="Required. Generates a mailto payload."
							error={fieldErrors.email}
							autocomplete="email"
							inputmode="email"
							bind:value={presetValues.email.email}
						/>
						<TextInput
							id="qr-email-subject"
							label="Subject"
							placeholder="Quick follow-up"
							help="Optional. Encoded into the mailto query string."
							bind:value={presetValues.email.subject}
						/>
						<TextArea
							id="qr-email-body"
							label="Body"
							rows={7}
							placeholder="Hi, following up on..."
							help="Optional. Newlines and spaces are encoded safely."
							bind:value={presetValues.email.body}
						/>
					</div>
				{:else if activePreset === 'phone'}
					<TextInput
						id="qr-phone"
						label="Phone number"
						type="tel"
						placeholder="+1 (555) 123-4567"
						help="Formatting is normalized into a tap-to-call payload."
						error={fieldErrors.phone}
						autocomplete="tel"
						inputmode="tel"
						bind:value={presetValues.phone.phone}
					/>
				{:else}
					<div class="grid gap-5">
						<TextInput
							id="qr-sms-phone"
							label="Phone number"
							type="tel"
							placeholder="+1 (555) 123-4567"
							help="Recipient number for the SMS payload."
							error={fieldErrors.phone}
							autocomplete="tel"
							inputmode="tel"
							bind:value={presetValues.sms.phone}
						/>
						<TextArea
							id="qr-sms-message"
							label="Message"
							rows={7}
							placeholder="Meet me at the studio at 14:00."
							help="Optional. Message text is URL-encoded inside the SMS payload."
							bind:value={presetValues.sms.message}
						/>
					</div>
				{/if}
			</div>
		</div>

		<div class="surface-panel p-6">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div class="space-y-1">
					<div class="field__label">Advanced</div>
					<div class="field__help">
						Export size, quiet zone, and error correction are optional. Preview stays capped at
						320px.
					</div>
				</div>
				<button
					type="button"
					class={`button-base ${advancedOpen ? 'button-secondary' : 'button-ghost'}`}
					aria-expanded={advancedOpen}
					aria-controls="qr-advanced-controls"
					on:click={() => (advancedOpen = !advancedOpen)}
				>
					{advancedOpen ? 'Hide advanced' : 'Show advanced'}
				</button>
			</div>

			{#if advancedOpen}
				<div id="qr-advanced-controls" class="mt-5 grid gap-5">
					<div class="field">
						<div class="field__label">Export size</div>
						<div class="flex flex-wrap gap-2">
							{#each sizeOptions as option (option)}
								<button
									type="button"
									class={`button-base ${exportSize === option ? 'button-secondary' : 'button-ghost'}`}
									on:click={() => (exportSize = option)}
								>
									{option}px
								</button>
							{/each}
						</div>
						<div class="field__help">
							{previewHint}. This affects exported PNG/SVG output, not the on-page preview.
						</div>
					</div>

					<div class="field">
						<div class="field__label">Quiet zone</div>
						<div class="flex flex-wrap gap-2">
							{#each marginOptions as option (option)}
								<button
									type="button"
									class={`button-base ${margin === option ? 'button-secondary' : 'button-ghost'}`}
									on:click={() => (margin = option)}
								>
									{option}
								</button>
							{/each}
						</div>
						<div class="field__help">
							A larger margin gives scanners more whitespace around the code.
						</div>
					</div>

					<div class="field">
						<div class="field__label">Error correction</div>
						<div class="flex flex-wrap gap-2">
							{#each errorCorrectionOptions as option (option.id)}
								<button
									type="button"
									class={`button-base ${errorCorrectionLevel === option.id ? 'button-secondary' : 'button-ghost'}`}
									on:click={() => (errorCorrectionLevel = option.id)}
								>
									{option.label}
								</button>
							{/each}
						</div>
						<div class="field__help">
							Higher correction is more resilient but reduces maximum payload capacity.
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${renderError ? 'status-error' : 'status-neutral'}`}>
			{statusMessage}
		</div>

		<div class="surface-panel p-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<div class="field__label">Preview</div>
					<div class="field__help">
						Canvas preview uses the same payload and settings as the exports.
					</div>
				</div>
				<div class="flex flex-wrap gap-3">
					<Button variant="secondary" on:click={downloadSvg} disabled={!svgMarkup || !!renderError}>
						Download SVG
					</Button>
					<Button on:click={downloadPng} disabled={!payload || !!renderError}>Download PNG</Button>
				</div>
			</div>

			{#if payload && !renderError}
				<div
					class="mt-6 overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-white p-6"
				>
					<div class="mx-auto w-full max-w-[320px]">
						<canvas bind:this={canvas} class="block h-auto w-full max-w-full"></canvas>
					</div>
				</div>
			{:else if renderError}
				<div class="result-empty mt-6">{renderError}</div>
			{:else}
				<div class="result-empty mt-6">Fill the required fields to generate a QR code preview.</div>
			{/if}
		</div>

		<div class="surface-panel p-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<div class="field__label">Raw payload</div>
					<div class="field__help">
						Useful when you want to verify or reuse the generated payload directly.
					</div>
				</div>
				<CopyButton value={payload} label="Copy payload" />
			</div>

			{#if payload}
				<pre class="mono-surface mt-5 overflow-x-auto p-5">{payload}</pre>
			{:else}
				<div class="result-empty mt-5">The generated payload will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
