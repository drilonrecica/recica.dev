<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { slugify } from '$lib/tools/slug';
	import { checkToolInputLimit } from '$lib/utils/input-policy';
	import { onDestroy } from 'svelte';

	let input = '';
	let debouncedInput = '';
	let output = '';
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	$: limit = checkToolInputLimit('slug', [debouncedInput]);

	function scheduleSlugUpdate() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			debouncedInput = input;
			const limit = checkToolInputLimit('slug', [input]);
			output = limit.ok ? slugify(input) : '';
		}, 140);
	}

	onDestroy(() => {
		clearTimeout(debounceTimer);
	});
</script>

<ToolShell
	title="Slug Generator"
	description="Generate clean lowercase slugs with Unicode normalization, diacritic stripping, and collapsed separators."
	tips={[
		'Numbers are preserved by default.',
		'Repeated punctuation and spaces collapse into a single hyphen.',
		'The generated slug updates after a short debounce.'
	]}
>
	<div class="space-y-6">
		<div class="surface-panel p-6">
			<TextInput
				id="slug-input"
				label="Source title"
				error={limit.ok ? undefined : limit.message}
				placeholder="Recica Tools: JSON Formatter / Validator"
				help="Normalization happens locally and immediately."
				bind:value={input}
				on:input={scheduleSlugUpdate}
			/>
		</div>

		<div class="surface-panel p-6">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="field__label">Slug</div>
					<div class="field__help">Lowercase output with trimmed edges and collapsed hyphens.</div>
				</div>
				<CopyButton value={output} />
			</div>

			{#if !limit.ok}
				<div class="status-pill status-error mt-5" role="alert" aria-live="assertive">
					{limit.message}
				</div>
			{:else if debouncedInput && output}
				<div class="mono-surface mt-5 overflow-x-auto p-5">{output}</div>
			{:else}
				<div class="result-empty mt-5">Enter a title to generate a slug.</div>
			{/if}
		</div>
	</div>
</ToolShell>
