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
		expect(doc).toContain(`default-src 'none'; style-src 'unsafe-inline'`);
	});

	it('renders inline code and blocks unsafe link schemes', () => {
		const html = renderMarkdown(
			'`<tag>` *emphasis* [mail](mailto:hello@recica.dev) [bad](javascript:evil)'
		);
		expect(html).toContain('<code>&lt;tag&gt;</code>');
		expect(html).toContain('<em>emphasis</em>');
		expect(html).toContain('href="mailto:hello@recica.dev"');
		expect(html).toContain('href="#"');
	});

	it('renders block structures and switches list types cleanly', () => {
		const html = renderMarkdown(
			[
				'###### Detail',
				'',
				'First paragraph',
				'continues here',
				'',
				'- one',
				'- two',
				'1. three',
				'2. four',
				'',
				'> quoted',
				'',
				'---',
				'',
				'```ts',
				'<unsafe>',
				'```'
			].join('\r\n')
		);

		expect(html).toContain('<h6>Detail</h6>');
		expect(html).toContain('<p>First paragraph continues here</p>');
		expect(html).toContain('<ul>\n<li>one</li>\n<li>two</li>\n</ul>');
		expect(html).toContain('<ol>\n<li>three</li>\n<li>four</li>\n</ol>');
		expect(html).toContain('<blockquote><p>quoted</p></blockquote>');
		expect(html).toContain('<hr />');
		expect(html).toContain('<pre><code>&lt;unsafe&gt;</code></pre>');
	});

	it('renders an explicit empty state in the preview document', () => {
		expect(createMarkdownPreviewDocument('')).toContain(
			'<p>Markdown preview will appear here.</p>'
		);
	});
});
