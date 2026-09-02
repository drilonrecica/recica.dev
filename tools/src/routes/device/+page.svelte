<script lang="ts">
	import { onMount } from 'svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import OutputPane from '$lib/components/workbench/OutputPane.svelte';
	import StatusLine from '$lib/components/workbench/StatusLine.svelte';
	import Workbench from '$lib/components/workbench/Workbench.svelte';
	import { setupToolPage } from '$lib/workbench/page';

	type DeviceInfo = Record<string, string | number | boolean>;

	let info = $state<DeviceInfo>({});

	function storageAvailable(type: 'localStorage' | 'sessionStorage') {
		try {
			window[type].setItem('__recica_test__', '1');
			window[type].removeItem('__recica_test__');
			return true;
		} catch {
			return false;
		}
	}

	function collect() {
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
	}

	const json = $derived(JSON.stringify(info, null, 2));
	const entries = $derived(Object.entries(info));

	onMount(() => {
		collect();
		window.addEventListener('resize', collect);
		const cleanup = setupToolPage({ toolId: 'device' });
		return () => {
			window.removeEventListener('resize', collect);
			cleanup();
		};
	});
</script>

<Workbench
	title="Device / Browser Info"
	description="Inspect practical client-side environment details such as viewport, platform, language, storage support, and theme preference."
	split
	tips={[
		'All values are collected locally from browser APIs.',
		'Useful for quick support checks and responsive debugging.',
		'This page is informational only and does not send the data anywhere.'
	]}
>
	{#snippet actions()}
		<button type="button" class="button-base button-ghost" onclick={collect}>Refresh</button>
		<CopyButton value={json} label="Copy JSON" />
	{/snippet}

	<div class="workbench__pane">
		<div class="codefield__bar"><div class="field__label">Environment snapshot</div></div>
		{#if entries.length}
			<dl class="metrics">
				{#each entries as [label, value] (label)}
					<div>
						<dt>{label}</dt>
						<dd class="text-sm break-words">{value}</dd>
					</div>
				{/each}
			</dl>
		{:else}
			<div class="result-empty">Loading current browser information.</div>
		{/if}
	</div>

	<div class="workbench__pane">
		<OutputPane
			id="device-json"
			label="As JSON"
			value={entries.length ? json : ''}
			filename="device.json"
			mime="application/json"
			from="device"
		/>
	</div>

	{#snippet status()}
		<StatusLine
			tone={entries.length ? 'ok' : 'idle'}
			message={entries.length
				? 'Collected from this browser session. Nothing is sent anywhere.'
				: 'Collecting…'}
		/>
	{/snippet}
</Workbench>
