<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
	export let disabled = false;
	export let block = false;
	export let ariaLabel: string | undefined = undefined;

	$: variantClass =
		variant === 'primary'
			? 'button-primary'
			: variant === 'secondary'
				? 'button-secondary'
				: variant === 'danger'
					? 'button-danger'
					: 'button-ghost';
</script>

<button
	{type}
	class={`button-base ${variantClass} ${block ? 'w-full' : ''}`}
	{disabled}
	aria-label={ariaLabel}
	on:click
>
	<slot />
</button>
