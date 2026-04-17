export const parentalGateFaq = [
	{
		question: 'What is a parental gate in an app?',
		answer:
			'A parental gate is a deliberate interaction step that helps prevent children from entering settings, purchases, subscriptions, account areas, or other adult-only surfaces by mistake.'
	},
	{
		question: 'Is there one parental gate pattern that is always best?',
		answer:
			'No. The right gate depends on the risk level, how often the flow appears, the likely child age, the literacy context, and the accessibility expectations for adults.'
	},
	{
		question: 'Are parental gates just for purchase flows?',
		answer:
			'No. They are also useful for settings, profile changes, adult dashboards, subscription management, and any surface where accidental child interaction creates real consequences.'
	},
	{
		question: 'Should a parental gate be hard to solve?',
		answer:
			'It should be intentionally resistant to accidental child interaction, but not punishing for adults. Excessive friction damages the product just as much as weak gating.'
	},
	{
		question: 'Do parental gates need accessibility support?',
		answer:
			'Yes. A gate that blocks adults with accessibility needs is not a good gate. Accessible fallback paths and clear semantics are part of the design, not optional extras.'
	}
] as const;
