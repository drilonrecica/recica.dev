import { parentalGatePatternMap, parentalGatePatterns } from '$lib/data/parental-gate/patterns';
import {
	collectRuleEntries,
	fitsFrequency,
	fitsRisk,
	recommendationQuestions
} from '$lib/data/parental-gate/recommendationRules';
import type {
	ParentalGatePattern,
	RecommendationAnswers,
	RecommendationResult
} from '$lib/types/parental-gate';

export function isRecommendationComplete(answers: RecommendationAnswers): boolean {
	return recommendationQuestions.every((question) => Boolean(answers[question.id]));
}

export function scorePatterns(
	answers: RecommendationAnswers
): Array<{ patternId: string; score: number }> {
	const scores = new Map(parentalGatePatterns.map((pattern) => [pattern.id, 0]));

	for (const entry of collectRuleEntries(answers)) {
		if (!entry.rule) {
			continue;
		}

		const weights = entry.rule.answerWeights[entry.value];

		if (!weights) {
			continue;
		}

		for (const [patternId, weight] of Object.entries(weights)) {
			if (weight === undefined) {
				continue;
			}

			scores.set(patternId, (scores.get(patternId) ?? 0) + weight);
		}
	}

	const risk = answers.risk;
	const frequency = answers.frequency;

	for (const pattern of parentalGatePatterns) {
		let bonus = 0;

		if (risk === 'high' || risk === 'medium' || risk === 'low') {
			bonus += fitsRisk(pattern, risk) ? 2 : -1;
		}

		if (frequency === 'rare' || frequency === 'occasional' || frequency === 'frequent') {
			bonus += fitsFrequency(pattern, frequency) ? 2 : -1;
		}

		if (answers.accessibility === 'critical' && pattern.criteriaScores.accessibility >= 4) {
			bonus += 2;
		}

		if (answers.touch === 'avoid' && pattern.criteriaScores.parentFriction <= 2) {
			bonus += 1;
		}

		if (answers.surface === 'purchase' && pattern.recommendationTags.includes('purchases')) {
			bonus += 2;
		}

		scores.set(pattern.id, (scores.get(pattern.id) ?? 0) + bonus);
	}

	return [...scores.entries()]
		.map(([patternId, score]) => ({ patternId, score }))
		.sort(
			(left, right) => right.score - left.score || left.patternId.localeCompare(right.patternId)
		);
}

export function buildRecommendation(answers: RecommendationAnswers): RecommendationResult {
	if (!isRecommendationComplete(answers)) {
		throw new Error('Recommendation answers are incomplete.');
	}

	const scoreBreakdown = scorePatterns(answers);
	const primary = resolvePattern(scoreBreakdown[0]?.patternId);
	const backup = resolvePattern(scoreBreakdown[1]?.patternId ?? scoreBreakdown[0]?.patternId);

	const rationale = collectRationale(primary, answers);
	const watchOuts = collectWatchOuts(primary, backup, answers);

	return {
		primary,
		backup,
		rationale,
		watchOuts,
		scoreBreakdown
	};
}

function resolvePattern(patternId: string | undefined): ParentalGatePattern {
	if (!patternId) {
		throw new Error('No pattern available for recommendation.');
	}

	const pattern = parentalGatePatternMap.get(patternId);

	if (!pattern) {
		throw new Error(`Unknown pattern id: ${patternId}`);
	}

	return pattern;
}

function collectRationale(pattern: ParentalGatePattern, answers: RecommendationAnswers): string[] {
	const points = new Set<string>();

	if (answers.risk === 'high' && pattern.criteriaScores.childResistance >= 4) {
		points.add('It creates stronger intentional friction for more sensitive adult-only actions.');
	}

	if (answers.frequency === 'frequent' && pattern.criteriaScores.parentFriction <= 2) {
		points.add('It respects repeat parent flows better than heavier, slower gates.');
	}

	if (answers.literacy === 'no' && pattern.recommendationTags.includes('low-literacy')) {
		points.add('It works without leaning too hard on reading or typing.');
	}

	if (answers.accessibility === 'critical' && pattern.criteriaScores.accessibility >= 4) {
		points.add('It gives you a cleaner starting point for accessible adult interaction.');
	}

	if (answers.surface === 'purchase' && pattern.recommendationTags.includes('purchases')) {
		points.add('It fits purchase and subscription flows where adult intent needs to be clearer.');
	}

	if (answers.surface === 'settings' && pattern.recommendationTags.includes('settings')) {
		points.add('It matches settings and adult-area flows without feeling heavier than necessary.');
	}

	if (points.size < 3) {
		points.add(pattern.bestFor);
	}

	return [...points].slice(0, 4);
}

function collectWatchOuts(
	primary: ParentalGatePattern,
	backup: ParentalGatePattern,
	answers: RecommendationAnswers
): string[] {
	const points = new Set<string>();

	if (primary.criteriaScores.accessibility <= 2) {
		points.add(
			'Plan an explicit accessible fallback instead of relying on the primary interaction alone.'
		);
	}

	if (answers.frequency === 'frequent' && primary.criteriaScores.parentFriction >= 4) {
		points.add('This pattern may feel too heavy if adults hit it often.');
	}

	if (answers.touch === 'avoid' && primary.criteriaScores.complexity >= 4) {
		points.add(
			'Avoid overly tactile or precision-heavy behavior if forgiving interaction is a requirement.'
		);
	}

	if (primary.id !== backup.id) {
		points.add(
			`If the primary option feels too heavy in practice, ${backup.name} is the safer fallback.`
		);
	}

	if (points.size < 3) {
		for (const weakness of primary.weaknesses.slice(0, 3)) {
			points.add(weakness);
		}
	}

	return [...points].slice(0, 4);
}
