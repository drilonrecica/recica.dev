<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import {
		defaultRobotsDirectives,
		defaultSocialImagePath,
		serializeJsonLd,
		siteName,
		siteTagline
	} from '$lib/utils/seo';
	import { resolveSiteOrigin } from '$lib/utils/site-indexing';

	export let title: string;
	export let description: string;
	export let path = '/';
	export let socialImagePath = defaultSocialImagePath;
	export let socialImageAlt = '';
	export let keywords: string[] = [];
	export let type: 'website' | 'article' = 'website';
	export let noindex = false;
	export let schema: unknown[] = [];
	export let schemaBuilder: ((origin: string, canonicalUrl: string) => unknown[]) | null = null;

	$: canonicalOrigin = resolveSiteOrigin(env.PUBLIC_SITE_URL, $page.url);
	$: canonicalUrl = new URL(path, canonicalOrigin).toString();
	$: socialImageUrl = new URL(socialImagePath, canonicalOrigin).toString();
	$: fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
	$: resolvedSocialImageAlt = socialImageAlt || `${fullTitle} social preview`;
	$: robotsContent = noindex ? 'noindex, nofollow, noarchive' : defaultRobotsDirectives;
	$: resolvedSchema = schemaBuilder ? schemaBuilder(canonicalOrigin, canonicalUrl) : schema;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robotsContent} />
	<meta name="googlebot" content={robotsContent} />
	<meta name="author" content="Drilon Reçica" />
	<meta name="creator" content="Drilon Reçica" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="theme-color" content="#0c1014" />
	<meta name="application-name" content={siteName} />
	<meta name="apple-mobile-web-app-title" content={siteName} />
	<meta name="color-scheme" content="dark" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
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
	<link rel="canonical" href={canonicalUrl} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}

	{#each resolvedSchema as entry, index (index)}
		<svelte:element this={'script'} type="application/ld+json">
			{serializeJsonLd(entry)}
		</svelte:element>
	{/each}
</svelte:head>
