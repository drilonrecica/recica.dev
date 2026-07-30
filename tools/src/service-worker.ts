/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';
import {
	CACHE_PREFIX,
	classifyCacheRequest,
	getObsoleteCacheNames,
	selectPublicDocuments
} from '$lib/offline/cache-policy';

const worker = self as unknown as ServiceWorkerGlobalScope;
const assetCacheName = `${CACHE_PREFIX}assets-${version}`;
const documentCacheName = `${CACHE_PREFIX}documents-${version}`;
const currentCacheNames = new Set([assetCacheName, documentCacheName]);
const assetPaths = new Set([...build, ...files]);
const documentPaths = new Set(selectPublicDocuments(prerendered));

function canStore(response: Response): boolean {
	return response.ok && response.type !== 'opaque';
}

async function cacheFirst(request: Request): Promise<Response> {
	const cache = await caches.open(assetCacheName);
	const cached = await cache.match(request);
	if (cached) {
		return cached;
	}

	const response = await fetch(request);
	if (canStore(response)) {
		await cache.put(request, response.clone());
	}
	return response;
}

async function networkFirst(request: Request): Promise<Response> {
	const cache = await caches.open(documentCacheName);

	try {
		const response = await fetch(request);
		if (canStore(response)) {
			await cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		const cached = await cache.match(request);
		if (cached) {
			return cached;
		}
		throw error;
	}
}

worker.addEventListener('install', (event) => {
	event.waitUntil(
		Promise.all([
			caches.open(assetCacheName).then((cache) => cache.addAll([...assetPaths])),
			caches.open(documentCacheName).then((cache) => cache.addAll([...documentPaths]))
		])
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					getObsoleteCacheNames(cacheNames, currentCacheNames).map((cacheName) =>
						caches.delete(cacheName)
					)
				)
			)
			.then(() => worker.clients.claim())
	);
});

worker.addEventListener('fetch', (event) => {
	const strategy = classifyCacheRequest(
		event.request,
		worker.location.origin,
		assetPaths,
		documentPaths
	);

	if (strategy === 'asset-cache-first') {
		event.respondWith(cacheFirst(event.request));
		return;
	}

	if (strategy === 'document-network-first') {
		event.respondWith(networkFirst(event.request));
	}
});
