import { describe, expect, it } from 'vitest';
import { parseRobotsTxt } from '$lib/tools/robots';

describe('robots tools', () => {
	it('parses directives and comments', () => {
		const result = parseRobotsTxt('# note\nUser-agent: *\nDisallow: /admin');
		expect(result.directiveCount).toBe(2);
		expect(result.errorCount).toBe(0);
	});

	it('flags malformed directives', () => {
		const result = parseRobotsTxt('Bad line');
		expect(result.errorCount).toBe(1);
	});
});
