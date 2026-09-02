<script lang="ts">
	import SendTo from '$lib/components/workbench/SendTo.svelte';
	import { copyText } from '$lib/utils/clipboard';

	let {
		id,
		label = 'Output',
		value = '',
		empty = 'Output appears here.',
		filename = 'output.txt',
		mime = 'text/plain',
		wrap = false,
		gutter = true,
		from = undefined,
		help = ''
	}: {
		id: string;
		label?: string;
		value?: string;
		empty?: string;
		filename?: string;
		mime?: string;
		wrap?: boolean;
		gutter?: boolean;
		from?: string;
		help?: string;
	} = $props();

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	const lineNumbers = $derived.by(() => {
		const count = value ? value.split('\n').length : 0;
		return Array.from({ length: count }, (_unused, index) => index + 1);
	});

	async function copy() {
		const ok = await copyText(value);
		copied = ok;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1600);
	}

	function download() {
		if (!value) return;
		const blob = new Blob([value], { type: mime });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = filename;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		setTimeout(() => URL.revokeObjectURL(url), 0);
	}
</script>

<div class="output">
	<div class="codefield__bar">
		<div class="field__label" id={`${id}-label`}>{label}</div>
		<div class="codefield__tools">
			<button type="button" class="button-base button-ghost" onclick={copy} disabled={!value}>
				{copied ? 'Copied' : 'Copy'}
			</button>
			<button type="button" class="button-base button-ghost" onclick={download} disabled={!value}>
				Download
			</button>
			{#if from}
				<SendTo {from} payload={value} />
			{/if}
		</div>
	</div>
	<div class={`output__frame${gutter && value ? '' : ' output__frame--plain'}`}>
		{#if value}
			{#if gutter}
				<div class="codefield__gutter" aria-hidden="true">
					{#each lineNumbers as lineNumber (lineNumber)}
						<div>{lineNumber}</div>
					{/each}
				</div>
			{/if}
			<pre
				class={`output__body${wrap ? ' output__body--wrap' : ''}`}
				{id}
				aria-labelledby={`${id}-label`}
				tabindex="0">{value}</pre>
		{:else}
			<div class="output__empty" {id}>{empty}</div>
		{/if}
	</div>
	{#if help}
		<div class="codefield__foot"><span>{help}</span></div>
	{/if}
</div>
