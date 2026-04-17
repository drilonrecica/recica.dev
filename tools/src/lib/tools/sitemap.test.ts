import { describe, expect, it } from 'vitest';
import { parseSitemapXml } from '$lib/tools/sitemap';

describe('sitemap tools', () => {
	it('extracts loc entries', () => {
		const result = parseSitemapXml(
			'<urlset><url><loc>https://recica.dev</loc></url><url><loc>https://recica.dev/tools</loc></url></urlset>'
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.urls).toEqual(['https://recica.dev', 'https://recica.dev/tools']);
	});

	it('rejects invalid roots', () => {
		expect(parseSitemapXml('<root></root>')).toEqual({
			ok: false,
			error: 'Sitemaps must contain a <urlset> or <sitemapindex> root element.'
		});
	});
});
