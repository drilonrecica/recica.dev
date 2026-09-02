<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import {
		generatePassword,
		type PasswordOptions,
		validatePasswordOptions
	} from '$lib/tools/password';
	import { copyText } from '$lib/utils/clipboard';
	import { STANDARD_SHORTCUTS, setupToolPage } from '$lib/workbench/page';

	let length = $state(20);
	let uppercase = $state(true);
	let lowercase = $state(true);
	let numbers = $state(true);
	let symbols = $state(true);
	let password = $state('');
	let error = $state('');
	let ready = $state(false);

	const options = $derived({
		length,
		uppercase,
		lowercase,
		numbers,
		symbols
	} satisfies PasswordOptions);

	function refreshPassword() {
		if (!browser) return;
		const validationError = validatePasswordOptions(options);
		if (validationError) {
			error = validationError;
			password = '';
			return;
		}
		error = '';
		password = generatePassword(options);
	}

	$effect(() => {
		// Regenerate whenever any option changes, after mount.
		void options;
		if (ready) refreshPassword();
	});

	onMount(() => {
		ready = true;
		refreshPassword();
		return setupToolPage({
			toolId: 'password',
			shortcuts: [
				{ keys: STANDARD_SHORTCUTS.run, label: 'Regenerate', handler: refreshPassword },
				{
					keys: STANDARD_SHORTCUTS.copy,
					label: 'Copy password',
					handler: () => void copyText(password)
				}
			]
		});
	});
</script>

<Workbench
	title="Password Generator"
	description="Generate strong passwords with secure browser randomness and guaranteed character-set coverage."
	tips={[
		'At least one character set must stay enabled.',
		'Each enabled set is guaranteed to appear at least once in the generated password.',
		'Passwords are generated client-side with crypto.getRandomValues and never stored.'
	]}
>
	{#snippet actions()}
		<button type="button" class="button-base button-primary" onclick={refreshPassword}
			>Regenerate</button
		>
	{/snippet}

	<div class="workbench__pane">
		<div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
			<label class="field">
				<span class="field__label">Length <span class="tool-code">{length}</span></span>
				<input
					aria-label="Password length"
					type="range"
					min="8"
					max="64"
					step="1"
					bind:value={length}
					class="w-full accent-[var(--accent)]"
				/>
			</label>
			<div class="flex flex-wrap gap-2">
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

		<OutputPane
			id="password-output"
			label="Generated Password"
			value={password}
			empty="Enable at least one set to generate a password."
			filename="password.txt"
			gutter={false}
			wrap
			from="password"
			help="Regenerates automatically when the settings change."
		/>
	</div>

	{#snippet status()}
		<StatusLine
			tone={error ? 'error' : password ? 'ok' : 'idle'}
			message={error || `${length}-character password ready. Save it in a password manager.`}
			cells={[
				{
					label: 'sets',
					value: String([uppercase, lowercase, numbers, symbols].filter(Boolean).length)
				}
			]}
		/>
	{/snippet}
</Workbench>
