<script lang="ts">
	import { onMount } from 'svelte';
	import DiffTokens from '$lib/components/tools/DiffTokens.svelte';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { buildDiffModel, type DiffLine } from '$lib/tools/diff';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { createDebounced, timed } from '$lib/workbench/live';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	let leftText = $state('');
	let rightText = $state('');
	let rows = $state<DiffLine[]>([]);
	let limitError = $state('');
	let durationMs = $state<number | null>(null);

	function compare() {
		const limit = checkToolInputLimit('diff', [leftText, rightText]);
		if (!limit.ok) {
			rows = [];
			limitError = limit.message;
			durationMs = null;
			return;
		}
		limitError = '';
		const { result, durationMs: elapsed } = timed(() => buildDiffModel(leftText, rightText));
		rows = result;
		durationMs = leftText || rightText ? elapsed : null;
	}

	const live = createDebounced(compare, 180);
	const changedCount = $derived(rows.filter((row) => row.kind !== 'context').length);

	onMount(() => {
		const cleanup = setupToolPage({
			toolId: 'diff',
			onHandoff: (value) => {
				leftText = value;
				compare();
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Compare now', handler: compare },
				{
					keys: STANDARD_SHORTCUTS.clear,
					label: 'Clear both sides',
					handler: () => {
						leftText = '';
						rightText = '';
						compare();
					}
				}
			]
		});
		return () => {
			live.cancel();
			cleanup();
		};
	});
</script>

<Workbench
	title="Text Diff Checker"
	description="Compare two text blocks with line-first output and inline highlighting for changed content."
	split
	tips={[
		'Desktop keeps the two inputs side by side; mobile stacks them.',
		'Changed lines get inline highlights while full additions and removals keep separate lanes.',
		'Patch export and merge flow are intentionally out of scope.'
	]}
>
	<div class="workbench__pane">
		<CodeField
			id="diff-left"
			label="Original"
			bind:value={leftText}
			rows={14}
			maxBytes={512 * 1024}
			accept=".txt,.md,.json,.js,.ts,.css,.html,text/plain"
			placeholder="Paste the original text"
			error={limitError || undefined}
			oninput={() => live.call()}
		/>
	</div>
	<div class="workbench__pane">
		<CodeField
			id="diff-right"
			label="Changed"
			bind:value={rightText}
			rows={14}
			maxBytes={512 * 1024}
			accept=".txt,.md,.json,.js,.ts,.css,.html,text/plain"
			placeholder="Paste the updated text"
			error={limitError || undefined}
			oninput={() => live.call()}
		/>
	</div>

	<div class="lg:col-span-2">
		<div class="codefield__bar"><div class="field__label">Diff result</div></div>
		{#if rows.length}
			<ol class="rows diff" aria-label="Diff rows">
				{#each rows as row, index (`${index}-${row.kind}-${row.left}-${row.right}`)}
					<li data-kind={row.kind}>
						<span class="rows__line">{index + 1}</span>
						<span class="rows__kind">{row.kind === 'context' ? '' : row.kind}</span>
						<span class="diff__sides">
							<span
								class="diff__side"
								data-side="left"
								data-empty={row.kind === 'added' ? 'true' : undefined}
							>
								{#if row.kind === 'changed'}
									<DiffTokens tokens={row.leftTokens} side="left" />
								{:else}
									<span class="rows__value">{row.left || ' '}</span>
								{/if}
							</span>
							<span
								class="diff__side"
								data-side="right"
								data-empty={row.kind === 'removed' ? 'true' : undefined}
							>
								{#if row.kind === 'changed'}
									<DiffTokens tokens={row.rightTokens} side="right" />
								{:else}
									<span class="rows__value">{row.right || ' '}</span>
								{/if}
							</span>
						</span>
					</li>
				{/each}
			</ol>
		{:else}
			<div class="result-empty">Diff output appears here once one side changes.</div>
		{/if}
	</div>

	{#snippet status()}
		<StatusLine
			tone={limitError ? 'error' : changedCount ? 'ok' : 'idle'}
			message={limitError
				? limitError
				: leftText || rightText
					? `${changedCount} changed line${changedCount === 1 ? '' : 's'} detected.`
					: 'Add text on either side to start comparing.'}
			input={leftText + rightText}
			{durationMs}
		/>
	{/snippet}
</Workbench>
