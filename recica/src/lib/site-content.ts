export type NavItem = {
	label: string;
	href: `#${string}`;
};

export type ActionLink = {
	label: string;
	href: string;
	style?: 'primary' | 'secondary' | 'text';
	external?: boolean;
};

export type ProofItem = {
	title: string;
	description: string;
};

export type CaseStudyTone = 'cobalt' | 'gold' | 'forest';

export type CaseStudy = {
	title: string;
	role: string;
	period: string;
	summary: string;
	bullets: string[];
	stack: string[];
	href: string;
	linkLabel: string;
	tone: CaseStudyTone;
};

export type ToolHighlight = {
	name: string;
	href: string;
	description: string;
	category: string;
};

export type ExperienceItem = {
	title: string;
	role: string;
	period: string;
	summary: string;
};

export type Principle = {
	title: string;
	description: string;
};

export type ContactLink = {
	label: string;
	href: string;
	description: string;
	eyebrow: string;
	primary?: boolean;
};

export const siteConfig = {
	name: 'Drilon Reçica',
	domain: 'recica.dev',
	role: 'Senior Mobile & Product Engineer',
	title: 'Drilon Reçica — Senior Mobile & Product Engineer',
	description:
		'Senior Mobile & Product Engineer specializing in Android, product architecture, legacy modernization, and practical developer tools.',
	supportingLine:
		'Building polished mobile apps, practical developer tools, and modern digital products.',
	intro:
		'I design and ship mobile products, modernize legacy systems, and lead product-minded engineering work across architecture, delivery, and user experience.',
	email: 'drilonrecica.dev@gmail.com',
	cvPath: '/cv.pdf',
	image: '/og-image.png',
	socialLinks: [
		'https://github.com/drilonrecica',
		'https://linkedin.com/in/drilonrecica',
		'https://x.com/drilonre'
	]
} as const;

export const navigation: NavItem[] = [
	{ label: 'Work', href: '#work' },
	{ label: 'Tools', href: '#tools' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'About', href: '#about' },
	{ label: 'Contact', href: '#contact' }
];

export const heroActions: ActionLink[] = [
	{ label: 'View selected work', href: '#work', style: 'primary' },
	{ label: 'Get in touch', href: '#contact', style: 'secondary' },
	{ label: 'Download CV', href: siteConfig.cvPath, style: 'text' },
	{
		label: 'Explore tools',
		href: 'https://tools.recica.dev',
		style: 'text',
		external: true
	}
];

export const proofItems: ProofItem[] = [
	{
		title: 'Android since 2012',
		description:
			'Built through every major platform shift, from Java and XML to modern Kotlin-first Android stacks.'
	},
	{
		title: '13+ years in production software',
		description:
			'Long-running experience across enterprise mobility, retail, fintech, insurance, and startup product work.'
	},
	{
		title: 'Legacy systems modernized',
		description:
			'Moved large codebases away from MVP and RxJava toward maintainable MVVM, Coroutines, Flow, and modular boundaries.'
	},
	{
		title: 'Accessibility that ships',
		description:
			'Improved mobile UI quality and accessibility for public-facing products where standards and usability both matter.'
	},
	{
		title: '0-to-1 product leadership',
		description:
			'Led product architecture, backend foundations, and delivery for a greenfield startup product from concept to launch.'
	},
	{
		title: 'Practical builder mindset',
		description:
			'Employer and client work is backed by independent products, useful tools, and a strong bias toward real utility.'
	}
];

export const caseStudies: CaseStudy[] = [
	{
		title: 'Deutsche Bahn – Wohin Du Willst',
		role: 'Senior Android Developer',
		period: 'Nov 2023 — Present',
		summary:
			'Modernizing a large public mobility product with stronger architecture, better accessibility, and more reliable delivery.',
		bullets: [
			'Led migration from legacy MVP and RxJava patterns toward MVVM, Coroutines, and Flow.',
			'Improved accessibility and UI quality for a broad public user base with real WCAG expectations.',
			'Helped decouple core features to improve build times, maintainability, and team velocity.'
		],
		stack: ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Flow', 'Accessibility'],
		href: 'https://play.google.com/store/apps/details?id=de.dbregio.wohinduwillst',
		linkLabel: 'Open on Play Store',
		tone: 'cobalt'
	},
	{
		title: 'Qisara',
		role: 'Tech Lead & Senior Software Engineer',
		period: '2023 — 2024',
		summary:
			'0-to-1 product work spanning product direction, Flutter app architecture, backend foundations, and infrastructure setup.',
		bullets: [
			'Led ideation, architecture, and end-to-end implementation as an early-stage startup team member.',
			'Built the backend with Deno.js and TypeScript, and shipped the Flutter app from scratch.',
			'Owned core product foundations including navigation, localization, payments, persistence, and deployment.'
		],
		stack: ['Flutter', 'Deno', 'TypeScript', 'Coolify', 'VPS Infrastructure'],
		href: 'https://qisara.com/',
		linkLabel: 'Visit product',
		tone: 'forest'
	},
	{
		title: 'EDEKA – Scan & Go',
		role: 'Senior Android Developer',
		period: 'Aug 2022 — Nov 2023',
		summary:
			'Mobile retail work focused on scan-based shopping flows, customer-facing reliability, and the bridge between in-store and digital behavior.',
		bullets: [
			'Built practical shopping flows connecting scanning, checkout-adjacent interactions, and customer-facing retail UX.',
			'Worked inside a large production Android codebase with cross-disciplinary teams spanning mobile, backend, and product.',
			'Contributed to modernization and UI quality in a high-usage retail environment where speed and clarity matter.'
		],
		stack: ['Android', 'Kotlin', 'Jetpack Compose', 'Retail UX'],
		href: 'https://play.google.com/store/apps/details?id=de.edeka.genuss',
		linkLabel: 'Open on Play Store',
		tone: 'gold'
	}
];

