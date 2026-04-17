import { tools } from '$lib/constants/tools';

export const publicPageRoutes = ['/', ...tools.map((tool) => tool.route)];

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

	return ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`].join('\n');
}

export function buildSitemapXml(
	origin: string,
	routes: readonly string[] = publicPageRoutes
): string {
	const urls = [...new Set(routes)].map((route) => {
		const url = new URL(route, origin).toString();
		const priority = route === '/' ? '1.0' : '0.8';
		const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

		return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
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
