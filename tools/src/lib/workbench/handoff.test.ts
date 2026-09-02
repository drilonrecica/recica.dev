import { describe, expect, it } from 'vitest';
import { clearHandoff, handoffTargetsFor, peekHandoff, stageHandoff, takeHandoff } from './handoff';

describe('handoff', () => {
	it('hands a payload to exactly the staged tool, once', () => {
		clearHandoff();
		stageHandoff({ toolId: 'json', payload: '{"a":1}', from: 'jwt' });
		expect(takeHandoff('base64')).toBeNull();
		expect(peekHandoff()?.toolId).toBe('json');
		expect(takeHandoff('json')).toEqual({ toolId: 'json', payload: '{"a":1}', from: 'jwt' });
		expect(takeHandoff('json')).toBeNull();
		expect(peekHandoff()).toBeNull();
	});

	it('resolves targets to registered tools and never to the source', () => {
		const targets = handoffTargetsFor('jwt');
		expect(targets[0]?.toolId).toBe('json');
		expect(targets.every((target) => target.tool.route.startsWith('/'))).toBe(true);
		expect(targets.some((target) => target.toolId === 'jwt')).toBe(false);
		expect(handoffTargetsFor('unknown-tool').length).toBeGreaterThan(0);
	});
});
