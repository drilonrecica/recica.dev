<script lang="ts">
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead
	title="Privacy"
	description="How Recica Tools keeps built-in utility input and output in browser memory without accounts, analytics, uploads, or server-side processing."
/>

<article class="mx-auto w-full max-w-4xl space-y-8">
	<header class="space-y-4">
		<div class="kicker">Operating policy / PR-01</div>
		<h1 class="text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">
			Privacy by construction
		</h1>
		<p class="prose-note max-w-3xl">
			For every built-in utility, input and output stay in browser memory. The site has no account
			system, analytics, advertising scripts, remote uploads, or server-side tool processing.
		</p>
	</header>

	<div class="switchboard-readout" aria-label="Privacy operating summary">
		<div>
			<div class="tool-code">INPUT / OUTPUT</div>
			<p>Held in the current browser tab only while you work.</p>
		</div>
		<div>
			<div class="tool-code">NETWORK TRANSFER</div>
			<p>None for built-in tool operations.</p>
		</div>
		<div>
			<div class="tool-code">PERSISTENCE</div>
			<p>Theme preference only.</p>
		</div>
	</div>

	<section class="surface-panel p-6">
		<h2 class="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
			What is not collected
		</h2>
		<p class="mt-4 leading-7 text-[var(--text-secondary)]">
			Tool input and generated output are not sent to Recica servers or third parties, added to page
			URLs, stored in local storage or IndexedDB, written to application logs, or included in error
			telemetry. Only the selected theme preference is stored so the interface can remember light or
			dark mode.
		</p>
	</section>

	<section class="surface-panel p-6">
		<h2 class="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
			Downloads, clipboard, and external links
		</h2>
		<p class="mt-4 leading-7 text-[var(--text-secondary)]">
			Copy and download actions happen only after you request them through your browser. Links to
			other Recica publications and curated external resources leave this site and are governed by
			the destination’s policies. Recica Tools does not load those destinations in the background.
		</p>
	</section>

	<section class="surface-panel p-6">
		<h2 class="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
			Responsiveness limits
		</h2>
		<p class="mt-4 leading-7 text-[var(--text-secondary)]">
			Each utility publishes its processing limit. Limits are checked before expensive work, protect
			the responsiveness of the browser tab, and never cause silent truncation. They do not change
			the local-processing guarantee.
		</p>
	</section>
</article>
