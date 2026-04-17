import type { ToolDefinition } from '$lib/types/tool';

export const tools: ToolDefinition[] = [
	{
		id: 'json',
		name: 'JSON Formatter / Validator',
		route: '/json',
		description: 'Free JSON formatter, validator, and minifier with clear local parse feedback.',
		category: 'Format',
		localOnly: true,
		keywords: ['json', 'validator', 'formatter', 'minify', 'pretty print']
	},
	{
		id: 'base64',
		name: 'Base64 Encoder / Decoder',
		route: '/base64',
		description:
			'Free Base64 encoder and decoder for UTF-8 text with local processing and strict validation.',
		category: 'Encoding',
		localOnly: true,
		keywords: ['base64', 'encode', 'decode', 'utf-8', 'text']
	},
	{
		id: 'qr',
		name: 'QR Code Generator',
		route: '/qr',
		description:
			'Free QR code generator for text, URLs, Wi-Fi, email, phone, and SMS with local PNG and SVG export.',
		category: 'Share',
		localOnly: true,
		keywords: ['qr', 'code', 'generator', 'wifi', 'email', 'phone', 'sms', 'png', 'svg']
	},
	{
		id: 'url',
		name: 'URL Encoder / Decoder',
		route: '/url',
		description:
			'Encode or decode full URLs and URL components without overwriting your source text.',
		category: 'Encoding',
		localOnly: true,
		keywords: ['url', 'encode', 'decode', 'component', 'uri']
	},
	{
		id: 'regex',
		name: 'Regex Tester',
		route: '/regex',
		description: 'Test ECMAScript regex patterns with flags, capture groups, and replace preview.',
		category: 'Text',
		localOnly: true,
		keywords: ['regex', 'regexp', 'pattern', 'replace', 'flags', 'capture groups']
	},
	{
		id: 'timestamp',
		name: 'Timestamp Converter',
		route: '/timestamp',
		description: 'Move cleanly between Unix timestamps, local time, and UTC.',
		category: 'Time',
		localOnly: true,
		keywords: ['timestamp', 'unix', 'epoch', 'utc', 'local time', 'date']
	},
	{
		id: 'password',
		name: 'Password Generator',
		route: '/password',
		description: 'Create strong passwords with secure browser randomness.',
		category: 'Security',
		localOnly: true,
		keywords: ['password', 'secure', 'random', 'generator', 'crypto']
	},
	{
		id: 'diff',
		name: 'Text Diff Checker',
		route: '/diff',
		description: 'Compare two text blocks with readable line and inline changes.',
		category: 'Compare',
		localOnly: true,
		keywords: ['diff', 'compare', 'text', 'changes', 'lines']
	},
	{
		id: 'sql',
		name: 'SQL Formatter / Minifier',
		route: '/sql',
		description:
			'Format or minify SQL locally without executing anything or assuming a specific backend.',
		category: 'Format',
		localOnly: true,
		keywords: ['sql', 'format', 'prettify', 'minify', 'indent', 'query']
	},
	{
		id: 'hash',
		name: 'Hash Generator',
		route: '/hash',
		description: 'Hash text locally with SHA-256, SHA-384, or SHA-512 using Web Crypto.',
		category: 'Security',
		localOnly: true,
		keywords: ['hash', 'sha-256', 'sha-384', 'sha-512', 'digest', 'crypto']
	},
	{
		id: 'uuid',
		name: 'UUID Generator',
		route: '/uuid',
		description: 'Generate UUID v4 or v7 values locally, one at a time or in bulk.',
		category: 'Identity',
		localOnly: true,
		keywords: ['uuid', 'guid', 'v4', 'v7', 'generate', 'id']
	},
	{
		id: 'query',
		name: 'Query String Parser / Builder',
		route: '/query',
		description:
			'Parse raw query strings into editable rows and rebuild them with repeated keys intact.',
		category: 'Encoding',
		localOnly: true,
		keywords: ['query string', 'url params', 'search params', 'parse', 'builder', 'repeated keys']
	},
	{
		id: 'env',
		name: '.env Parser / Viewer',
		route: '/env',
		description:
			'Inspect dotenv text with comments, quoted values, duplicates, and malformed lines surfaced clearly.',
		category: 'Config',
		localOnly: true,
		keywords: ['env', 'dotenv', 'parser', 'viewer', 'environment variables', 'config']
	},
	{
		id: 'jwt',
		name: 'JWT Inspector',
		route: '/jwt',
		description:
			'Decode JWT headers and payloads locally, then inspect claims and key timestamps safely.',
		category: 'Security',
		localOnly: true,
		keywords: ['jwt', 'json web token', 'decode', 'claims', 'header', 'payload', 'exp']
	},
	{
		id: 'markdown',
		name: 'Markdown Previewer',
		route: '/markdown',
		description: 'Write Markdown on the left and review a sanitized local preview on the right.',
		category: 'Preview',
		localOnly: true,
		keywords: ['markdown', 'preview', 'md', 'sanitized', 'render']
	},
	{
		id: 'html',
		name: 'HTML Previewer',
		route: '/html',
		description:
			'Preview HTML in a sandboxed iframe with scripts stripped and unsafe handlers removed.',
		category: 'Preview',
		localOnly: true,
		keywords: ['html', 'preview', 'sandbox', 'iframe', 'sanitize']
	},
	{
		id: 'slug',
		name: 'Slug Generator',
		route: '/slug',
		description: 'Turn titles into clean, lowercase slugs with predictable normalization.',
		category: 'Text',
		localOnly: true,
		keywords: ['slug', 'title', 'normalize', 'seo', 'text']
	},
	{
		id: 'case',
		name: 'Text Case Converter',
		route: '/case',
		description:
			'Convert text into camelCase, PascalCase, snake_case, kebab-case, title case, and more.',
		category: 'Text',
		localOnly: true,
		keywords: ['case', 'camel', 'pascal', 'snake', 'kebab', 'title', 'uppercase', 'lowercase']
	},
	{
		id: 'counter',
		name: 'Word / Character Counter',
		route: '/counter',
		description: 'Count words, characters, lines, paragraphs, and estimated reading time locally.',
		category: 'Text',
		localOnly: true,
		keywords: ['word count', 'character count', 'lines', 'paragraphs', 'reading time', 'text']
	},
	{
		id: 'color',
		name: 'Color Converter',
		route: '/color',
		description:
			'Convert between HEX, RGB(A), and HSL(A) with a live swatch and copy-ready outputs.',
		category: 'Design',
		localOnly: true,
		keywords: ['color', 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'converter']
	},
	{
		id: 'barcode',
		name: 'Barcode Generator',
		route: '/barcode',
		description:
			'Generate practical Code 128, EAN-13, and UPC-A barcodes with local SVG and PNG export.',
		category: 'Share',
		localOnly: true,
		keywords: ['barcode', 'code128', 'ean13', 'upca', 'svg', 'png', 'generator']
	},
	{
		id: 'device',
		name: 'Device / Browser Info',
		route: '/device',
		description:
			'Inspect the current browser environment, including viewport, platform, storage support, and theme preference.',
		category: 'Inspect',
		localOnly: true,
		keywords: ['device', 'browser', 'user agent', 'viewport', 'platform', 'screen', 'storage']
	},
	{
		id: 'robots',
		name: 'robots.txt Parser / Validator',
		route: '/robots',
		description:
			'Parse pasted robots.txt content and surface directives, comments, and malformed lines.',
		category: 'Inspect',
		localOnly: true,
		keywords: ['robots.txt', 'robots', 'parser', 'validator', 'seo', 'crawler']
	},
	{
		id: 'sitemap',
		name: 'Sitemap XML Parser / Validator',
		route: '/sitemap',
		description:
			'Validate pasted sitemap XML and list the URLs or child sitemap locations it contains.',
		category: 'Inspect',
		localOnly: true,
		keywords: ['sitemap', 'xml', 'validator', 'parser', 'urls', 'seo']
	}
];

export const featuredToolIds = ['json', 'base64', 'qr'] as const;
