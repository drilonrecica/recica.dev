import { tools } from '$lib/constants/tools';

export const publicPageRoutes = [
	{ path: '/', changeFrequency: 'weekly', priority: '1.0' },
	...tools.map((tool) => ({
		path: tool.route,
		changeFrequency: 'monthly',
		priority: '0.8'
	}))
] as const;

export function resolveSiteOrigin(configuredUrl: string | undefined, requestUrl: URL): string {
	const candidate = configuredUrl?.trim();

	if (candidate) {
		try {
			const url = new URL(candidate);
			// Basic validation - ensure it's http or https
			if (!['http:', 'https:'].includes(url.protocol)) {
				throw new Error('Invalid protocol');
			}
			return url.origin;
		} catch {
			// Fall back to the current request origin when configuration is invalid.
		}
	}

	return requestUrl.origin;
}

export function buildRobotsTxt(origin: string): string {
	const sitemapUrl = new URL('/sitemap.xml', origin).toString();
	const host = new URL(origin).host;

	return ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`, `Host: ${host}`].join('\n');
}

export function buildSitemapXml(
	origin: string,
	routes: ReadonlyArray<{
		path: string;
		changeFrequency?: string;
		priority?: string;
	}> = publicPageRoutes
): string {
	const lastmod = new Date().toISOString().split('T')[0] ?? '';
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
			const priority = route.priority ?? (route.path === '/' ? '1.0' : '0.8');
			const changeFrequency = route.changeFrequency;

			return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    ${changeFrequency ? `<changefreq>${changeFrequency}</changefreq>` : ''}
    <priority>${priority}</priority>
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
