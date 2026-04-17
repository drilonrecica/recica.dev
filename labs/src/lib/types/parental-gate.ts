export const criteriaKeys = [
	'childResistance',
	'parentFriction',
	'accessibility',
	'complexity',
	'speed',
	'breadth'
] as const;

export type CriterionKey = (typeof criteriaKeys)[number];

export interface CriteriaScores {
	childResistance: number;
	parentFriction: number;
	accessibility: number;
	complexity: number;
	speed: number;
	breadth: number;
}

export type ParentalGateDemoType = 'math' | 'hold' | 'drag' | 'shape' | 'text' | 'pattern';

export type RecommendationTag =
	| 'high-risk'
	| 'low-literacy'
	| 'fast-parent-flow'
	| 'settings'
	| 'purchases'
	| 'broad-audience'
	| 'accessible-first'
	| 'touch-friendly';

export type RiskFit = 'low' | 'medium' | 'high';
export type FrequencyFit = 'rare' | 'occasional' | 'frequent';
export type InteractionConstraint =
	| 'screen-reader'
	| 'low-literacy'
	| 'motor-sensitive'
	| 'color-vision'
	| 'limited-precision'
	| 'time-sensitive';

export interface ParentalGatePattern {
	id: string;
	slug: string;
	name: string;
	summary: string;
	bestFor: string;
	description: string;
	strengths: string[];
	weaknesses: string[];
	accessibilityNotes: string[];
	implementationNotes: string[];
	criteriaScores: CriteriaScores;
	demoType: ParentalGateDemoType;
	recommendationTags: RecommendationTag[];
	riskFit: RiskFit[];
	frequencyFit: FrequencyFit[];
	interactionConstraints: InteractionConstraint[];
}

export interface RecommendationQuestionOption {
	value: string;
	label: string;
	description: string;
}

export interface RecommendationQuestion {
	id: string;
	prompt: string;
	options: RecommendationQuestionOption[];
}

export type RecommendationAnswers = Record<string, string>;

export interface RecommendationResult {
	primary: ParentalGatePattern;
	backup: ParentalGatePattern;
	rationale: string[];
	watchOuts: string[];
	scoreBreakdown: Array<{ patternId: string; score: number }>;
}
