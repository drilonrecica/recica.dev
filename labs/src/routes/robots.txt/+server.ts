import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';
import { buildRobotsTxt, resolveSiteOrigin } from '$lib/utils/site-indexing';

export const GET: RequestHandler = ({ url }) => {
	const origin = resolveSiteOrigin(env.PUBLIC_SITE_URL, url);
	const body = buildRobotsTxt(origin);

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
