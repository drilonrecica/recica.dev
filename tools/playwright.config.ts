import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/e2e',
	testMatch: '**/*.e2e.ts',
	workers: 1,
	use: {
		baseURL: 'http://127.0.0.1:4174',
		trace: 'retain-on-failure'
	},
	webServer: {
		command:
			'./node_modules/.bin/vite build && ./node_modules/.bin/vite preview --host 127.0.0.1 --port 4174',
		port: 4174,
		reuseExistingServer: !process.env.CI
	}
});
