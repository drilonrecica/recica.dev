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
			'./node_modules/.bin/vite build && ./node_modules/.bin/vite preview --host 127.0.0.1 --port 4175',
		port: 4175,
		reuseExistingServer: !process.env.CI
	}
});
