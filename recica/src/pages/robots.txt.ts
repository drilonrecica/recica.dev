import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site, url }) => {
	const origin = import.meta.env.SITE ?? site?.origin ?? url.origin;
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${new URL('/sitemap-index.xml', origin).toString()}`,
		`Host: ${new URL(origin).host}`
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
