<script lang="ts">
	import { countLines } from '$lib/workbench/diagnostics';
	import { formatDuration } from '$lib/workbench/live';
	import { formatByteSize, utf8ByteLength } from '$lib/utils/input-policy';

	type Tone = 'idle' | 'ok' | 'error' | 'warn';

	let {
		tone = 'idle',
		message = '',
		input = '',
		durationMs = null,
		cells = [],
		hint = ''
	}: {
		tone?: Tone;
		message?: string;
		input?: string;
		durationMs?: number | null;
		cells?: Array<{ label: string; value: string }>;
		hint?: string;
	} = $props();

	const bytes = $derived(utf8ByteLength(input));
	const lines = $derived(input ? countLines(input) : 0);
	const duration = $derived(formatDuration(durationMs));
</script>

<div class="statusline" data-tone={tone} role="status" aria-live="polite" aria-atomic="true">
	<span class="statusline__msg">{message}</span>
	{#if input}
		<span class="statusline__cell"><b>{lines}</b> {lines === 1 ? 'line' : 'lines'}</span>
		<span class="statusline__cell"><b>{formatByteSize(bytes)}</b></span>
	{/if}
	{#each cells as cell (cell.label)}
		<span class="statusline__cell">{cell.label} <b>{cell.value}</b></span>
	{/each}
	{#if duration}
		<span class="statusline__cell">ran in <b>{duration}</b></span>
	{/if}
	<span class="statusline__cell">local only</span>
	{#if hint}
		<span class="statusline__cell hidden md:inline" aria-hidden="true">{hint}</span>
	{/if}
</div>
