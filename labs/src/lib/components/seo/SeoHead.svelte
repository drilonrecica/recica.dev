<script lang="ts">
	import {
		defaultRobotsDirectives,
		defaultSocialImagePath,
		serializeJsonLd,
		siteName,
		siteTagline
	} from '$lib/utils/seo';
	import { INDEXING_ENABLED, SITE_ORIGIN } from '$lib/utils/site-indexing';

	export let title: string;
	export let description: string;
	export let path = '/';
	export let socialImagePath = defaultSocialImagePath;
	export let socialImageAlt = '';
	export let keywords: string[] = [];
	export let type: 'website' | 'article' = 'website';
	export let noindex = false;
	export let omitCanonical = false;
	export let schema: unknown[] = [];
	export let schemaBuilder: ((origin: string, canonicalUrl: string) => unknown[]) | null = null;

	$: canonicalUrl = new URL(path, SITE_ORIGIN).toString();
	$: socialImageUrl = new URL(socialImagePath, SITE_ORIGIN).toString();
	$: fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
	$: resolvedSocialImageAlt = socialImageAlt || `${fullTitle} social preview`;
	$: robotsContent =
		noindex || !INDEXING_ENABLED ? 'noindex, nofollow, noarchive' : defaultRobotsDirectives;
	$: resolvedSchema = schemaBuilder ? schemaBuilder(SITE_ORIGIN, canonicalUrl) : schema;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robotsContent} />
	<meta name="googlebot" content={robotsContent} />
	<meta name="author" content="Drilon Reçica" />
	<meta name="creator" content="Drilon Reçica" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="theme-color" content="#f6f0e6" />
	<meta name="application-name" content={siteName} />
	<meta name="apple-mobile-web-app-title" content={siteName} />
	<meta name="color-scheme" content="light" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	{#if !omitCanonical}
		<meta property="og:url" content={canonicalUrl} />
	{/if}
	<meta property="og:image" content={socialImageUrl} />
	<meta property="og:image:secure_url" content={socialImageUrl} />
	<meta property="og:image:alt" content={resolvedSocialImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImageUrl} />
	<meta name="twitter:image:alt" content={resolvedSocialImageAlt} />
	<meta name="twitter:creator" content="@drilonrecica" />
	<meta name="twitter:site" content="@drilonrecica" />
	<meta name="generator" content={siteTagline} />
	{#if !omitCanonical}
		<link rel="canonical" href={canonicalUrl} />
	{/if}
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}

	{#each resolvedSchema as entry, index (index)}
		<svelte:element this={'script'} type="application/ld+json">
			{serializeJsonLd(entry)}
		</svelte:element>
	{/each}
</svelte:head>
