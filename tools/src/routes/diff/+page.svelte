<script lang="ts">
	import DiffTokens from '$lib/components/tools/DiffTokens.svelte';
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import { buildDiffModel, type DiffLine } from '$lib/tools/diff';
	import { onDestroy } from 'svelte';

	let leftText = '';
	let rightText = '';
	let rows: DiffLine[] = [];
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function scheduleDiffUpdate() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			rows = buildDiffModel(leftText, rightText);
		}, 180);
	}

	$: changedCount = rows.filter((row) => row.kind !== 'context').length;

	onDestroy(() => {
		clearTimeout(debounceTimer);
	});
</script>

<ToolShell
	title="Text Diff Checker"
	description="Compare two text blocks with line-first output and inline highlighting for changed content."
	contentClass="max-w-6xl"
	tips={[
		'Desktop keeps the two inputs side by side; mobile stacks them.',
		'Changed lines get inline highlights while full additions and removals keep separate lanes.',
		'Patch export and merge flow are intentionally out of scope.'
	]}
>
	<div class="space-y-6">
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="surface-panel p-6">
				<TextArea
					id="diff-left"
					label="Original"
					rows={14}
					mono
					placeholder="Paste the original text"
					bind:value={leftText}
					on:input={scheduleDiffUpdate}
				/>
			</div>

			<div class="surface-panel p-6">
				<TextArea
					id="diff-right"
					label="Changed"
					rows={14}
					mono
					placeholder="Paste the updated text"
					bind:value={rightText}
					on:input={scheduleDiffUpdate}
				/>
			</div>
		</div>

		<div class={`status-pill ${changedCount ? 'status-success' : 'status-neutral'}`}>
			{#if leftText || rightText}
				{changedCount} changed line{changedCount === 1 ? '' : 's'} detected.
			{:else}
				Add text on either side to start comparing.
			{/if}
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Diff Result</div>

			{#if rows.length}
				<div class="mt-5 grid gap-3">
					{#each rows as row, index (`${index}-${row.kind}-${row.left}-${row.right}`)}
						<div
							class="grid gap-3 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 lg:grid-cols-2"
						>
							<div class={`${row.kind === 'added' ? 'opacity-45' : ''}`}>
								<div class="tool-code mb-2">left · {index + 1}</div>
								{#if row.kind === 'changed'}
									<DiffTokens tokens={row.leftTokens} side="left" />
								{:else}
									<p
										class="font-mono text-sm leading-7 break-words whitespace-pre-wrap text-[var(--text)]"
									>
										{row.left || ' '}
									</p>
								{/if}
							</div>
							<div class={`${row.kind === 'removed' ? 'opacity-45' : ''}`}>
								<div class="tool-code mb-2">right · {index + 1}</div>
								{#if row.kind === 'changed'}
									<DiffTokens tokens={row.rightTokens} side="right" />
								{:else}
									<p
										class="font-mono text-sm leading-7 break-words whitespace-pre-wrap text-[var(--text)]"
									>
										{row.right || ' '}
									</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="result-empty mt-5">Diff output appears here once one side changes.</div>
			{/if}
		</div>
	</div>
</ToolShell>
