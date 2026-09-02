import { describe, expect, it } from 'vitest';
import { detectContent } from './detect';

const top = (input: string) => detectContent(input)[0]?.toolId;

describe('detectContent', () => {
	it('returns nothing for blank input', () => {
		expect(detectContent('   \n ')).toEqual([]);
	});

	it('ranks valid JSON first', () => {
		expect(top('{"a":1,"b":[1,2]}')).toBe('json');
		expect(detectContent('{"a":1}')[0]?.confidence).toBeGreaterThan(0.9);
	});

	it('still suggests the JSON tool for broken JSON with lower confidence', () => {
		const result = detectContent('{"a":1,');
		expect(result[0]?.toolId).toBe('json');
		expect(result[0]?.confidence).toBeLessThan(0.9);
	});

	it('recognizes a JWT with a JSON header above base64', () => {
		const jwt =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiUmVjaWNhIn0.c2lnbmF0dXJl';
		const result = detectContent(jwt);
		expect(result[0]?.toolId).toBe('jwt');
		expect(result.some((item) => item.toolId === 'base64')).toBe(false);
	});

	it('recognizes UUIDs, timestamps, and colors', () => {
		expect(top('123e4567-e89b-42d3-a456-426614174000')).toBe('uuid');
		expect(top('1735689600')).toBe('timestamp');
		expect(top('1735689600000')).toBe('timestamp');
		expect(top('#0f7a4c')).toBe('color');
		expect(top('rgb(15, 122, 76)')).toBe('color');
	});

	it('recognizes URLs and query strings', () => {
		const result = detectContent('https://example.com/path?a=1&b=two');
		expect(result[0]?.toolId).toBe('url');
		expect(result.some((item) => item.toolId === 'query')).toBe(true);
		expect(top('a=1&b=2&c=three')).toBe('query');
		expect(top('hello%20world%21')).toBe('url');
	});

	it('recognizes printable base64', () => {
		expect(top('aGVsbG8gd29ybGQ=')).toBe('base64');
	});

	it('recognizes dotenv, robots, sitemap, html, markdown, and sql', () => {
		expect(top('DATABASE_URL=postgres://x\nexport API_KEY="abc"\n# comment')).toBe('env');
		expect(top('User-agent: *\nDisallow: /admin\nSitemap: https://x/s.xml')).toBe('robots');
		expect(
			top('<?xml version="1.0"?><urlset xmlns="x"><url><loc>https://x</loc></url></urlset>')
		).toBe('sitemap');
		expect(top('<!doctype html><html><body><p>hi</p></body></html>')).toBe('html');
		expect(top('# Title\n\n- item one\n- item two')).toBe('markdown');
		expect(top('select id, name from users where id = 1')).toBe('sql');
	});

	it('falls back to text utilities for plain text', () => {
		const result = detectContent('just some words');
		expect(result.map((item) => item.toolId)).toContain('counter');
		expect(result.map((item) => item.toolId)).toContain('case');
		expect(result.length).toBeLessThanOrEqual(5);
	});
});
