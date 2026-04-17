import { describe, expect, it } from 'vitest';
import { slugify } from '$lib/tools/slug';

describe('slug tools', () => {
	it('normalizes unicode and punctuation', () => {
		expect(slugify(' Recica Dév: JSON / Validator ')).toBe('recica-dev-json-validator');
	});
});
