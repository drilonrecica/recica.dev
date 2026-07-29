import type { RequestHandler } from './$types';
import { buildRobotsTxt, INDEXING_ENABLED, SITE_ORIGIN } from '$lib/utils/site-indexing';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = buildRobotsTxt(SITE_ORIGIN, INDEXING_ENABLED);

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
