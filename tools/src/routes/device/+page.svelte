<script lang="ts">
	import { onMount } from 'svelte';
	import ToolShell from '$lib/components/tools/ToolShell.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	type DeviceInfo = Record<string, string | number | boolean>;

	let info: DeviceInfo = {};

	function storageAvailable(type: 'localStorage' | 'sessionStorage') {
		try {
			window[type].setItem('__recica_test__', '1');
			window[type].removeItem('__recica_test__');
			return true;
		} catch {
			return false;
		}
	}

	onMount(() => {
		const userAgentData = navigator as Navigator & { userAgentData?: { platform?: string } };
		info = {
			userAgent: navigator.userAgent,
			platform: userAgentData.userAgentData?.platform ?? navigator.platform ?? 'Unknown',
			language: navigator.language,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			viewport: `${window.innerWidth} × ${window.innerHeight}`,
			screen: `${window.screen.width} × ${window.screen.height}`,
			pixelRatio: window.devicePixelRatio,
			darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
			touchPoints: navigator.maxTouchPoints || 0,
			cookiesEnabled: navigator.cookieEnabled,
			localStorage: storageAvailable('localStorage'),
			sessionStorage: storageAvailable('sessionStorage'),
			online: navigator.onLine
		};
	});

	$: json = JSON.stringify(info, null, 2);
</script>

<ToolShell
	title="Device / Browser Info"
	description="Inspect practical client-side environment details such as viewport, platform, language, storage support, and theme preference."
	tips={[
		'All values are collected locally from browser APIs.',
		'Useful for quick support checks and responsive debugging.',
		'This page is informational only and does not send the data anywhere.'
	]}
>
	<div class="surface-panel p-6">
		<div class="flex items-center justify-between gap-3">
			<div>
				<div class="field__label">Environment snapshot</div>
				<div class="field__help">Collected locally from the current browser session.</div>
			</div>
			<CopyButton value={json} label="Copy JSON" />
		</div>

		{#if Object.keys(info).length}
			<div class="mt-5 grid gap-4 md:grid-cols-2">
				{#each Object.entries(info) as [label, value] (label)}
					<div
						class="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4"
					>
						<div class="field__label">{label}</div>
						<div class="mt-2 font-mono text-sm break-words text-[var(--text)]">{value}</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="result-empty mt-5">Loading current browser information.</div>
		{/if}
	</div>
</ToolShell>
