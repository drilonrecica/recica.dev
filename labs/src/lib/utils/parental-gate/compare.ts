import type { CriterionKey, ParentalGatePattern } from '$lib/types/parental-gate';
import { criteriaMeta } from '$lib/data/parental-gate/criteria';

export function sortPatternsByCriterion(
	patterns: readonly ParentalGatePattern[],
	criterion: CriterionKey
) {
	const meta = criteriaMeta.find((entry) => entry.key === criterion);

	return [...patterns].sort((left, right) => {
		const delta =
			meta?.highIsBetter === false
				? left.criteriaScores[criterion] - right.criteriaScores[criterion]
				: right.criteriaScores[criterion] - left.criteriaScores[criterion];

		if (delta === 0) {
			return left.name.localeCompare(right.name);
		}

		return delta;
	});
}
