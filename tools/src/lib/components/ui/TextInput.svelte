<script lang="ts">
	export let id = '';
	export let label = '';
	export let value = '';
	export let type = 'text';
	export let name = '';
	export let placeholder = '';
	export let help = '';
	export let error: string | undefined = undefined;
	export let autocomplete:
		| 'off'
		| 'on'
		| 'name'
		| 'email'
		| 'tel'
		| 'username'
		| 'new-password'
		| 'current-password'
		| 'one-time-code'
		| 'url'
		| undefined = 'off';
	export let inputmode:
		| 'none'
		| 'text'
		| 'tel'
		| 'url'
		| 'email'
		| 'numeric'
		| 'decimal'
		| 'search'
		| undefined = undefined;
	export let spellcheck = false;
	export let mono = false;
	export let readonly = false;

	$: helpId = help && !error ? `${id}-help` : undefined;
	$: errorId = error ? `${id}-error` : undefined;
	$: describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;
</script>

<label class="field" for={id}>
	{#if label}
		<span class="field__label">{label}</span>
	{/if}
	<input
		{id}
		name={name || id}
		class={`input-base ${mono ? 'mono' : ''}`}
		{type}
		bind:value
		on:input
		on:change
		{placeholder}
		{autocomplete}
		{inputmode}
		{spellcheck}
		{readonly}
		aria-describedby={describedBy}
		aria-invalid={error ? 'true' : undefined}
	/>
	{#if error}
		<span class="field__error" id={errorId}>{error}</span>
	{:else if help}
		<span class="field__help" id={helpId}>{help}</span>
	{/if}
</label>
