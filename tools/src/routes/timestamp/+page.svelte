<script lang="ts">
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import type { ParsedTimeResult, TimestampUnit, TimezoneMode } from '$lib/tools/timestamp';
	import {
		formatLocalDisplay,
		parseDateTimeInput,
		parseTimestampInput,
		toDateTimeInputValue
	} from '$lib/tools/timestamp';

	let mode: 'timestamp' | 'date' = 'timestamp';
	let timestampInput = '';
	let unit: TimestampUnit = 'auto';
	let timezone: TimezoneMode = 'local';
	let dateInput = '';
	let result: ParsedTimeResult | null = null;
	let error = '';

	function convert() {
		if (mode === 'timestamp') {
			const parsed = parseTimestampInput(timestampInput, unit);
			if (!parsed.ok) {
				error = parsed.error;
				result = null;
				return;
			}

			error = '';
			result = parsed.value;
			return;
		}

		const parsed = parseDateTimeInput(dateInput, timezone);
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

		if (mode === 'date') {
			dateInput = toDateTimeInputValue(result?.date ?? new Date(), next);
		}
	}
</script>

<ToolShell
	title="Timestamp Converter"
	description="Convert cleanly between Unix timestamps, local wall time, and UTC without pulling in a date library."
	split
	tips={[
		'MVP supports Local and UTC only.',
		'Timestamp mode auto-detects seconds vs milliseconds unless you override it.',
		'Date mode uses the selected timezone when interpreting the input value.'
	]}
>
	<div class="surface-panel p-6">
		<div class="space-y-5">
			<div class="field">
				<div class="field__label">Conversion mode</div>
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						class={`button-base ${mode === 'timestamp' ? 'button-secondary' : 'button-ghost'}`}
						on:click={() => (mode = 'timestamp')}
					>
						Timestamp → Date
					</button>
					<button
						type="button"
						class={`button-base ${mode === 'date' ? 'button-secondary' : 'button-ghost'}`}
						on:click={() => {
							mode = 'date';
							if (!dateInput) {
								dateInput = toDateTimeInputValue(result?.date ?? new Date(), timezone);
							}
						}}
					>
						Date → Timestamp
					</button>
				</div>
			</div>

			{#if mode === 'timestamp'}
				<TextInput
					id="timestamp-input"
					label="Unix timestamp"
					placeholder="1715342400"
					help="Only whole-number timestamps are accepted."
					mono
					bind:value={timestampInput}
				/>

				<div class="field">
					<div class="field__label">Unit</div>
					<div class="flex flex-wrap gap-2">
						{#each ['auto', 'seconds', 'milliseconds'] as option (option)}
							<button
								type="button"
								class={`button-base ${unit === option ? 'button-secondary' : 'button-ghost'}`}
								on:click={() => (unit = option as TimestampUnit)}
							>
								{option}
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<TextInput
					id="date-input"
					label={`Date and time (${timezone.toUpperCase()})`}
					type="datetime-local"
					help="Choose a wall-clock value and convert it with the selected timezone."
					bind:value={dateInput}
				/>

				<div class="field">
					<div class="field__label">Timezone</div>
					<div class="flex flex-wrap gap-2">
						<button
							type="button"
							class={`button-base ${timezone === 'local' ? 'button-secondary' : 'button-ghost'}`}
							on:click={() => setTimezone('local')}
						>
							Local
						</button>
						<button
							type="button"
							class={`button-base ${timezone === 'utc' ? 'button-secondary' : 'button-ghost'}`}
							on:click={() => setTimezone('utc')}
						>
							UTC
						</button>
					</div>
				</div>
			{/if}

			<div class="flex flex-wrap gap-3">
				<Button on:click={convert}>Convert</Button>
				<Button variant="ghost" on:click={fillNow}>Now</Button>
			</div>
		</div>
	</div>

	<div class="space-y-4">
		<div class={`status-pill ${error ? 'status-error' : 'status-neutral'}`}>
			{#if error}
				{error}
			{:else if result}
				Resolved from {result.unit}.
			{:else}
				Choose a mode, enter a value, then convert.
			{/if}
		</div>

		<div class="surface-panel p-6">
			<div class="field__label">Result</div>

			{#if result}
				<div class="mt-5 grid gap-4">
					<div
						class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
					>
						<div class="tool-code">Local</div>
						<div class="mt-2 text-sm leading-7 text-[var(--text)]">
							{formatLocalDisplay(result.date)}
						</div>
					</div>

					<div
						class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
					>
						<div class="flex items-center justify-between gap-3">
							<div class="tool-code">UTC / ISO</div>
							<CopyButton value={result.utcIso} />
						</div>
						<div class="mt-2 font-mono text-sm leading-7 text-[var(--text)]">{result.utcIso}</div>
					</div>

					<div class="grid gap-4 lg:grid-cols-2">
						<div
							class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
						>
							<div class="flex items-center justify-between gap-3">
								<div class="tool-code">Unix Seconds</div>
								<CopyButton value={String(result.seconds)} />
							</div>
							<div class="mt-2 font-mono text-sm leading-7 text-[var(--text)]">
								{result.seconds}
							</div>
						</div>

						<div
							class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
						>
							<div class="flex items-center justify-between gap-3">
								<div class="tool-code">Unix Milliseconds</div>
								<CopyButton value={String(result.milliseconds)} />
							</div>
							<div class="mt-2 font-mono text-sm leading-7 text-[var(--text)]">
								{result.milliseconds}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="result-empty mt-5">Converted values will appear here.</div>
			{/if}
		</div>
	</div>
</ToolShell>
