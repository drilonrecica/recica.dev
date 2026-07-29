import { describe, expect, it } from 'vitest';
import {
	CACHE_PREFIX,
	classifyCacheRequest,
	getObsoleteCacheNames,
	selectPublicDocuments
} from './cache-policy';

const origin = 'https://tools.recica.dev';
const assets = new Set(['/_app/immutable/entry/start.abc123.js', '/manifest.json']);
const documents = new Set(['/', '/json', '/privacy']);

describe('offline cache policy', () => {
	it('uses cache-first only for known same-origin assets', () => {
		expect(
			classifyCacheRequest(
				{ method: 'GET', url: `${origin}/_app/immutable/entry/start.abc123.js` },
				origin,
				assets,
				documents
			)
		).toBe('asset-cache-first');
		expect(
			classifyCacheRequest(
				{ method: 'GET', url: `${origin}/manifest.json` },
				origin,
				assets,
				documents
			)
		).toBe('asset-cache-first');
	});

	it('uses network-first only for known document navigations', () => {
		expect(
			classifyCacheRequest(
				{ method: 'GET', mode: 'navigate', url: `${origin}/json` },
				origin,
				assets,
				documents
			)
		).toBe('document-network-first');
		expect(
			classifyCacheRequest(
				{ method: 'GET', mode: 'navigate', url: `${origin}/unknown` },
				origin,
				assets,
				documents
			)
		).toBe('network-only');
	});

	it.each([
		['POST requests', { method: 'POST', mode: 'navigate' as const, url: `${origin}/json` }],
		['third-party requests', { method: 'GET', url: 'https://example.com/script.js' }],
		[
			'query variants',
			{ method: 'GET', mode: 'navigate' as const, url: `${origin}/json?input=secret` }
		],
		[
			'fragment variants',
			{ method: 'GET', mode: 'navigate' as const, url: `${origin}/json#private` }
		]
	])('never caches %s', (_label, request) => {
		expect(classifyCacheRequest(request, origin, assets, documents)).toBe('network-only');
	});

	it('selects public HTML routes without health, error, or machine endpoints', () => {
		expect(
			selectPublicDocuments([
				'/',
				'/json',
				'/privacy',
				'/404',
				'/health',
				'/robots.txt',
				'/sitemap.xml'
			])
		).toEqual(['/', '/json', '/privacy']);
	});

	it('removes only obsolete caches owned by Recica Tools', () => {
		const current = new Set([`${CACHE_PREFIX}assets-current`, `${CACHE_PREFIX}documents-current`]);

		expect(
			getObsoleteCacheNames(
				[
					`${CACHE_PREFIX}assets-old`,
					`${CACHE_PREFIX}assets-current`,
					`${CACHE_PREFIX}documents-current`,
					'unrelated-cache'
				],
				current
			)
		).toEqual([`${CACHE_PREFIX}assets-old`]);
	});
});
