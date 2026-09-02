<script lang="ts">
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead
	title="Privacy"
	description="How Recica Tools keeps built-in utility input and output in browser memory without accounts, analytics, uploads, or server-side processing."
/>

<article class="mx-auto w-full max-w-4xl">
	<header class="workbench__head">
		<div>
			<p class="kicker kicker--accent">Operating policy</p>
			<h1 class="mt-1 text-2xl font-semibold">Privacy by construction</h1>
			<p class="workbench__desc mt-2">
				For every built-in utility, input and output stay in browser memory. The site has no account
				system, analytics, advertising scripts, remote uploads, or server-side tool processing.
			</p>
		</div>
	</header>

	<dl class="metrics mt-6" aria-label="Privacy operating summary">
		<div>
			<dt>Input / output</dt>
			<dd class="text-sm">Held in the current browser tab only while you work.</dd>
		</div>
		<div>
			<dt>Network transfer</dt>
			<dd class="text-sm">None for built-in tool operations.</dd>
		</div>
		<div>
			<dt>Persistence</dt>
			<dd class="text-sm">Theme override plus favorite and recent tool IDs. Never content.</dd>
		</div>
	</dl>

	<section class="about mt-6" aria-label="Privacy details">
		<div data-span="2">
			<h2>What is not collected</h2>
			<p>
				Tool input and generated output are not sent to Recica servers or third parties, added to
				page URLs, stored in local storage or IndexedDB, written to application logs, or included in
				error telemetry. Only your theme override and the identifiers of favorite and recently
				opened tools are stored, so the interface can remember your preferences. No text you paste
				or generate is ever persisted.
			</p>
		</div>
		<div>
			<h2>Sending output to another tool</h2>
			<p>
				The “Send to” menu passes output to the next tool in memory during the page transition.
				Nothing is written to the address bar, storage, or the offline cache, and the payload is
				discarded as soon as the destination reads it.
			</p>
		</div>
		<div>
			<h2>Files and clipboard</h2>
			<p>
				Loading a file reads it inside your browser with the File API. It is never uploaded. The
				Paste button reads the clipboard only when you click it, and Copy writes to it only when you
				click it. Downloads are generated locally from the current output.
			</p>
		</div>
		<div>
			<h2>Smart paste on the homepage</h2>
			<p>
				Detection runs entirely in this tab against a fixed set of patterns. The pasted text is
				handed to the tool you choose and is not retained anywhere afterward.
			</p>
		</div>
		<div>
			<h2>External links</h2>
			<p>
				Links to other Recica publications and curated external resources leave this site and are
				governed by the destination’s policies. Recica Tools does not load those destinations in the
				background.
			</p>
		</div>
		<div>
			<h2>Responsiveness limits</h2>
			<p>
				Each utility publishes its processing limit. Limits are checked before expensive work,
				including before a dropped file is read, and never cause silent truncation. They do not
				change the local-processing guarantee.
			</p>
		</div>
	</section>
</article>
