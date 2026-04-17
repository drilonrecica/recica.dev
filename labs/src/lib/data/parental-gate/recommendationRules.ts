import type {
	ParentalGatePattern,
	RecommendationAnswers,
	RecommendationQuestion,
	RiskFit,
	FrequencyFit
} from '$lib/types/parental-gate';

interface QuestionRule {
	answerWeights: Record<string, Partial<Record<ParentalGatePattern['id'], number>>>;
	rationale: Partial<Record<ParentalGatePattern['id'], string>>;
	watchOuts?: Partial<Record<ParentalGatePattern['id'], string>>;
}

export const recommendationQuestions: RecommendationQuestion[] = [
	{
		id: 'risk',
		prompt: 'How sensitive is the action behind the gate?',
		options: [
			{
				value: 'high',
				label: 'High risk',
				description: 'Purchases, account changes, or anything with meaningful consequences.'
			},
			{
				value: 'medium',
				label: 'Medium risk',
				description: 'Settings or profile changes that matter, but are still reversible.'
			},
			{
				value: 'low',
				label: 'Low risk',
				description: 'Lightweight adult confirmations with lower downside.'
			}
		]
	},
	{
		id: 'frequency',
		prompt: 'How often will adults hit this gate?',
		options: [
			{
				value: 'frequent',
				label: 'Frequent',
				description: 'The gate appears regularly, so parent speed matters a lot.'
			},
			{
				value: 'occasional',
				label: 'Occasional',
				description: 'It appears sometimes, but not on every session.'
			},
			{
				value: 'rare',
				label: 'Rare',
				description: 'It protects higher-stakes actions and can afford more friction.'
			}
		]
	},
	{
		id: 'literacy',
		prompt: 'Can you assume the adult can comfortably read and type?',
		options: [
			{
				value: 'yes',
				label: 'Yes',
				description: 'Reading and typing are reasonable assumptions in this flow.'
			},
			{
				value: 'mixed',
				label: 'Mixed',
				description:
					'Some adults can, but the product should still work well with lighter text demands.'
			},
			{
				value: 'no',
				label: 'No',
				description: 'Low-literacy or symbol-first interaction is important.'
			}
		]
	},
	{
		id: 'accessibility',
		prompt: 'How strong do accessibility accommodations need to be?',
		options: [
			{
				value: 'critical',
				label: 'Critical',
				description: 'The gate must have a strong accessible path from the start.'
			},
			{
				value: 'important',
				label: 'Important',
				description: 'Accessibility matters, but more moderate friction may still be acceptable.'
			},
			{
				value: 'baseline',
				label: 'Baseline',
				description:
					'Normal expectations apply, but the product can tolerate a tighter interaction.'
			}
		]
	},
	{
		id: 'touch',
		prompt: 'How comfortable are you with precision-heavy touch interaction?',
		options: [
			{
				value: 'avoid',
				label: 'Avoid precision',
				description: 'The interaction should stay generous and forgiving.'
			},
			{
				value: 'neutral',
				label: 'Neutral',
				description: 'Some visual interaction is acceptable, but not too fiddly.'
			},
			{
				value: 'comfortable',
				label: 'Comfortable',
				description: 'A more tactile challenge is acceptable if it improves resistance.'
			}
		]
	},
	{
		id: 'surface',
		prompt: 'Which surface are you protecting most directly?',
		options: [
			{
				value: 'purchase',
				label: 'Purchase / subscription',
				description: 'The gate protects a financially sensitive action.'
			},
			{
				value: 'settings',
				label: 'Settings / adult area',
				description: 'The gate protects product configuration or adult-only navigation.'
			},
			{
				value: 'general',
				label: 'General restricted flow',
				description: 'The gate protects a broader adult step without one dominant use case.'
			}
		]
	}
];

