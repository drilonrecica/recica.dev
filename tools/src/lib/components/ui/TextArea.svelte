<script lang="ts">
	export let id = '';
	export let label = '';
	export let name = '';
	export let value = '';
	export let placeholder = '';
	export let help = '';
	export let error: string | undefined = undefined;
	export let rows = 8;
	export let mono = false;

	$: helpId = help && !error ? `${id}-help` : undefined;
	$: errorId = error ? `${id}-error` : undefined;
	$: describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;
</script>

<label class="field" for={id}>
	{#if label}
		<span class="field__label">{label}</span>
	{/if}
	<textarea
		{id}
		name={name || id}
		class={`input-base textarea-base ${mono ? 'mono' : ''}`}
		bind:value
		on:input
		on:change
		{placeholder}
		{rows}
		aria-describedby={describedBy}
		aria-invalid={error ? 'true' : undefined}
	></textarea>
	{#if error}
		<span class="field__error" id={errorId}>{error}</span>
	{:else if help}
		<span class="field__help" id={helpId}>{help}</span>
	{/if}
</label>
