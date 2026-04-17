<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead
	title="404 — Labs not found"
	description="This Labs route does not exist. Head back to the main experiments page."
	path="/404"
	noindex={true}
/>

<section class="section-shell">
	<div class="section-frame">
		<div class="surface-panel-strong mx-auto grid max-w-4xl gap-6 p-8 sm:p-10">
			<div class="flex flex-wrap items-center gap-3">
				<span class="status-pill status-pill--coming">404</span>
				<span class="metric-label">Not found</span>
			</div>
			<h1 class="section-title">That experiment route does not exist.</h1>
			<p class="section-copy">
				Labs is still intentionally small. Head back to the homepage or open the live Parental Gate
				Lab.
			</p>
			<div class="flex flex-wrap gap-3">
				<a href={resolve('/')} class="button-base button-primary">Back to Labs</a>
				<a href={resolve('/parental-gate-lab')} class="button-base button-secondary">
					Open Parental Gate Lab
				</a>
			</div>
		</div>
	</div>
</section>
