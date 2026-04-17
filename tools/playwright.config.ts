import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/e2e',
	testMatch: '**/*.e2e.ts',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'retain-on-failure'
	},
	webServer: {
		command: './node_modules/.bin/vite build && HOST=127.0.0.1 PORT=4173 node build',
		port: 4173,
		reuseExistingServer: !process.env.CI
	}
});
