import { describe, expect, it } from 'vitest';
import { tools } from '$lib/constants/tools';

describe('tool registry contracts', () => {
	it('assigns a unique sequential switchboard number to every tool', () => {
		expect(tools.map((tool) => tool.number)).toEqual(
			Array.from({ length: tools.length }, (_, index) => index + 1)
		);
		expect(new Set(tools.map((tool) => tool.number)).size).toBe(tools.length);
	});

	it('documents the local input policy and useful content for every tool', () => {
		for (const tool of tools) {
			expect(tool.localOnly).toBe(true);
			expect(tool.inputPolicy.label.length).toBeGreaterThan(0);
			expect(tool.directAnswer.length).toBeGreaterThan(20);
			expect(tool.limitations.length).toBeGreaterThan(0);
			expect(tool.whenToUse.length).toBeGreaterThan(20);
			expect(tool.example.length).toBeGreaterThan(20);
			expect(tool.supportedFormats.length).toBeGreaterThan(0);
			expect(tool.commonErrors.length).toBeGreaterThan(0);
			expect(new URL(tool.reference.href).protocol).toBe('https:');
			expect(tool.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		}
	});
});
