import { describe, expect, it } from 'vitest';
import { convertCase } from '$lib/tools/case';

describe('case tools', () => {
	it('converts mixed input into multiple cases', () => {
		expect(convertCase('Recica JSON formatter')).toEqual({
			camel: 'recicaJsonFormatter',
			pascal: 'RecicaJsonFormatter',
			snake: 'recica_json_formatter',
			kebab: 'recica-json-formatter',
			title: 'Recica Json Formatter',
			upper: 'RECICA JSON FORMATTER',
			lower: 'recica json formatter'
		});
	});
});
