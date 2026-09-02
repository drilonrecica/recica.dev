import { describe, expect, it } from 'vitest';
import { RECENT_LIMIT, pushRecent, sanitizePrefs, toggleInList } from './prefs';

describe('prefs helpers', () => {
	it('drops unknown or malformed ids and caps recents', () => {
		const prefs = sanitizePrefs({
			favorites: ['json', 'nope', 42, 'json'],
			recents: ['qr', 'diff', 'json', 'hash', 'uuid', 'sql', 'env']
		});
		expect(prefs.favorites).toEqual(['json']);
		expect(prefs.recents).toHaveLength(RECENT_LIMIT);
		expect(sanitizePrefs(null)).toEqual({ favorites: [], recents: [] });
		expect(sanitizePrefs('garbage')).toEqual({ favorites: [], recents: [] });
	});

	it('moves a repeated recent to the front', () => {
		expect(pushRecent(['a', 'b', 'c'], 'c')).toEqual(['c', 'a', 'b']);
		expect(pushRecent(['a', 'b', 'c', 'd', 'e'], 'z')).toEqual(['z', 'a', 'b', 'c', 'd']);
	});

	it('toggles membership', () => {
		expect(toggleInList(['a'], 'b')).toEqual(['a', 'b']);
		expect(toggleInList(['a', 'b'], 'a')).toEqual(['b']);
	});
});
