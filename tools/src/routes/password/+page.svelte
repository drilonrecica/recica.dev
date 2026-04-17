<script lang="ts">
	import { browser } from '$app/environment';
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import {
		generatePassword,
		type PasswordOptions,
		validatePasswordOptions
	} from '$lib/tools/password';

	let length = 20;
	let uppercase = true;
	let lowercase = true;
	let numbers = true;
	let symbols = true;
	let password = '';
	let error = '';

	$: options = { length, uppercase, lowercase, numbers, symbols } satisfies PasswordOptions;

	function refreshPassword() {
		if (!browser) return;
		password = generatePassword(options);
	}

	$: if (browser && options) {
		const validationError = validatePasswordOptions(options);

		if (validationError) {
			error = validationError;
			password = '';
		} else {
			error = '';
			password = generatePassword(options);
		}
	}
</script>

<ToolShell
	title="Password Generator"
	description="Generate strong passwords with secure browser randomness and guaranteed character-set coverage."
	tips={[
		'At least one character set must stay enabled.',
		'Each enabled set is guaranteed to appear at least once in the generated password.',
		'Passwords are generated client-side with crypto.getRandomValues.'
	]}
>
	<div class="space-y-6">
		<div class="surface-panel p-6">
			<div class="grid gap-5">
				<div class="space-y-3">
					<div class="flex items-center justify-between gap-4">
						<div>
							<div class="field__label">Length</div>
							<div class="field__help">Adjust the slider to regenerate instantly.</div>
						</div>
						<div class="tool-code text-base">{length}</div>
					</div>
					<input
						aria-label="Password length"
						type="range"
						min="8"
						max="64"
						step="1"
						bind:value={length}
						class="w-full accent-[var(--primary)]"
					/>
				</div>

				<div class="grid gap-3 sm:grid-cols-2">
					<Toggle
						checked={uppercase}
						label="Uppercase"
						hint="A-Z"
						on:change={(event) => (uppercase = event.detail)}
					/>
					<Toggle
						checked={lowercase}
						label="Lowercase"
						hint="a-z"
						on:change={(event) => (lowercase = event.detail)}
					/>
					<Toggle
						checked={numbers}
						label="Numbers"
						hint="0-9"
						on:change={(event) => (numbers = event.detail)}
					/>
					<Toggle
						checked={symbols}
						label="Symbols"
						hint="!#$"
						on:change={(event) => (symbols = event.detail)}
					/>
				</div>
			</div>
		</div>

		<div class="surface-panel p-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<div class="field__label">Generated Password</div>
					<div class="field__help">Regenerates automatically when the settings change.</div>
				</div>
				<div class="flex flex-wrap gap-2">
					<Button variant="secondary" on:click={refreshPassword}>Regenerate</Button>
					<CopyButton value={password} />
				</div>
			</div>

			{#if error}
				<div class="status-pill status-error mt-5">{error}</div>
			{:else}
				<div class="mono-surface mt-5 overflow-x-auto p-5 text-base">{password}</div>
			{/if}
		</div>
	</div>
</ToolShell>
