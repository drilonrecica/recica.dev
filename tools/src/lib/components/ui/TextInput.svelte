<script lang="ts">
	export let id = '';
	export let label = '';
	export let value = '';
	export let type = 'text';
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
</script>

<label class="field" for={id}>
	{#if label}
		<span class="field__label">{label}</span>
	{/if}
	<input
		{id}
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
	/>
	{#if error}
		<span class="field__error">{error}</span>
	{:else if help}
		<span class="field__help">{help}</span>
	{/if}
</label>
