import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'font-src': ['self'],
				'img-src': ['self', 'data:', 'blob:'],
				'style-src': ['self', 'unsafe-inline'],
				// The second entry is the no-flash theme script in src/app.html.
				// Recompute with: printf '%s' "<script body>" | openssl dgst -sha256 -binary | openssl base64 -A
				'script-src': ['self', 'sha256-nnqAk3TjM/kLxeOjfcrYj2ipBpb2GHv/r4S2osCOWZg='],
				'connect-src': ['self'],
				'frame-src': ['self', 'blob:'],
				'object-src': ['none'],
				'manifest-src': ['self'],
				'worker-src': ['self', 'blob:']
			}
		}
	}
};

export default config;
