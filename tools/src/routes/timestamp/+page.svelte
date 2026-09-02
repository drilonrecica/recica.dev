<script lang="ts">
	import { onMount } from 'svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import type { ParsedTimeResult, TimestampUnit, TimezoneMode } from '$lib/tools/timestamp';
	import {
		formatLocalDisplay,
		parseDateTimeInput,
		parseTimestampInput,
		toDateTimeInputValue
	} from '$lib/tools/timestamp';
	import { copyText } from '$lib/utils/clipboard';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	let mode = $state<'timestamp' | 'date'>('timestamp');
	let timestampInput = $state('');
	let unit = $state<TimestampUnit>('auto');
	let timezone = $state<TimezoneMode>('local');
	let dateInput = $state('');
	let result = $state<ParsedTimeResult | null>(null);
	let error = $state('');

	function convert() {
		const parsed =
			mode === 'timestamp'
				? parseTimestampInput(timestampInput, unit)
				: parseDateTimeInput(dateInput, timezone);
		if (!parsed.ok) {
			error = parsed.error;
			result = null;
			return;
		}
		error = '';
		result = parsed.value;
	}

	function fillNow() {
		const now = new Date();
		if (mode === 'timestamp') {
			timestampInput = String(Math.trunc(now.getTime() / 1000));
			unit = 'seconds';
		} else {
			dateInput = toDateTimeInputValue(now, timezone);
		}
		convert();
	}

	function setTimezone(next: TimezoneMode) {
		timezone = next;
		if (mode === 'date') dateInput = toDateTimeInputValue(result?.date ?? new Date(), next);
	}

	function setMode(next: 'timestamp' | 'date') {
		mode = next;
		if (next === 'date' && !dateInput) {
			dateInput = toDateTimeInputValue(result?.date ?? new Date(), timezone);
		}
	}

	const summary = $derived(
		result
			? [
					`Local        ${formatLocalDisplay(result.date)}`,
					`UTC / ISO    ${result.utcIso}`,
					`Seconds      ${result.seconds}`,
					`Milliseconds ${result.milliseconds}`
				].join('\n')
			: ''
	);

	onMount(() =>
		setupToolPage({
			toolId: 'timestamp',
			onHandoff: (value) => {
				mode = 'timestamp';
				timestampInput = value;
				convert();
			},
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Convert', handler: convert },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy ISO value',
					handler: () => void copyText(result?.utcIso ?? '')
				}
			]
		})
	);
</script>

<Workbench
	title="Timestamp Converter"
	description="Convert cleanly between Unix timestamps, local wall time, and UTC without pulling in a date library."
	split
	tips={[
		'MVP supports Local and UTC only.',
		'Timestamp mode auto-detects seconds vs milliseconds unless you override it.',
		'Date mode uses the selected timezone when interpreting the input value.'
	]}
>
	{#snippet actions()}
		<div class="seg" role="group" aria-label="Conversion mode">
			<button type="button" aria-pressed={mode === 'timestamp'} onclick={() => setMode('timestamp')}
				>Timestamp → Date</button
			>
			<button type="button" aria-pressed={mode === 'date'} onclick={() => setMode('date')}
				>Date → Timestamp</button
			>
		</div>
		<button type="button" class="button-base button-primary" onclick={convert}>Convert</button>
		<button type="button" class="button-base button-ghost" onclick={fillNow}>Now</button>
	{/snippet}

	<div class="workbench__pane">
		{#if mode === 'timestamp'}
			<TextInput
				id="timestamp-input"
				label="Unix timestamp"
				error={error || undefined}
				placeholder="1715342400"
				help="Only whole-number timestamps are accepted."
				mono
				bind:value={timestampInput}
			/>
			<div class="field">
				<div class="field__label">Unit</div>
				<div class="seg" role="group" aria-label="Unit">
					{#each ['auto', 'seconds', 'milliseconds'] as option (option)}
						<button
							type="button"
							aria-pressed={unit === option}
							onclick={() => (unit = option as TimestampUnit)}>{option}</button
						>
					{/each}
				</div>
			</div>
		{:else}
			<TextInput
				id="date-input"
				label={`Date and time (${timezone.toUpperCase()})`}
				error={error || undefined}
				type="datetime-local"
				help="Choose a wall-clock value and convert it with the selected timezone."
				bind:value={dateInput}
			/>
			<div class="field">
				<div class="field__label">Timezone</div>
				<div class="seg" role="group" aria-label="Timezone">
					<button
						type="button"
						aria-pressed={timezone === 'local'}
						onclick={() => setTimezone('local')}>Local</button
					>
					<button type="button" aria-pressed={timezone === 'utc'} onclick={() => setTimezone('utc')}
						>UTC</button
					>
				</div>
			</div>
		{/if}
	</div>

	<div class="workbench__pane">
		{#if result}
			<dl class="metrics" aria-label="Converted values">
				<div>
					<dt>Local</dt>
					<dd class="text-sm">{formatLocalDisplay(result.date)}</dd>
				</div>
				<div>
					<dt>Seconds</dt>
					<dd class="text-sm">{result.seconds}</dd>
				</div>
				<div>
					<dt>Milliseconds</dt>
					<dd class="text-sm">{result.milliseconds}</dd>
				</div>
			</dl>
			<OutputPane
				id="timestamp-iso"
				label="UTC / ISO"
				value={result.utcIso}
				filename="timestamp.txt"
				gutter={false}
				wrap
				from="timestamp"
			/>
			<OutputPane
				id="timestamp-summary"
				label="Summary"
				value={summary}
				filename="timestamp-summary.txt"
				gutter={false}
				wrap
			/>
		{:else}
			<div class="result-empty">Converted values will appear here.</div>
		{/if}
	</div>

	{#snippet status()}
		<StatusLine
			tone={error ? 'error' : result ? 'ok' : 'idle'}
			message={error ||
				(result ? `Resolved from ${result.unit}.` : 'Choose a mode, enter a value, then convert.')}
		/>
	{/snippet}
</Workbench>
