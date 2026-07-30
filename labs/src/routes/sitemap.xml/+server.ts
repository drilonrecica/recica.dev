import type { RequestHandler } from './$types';
import { buildSitemapXml, SITE_ORIGIN } from '$lib/utils/site-indexing';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = buildSitemapXml(SITE_ORIGIN);

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
