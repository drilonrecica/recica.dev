<script lang="ts">
	import { onMount } from 'svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { countText } from '$lib/tools/counter';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { setupToolPage, STANDARD_SHORTCUTS } from '$lib/workbench/page';

	let input = $state('Recica Tools keeps practical browser utilities local and fast.');
	const limit = $derived(checkToolInputLimit('counter', [input]));
	const counts = $derived(countText(limit.ok ? input : ''));
	const metrics = $derived([
		{ key: 'characters', label: 'Characters', value: String(counts.characters) },
		{ key: 'no-spaces', label: 'No spaces', value: String(counts.charactersNoSpaces) },
		{ key: 'words', label: 'Words', value: String(counts.words) },
		{ key: 'lines', label: 'Lines', value: String(counts.lines) },
		{ key: 'paragraphs', label: 'Paragraphs', value: String(counts.paragraphs) },
		{
			key: 'reading-time',
			label: 'Reading time',
			value: counts.readingMinutes ? `${counts.readingMinutes} min` : '0 min'
		}
	]);

	onMount(() =>
		setupToolPage({
			toolId: 'counter',
			onHandoff: (payload) => {
				input = payload;
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
	title="Word / Character Counter"
	description="Count words, characters, lines, paragraphs, and reading time locally as you write."
	split
	tips={[
		'Counts update immediately as you type or paste.',
		'Characters without spaces remove all whitespace characters, not just ASCII spaces.',
		'Reading time uses a simple 200-word-per-minute estimate.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="counter-input"
			label="Source text"
			bind:value={input}
			rows={18}
			maxBytes={1024 * 1024}
			accept=".txt,.md,text/plain,text/markdown"
			help="Paste or type any text block."
			error={limit.ok ? undefined : limit.message}
			wrap
		/>
	</div>

	<div class="workbench__pane">
		<div class="codefield__bar"><div class="field__label">Metrics</div></div>
		<dl class="metrics">
			{#each metrics as metric (metric.key)}
				<div data-metric={metric.key}>
					<dt>{metric.label}</dt>
					<dd>{metric.value}</dd>
				</div>
			{/each}
		</dl>
	</div>

	{#snippet status()}
		<StatusLine
			tone={limit.ok ? 'ok' : 'error'}
			message={limit.ok ? 'Counts update as you type.' : limit.message}
			{input}
		/>
	{/snippet}
</Workbench>
