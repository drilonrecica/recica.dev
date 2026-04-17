const SCRIPT_TAG = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL = /\s(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi;

export function sanitizeHtmlForPreview(input: string) {
	return input
		.replace(SCRIPT_TAG, '')
		.replace(EVENT_HANDLER, '')
		.replace(JAVASCRIPT_URL, ' $1="#"');
}

export function createHtmlPreviewDocument(input: string) {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
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
