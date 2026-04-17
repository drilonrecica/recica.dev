<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { defaultSocialImagePath, serializeJsonLd, siteName, siteTagline } from '$lib/utils/seo';
	import { resolveSiteOrigin } from '$lib/utils/site-indexing';

	export let title: string;
	export let description: string;
	export let path = '/';
	export let socialImagePath = defaultSocialImagePath;
	export let type: 'website' | 'article' = 'website';
	export let schema: unknown[] = [];

	$: canonicalOrigin = resolveSiteOrigin(env.PUBLIC_SITE_URL, $page.url);
	$: canonicalUrl = new URL(path, canonicalOrigin).toString();
	$: socialImageUrl = new URL(socialImagePath, canonicalOrigin).toString();
	$: fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content="#0c1014" />
	<meta name="application-name" content={siteName} />
	<meta name="apple-mobile-web-app-title" content={siteName} />
	<meta name="color-scheme" content="dark" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={socialImageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImageUrl} />
	<meta name="twitter:creator" content="@drilonrecica" />
	<meta name="twitter:site" content="@drilonrecica" />
	<meta name="generator" content={siteTagline} />
	<link rel="canonical" href={canonicalUrl} />

	{#each schema as entry, index (index)}
		<svelte:element this={'script'} type="application/ld+json">
			{serializeJsonLd(entry)}
		</svelte:element>
	{/each}
</svelte:head>
