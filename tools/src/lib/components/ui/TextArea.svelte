<script lang="ts">
	export let id = '';
	export let label = '';
	export let value = '';
	export let placeholder = '';
	export let help = '';
	export let error: string | undefined = undefined;
	export let rows = 8;
	export let mono = false;
</script>

<label class="field" for={id}>
	{#if label}
		<span class="field__label">{label}</span>
	{/if}
	<textarea
		{id}
		class={`input-base textarea-base ${mono ? 'mono' : ''}`}
		bind:value
		on:input
		on:change
		{placeholder}
		{rows}
	></textarea>
	{#if error}
		<span class="field__error">{error}</span>
	{:else if help}
		<span class="field__help">{help}</span>
	{/if}
</label>
