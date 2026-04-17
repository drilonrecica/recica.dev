import { describe, expect, it } from 'vitest';
import { inspectJwt } from '$lib/tools/jwt';

describe('jwt tools', () => {
	it('inspects a valid jwt', () => {
		const result = inspectJwt(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjQxMDI0NDQ4MDB9.signature'
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.header.alg).toBe('HS256');
		expect(result.payload.sub).toBe('123');
		expect(result.timestamps[0]?.key).toBe('exp');
	});

	it('rejects malformed input', () => {
		expect(inspectJwt('not-a-token')).toEqual({
			ok: false,
			error: 'JWTs must contain header, payload, and signature sections.'
		});
	});
});
