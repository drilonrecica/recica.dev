import { describe, expect, it } from 'vitest';
import { isThemeOverride, resolveTheme } from './theme';

describe('theme resolution', () => {
	it('follows the system only when no override is set', () => {
		expect(resolveTheme('system', true)).toBe('dark');
		expect(resolveTheme('system', false)).toBe('light');
		expect(resolveTheme('light', true)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});

	it('accepts only light or dark as stored overrides', () => {
		expect(isThemeOverride('dark')).toBe(true);
		expect(isThemeOverride('system')).toBe(false);
		expect(isThemeOverride(null)).toBe(false);
	});
});
