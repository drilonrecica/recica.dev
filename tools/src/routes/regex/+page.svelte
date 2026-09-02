<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { evaluateRegex } from '$lib/tools/regex';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let pattern = $state('(json)');
	let flags = $state('gi');
	let source = $state('JSON formatter\njson validator');
	let replacement = $state('<$1>');

	const limit = $derived(checkToolInputLimit('regex', [source]));
	const result = $derived(
		limit.ok
			? evaluateRegex(pattern, flags, source, replacement)
			: ({ ok: false, error: limit.message } as const)
	);
	const patternError = $derived(
		limit.ok && !result.ok && !result.error.toLowerCase().includes('flag')
			? result.error
			: undefined
	);
	const flagsError = $derived(
		limit.ok && !result.ok && result.error.toLowerCase().includes('flag') ? result.error : undefined
	);
	const matchList = $derived(
		result.ok
			? result.matches
					.map(
						(match, index) =>
							`Match ${index + 1} · ${match.index}-${match.end}\n${match.text}${match.groups.length ? `\nGroups: ${match.groups.join(' · ')}` : ''}`
					)
					.join('\n\n')
			: ''
	);

	onMount(() =>
		setupToolPage({
			toolId: 'regex',
			onHandoff: (value) => {
				source = value;
			},
			shortcuts: [
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear test text',
					handler: () => {
						source = '';
					}
				}
			]
		})
	);
</script>

<Workbench
	title="Regex Tester"
	description="Test ECMAScript regular expressions locally with flags, match results, capture groups, and replace preview."
	split
	tips={[
		'This tool uses standard JavaScript RegExp behavior.',
		'Replace preview follows normal JS replacement semantics.',
		'Invalid patterns fail inline without changing your source text.'
	]}
>
	<div class="workbench__pane">
		<div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
			<TextInput
				id="regex-pattern"
				label="Pattern"
				mono
				error={patternError}
				bind:value={pattern}
			/>
			<TextInput
				id="regex-flags"
				label="Flags"
				mono
				error={flagsError}
				help="g i m s u y"
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
		<CodeField
			id="regex-source"
			label="Test text"
			bind:value={source}
			rows={12}
			maxBytes={1024 * 1024}
			accept=".txt,text/plain"
			help="Results update as you edit the pattern, flags, and text."
			error={limit.ok ? undefined : limit.message}
		/>
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="regex-replaced"
			label="Replace preview"
			value={result.ok ? result.replaced : ''}
			empty="Fix the pattern to preview replacements."
			filename="replaced.txt"
			from="regex"
		/>
		<OutputPane
			id="regex-matches"
			label="Matches"
			value={matchList}
			empty={result.ok
				? 'No matches found for the current pattern.'
				: 'Match details will appear here.'}
			filename="matches.txt"
			gutter={false}
			wrap
		/>
	</div>

	{#snippet status()}
		<StatusLine
			tone={result.ok ? (result.matches.length ? 'ok' : 'idle') : 'error'}
			message={result.ok
				? `${result.matches.length} match${result.matches.length === 1 ? '' : 'es'} found.`
				: result.error}
			input={source}
		/>
	{/snippet}
</Workbench>
