export const CACHE_PREFIX = 'recica-tools-';

export type CacheStrategy = 'asset-cache-first' | 'document-network-first' | 'network-only';

type CacheRequest = Pick<Request, 'method' | 'url'> & {
	mode?: RequestMode;
};

function normalizeOrigin(origin: string): string {
	return new URL(origin).origin;
}

export function selectPublicDocuments(paths: Iterable<string>): string[] {
	return [...new Set(paths)].filter((path) => {
		if (path === '/404' || path === '/health') {
			return false;
		}

		const finalSegment = path.split('/').at(-1) ?? '';
		return !finalSegment.includes('.');
	});
}

export function classifyCacheRequest(
	request: CacheRequest,
	siteOrigin: string,
	assetPaths: ReadonlySet<string>,
	documentPaths: ReadonlySet<string>
): CacheStrategy {
	if (request.method !== 'GET') {
		return 'network-only';
	}

	const url = new URL(request.url, siteOrigin);
	if (url.origin !== normalizeOrigin(siteOrigin) || url.search || url.hash) {
		return 'network-only';
	}

	if (assetPaths.has(url.pathname)) {
		return 'asset-cache-first';
	}

	if (request.mode === 'navigate' && documentPaths.has(url.pathname)) {
		return 'document-network-first';
	}

	return 'network-only';
}

export function getObsoleteCacheNames(
	cacheNames: Iterable<string>,
	currentCacheNames: ReadonlySet<string>
): string[] {
	return [...cacheNames].filter(
		(cacheName) => cacheName.startsWith(CACHE_PREFIX) && !currentCacheNames.has(cacheName)
	);
}
