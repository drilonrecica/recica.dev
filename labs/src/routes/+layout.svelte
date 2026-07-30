<script lang="ts">
	import './layout.css';
	import LabsFooter from '$lib/components/layout/LabsFooter.svelte';
	import LabsHeader from '$lib/components/layout/LabsHeader.svelte';

	import { page } from '$app/stores';
	$: pathname = $page.url.pathname;
</script>

<div class="app-shell">
	<a href="#main-content" class="skip-link">Skip to content</a>
	<LabsHeader {pathname} />

	<main id="main-content"><slot /></main>

	<LabsFooter />
</div>
