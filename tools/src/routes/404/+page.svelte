<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead
	title="Route not found"
	description="This Tools route does not exist. Return to the utility index to choose a browser-local tool."
	noindex={true}
	omitCanonical={true}
/>

<section class="mx-auto min-h-[60vh] w-full max-w-4xl py-12">
	<div class="surface-panel grid gap-6 p-8 sm:p-10">
		<div class="status-pill status-error w-fit">404 · Not found</div>
		<div class="grid gap-3">
			<div class="kicker">Utility switchboard</div>
			<h1 class="text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-5xl">
				Route not found
			</h1>
			<p class="prose-note max-w-2xl">
				No utility is wired to this address. Return to the index to search the available local
				tools.
			</p>
		</div>
		<a href={resolve('/')} class="button-base button-primary w-fit">Return to Tools</a>
	</div>
</section>
