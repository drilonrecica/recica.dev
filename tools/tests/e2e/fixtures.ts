import { expect, test as base } from '@playwright/test';
import { tools } from '../../src/lib/constants/tools';

const allowedDocumentPaths = new Set(['/', '/404', '/privacy', ...tools.map((tool) => tool.route)]);
const allowedStaticPaths = new Set([
	'/favicon.svg',
	'/manifest.json',
	'/og-default.svg',
	'/recica-tools-logo.jpg',
	'/service-worker.js'
]);

export function isAllowedBrowserRequest(
	url: string,
	expectedOrigin: string,
	method = 'GET',
	postData: string | null = null
) {
	const parsed = new URL(url);
	if (
		method !== 'GET' ||
		postData !== null ||
		parsed.origin !== expectedOrigin ||
		parsed.search ||
		parsed.hash
	) {
		return false;
	}

	return (
		allowedDocumentPaths.has(parsed.pathname) ||
		allowedStaticPaths.has(parsed.pathname) ||
		parsed.pathname.startsWith('/_app/')
	);
}

export const test = base.extend<{
	expectedBrowserRequests: Set<string>;
	qualityGuards: void;
}>({
	expectedBrowserRequests: async ({ page }, use) => {
		const requests = new Set<string>();
		const clearRequests = () => requests.clear();
		page.once('close', clearRequests);
		await use(requests);
		page.off('close', clearRequests);
	},
	qualityGuards: [
		async ({ baseURL, expectedBrowserRequests, page }, use) => {
			const consoleErrors: string[] = [];
			const pageErrors: string[] = [];
			const unexpectedRequests: string[] = [];
			const expectedOrigin = baseURL ? new URL(baseURL).origin : undefined;

			page.on('console', (message) => {
				if (message.type() === 'error') consoleErrors.push(message.text());
			});
			page.on('pageerror', (error) => pageErrors.push(error.message));
			page.on('request', (request) => {
				const url = request.url();
				if (!url.startsWith('http:') && !url.startsWith('https:')) return;
				if (
					expectedOrigin &&
					!expectedBrowserRequests.has(url) &&
					!isAllowedBrowserRequest(url, expectedOrigin, request.method(), request.postData())
				) {
					unexpectedRequests.push(`${request.method()} ${url}`);
				}
			});

			await use();

			expect(consoleErrors, 'browser console errors').toEqual([]);
			expect(pageErrors, 'uncaught browser errors').toEqual([]);
			expect(unexpectedRequests, 'unexpected browser network requests').toEqual([]);
		},
		{ auto: true }
	]
});

export { expect };
