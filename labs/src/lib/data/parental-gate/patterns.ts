import type { ParentalGatePattern } from '$lib/types/parental-gate';

export const parentalGatePatterns: ParentalGatePattern[] = [
	{
		id: 'math-gate',
		slug: 'math-gate',
		name: 'Math Gate',
		summary: 'A simple arithmetic prompt that asks the adult to solve a small equation.',
		bestFor:
			'Settings, purchases, and flows where literacy is available but accidental taps are common.',
		description:
			'Math gates are familiar, compact, and easy to explain. They work best when the adult can read the prompt and solve a small task quickly.',
		strengths: [
			'Fast for adults who can read and calculate comfortably.',
			'Compact UI that works well in settings and purchase confirmation flows.',
			'Easy to randomize without adding much engineering overhead.'
		],
		weaknesses: [
			'Not ideal for very low-literacy contexts.',
			'Can fail accessibility expectations if the math prompt is purely visual.',
			'Older children may eventually memorize the pattern.'
		],
		accessibilityNotes: [
			'Expose the prompt as real text, not an image.',
			'Allow clear focus order and error messaging for keyboard users.',
			'Give enough contrast and spacing for adults under time pressure.'
		],
		implementationNotes: [
			'Generate prompts from a constrained range so difficulty stays predictable.',
			'Reset attempts cleanly after failure and avoid silent input clearing.',
			'Do not use visual distortion or CAPTCHA-style obfuscation.'
		],
		criteriaScores: {
			childResistance: 3,
			parentFriction: 2,
			accessibility: 3,
			complexity: 2,
			speed: 4,
			breadth: 4
		},
		demoType: 'math',
		recommendationTags: ['settings', 'purchases', 'fast-parent-flow'],
		riskFit: ['medium', 'high'],
		frequencyFit: ['occasional', 'frequent'],
		interactionConstraints: ['screen-reader', 'time-sensitive']
	},
	{
		id: 'hold-to-confirm',
		slug: 'hold-to-confirm',
		name: 'Hold-to-Confirm Gate',
		summary: 'A hold gesture adds intention without asking the adult to read or solve a challenge.',
		bestFor: 'Frequent confirmations where parent speed matters more than maximum resistance.',
		description:
			'Hold-to-confirm is fast, calm, and familiar on touch devices. It is useful when you want intentional friction without breaking flow.',
		strengths: [
			'Very fast for adults once the pattern is understood.',
			'Works well for repeat settings access and lightweight confirmations.',
			'Can be adapted for both touch and keyboard input.'
		],
		weaknesses: [
			'Resistance is lower than knowledge-based challenges.',
			'Long holds can be frustrating if timing is inconsistent.',
			'Needs careful feedback so users know the gesture is active.'
		],
		accessibilityNotes: [
			'Provide a keyboard hold interaction or explicit accessible alternative.',
			'Avoid relying on subtle progress changes alone; announce state clearly.',
			'Do not make the required hold duration excessive.'
		],
		implementationNotes: [
			'Use a deterministic duration and visible progress.',
			'Cancel cleanly on pointer release, blur, or escape conditions.',
			'Test on lower-end mobile devices to make sure progress animation stays smooth.'
		],
		criteriaScores: {
			childResistance: 2,
			parentFriction: 1,
			accessibility: 4,
			complexity: 2,
			speed: 5,
			breadth: 3
		},
		demoType: 'hold',
		recommendationTags: ['fast-parent-flow', 'settings', 'accessible-first'],
		riskFit: ['low', 'medium'],
		frequencyFit: ['frequent', 'occasional'],
		interactionConstraints: ['screen-reader', 'motor-sensitive', 'time-sensitive']
	},
	{
		id: 'drag-and-drop',
		slug: 'drag-and-drop',
		name: 'Drag-and-Drop Gate',
		summary: 'An adult moves a target item into a drop zone to prove intentional control.',
		bestFor:
			'Touch-first flows where you want more resistance than a simple tap, with accessible fallback support.',
		description:
			'Drag gates add a stronger motor step and feel more deliberate, but they require careful fallback behavior for accessibility and precision-sensitive contexts.',
		strengths: [
			'Adds meaningful friction without relying on reading or numeracy.',
			'Feels playful while still product-appropriate for family apps.',
			'Can work well when the interaction itself reinforces “adult action required.”'
		],
		weaknesses: [
			'Precision-heavy interaction can block some adults.',
			'More complex to implement and QA across devices.',
			'Needs accessible fallback instead of drag-only behavior.'
		],
		accessibilityNotes: [
			'Always include a keyboard or button-based fallback path.',
			'Large touch targets and forgiving drop zones are mandatory.',
			'Do not assume color or motion alone explains the task.'
		],
		implementationNotes: [
			'Model drag state separately from success state so resets are predictable.',
			'Support both pointer and fallback selection flows in the same component.',
			'Validate success only when the intended item reaches the target zone.'
		],
		criteriaScores: {
			childResistance: 4,
			parentFriction: 3,
			accessibility: 2,
			complexity: 4,
			speed: 2,
			breadth: 3
		},
		demoType: 'drag',
		recommendationTags: ['touch-friendly', 'low-literacy'],
		riskFit: ['medium', 'high'],
		frequencyFit: ['rare', 'occasional'],
		interactionConstraints: ['limited-precision', 'motor-sensitive', 'color-vision']
	},
	{
		id: 'shape-color-recognition',
		slug: 'shape-color-recognition',
		name: 'Shape / Color Recognition Gate',
		summary: 'The adult selects a specific combination such as the blue triangle or all circles.',
		bestFor: 'Low-literacy contexts where you still want a compact and explainable challenge.',
		description:
			'Recognition gates are useful when reading and math should not be required, but they need careful visual design to avoid excluding adults with visual differences.',
		strengths: [
			'Readable at a glance and suitable for lower-literacy contexts.',
			'Flexible enough for many visual prompt styles.',
			'Good balance between simple interaction and stronger resistance than a tap.'
		],
		weaknesses: [
			'Color-only prompts can create accessibility failures.',
			'Too many options quickly turns the pattern into visual clutter.',
			'Children may solve simpler prompts by chance.'
		],
		accessibilityNotes: [
			'Combine shape, label, and color rather than color-only instruction.',
			'Keep target count and visual density controlled.',
			'Ensure screen readers announce the prompt and each selectable option clearly.'
		],
		implementationNotes: [
			'Use a constrained token set so prompt generation stays understandable.',
			'Represent options as buttons, not decorative divs.',
			'Pair color with text or icons in the data model.'
		],
		criteriaScores: {
			childResistance: 3,
			parentFriction: 2,
			accessibility: 3,
			complexity: 3,
			speed: 3,
			breadth: 4
		},
		demoType: 'shape',
		recommendationTags: ['low-literacy', 'settings', 'touch-friendly'],
		riskFit: ['medium'],
		frequencyFit: ['occasional'],
		interactionConstraints: ['color-vision', 'screen-reader']
	},
	{
		id: 'text-challenge',
		slug: 'text-challenge',
		name: 'Text Challenge Gate',
		summary: 'The adult types a short word or phrase exactly as instructed.',
		bestFor:
			'Higher-risk actions where strong certainty matters and the adult can comfortably read and type.',
		description:
			'Text challenges are more deliberate than quick recognition patterns and can create strong intent signals for critical actions like purchases or account changes.',
		strengths: [
			'High intentionality for sensitive actions.',
			'Easy to adapt with semantic labels and clear instructions.',
			'Good fit when the flow should feel clearly “adult only.”'
		],
		weaknesses: [
			'Typing is slower and more error-prone on mobile.',
			'Less suitable for frequent gates.',
			'Poor fit for low-literacy or rushed contexts.'
		],
		accessibilityNotes: [
			'Keep target text short and clearly announced.',
			'Do not rely on unusual capitalization or punctuation traps.',
			'Make error recovery straightforward without shame-inducing copy.'
		],
		implementationNotes: [
			'Normalize whitespace carefully but avoid over-correcting wrong answers.',
			'Use real form fields and platform keyboard hints.',
			'Rate-limit retries only if abuse risk genuinely warrants it.'
		],
		criteriaScores: {
			childResistance: 4,
			parentFriction: 4,
			accessibility: 4,
			complexity: 2,
			speed: 2,
			breadth: 4
		},
		demoType: 'text',
		recommendationTags: ['high-risk', 'purchases', 'broad-audience'],
		riskFit: ['high'],
		frequencyFit: ['rare'],
		interactionConstraints: ['screen-reader', 'time-sensitive']
	},
	{
		id: 'pattern-matching',
		slug: 'pattern-matching',
		name: 'Pattern Matching Gate',
		summary: 'The adult finds the matching sequence, tile, or symbol among a small set of options.',
		bestFor:
			'Family-facing interfaces that want moderate resistance with broader visual flexibility.',
		description:
			'Pattern matching can feel more distinctive than math or text while still staying compact. It works best when the matching rule is obvious once seen.',
		strengths: [
			'More visually distinctive than common math prompts.',
			'Can balance resistance and speed well with a tight option set.',
			'Good fit for product surfaces that benefit from a more branded interaction.'
		],
		weaknesses: [
			'Rules that are too abstract create cognitive friction.',
			'Needs careful explanation to avoid trial-and-error confusion.',
			'Can become noisy if the visual set is over-designed.'
		],
		accessibilityNotes: [
			'Make the matching rule explicit in text, not only visual layout.',
			'Provide button semantics and visible focus states on every option.',
			'Keep symbol differences large enough for low-vision users.'
		],
		implementationNotes: [
			'Use a small, consistent token vocabulary across rounds.',
			'Separate prompt rendering from answer options so assistive text stays clean.',
			'Ensure the correct option is not predictable from position alone.'
		],
		criteriaScores: {
			childResistance: 3,
			parentFriction: 3,
			accessibility: 3,
			complexity: 3,
			speed: 3,
			breadth: 4
		},
		demoType: 'pattern',
		recommendationTags: ['broad-audience', 'touch-friendly', 'settings'],
		riskFit: ['medium'],
		frequencyFit: ['occasional', 'rare'],
		interactionConstraints: ['screen-reader', 'limited-precision']
	}
];

export const parentalGatePatternMap = new Map(
	parentalGatePatterns.map((pattern) => [pattern.id, pattern] as const)
);
