<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { evaluateRegex } from '$lib/tools/regex';

	let pattern = '(json)';
	let flags = 'gi';
	let source = 'JSON formatter\njson validator';
	let replacement = '<$1>';

	$: result = evaluateRegex(pattern, flags, source, replacement);
</script>

<ToolShell
	title="Regex Tester"
	description="Test ECMAScript regular expressions locally with flags, match results, capture groups, and replace preview."
	split
	tips={[
		'This tool uses standard JavaScript RegExp behavior.',
		'Replace preview follows normal JS replacement semantics.',
		'Invalid patterns fail inline without changing your source text.'
	]}
>
	<div class="surface-panel p-6">
		<div class="grid gap-4">
			<div class="grid gap-4 sm:grid-cols-2">
				<TextInput id="regex-pattern" label="Pattern" mono bind:value={pattern} />
				<TextInput
					id="regex-flags"
					label="Flags"
					mono
					help="Common flags: g i m s u y"
					bind:value={flags}
				/>
			</div>

			<TextInput
				id="regex-replacement"
				label="Replacement"
				mono
				help="Used only for the replace preview."
				bind:value={replacement}
			/>

			<TextArea
				id="regex-source"
				label="Test text"
				rows={14}
				mono
				help="Results update as you edit the pattern, flags, and text."
				bind:value={source}
			/>
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${result.ok ? 'status-neutral' : 'status-error'}`}>
			{#if result.ok}
				{result.matches.length} match{result.matches.length === 1 ? '' : 'es'} found.
			{:else}
				{result.error}
			{/if}
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Replace Preview</div>
					<div class="field__help">Preview only. The source text is not overwritten.</div>
				</div>
				<CopyButton value={result.ok ? result.replaced : ''} />
			</div>

			{#if result.ok}
				<pre class="mono-surface mt-5 overflow-x-auto p-5">{result.replaced}</pre>
			{:else}
				<div class="result-empty mt-5">Fix the pattern to preview replacements.</div>
			{/if}
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Matches</div>
			{#if result.ok && result.matches.length}
				<div class="mt-5 grid gap-4">
					{#each result.matches as match, index (`${match.index}-${match.end}-${index}`)}
						<div
							class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
						>
							<div class="tool-code">Match {index + 1} · {match.index}-{match.end}</div>
							<div class="mt-2 font-mono text-sm text-[var(--text)]">{match.text}</div>
							{#if match.groups.length}
								<div class="mt-3 text-sm text-[var(--text-secondary)]">
									Groups: {match.groups.join(' · ')}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{:else if result.ok}
				<div class="result-empty mt-5">No matches found for the current pattern.</div>
			{:else}
				<div class="result-empty mt-5">Match details will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