export const featuredTools: ToolHighlight[] = [
	{
		name: 'JSON Formatter / Validator',
		href: 'https://tools.recica.dev/json',
		description:
			'Local formatting, validation, and parse feedback for the payloads you actually work with every day.',
		category: 'Format'
	},
	{
		name: 'QR Code Generator',
		href: 'https://tools.recica.dev/qr',
		description:
			'Practical QR generation for text, URLs, Wi-Fi credentials, email, phone, and SMS with local exports.',
		category: 'Share'
	},
	{
		name: 'Regex Tester',
		href: 'https://tools.recica.dev/regex',
		description:
			'Readable ECMAScript regex testing with capture groups, replace preview, and zero dependence on remote services.',
		category: 'Inspect'
	}
];

export const experienceItems: ExperienceItem[] = [
	{
		title: 'Deutsche Bahn – Wohin Du Willst',
		role: 'Senior Android Developer',
		period: 'Nov 2023 — Present',
		summary:
			'Architecture modernization, accessibility improvements, and long-term maintainability for a public mobility product.'
	},
	{
		title: 'Qisara',
		role: 'Tech Lead & Senior Software Engineer',
		period: '2023 — 2024',
		summary:
			'Greenfield product work across mobile, backend, infrastructure, and technical ownership.'
	},
	{
		title: 'EDEKA – Scan & Go',
		role: 'Senior Android Developer',
		period: 'Aug 2022 — Nov 2023',
		summary:
			'Retail app engineering for scan-led shopping flows and production Android delivery.'
	},
	{
		title: 'RMVGo',
		role: 'Senior Android Developer',
		period: 'Jun 2020 — Aug 2022',
		summary:
			'Transit app stabilization and modernization across reliability, mobility features, and delivery quality.'
	},
	{
		title: 'easyCredit / Fymio & ErgoDirekt',
		role: 'Senior Android Developer',
		period: '2015 — 2020',
		summary:
			'FinTech and insurance product development across Kotlin, Java, architectural setup, and early Flutter work.'
	}
];

export const principles: Principle[] = [
	{
		title: 'Product-minded engineering',
		description:
			'I care about what the product is doing for users and the business, not just whether the ticket is technically complete.'
	},
	{
		title: 'Modernization without reckless rewrites',
		description:
			'I like moving legacy systems forward carefully: clearer boundaries, better delivery confidence, and less long-term chaos.'
	},
	{
		title: 'Strong mobile foundations',
		description:
			'I default to maintainable architecture, readable code, and mobile experiences that stay reliable as products grow.'
	},
	{
		title: 'Ownership beyond the app surface',
		description:
			'I operate comfortably where product direction, backend systems, infrastructure, and execution all meet.'
	}
];

export const collaboration = {
	title: 'Open to senior roles, consulting engagements, and selected product collaborations.',
	description:
		'Especially interested in mobile product engineering, architecture modernization, and practical product work where strong execution matters.'
} as const;

export const contactLinks: ContactLink[] = [
	{
		label: 'Email',
		href: `mailto:${siteConfig.email}`,
		description: 'Best route for serious conversations, consulting, or role discussions.',
		eyebrow: 'Primary',
		primary: true
	},
	{
		label: 'LinkedIn',
		href: 'https://linkedin.com/in/drilonrecica',
		description: 'Professional profile, background, and the easiest social touchpoint.',
		eyebrow: 'Network'
	},
	{
		label: 'GitHub',
		href: 'https://github.com/drilonrecica',
		description: 'Public code, current experiments, and technical context beyond the homepage.',
		eyebrow: 'Code'
	},
	{
		label: 'Download CV',
		href: siteConfig.cvPath,
		description: 'Clean chronological history for recruiters, hiring managers, and formal review.',
		eyebrow: 'Document'
	},
	{
		label: 'X / Twitter',
		href: 'https://x.com/drilonre',
		description: 'Lower-priority public channel for lightweight updates and shared work.',
		eyebrow: 'Optional'
	}
];

export const footerLinks: ActionLink[] = [
	{ label: 'Tools', href: 'https://tools.recica.dev', external: true },
	{ label: 'CV', href: siteConfig.cvPath },
	{ label: 'GitHub', href: 'https://github.com/drilonrecica', external: true },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/drilonrecica', external: true },
	{ label: 'Email', href: `mailto:${siteConfig.email}` }
];
