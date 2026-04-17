function escapeHtml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function sanitizeUrl(url: string) {
	return /^(https?:|mailto:)/i.test(url) ? url : '#';
}

function renderInline(input: string) {
	const codeSpans: string[] = [];
	let value = escapeHtml(input).replace(/`([^`]+)`/g, (_, code: string) => {
		codeSpans.push(`<code>${escapeHtml(code)}</code>`);
		return `__CODE_${codeSpans.length - 1}__`;
	});

	value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text: string, href: string) => {
		return `<a href="${sanitizeUrl(href)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>`;
	});
	value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	value = value.replace(/\*([^*]+)\*/g, '<em>$1</em>');

	return value.replace(
		/__CODE_(\d+)__/g,
		(match, index: string) => codeSpans[Number(index)] ?? match
	);
}

export function renderMarkdown(markdown: string) {
	const lines = markdown.replace(/\r\n/g, '\n').split('\n');
	const html: string[] = [];
	const paragraph: string[] = [];
	let inCodeBlock = false;
	let codeBlock: string[] = [];
	let listType: 'ul' | 'ol' | null = null;

	function flushParagraph() {
		if (!paragraph.length) return;
		html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
		paragraph.length = 0;
	}

	function flushList() {
		if (!listType) return;
		html.push(`</${listType}>`);
		listType = null;
	}

	for (const line of lines) {
		if (line.startsWith('```')) {
			flushParagraph();
			flushList();
			if (inCodeBlock) {
				html.push(`<pre><code>${escapeHtml(codeBlock.join('\n'))}</code></pre>`);
				codeBlock = [];
			}
			inCodeBlock = !inCodeBlock;
			continue;
		}

		if (inCodeBlock) {
			codeBlock.push(line);
			continue;
		}

		if (!line.trim()) {
			flushParagraph();
			flushList();
			continue;
		}

		const heading = line.match(/^(#{1,6})\s+(.+)$/);
		if (heading) {
			flushParagraph();
			flushList();
			const [, hashes = '', headingText = ''] = heading;
			const level = hashes.length;
			html.push(`<h${level}>${renderInline(headingText)}</h${level}>`);
			continue;
		}

		if (/^---+$/.test(line.trim())) {
			flushParagraph();
			flushList();
			html.push('<hr />');
			continue;
		}

		const unordered = line.match(/^\s*[-*]\s+(.+)$/);
		if (unordered) {
			flushParagraph();
			if (!listType) {
				listType = 'ul';
				html.push('<ul>');
			} else if (listType !== 'ul') {
				flushList();
				listType = 'ul';
				html.push('<ul>');
			}
			const [, content = ''] = unordered;
			html.push(`<li>${renderInline(content)}</li>`);
			continue;
		}

		const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
		if (ordered) {
			flushParagraph();
			if (!listType) {
				listType = 'ol';
				html.push('<ol>');
			} else if (listType !== 'ol') {
				flushList();
				listType = 'ol';
				html.push('<ol>');
			}
			const [, content = ''] = ordered;
			html.push(`<li>${renderInline(content)}</li>`);
			continue;
		}

		const quote = line.match(/^\s*>\s?(.+)$/);
		if (quote) {
			flushParagraph();
			flushList();
			const [, content = ''] = quote;
			html.push(`<blockquote><p>${renderInline(content)}</p></blockquote>`);
			continue;
		}

		flushList();
		paragraph.push(line.trim());
	}

	flushParagraph();
	flushList();

	return html.join('\n');
}

export function createMarkdownPreviewDocument(markdown: string) {
	const body = renderMarkdown(markdown);
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<style>
			body {
				margin: 0;
				padding: 1.25rem;
				font-family: Inter, system-ui, sans-serif;
				background: #10161d;
				color: #eaf2f8;
				line-height: 1.7;
			}
			a { color: #4da3ff; }
			code, pre { font-family: 'JetBrains Mono', monospace; }
			pre {
				overflow: auto;
				padding: 1rem;
				border-radius: 12px;
				background: #151c24;
				border: 1px solid #263341;
			}
			blockquote {
				margin: 0;
				padding-left: 1rem;
				border-left: 3px solid #1ec8a5;
				color: #a5b4c3;
			}
			hr { border: 0; border-top: 1px solid #263341; }
		</style>
	</head>
	<body>${body || '<p>Markdown preview will appear here.</p>'}</body>
</html>`;
}
