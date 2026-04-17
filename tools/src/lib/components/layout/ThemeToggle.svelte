<script lang="ts">
	import { theme } from '$lib/theme/theme';
</script>

<button
	type="button"
	class="button-base button-ghost min-w-[7.5rem]"
	on:click={() => theme.toggle()}
	aria-label="Toggle theme"
>
	{#if $theme === 'dark'}
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			class="h-4 w-4 fill-none stroke-current stroke-[1.8]"
		>
			<path
				d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"
			/>
			<circle cx="12" cy="12" r="4.2" />
		</svg>
		<span>Dark</span>
	{:else}
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			class="h-4 w-4 fill-none stroke-current stroke-[1.8]"
		>
			<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 7.6 7.6 0 1 0 20 15.5Z" />
		</svg>
		<span>Light</span>
	{/if}
</button>
