import { describe, expect, it } from 'vitest';
import { createHtmlPreviewDocument, sanitizeHtmlForPreview } from '$lib/tools/html';

describe('html tools', () => {
	it('strips scripts and event handlers', () => {
		const html = sanitizeHtmlForPreview(
			'<button onclick="alert(1)">x</button><script>alert(1)</script>'
		);
		expect(html).toBe('<button>x</button>');
	});

	it('neutralizes javascript urls in preview documents', () => {
		expect(createHtmlPreviewDocument('<a href="javascript:alert(1)">bad</a>')).toContain(
			'href="#"'
		);
	});
});
