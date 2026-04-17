<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked = false;
	export let label = '';
	export let hint = '';
	export let disabled = false;

	const dispatch = createEventDispatcher<{ change: boolean }>();

	function toggle() {
		if (disabled) return;
		dispatch('change', !checked);
	}
</script>

<button
	type="button"
	class={`toggle-chip ${checked ? 'toggle-chip--active' : ''}`}
	aria-pressed={checked}
	{disabled}
	on:click={toggle}
>
	<span>{label}</span>
	{#if hint}
		<span class="tool-code">{hint}</span>
	{/if}
</button>
