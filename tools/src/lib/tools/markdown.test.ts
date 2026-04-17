import { describe, expect, it } from 'vitest';
import { createMarkdownPreviewDocument, renderMarkdown } from '$lib/tools/markdown';

describe('markdown tools', () => {
	it('renders safe markdown html', () => {
		const html = renderMarkdown('# Title\n\n**Bold** and [link](https://example.com)');
		expect(html).toContain('<h1>Title</h1>');
		expect(html).toContain('<strong>Bold</strong>');
		expect(html).toContain('href="https://example.com"');
	});

	it('escapes script tags in preview documents', () => {
		const doc = createMarkdownPreviewDocument('<script>alert(1)</script>');
		expect(doc).not.toContain('<script>alert(1)</script>');
		expect(doc).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
	});
});