export const recommendationRules: Record<string, QuestionRule> = {
	risk: {
		answerWeights: {
			high: {
				'text-challenge': 5,
				'math-gate': 3,
				'drag-and-drop': 2
			},
			medium: {
				'math-gate': 3,
				'shape-color-recognition': 2,
				'pattern-matching': 2,
				'drag-and-drop': 1
			},
			low: {
				'hold-to-confirm': 5,
				'shape-color-recognition': 2,
				'pattern-matching': 1
			}
		},
		rationale: {
			'text-challenge': 'Higher-risk actions usually justify a more deliberate adult-only step.',
			'math-gate': 'Math prompts create moderate resistance without feeling as heavy as typing.',
			'hold-to-confirm': 'Lower-risk flows benefit from lighter intentional friction.'
		}
	},
	frequency: {
		answerWeights: {
			frequent: {
				'hold-to-confirm': 5,
				'math-gate': 2
			},
			occasional: {
				'math-gate': 3,
				'shape-color-recognition': 2,
				'pattern-matching': 2
			},
			rare: {
				'text-challenge': 4,
				'drag-and-drop': 2,
				'pattern-matching': 1
			}
		},
		rationale: {
			'hold-to-confirm':
				'Frequent gates need to respect parent speed or the product will feel hostile.',
			'text-challenge':
				'Rare, sensitive actions can absorb more friction without damaging the overall flow.'
		}
	},
	literacy: {
		answerWeights: {
			yes: {
				'text-challenge': 3,
				'math-gate': 3
			},
			mixed: {
				'pattern-matching': 2,
				'shape-color-recognition': 2,
				'hold-to-confirm': 2
			},
			no: {
				'shape-color-recognition': 4,
				'drag-and-drop': 3,
				'hold-to-confirm': 2,
				'math-gate': -2,
				'text-challenge': -3
			}
		},
		rationale: {
			'shape-color-recognition':
				'Low-literacy contexts need recognition-based interaction more than text entry.',
			'math-gate': 'If reading and numeracy are comfortable, math remains a compact option.'
		},
		watchOuts: {
			'text-challenge':
				'Typing-heavy patterns are a poor fit when you cannot rely on comfortable reading or input.',
			'math-gate': 'Math prompts lose value quickly in lower-literacy contexts.'
		}
	},
	accessibility: {
		answerWeights: {
			critical: {
				'hold-to-confirm': 4,
				'text-challenge': 3,
				'math-gate': 2,
				'shape-color-recognition': 1
			},
			important: {
				'math-gate': 2,
				'pattern-matching': 2,
				'shape-color-recognition': 1
			},
			baseline: {
				'drag-and-drop': 2,
				'pattern-matching': 2
			}
		},
		rationale: {
			'hold-to-confirm':
				'Simple, well-signaled hold interactions adapt better than precision-heavy drag-only gates.',
			'text-challenge':
				'Typed input can be made accessible more reliably than purely visual puzzles.'
		},
		watchOuts: {
			'drag-and-drop':
				'Drag-only interaction should not be your default when accessibility requirements are strict.'
		}
	},
	touch: {
		answerWeights: {
			avoid: {
				'text-challenge': 2,
				'math-gate': 2,
				'hold-to-confirm': 2
			},
			neutral: {
				'pattern-matching': 2,
				'shape-color-recognition': 2
			},
			comfortable: {
				'drag-and-drop': 4,
				'pattern-matching': 2
			}
		},
		rationale: {
			'drag-and-drop':
				'If the product can tolerate a more tactile interaction, drag gates add stronger resistance.',
			'hold-to-confirm':
				'When precision should stay low, hold interactions are a safer tactile compromise.'
		}
	},
	surface: {
		answerWeights: {
			purchase: {
				'text-challenge': 4,
				'math-gate': 3
			},
			settings: {
				'hold-to-confirm': 3,
				'math-gate': 1,
				'shape-color-recognition': 3
			},
			general: {
				'pattern-matching': 3,
				'shape-color-recognition': 2,
				'math-gate': 1
			}
		},
		rationale: {
			'text-challenge':
				'Financially sensitive actions usually justify a more explicit adult confirmation.',
			'hold-to-confirm':
				'Settings access often benefits from a lighter gate that still signals intent.',
			'pattern-matching':
				'General restricted flows benefit from patterns that feel adaptable and product-friendly.'
		}
	}
};

export function fitsRisk(pattern: ParentalGatePattern, risk: RiskFit): boolean {
	return pattern.riskFit.includes(risk);
}

export function fitsFrequency(pattern: ParentalGatePattern, frequency: FrequencyFit): boolean {
	return pattern.frequencyFit.includes(frequency);
}

export function collectRuleEntries(answers: RecommendationAnswers) {
	return recommendationQuestions
		.map((question) => {
			const value = answers[question.id];

			if (!value) {
				return null;
			}

			return {
				question,
				value,
				rule: recommendationRules[question.id]
			};
		})
		.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}
