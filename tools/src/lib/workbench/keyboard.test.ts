import { describe, expect, it } from 'vitest';
import { formatChord, matchesChord, parseChord } from './keyboard';

describe('keyboard chords', () => {
	it('parses modifier chords', () => {
		expect(parseChord('Mod+Shift+C')).toEqual({ key: 'C', mod: true, shift: true, alt: false });
		expect(parseChord('/')).toEqual({ key: '/', mod: false, shift: false, alt: false });
		expect(parseChord('Mod+Enter')).toEqual({ key: 'enter', mod: true, shift: false, alt: false });
	});

	it('matches events against chords', () => {
		const chord = parseChord('Mod+Enter');
		expect(
			matchesChord(
				{
					key: 'Enter',
					ctrlKey: true,
					metaKey: false,
					shiftKey: false,
					altKey: false
				} as KeyboardEvent,
				chord
			)
		).toBe(true);
		expect(
			matchesChord(
				{
					key: 'Enter',
					ctrlKey: false,
					metaKey: false,
					shiftKey: false,
					altKey: false
				} as KeyboardEvent,
				chord
			)
		).toBe(false);
		const question = parseChord('?');
		expect(
			matchesChord(
				{
					key: '?',
					ctrlKey: false,
					metaKey: false,
					shiftKey: true,
					altKey: false
				} as KeyboardEvent,
				question
			)
		).toBe(false);
	});

	it('formats chords per platform', () => {
		expect(formatChord('Mod+Shift+C', true)).toEqual(['⌘', '⇧', 'C']);
		expect(formatChord('Mod+Enter', false)).toEqual(['Ctrl', 'Enter']);
	});
});
