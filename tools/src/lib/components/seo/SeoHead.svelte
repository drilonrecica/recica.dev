<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { resolveSiteOrigin } from '$lib/utils/site-indexing';
	import { defaultSocialImagePath, serializeJsonLd, siteName } from '$lib/utils/seo';

	export let title = '';
	export let description = '';
	export let path = '';
	export let type = 'website';
	export let imagePath = defaultSocialImagePath;
	export let imageAlt = `${siteName} social preview`;
	export let robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
	export let schemas: unknown[] = [];

	$: origin = resolveSiteOrigin(env.PUBLIC_SITE_URL, $page.url);
	$: canonicalUrl = new URL(path || $page.url.pathname, origin).toString();
	$: imageUrl = imagePath ? new URL(imagePath, origin).toString() : '';
	$: fullTitle = title ? `${title} • ${siteName}` : siteName;
	$: socialTitle = title || siteName;
	$: serializedSchemas = schemas.map((schema) => serializeJsonLd(schema));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />

	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="og:image:alt" content={imageAlt} />
		<meta property="og:image:type" content="image/svg+xml" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="author" content="Drilon Recica" />
	<meta name="theme-color" content="#1ec8a5" />
	<meta name="color-scheme" content="light dark" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />

	{#if imageUrl}
		<meta name="twitter:image" content={imageUrl} />
	{/if}

	{#each serializedSchemas as json (json)}
		<!-- prettier-ignore -->
		<script type="application/ld+json">
{json}
		</script>
	{/each}
</svelte:head>
