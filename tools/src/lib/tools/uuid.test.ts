import { describe, expect, it } from 'vitest';
import { generateUuid, generateUuidBatch } from '$lib/tools/uuid';

describe('uuid tools', () => {
	it('generates a v4 uuid', () => {
		expect(generateUuid('v4')).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
		);
	});

	it('generates a v7 uuid', () => {
		expect(generateUuid('v7', 1715342400000)).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
		);
	});

	it('generates a batch', () => {
		expect(generateUuidBatch('v4', 4)).toHaveLength(4);
	});
});
