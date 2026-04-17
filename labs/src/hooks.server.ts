import type { Handle } from '@sveltejs/kit';

const contentSecurityPolicy = [
	"default-src 'self'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	"img-src 'self' data: blob:",
	"font-src 'self'",
	"style-src 'self' 'unsafe-inline'",
	"script-src 'self' 'unsafe-inline'",
	"connect-src 'self'",
	"object-src 'none'"
].join('; ');

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('Content-Security-Policy', contentSecurityPolicy);
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');

	return response;
};
