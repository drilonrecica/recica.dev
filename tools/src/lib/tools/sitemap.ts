function decodeXml(value: string) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

export type SitemapResult =
	| {
			ok: true;
			kind: 'urlset' | 'sitemapindex';
			urls: string[];
	  }
	| { ok: false; error: string };

export function parseSitemapXml(input: string): SitemapResult {
	const xml = input.trim();
	if (!xml) {
		return { ok: false, error: 'Paste sitemap XML to inspect it.' };
	}

	const rootMatch = xml.match(/<(?:\w+:)?(urlset|sitemapindex)\b/i);
	if (!rootMatch) {
		return { ok: false, error: 'Sitemaps must contain a <urlset> or <sitemapindex> root element.' };
	}

	const rootName = rootMatch[1];
	if (!rootName) {
		return { ok: false, error: 'Sitemaps must contain a valid root element.' };
	}

	const root = rootName.toLowerCase() as 'urlset' | 'sitemapindex';
	const closingTag = new RegExp(`</(?:\\w+:)?${root}>`, 'i');
	if (!closingTag.test(xml)) {
		return { ok: false, error: 'The sitemap root element is not closed correctly.' };
	}

	const urls = Array.from(xml.matchAll(/<(?:\w+:)?loc>([\s\S]*?)<\/(?:\w+:)?loc>/gi), (match) => {
		const location = match[1];
		return location ? decodeXml(location.trim()) : '';
	}).filter((value): value is string => value.length > 0);

	if (!urls.length) {
		return { ok: false, error: 'No <loc> entries were found in this sitemap.' };
	}

	return { ok: true, kind: root, urls };
}
