import { expect, test as base } from '@playwright/test';

export const test = base.extend<{ qualityGuards: void }>({
	qualityGuards: [
		async ({ baseURL, page }, use) => {
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
				if (expectedOrigin && new URL(url).origin !== expectedOrigin) {
					unexpectedRequests.push(`${request.method()} ${url}`);
				}
			});

			await use();

			expect(consoleErrors, 'browser console errors').toEqual([]);
			expect(pageErrors, 'uncaught browser errors').toEqual([]);
			expect(unexpectedRequests, 'unexpected cross-origin requests').toEqual([]);
		},
		{ auto: true }
	]
});

export { expect };
