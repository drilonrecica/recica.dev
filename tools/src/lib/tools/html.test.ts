import { describe, expect, it } from 'vitest';
import { createHtmlPreviewDocument, sanitizeHtmlForPreview } from '$lib/tools/html';

describe('html tools', () => {
	it('strips scripts and event handlers', () => {
		const html = sanitizeHtmlForPreview(
			'<button onclick="alert(1)">x</button><script>alert(1)</script>'
		);
		expect(html).toBe('<button>x</button>');
	});

	it('removes URL-bearing attributes and active metadata', () => {
		const scriptUrl = ['java', 'script:alert(1)'].join('');
		const document = createHtmlPreviewDocument(
			`<a href="${scriptUrl}">bad</a><img src="/private"><link rel="stylesheet" href="/private.css">`
		);
		expect(document).not.toContain(scriptUrl);
		expect(document).not.toContain('/private');
		expect(document).not.toContain('<link');
	});

	it('blocks preview documents from making network requests', () => {
		const document = createHtmlPreviewDocument(
			'<style>@import "/private.css"; p { background: url(/private.png) }</style>'
		);
		expect(document).toContain(
			`Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"`
		);
		expect(document).not.toContain('@import');
		expect(document).not.toContain('url(');
	});
});
