import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	envPrefix: ['VITE_', 'PUBLIC_'],
	plugins: [tailwindcss(), sveltekit()],
	test: {
		expect: { requireAssertions: true },
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: [
				'src/lib/constants/**/*.ts',
				'src/lib/offline/**/*.ts',
				'src/lib/search/**/*.ts',
				'src/lib/tools/**/*.ts',
				'src/lib/utils/**/*.ts'
			],
			exclude: [
				'build/',
				'src/lib/constants/resources.ts',
				'src/lib/utils/clipboard.ts',
				'src/**/*.d.ts',
				'src/**/*.config.*',
				'src/**/*.test.*',
				'src/**/*.spec.*'
			],
			thresholds: {
				statements: 80,
				lines: 80,
				functions: 80,
				branches: 70
			}
		},
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
