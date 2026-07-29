import { tools } from '$lib/constants/tools';

export const PRODUCTION_ORIGIN = 'https://tools.recica.dev';

export const publicPageRoutes = [
	{ path: '/' },
	...tools.map((tool) => ({ path: tool.route }))
] as const;

export function parseIndexingEnabled(value: string | undefined): boolean {
	return value === 'true';
}

function isLoopbackHostname(hostname: string): boolean {
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

export function resolveSiteOrigin(
	configuredUrl: string | undefined,
	indexingEnabled: boolean
): string {
	const candidate = configuredUrl?.trim();

	if (!candidate) {
		return PRODUCTION_ORIGIN;
	}

	let url: URL;
	try {
		url = new URL(candidate);
	} catch {
		throw new Error('PUBLIC_SITE_URL must be a valid absolute URL.');
	}

	if (!['http:', 'https:'].includes(url.protocol)) {
		throw new Error('PUBLIC_SITE_URL must use http or https.');
	}

	if (url.origin === PRODUCTION_ORIGIN) {
		return PRODUCTION_ORIGIN;
	}

	if (indexingEnabled) {
		throw new Error('PUBLIC_SITE_URL cannot override the production origin for indexable builds.');
	}

	if (!isLoopbackHostname(url.hostname)) {
		throw new Error(
			'PUBLIC_SITE_URL may override the canonical origin only for loopback test builds.'
		);
	}

	return url.origin;
}

export const INDEXING_ENABLED = parseIndexingEnabled(import.meta.env.PUBLIC_INDEXING_ENABLED);
export const SITE_ORIGIN = resolveSiteOrigin(import.meta.env.PUBLIC_SITE_URL, INDEXING_ENABLED);

export function buildRobotsTxt(origin: string, indexingEnabled: boolean): string {
	const sitemapUrl = new URL('/sitemap.xml', origin).toString();
	const host = new URL(origin).host;
	const accessDirective = indexingEnabled ? 'Allow: /' : 'Disallow: /';

	return ['User-agent: *', accessDirective, '', `Sitemap: ${sitemapUrl}`, `Host: ${host}`].join(
		'\n'
	);
}

export function buildSitemapXml(
	origin: string,
	routes: ReadonlyArray<{
		path: string;
		lastModified?: string;
	}> = publicPageRoutes
): string {
	const seenPaths = new Set<string>();
	const urls = routes
		.filter((route) => {
			if (seenPaths.has(route.path)) {
				return false;
			}

			seenPaths.add(route.path);
			return true;
		})
		.map((route) => {
			const url = new URL(route.path, origin).toString();
			const lastModified = route.lastModified
				? `\n    <lastmod>${escapeXml(route.lastModified)}</lastmod>`
				: '';

			return `  <url>
    <loc>${escapeXml(url)}</loc>${lastModified}
  </url>`;
		});

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls,
		'</urlset>'
	].join('\n');
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
