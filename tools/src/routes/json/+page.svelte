<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import type { JsonErrorDetails } from '$lib/tools/json';
	import { extractJsonError, formatJson, minifyJson, validateJson } from '$lib/tools/json';

	let input = '{\n  "lab": "recica",\n  "localOnly": true,\n  "tools": 7\n}';
	let output = '';
	let status = 'Choose an action to validate, format, or minify the current input.';
	let tone: 'neutral' | 'success' | 'error' = 'neutral';

	function isJsonErrorDetails(error: unknown): error is JsonErrorDetails {
		return Boolean(
			error &&
				typeof error === 'object' &&
				'message' in error &&
				typeof error.message === 'string'
		);
	}

	function setError(error: unknown) {
		const details = isJsonErrorDetails(error) ? error : extractJsonError(input, error);
		output = '';
		status =
			details.line && details.column
				? `${details.message} Line ${details.line}, column ${details.column}.`
				: details.message;
		tone = 'error';
	}

	function handleValidate() {
		const result = validateJson(input);
		if (!result.ok) {
			setError(result.error);
			return;
		}

		output = '';
		status = 'JSON is valid.';
		tone = 'success';
	}

	function handleFormat() {
		try {
			output = formatJson(input);
			status = 'Formatted output ready.';
			tone = 'success';
		} catch (error) {
			setError(error);
		}
	}

	function handleMinify() {
		try {
			output = minifyJson(input);
			status = 'Minified output ready.';
			tone = 'success';
		} catch (error) {
			setError(error);
		}
	}
</script>

<ToolShell
	title="JSON Formatter / Validator"
	seoTitle="Free JSON Formatter / Validator"
	description="Free JSON formatter and validator with native parsing, local processing, and clear inline feedback."
	split
	tips={[
		'Validate leaves the output panel empty and only confirms syntax.',
		'Format and Minify both preserve the original input until you choose an action.',
		'Comments and JSON5 syntax are intentionally out of scope.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="json-input"
			label="Raw JSON"
			rows={18}
			mono
			help="Input is treated as strict JSON only."
			bind:value={input}
		/>

		<div class="mt-5 flex flex-wrap gap-3">
			<Button on:click={handleValidate}>Validate</Button>
			<Button variant="secondary" on:click={handleFormat}>Format</Button>
			<Button variant="ghost" on:click={handleMinify}>Minify</Button>
		</div>
	</div>

	<div class="space-y-4">
		<div
			class={`status-pill ${tone === 'success' ? 'status-success' : tone === 'error' ? 'status-error' : 'status-neutral'}`}
		>
			{status}
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Output</div>
					<div class="field__help">Formatted JSON is rendered as plain text only.</div>
				</div>
				<CopyButton value={output} />
			</div>

			{#if output}
				<pre class="mono-surface mt-5 overflow-x-auto p-5">{output}</pre>
			{:else}
				<div class="result-empty mt-5">Formatted or minified JSON will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
