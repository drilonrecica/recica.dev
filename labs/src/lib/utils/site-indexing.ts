export const publicPageRoutes = [
	{ path: '/', changeFrequency: 'weekly', priority: '1.0' },
	{ path: '/parental-gate-lab', changeFrequency: 'monthly', priority: '0.9' }
] as const;
export const robotsDisallowRoutes = ['/404'] as const;

export function resolveSiteOrigin(configuredUrl: string | undefined, requestUrl: URL): string {
	const candidate = configuredUrl?.trim();

	if (candidate) {
		try {
			const url = new URL(candidate);

			if (!['http:', 'https:'].includes(url.protocol)) {
				throw new Error('Invalid protocol');
			}

			return url.origin;
		} catch {
			// Fall back to request origin.
		}
	}

	return requestUrl.origin;
}

export function buildRobotsTxt(origin: string): string {
	const sitemapUrl = new URL('/sitemap.xml', origin).toString();
	const host = new URL(origin).host;

	return [
		'User-agent: *',
		'Allow: /',
		...robotsDisallowRoutes.map((route) => `Disallow: ${route}`),
		'',
		`Sitemap: ${sitemapUrl}`,
		`Host: ${host}`
	].join('\n');
}

export function buildSitemapXml(
	origin: string,
	routes: ReadonlyArray<{
		path: string;
		changeFrequency?: string;
		priority?: string;
	}> = publicPageRoutes
): string {
	const today = new Date().toISOString().split('T')[0] ?? '';
	const urls = [...new Set(routes)].map((route) => {
		const url = new URL(route.path, origin).toString();
		const priority = route.priority ?? (route.path === '/' ? '1.0' : '0.8');
		const changeFrequency = route.changeFrequency;

		return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${today}</lastmod>
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
