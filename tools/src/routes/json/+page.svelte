<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import type { JsonErrorDetails } from '$lib/tools/json';
	import { extractJsonError, formatJson, minifyJson, validateJson } from '$lib/tools/json';
	import { copyText } from '$lib/utils/clipboard';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import {
		diagnosticFromParts,
		positionFromIndex,
		type Diagnostic
	} from '$lib/workbench/diagnostics';
	import { findJsonErrorPosition } from '$lib/workbench/json-position';
	import { createDebounced, timed } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	type Mode = 'format' | 'minify';
	type Tone = 'idle' | 'ok' | 'error';

	let input = $state('{\n  "lab": "recica",\n  "localOnly": true,\n  "tools": 7\n}');
	let output = $state('');
	let mode = $state<Mode>('format');
	let message = $state('Paste JSON. Output updates as you type.');
	let tone = $state<Tone>('idle');
	let fieldError = $state<string | undefined>(undefined);
	let diagnostics = $state<Diagnostic[]>([]);
	let durationMs = $state<number | null>(null);

	function isJsonErrorDetails(error: unknown): error is JsonErrorDetails {
		return Boolean(
			error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
		);
	}

	function reportError(error: unknown) {
		const details = isJsonErrorDetails(error) ? error : extractJsonError(input, error);
		if (!details.line || !details.column) {
			// Engines disagree on error positions, so locate it ourselves.
			const located = findJsonErrorPosition(input);
			if (located) {
				const at = positionFromIndex(input, located.index);
				details.line = at.line;
				details.column = at.column;
			}
		}
		const position =
			details.line && details.column ? ` Line ${details.line}, column ${details.column}.` : '';
		output = '';
		message = `${details.message}${position}`;
		fieldError = message;
		tone = 'error';
		const diagnostic = diagnosticFromParts(details.message, details.line, details.column);
		diagnostics = diagnostic ? [diagnostic] : [];
		durationMs = null;
	}

	function run(action: Mode | 'validate') {
		if (!input.trim()) {
			output = '';
			message = 'Paste JSON. Output updates as you type.';
			tone = 'idle';
			fieldError = undefined;
			diagnostics = [];
			durationMs = null;
			return;
		}

		const limit = checkToolInputLimit('json', [input]);
		if (!limit.ok) {
			output = '';
			message = limit.message;
			fieldError = limit.message;
			tone = 'error';
			diagnostics = [];
			durationMs = null;
			return;
		}

		if (action === 'validate') {
			const result = validateJson(input);
			if (!result.ok) {
				reportError(result.error);
				return;
			}
			output = '';
			message = 'JSON is valid.';
			tone = 'ok';
			fieldError = undefined;
			diagnostics = [];
			return;
		}

		try {
			const { result, durationMs: elapsed } = timed(() =>
				action === 'format' ? formatJson(input) : minifyJson(input)
			);
			output = result;
			durationMs = elapsed;
			message = action === 'format' ? 'Formatted output ready.' : 'Minified output ready.';
			tone = 'ok';
			fieldError = undefined;
			diagnostics = [];
		} catch (error) {
			reportError(error);
		}
	}

	const live = createDebounced(() => run(mode), 150);

	function choose(next: Mode) {
		mode = next;
		live.cancel();
		run(next);
	}

	function clearInput() {
		input = '';
		run(mode);
	}

	onMount(() => {
		run(mode);
		const cleanup = setupToolPage({
			toolId: 'json',
			onHandoff: (payload) => {
				input = payload;
				run(mode);
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Run the current mode', handler: () => run(mode) },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy output',
					handler: () => void copyText(output)
				},
				{ keys: STANDARD_SHORTCUTS.clear, label: 'Clear input', handler: clearInput }
			]
		});
		return () => {
			live.cancel();
			cleanup();
		};
	});
</script>

<Workbench
	title="JSON Formatter / Validator"
	seoTitle="Free JSON Formatter / Validator"
	description="Free JSON formatter and validator with native parsing, local processing, and an error marker on the exact line."
	split
	tips={[
		'Output follows the selected mode as you type; Validate only confirms syntax.',
		'A parse error marks the offending line in the gutter and the position in the text.',
		'Comments and JSON5 syntax are intentionally out of scope.'
	]}
>
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Mode">
			<button type="button" aria-pressed={mode === 'format'} onclick={() => choose('format')}>
				Format
			</button>
			<button type="button" aria-pressed={mode === 'minify'} onclick={() => choose('minify')}>
				Minify
			</button>
		</div>
		<button type="button" class="button-base button-ghost" onclick={() => run('validate')}>
			Validate
		</button>
	{/snippet}

	<div class="workbench__pane">
		<CodeField
			id="json-input"
			label="Raw JSON"
			bind:value={input}
			rows={18}
			maxBytes={3 * 1024 * 1024}
			accept=".json,.txt,application/json,text/plain"
			help="Strict JSON only. Drop a .json file or paste from the clipboard."
			error={fieldError}
			{diagnostics}
			oninput={() => live.call()}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="json-output"
			label={mode === 'format' ? 'Formatted' : 'Minified'}
			value={output}
			empty="Formatted or minified JSON will appear here."
			filename={mode === 'format' ? 'formatted.json' : 'minified.json'}
			mime="application/json"
			from="json"
		/>
	</div>

	{#snippet status()}
		<StatusLine
			{tone}
			{message}
			{input}
			{durationMs}
			hint="⌘/Ctrl+Enter runs · ? shows shortcuts"
		/>
	{/snippet}
</Workbench>
