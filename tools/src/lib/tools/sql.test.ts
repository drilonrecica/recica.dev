import { describe, expect, it } from 'vitest';
import { formatSql, minifySql } from '$lib/tools/sql';

describe('sql tools', () => {
	it('formats sql keywords onto separate lines', () => {
		const result = formatSql('select id, name from users where active = 1 order by name');
		expect(result).toContain('SELECT');
		expect(result).toContain('\nFROM');
		expect(result).toContain('\nWHERE');
	});

	it('minifies sql', () => {
		expect(minifySql("select  *  from users where name = 'Recica Lab'")).toBe(
			"select * from users where name = 'Recica Lab'"
		);
	});
});
