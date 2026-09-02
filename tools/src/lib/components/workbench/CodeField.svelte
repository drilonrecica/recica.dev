<script lang="ts">
	import { tick } from 'svelte';
	import type { Diagnostic } from '$lib/workbench/diagnostics';
	import { formatByteSize, utf8ByteLength } from '$lib/utils/input-policy';

	let {
		id,
		label,
		value = $bindable(''),
		placeholder = '',
		help = '',
		error = undefined,
		diagnostics = [],
		maxBytes = undefined,
		accept = '',
		readonly = false,
		rows = 12,
		wrap = false,
		oninput = undefined,
		onkeydown = undefined
	}: {
		id: string;
		label: string;
		value?: string;
		placeholder?: string;
		help?: string;
		error?: string | undefined;
		diagnostics?: Diagnostic[];
		maxBytes?: number;
		accept?: string;
		readonly?: boolean;
		rows?: number;
		wrap?: boolean;
		oninput?: () => void;
		onkeydown?: (event: KeyboardEvent) => void;
	} = $props();

	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let gutterEl = $state<HTMLDivElement | null>(null);
	let overlayEl = $state<HTMLDivElement | null>(null);
	let fileEl = $state<HTMLInputElement | null>(null);
	let dragging = $state(false);
	let note = $state('');
	let localError = $state('');

	const lineNumbers = $derived.by(() => {
		const count = value ? value.split('\n').length : 1;
		return Array.from({ length: count }, (_unused, index) => index + 1);
	});
	const markedLines = $derived(new Set(diagnostics.map((item) => item.line)));
	const shownError = $derived(localError || error);
	const helpId = $derived(help && !shownError ? `${id}-help` : undefined);
	const errorId = $derived(shownError ? `${id}-error` : undefined);
	const describedBy = $derived([helpId, errorId].filter(Boolean).join(' ') || undefined);
	const bytes = $derived(utf8ByteLength(value));

	type OverlaySegment = { text: string; mark?: string };

	/** Split the text into plain and marked segments for the overlay. */
	const overlay = $derived.by((): OverlaySegment[] => {
		if (!diagnostics.length) return [];
		const marks = diagnostics.filter((item) => item.column && item.column > 0);
		if (!marks.length) return [];
		const segments: OverlaySegment[] = [];
		const sourceLines = value.split('\n');
		sourceLines.forEach((line, index) => {
			const lineNumber = index + 1;
			const mark = marks.find((item) => item.line === lineNumber);
			if (!mark) {
				segments.push({ text: line + (index < sourceLines.length - 1 ? '\n' : '') });
				return;
			}
			const column = Math.min(mark.column ?? 1, Math.max(line.length, 1));
			const before = line.slice(0, column - 1);
			const marked = line.slice(column - 1, column) || ' ';
			const after = line.slice(column);
			segments.push({ text: before });
			segments.push({ text: marked, mark: mark.message });
			segments.push({ text: after + (index < sourceLines.length - 1 ? '\n' : '') });
		});
		return segments;
	});

	function syncScroll() {
		if (!textareaEl) return;
		if (gutterEl) gutterEl.scrollTop = textareaEl.scrollTop;
		if (overlayEl) {
			overlayEl.scrollTop = textareaEl.scrollTop;
			overlayEl.scrollLeft = textareaEl.scrollLeft;
		}
	}

	function notify() {
		localError = '';
		oninput?.();
	}

	function handleInput() {
		notify();
	}

	function clear() {
		value = '';
		note = '';
		notify();
		textareaEl?.focus();
	}

	async function pasteFromClipboard() {
		note = '';
		try {
			const text = await navigator.clipboard.readText();
			if (!text) {
				note = 'Clipboard is empty.';
				return;
			}
			if (maxBytes && utf8ByteLength(text) > maxBytes) {
				localError = `Clipboard content is ${formatByteSize(utf8ByteLength(text))}; the limit is ${formatByteSize(maxBytes)}. Nothing was inserted.`;
				return;
			}
			value = text;
			notify();
			await tick();
			textareaEl?.focus();
		} catch {
			note = 'Clipboard access was blocked. Use Ctrl+V or ⌘V inside the field.';
		}
	}

	async function loadFile(file: File | undefined) {
		note = '';
		if (!file) return;
		if (maxBytes && file.size > maxBytes) {
			localError = `${file.name} is ${formatByteSize(file.size)}; the limit is ${formatByteSize(maxBytes)}. The file was not read.`;
			return;
		}
		try {
			value = await file.text();
			note = `Loaded ${file.name} (${formatByteSize(file.size)}) in this tab only.`;
			notify();
		} catch {
			localError = `${file.name} could not be read as text.`;
		}
	}

	function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		void loadFile(input.files?.[0]);
		input.value = '';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		if (readonly) return;
		void loadFile(event.dataTransfer?.files?.[0]);
	}

	function handleDragOver(event: DragEvent) {
		if (readonly) return;
		event.preventDefault();
		dragging = true;
	}
</script>

<div class="codefield">
	<div class="codefield__bar">
		<label class="field__label" for={id}>{label}</label>
		{#if !readonly}
			<div class="codefield__tools">
				<button type="button" class="button-base button-ghost" onclick={pasteFromClipboard}>
					Paste
				</button>
				<button type="button" class="button-base button-ghost" onclick={() => fileEl?.click()}>
					Load file
				</button>
				<button type="button" class="button-base button-ghost" onclick={clear} disabled={!value}>
					Clear
				</button>
				<input
					bind:this={fileEl}
					type="file"
					{accept}
					class="sr-only"
					tabindex="-1"
					aria-hidden="true"
					data-file-input={id}
					onchange={handleFileChange}
				/>
			</div>
		{/if}
	</div>

	<div
		class="codefield__frame"
		data-invalid={shownError ? 'true' : undefined}
		data-dragging={dragging ? 'true' : undefined}
		role="presentation"
		ondragover={handleDragOver}
		ondragleave={() => (dragging = false)}
		ondrop={handleDrop}
	>
		<div class="codefield__gutter" bind:this={gutterEl} aria-hidden="true">
			{#each lineNumbers as lineNumber (lineNumber)}
				<div data-mark={markedLines.has(lineNumber) ? 'true' : undefined}>{lineNumber}</div>
			{/each}
		</div>
		<div class="codefield__text">
			{#if overlay.length}
				<div class="codefield__overlay" bind:this={overlayEl} aria-hidden="true">
					{#each overlay as segment, index (index)}{#if segment.mark}<mark title={segment.mark}
								>{segment.text}</mark
							>{:else}{segment.text}{/if}{/each}
				</div>
			{/if}
			<textarea
				bind:this={textareaEl}
				bind:value
				{id}
				name={id}
				{rows}
				{placeholder}
				{readonly}
				spellcheck="false"
				autocapitalize="off"
				autocomplete="off"
				style:white-space={wrap ? 'pre-wrap' : undefined}
				aria-describedby={describedBy}
				aria-invalid={shownError ? 'true' : undefined}
				oninput={handleInput}
				{onkeydown}
				onscroll={syncScroll}
			></textarea>
			{#if dragging}
				<div class="codefield__drop">Drop to load the file</div>
			{/if}
		</div>
	</div>

	<div class="codefield__foot">
		{#if shownError}
			<span class="field__error" id={errorId} role="alert" aria-live="assertive">{shownError}</span>
		{:else if note}
			<span>{note}</span>
		{:else if help}
			<span id={helpId}>{help}</span>
		{:else}
			<span></span>
		{/if}
		<span aria-hidden="true">{formatByteSize(bytes)}</span>
	</div>
</div>
