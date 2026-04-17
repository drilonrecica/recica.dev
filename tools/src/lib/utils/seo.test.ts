import { describe, expect, it } from 'vitest';
import { tools } from '$lib/constants/tools';
import {
	buildBreadcrumbSchema,
	buildToolListSchema,
	buildToolSchema,
	buildWebsiteSchema,
	serializeJsonLd
} from '$lib/utils/seo';

describe('seo helpers', () => {
	it('serializes JSON-LD safely for inline script tags', () => {
		const serialized = serializeJsonLd({
			name: '</script><script>alert(1)</script>'
		});

		expect(serialized).toContain('\\u003c/script>');
		expect(serialized).not.toContain('</script>');
	});

	it('builds a website schema with the canonical origin', () => {
		expect(buildWebsiteSchema('https://recica.dev', 'Local tools')).toMatchObject({
			'@type': 'WebSite',
			name: 'Recica Tools',
			url: 'https://recica.dev',
			description: 'Local tools'
		});
	});

	it('builds an item list schema from the tool registry', () => {
		const schema = buildToolListSchema('https://recica.dev', tools);
		const firstItem = schema.itemListElement[0];
		const firstTool = tools[0];
		if (!firstItem || !firstTool) {
			throw new Error('Expected the tool registry to include a first item.');
		}

		expect(schema.numberOfItems).toBe(tools.length);
		expect(firstItem).toMatchObject({
			position: 1,
			name: firstTool.name,
			url: 'https://recica.dev/json'
		});
	});

	it('builds a tool schema for free browser-based utilities', () => {
		const qrTool = tools[2];
		if (!qrTool) {
			throw new Error('Expected the tool registry to include the QR tool.');
		}

		const schema = buildToolSchema(
			'https://recica.dev',
			qrTool,
			'Free QR code generator for text and URLs.',
			'Free QR Code Generator'
		);

		expect(schema).toMatchObject({
			'@type': 'SoftwareApplication',
			name: 'Free QR Code Generator',
			applicationCategory: 'UtilitiesApplication',
			isAccessibleForFree: true,
			url: 'https://recica.dev/qr'
		});
	});

	it('builds breadcrumb schema entries with absolute URLs', () => {
		const schema = buildBreadcrumbSchema('https://recica.dev', [
			{ name: 'Home', path: '/' },
			{ name: 'QR Code Generator', path: '/qr' }
		]);

		expect(schema.itemListElement).toEqual([
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: 'https://recica.dev/'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'QR Code Generator',
				item: 'https://recica.dev/qr'
			}
		]);
	});
});
