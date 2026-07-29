const SCRIPT_TAG = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const ACTIVE_METADATA_TAG = /<(?:base|link)\b[^>]*>|<meta\b[^>]*http-equiv[^>]*>/gi;
const EVENT_HANDLER = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const RESOURCE_ATTRIBUTE =
	/\s(?:href|src|srcset|srcdoc|poster|data|action|formaction|background|ping|xlink:href)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const CSS_IMPORT = /@import\s+(?:url\s*\([^)]*\)|"[^"]*"|'[^']*')[^;]*;?/gi;
const CSS_URL = /url\s*\([^)]*\)/gi;

export function sanitizeHtmlForPreview(input: string) {
	return input
		.replace(SCRIPT_TAG, '')
		.replace(ACTIVE_METADATA_TAG, '')
		.replace(EVENT_HANDLER, '')
		.replace(RESOURCE_ATTRIBUTE, '')
		.replace(CSS_IMPORT, '')
		.replace(CSS_URL, 'none');
}

export function createHtmlPreviewDocument(input: string) {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'" />
		<style>
			body {
				margin: 0;
				padding: 1rem;
				font-family: Inter, system-ui, sans-serif;
			}
		</style>
	</head>
	<body>${sanitizeHtmlForPreview(input)}</body>
</html>`;
}
