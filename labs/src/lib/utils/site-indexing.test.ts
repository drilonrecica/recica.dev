import { describe, expect, it } from 'vitest';
import {
	buildRobotsTxt,
	buildSitemapXml,
	parseIndexingEnabled,
	PRODUCTION_ORIGIN,
	publicPageRoutes,
	resolveSiteOrigin
} from '$lib/utils/site-indexing';

describe('site indexing helpers', () => {
	it('uses the fixed production origin when no override is configured', () => {
		expect(resolveSiteOrigin(undefined, false)).toBe(PRODUCTION_ORIGIN);
	});

	it('allows loopback overrides only for non-indexable local builds', () => {
		expect(resolveSiteOrigin('http://127.0.0.1:4175/example', false)).toBe('http://127.0.0.1:4175');
		expect(() => resolveSiteOrigin('https://preview.example.com', false)).toThrow(
			'PUBLIC_SITE_URL'
		);
		expect(() => resolveSiteOrigin('http://127.0.0.1:4175', true)).toThrow('indexable builds');
	});

	it('fails visibly for invalid configured origins', () => {
		expect(() => resolveSiteOrigin('not-a-url', false)).toThrow('PUBLIC_SITE_URL');
		expect(() => resolveSiteOrigin('ftp://labs.recica.dev', false)).toThrow('http or https');
	});

	it('enables indexing only for the exact true value', () => {
		expect(parseIndexingEnabled('true')).toBe(true);
		expect(parseIndexingEnabled('TRUE')).toBe(false);
		expect(parseIndexingEnabled('1')).toBe(false);
		expect(parseIndexingEnabled(undefined)).toBe(false);
	});

	it('builds a permissive robots file for indexable builds', () => {
		expect(buildRobotsTxt(PRODUCTION_ORIGIN, true)).toBe(
			'User-agent: *\nAllow: /\n\nSitemap: https://labs.recica.dev/sitemap.xml\nHost: labs.recica.dev'
		);
	});

	it('blocks crawler access in non-indexable builds', () => {
		expect(buildRobotsTxt(PRODUCTION_ORIGIN, false)).toBe(
			'User-agent: *\nDisallow: /\n\nSitemap: https://labs.recica.dev/sitemap.xml\nHost: labs.recica.dev'
		);
	});

	it('builds a canonical sitemap with only truthful explicit modification dates', () => {
		const xml = buildSitemapXml(PRODUCTION_ORIGIN, [
			{ path: '/' },
			{ path: '/parental-gate-lab', lastModified: '2026-07-29' },
			{ path: '/parental-gate-lab', lastModified: '2026-07-29' }
		]);

		expect(xml).toContain('<loc>https://labs.recica.dev/</loc>');
		expect(xml).toContain('<loc>https://labs.recica.dev/parental-gate-lab</loc>');
		expect(xml).toContain('<lastmod>2026-07-29</lastmod>');
		expect(xml.match(/<loc>https:\/\/labs\.recica\.dev\/parental-gate-lab<\/loc>/g)).toHaveLength(
			1
		);
		expect(xml).not.toContain('<changefreq>');
		expect(xml).not.toContain('<priority>');
		expect(xml.match(/<lastmod>/g)).toHaveLength(1);
	});

	it('keeps the public sitemap limited to actual public routes', () => {
		expect(publicPageRoutes.map((route) => route.path)).toEqual(['/', '/parental-gate-lab']);
	});
});
