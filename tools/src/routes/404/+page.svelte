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

<section class="mx-auto grid min-h-[60vh] w-full max-w-3xl content-center gap-4 py-12">
	<p class="kicker kicker--accent">404 · Not found</p>
	<h1 class="text-3xl font-semibold">Route not found</h1>
	<p class="workbench__desc">
		No utility is wired to this address. Return to the index to search the available local tools.
	</p>
	<div><a href={resolve('/')} class="button-base button-primary">Return to Tools</a></div>
</section>
