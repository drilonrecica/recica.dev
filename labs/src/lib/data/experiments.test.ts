import { describe, expect, it } from 'vitest';
import { experiments, featuredExperiments, liveExperimentCount } from '$lib/data/experiments';

describe('experiment manifest', () => {
	it('publishes one routed study and one non-routed research note', () => {
		expect(experiments).toHaveLength(2);
		expect(liveExperimentCount).toBe(1);
		expect(experiments.filter((experiment) => experiment.ctaHref)).toHaveLength(1);

		const study = experiments.find((experiment) => experiment.slug === 'parental-gate-lab');
		expect(study).toMatchObject({
			status: 'live',
			ctaHref: '/parental-gate-lab',
			homeVisibility: 'featured'
		});

		const note = experiments.find(
			(experiment) => experiment.slug === 'mobile-analytics-crash-reporting'
		);
		expect(note).toMatchObject({
			status: 'in-progress',
			homeVisibility: 'teaser'
		});
		expect(note?.ctaHref).toBeUndefined();
	});

	it('keeps manifest identifiers and public routes unique', () => {
		expect(new Set(experiments.map((experiment) => experiment.slug)).size).toBe(experiments.length);
		const routes = experiments.flatMap((experiment) =>
			experiment.ctaHref ? [experiment.ctaHref] : []
		);
		expect(new Set(routes).size).toBe(routes.length);
		expect(featuredExperiments.map((experiment) => experiment.sortOrder)).toEqual([1, 2]);
	});
});
