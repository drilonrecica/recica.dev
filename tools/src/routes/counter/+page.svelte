<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { countText } from '$lib/tools/counter';

	let input = 'Recica Tools keeps practical browser utilities local and fast.';
	$: counts = countText(input);
</script>

<ToolShell
	title="Word / Character Counter"
	description="Count words, characters, lines, paragraphs, and reading time locally as you write."
	split
	tips={[
		'Counts update immediately as you type or paste.',
		'Characters without spaces remove all whitespace characters, not just ASCII spaces.',
		'Reading time uses a simple 200-word-per-minute estimate.'
	]}
>
	<div class="surface-panel p-6">
		<TextArea
			id="counter-input"
			label="Source text"
			rows={18}
			help="Paste or type any text block."
			bind:value={input}
		/>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		{#each [['Characters', counts.characters], ['No spaces', counts.charactersNoSpaces], ['Words', counts.words], ['Lines', counts.lines], ['Paragraphs', counts.paragraphs], ['Reading time', counts.readingMinutes ? `${counts.readingMinutes} min` : '0 min']] as metric (metric[0])}
			<div class="surface-panel p-5">
				<div class="field__label">{metric[0]}</div>
				<div class="mt-3 font-mono text-2xl text-[var(--text)]">{metric[1]}</div>
			</div>
		{/each}
	</div>
</ToolShell>
