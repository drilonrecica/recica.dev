<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { copyText } from '$lib/utils/clipboard';

	export let value = '';
	export let label = 'Copy';
	export let variant: 'secondary' | 'ghost' = 'ghost';

	let state: 'idle' | 'copied' | 'error' = 'idle';
	let timeout: ReturnType<typeof setTimeout> | undefined;

	async function copyValue() {
		clearTimeout(timeout);
		const copied = await copyText(value);
		state = copied ? 'copied' : 'error';
		timeout = setTimeout(() => {
			state = 'idle';
		}, 1600);
	}

	$: buttonLabel = state === 'copied' ? 'Copied' : state === 'error' ? 'Unavailable' : label;
</script>

<Button on:click={copyValue} {variant} disabled={!value}>
	{buttonLabel}
</Button>
