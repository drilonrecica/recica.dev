import { describe, expect, it } from 'vitest';
import {
	buildRobotsTxt,
	buildSitemapXml,
	publicPageRoutes,
	resolveSiteOrigin
} from '$lib/utils/site-indexing';

describe('site indexing helpers', () => {
	it('resolves the configured public site origin when it is valid', () => {
		const result = resolveSiteOrigin(
			'https://recica.dev/tools?preview=1',
			new URL('http://localhost:5173')
		);

		expect(result).toBe('https://recica.dev');
	});

	it('falls back to the request origin when the configured site url is invalid', () => {
		const result = resolveSiteOrigin('not-a-url', new URL('http://localhost:5173'));

		expect(result).toBe('http://localhost:5173');
	});

	it('builds a permissive robots.txt with a sitemap reference', () => {
		expect(buildRobotsTxt('https://recica.dev')).toBe(
			'User-agent: *\nAllow: /\n\nSitemap: https://recica.dev/sitemap.xml\nHost: recica.dev'
		);
	});

	it('builds a sitemap that includes the homepage and public tool routes', () => {
		const xml = buildSitemapXml('https://recica.dev', [
			{ path: '/', changeFrequency: 'weekly', priority: '1.0' },
			{ path: '/json', changeFrequency: 'monthly', priority: '0.8' },
			{ path: '/robots', changeFrequency: 'monthly', priority: '0.8' }
		]);

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain('<loc>https://recica.dev/</loc>');
		expect(xml).toContain('<loc>https://recica.dev/json</loc>');
		expect(xml).toContain('<loc>https://recica.dev/robots</loc>');
	});

	it('keeps the public sitemap route list aligned with the homepage and tools', () => {
		expect(publicPageRoutes[0]?.path).toBe('/');
		expect(publicPageRoutes.map((route) => route.path)).toContain('/json');
		expect(publicPageRoutes.map((route) => route.path)).toContain('/sitemap');
		expect(publicPageRoutes.map((route) => route.path)).toContain('/robots');
		expect(publicPageRoutes).toHaveLength(25);
	});
});
