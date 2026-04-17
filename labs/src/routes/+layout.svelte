<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import LabsFooter from '$lib/components/layout/LabsFooter.svelte';
	import LabsHeader from '$lib/components/layout/LabsHeader.svelte';

	$: pathname = $page.url.pathname;
	$: homeRoute = pathname === '/';
</script>

<div class={`app-shell theme-lab-dark ${homeRoute ? 'theme-lab-home' : ''}`}>
	<LabsHeader {pathname} />

	<main><slot /></main>

	<LabsFooter dark={true} />
</div>
