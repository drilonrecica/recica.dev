import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/e2e',
	testMatch: '**/*.e2e.ts',
	use: {
		baseURL: 'http://127.0.0.1:4175',
		trace: 'retain-on-failure'
	},
	webServer: {
		command:
			'PUBLIC_SITE_URL=http://127.0.0.1:4175 ./node_modules/.bin/vite build && PUBLIC_SITE_URL=http://127.0.0.1:4175 HOST=127.0.0.1 PORT=4175 node build',
		port: 4175,
		reuseExistingServer: !process.env.CI
	}
});
