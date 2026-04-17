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
	outcome: string;
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
	subdued?: boolean;
};

export type SectionCopy = {
	hero: {
		kicker: string;
		intro: string;
	};
	proof: {
		kicker: string;
		title: string;
		description: string;
	};
	work: {
		kicker: string;
		title: string;
		description: string;
	};
	tools: {
		kicker: string;
		title: string;
		description: string;
		footer: string;
	};
	experience: {
		kicker: string;
		title: string;
		description: string;
	};
	about: {
		kicker: string;
		title: string;
		description: string;
	};
	collaboration: {
		kicker: string;
		title: string;
		description: string;
	};
	contact: {
		kicker: string;
		title: string;
		description: string;
		emailLabel: string;
	};
};

export const siteConfig = {
	name: 'Drilon Reçica',
	domain: 'recica.dev',
	role: 'Senior Mobile & Product Engineer',
	title: 'Drilon Reçica — Senior Mobile & Product Engineer',
	description:
		'Senior Mobile & Product Engineer specializing in Android, product architecture, legacy modernization, and practical developer tools.',
	supportingLine:
		'Mobile products, practical tools, and modern engineering that holds up in production.',
	email: 'drilonrecica.dev@gmail.com',
	cvPath: '/cv.pdf',
	image: '/og-image.png',
	socialLinks: [
		'https://github.com/drilonrecica',
		'https://linkedin.com/in/drilonrecica',
		'https://x.com/drilonre'
	]
} as const;

export const sectionCopy: SectionCopy = {
	hero: {
		kicker: 'Recica.dev / flagship',
		intro:
			'I build mobile products, modernize legacy systems, and lead delivery with product judgment across architecture and execution.'
	},
	proof: {
		kicker: 'Proof',
		title: 'Evidence first, resume second.',
		description:
			'Long-running Android depth, real modernization work, and product ownership that goes beyond implementation.'
	},
	work: {
		kicker: 'Selected Work',
		title: 'Three projects that show how I work in production.',
		description:
			'Public mobility, early-stage product building, and customer-facing retail, chosen because they reflect the kind of ownership and delivery I bring to real teams.'
	},
	tools: {
		kicker: 'Featured Tools',
		title: 'Useful tools, built with the same standards.',
		description:
			'I also build privacy-first utilities for everyday technical work. They are small on purpose, fast to use, and focused on removing friction.',
		footer:
			'Local-first, fast, and built for real day-to-day work without accounts, uploads, or unnecessary ceremony.'
	},
	experience: {
		kicker: 'Experience Snapshot',
		title: 'Enough context to scan quickly, with the full CV one click away.',
		description: 'A quick scan of the roles behind the work, with the full timeline in the CV.'
	},
	about: {
		kicker: 'How I Work',
		title: 'Clear thinking, durable systems, and product-minded execution.',
		description:
			'A few principles that shape how I build software, modernize existing systems, and work with teams.'
	},
	collaboration: {
		kicker: 'Collaboration',
		title: 'Best fit: senior mobile product work, modernization, and selective consulting.',
		description:
			'Most useful in roles and projects that need ownership, technical judgment, and delivery beyond ticket-by-ticket execution.'
	},
	contact: {
		kicker: 'Contact',
		title: 'Start with a direct conversation.',
		description:
			'Email is the best place to start for senior roles, consulting, or product conversations. The rest is here if you want more context first.',
		emailLabel: 'Direct email'
	}
};

export const navigation: NavItem[] = [
	{ label: 'Work', href: '#work' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'About', href: '#about' },
	{ label: 'Contact', href: '#contact' },
	{ label: 'Tools', href: '#tools' }
];

export const heroActions: ActionLink[] = [
	{ label: 'View selected work', href: '#work', style: 'primary' },
	{ label: 'Get in touch', href: '#contact', style: 'secondary' },
	{ label: 'Download CV', href: siteConfig.cvPath, style: 'text' }
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
			'Backed by independent products and tools with a bias toward real utility over demo work.'
	}
];

export const caseStudies: CaseStudy[] = [
	{
		title: 'Deutsche Bahn – Wohin Du Willst',
		role: 'Senior Android Developer',
		period: 'Nov 2023 — Present',
		summary:
			'Large public mobility product balancing legacy architecture, accessibility demands, and continuous delivery in a live Android codebase.',
		bullets: [
			'Led migration paths from MVP and RxJava toward MVVM, Coroutines, and Flow in key parts of the app.',
			'Improved accessibility and UI consistency for a broad public user base with real WCAG expectations.',
			'Helped decouple core features to reduce delivery friction across a large production system.'
		],
		outcome:
			'Raised long-term maintainability and delivery confidence without relying on a disruptive rewrite.',
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
			'Early-stage product moving from concept to a shippable foundation across app architecture, backend systems, and deployment.',
		bullets: [
			'Led ideation, technical direction, and end-to-end implementation as an early team member.',
			'Built the backend in Deno and TypeScript, and shipped the Flutter app from scratch.',
			'Owned core product foundations including navigation, localization, payments, persistence, and deployment.'
		],
		outcome:
			'Turned an early concept into a launch-ready product foundation with coherent decisions across the whole stack.',
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
			'Customer-facing retail product where scan-led shopping flows need to stay quick, clear, and reliable in real store use.',
		bullets: [
			'Built shopping flows linking scanning, in-store actions, and checkout-adjacent interactions.',
			'Worked inside a large production Android codebase with cross-disciplinary teams spanning mobile, backend, and product.',
			'Improved modernization and UI quality in a high-usage retail environment where speed and clarity matter.'
		],
		outcome:
			'Strengthened a production retail experience where usability and reliability directly affect everyday customer behavior.',
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

export const contactLinks: ContactLink[] = [
	{
		label: 'Email',
		href: `mailto:${siteConfig.email}`,
		description: 'Best route for senior roles, consulting, or product conversations.',
		eyebrow: 'Primary',
		primary: true
	},
	{
		label: 'LinkedIn',
		href: 'https://linkedin.com/in/drilonrecica',
		description: 'Professional background, work history, and the easiest social checkpoint.',
		eyebrow: 'Network'
	},
	{
		label: 'GitHub',
		href: 'https://github.com/drilonrecica',
		description: 'Public code, tools, and current technical context.',
		eyebrow: 'Code'
	},
	{
		label: 'Download CV',
		href: siteConfig.cvPath,
		description: 'Formal timeline for hiring loops and structured review.',
		eyebrow: 'Document'
	},
	{
		label: 'X / Twitter',
		href: 'https://x.com/drilonre',
		description: 'Occasional updates and lightweight public context.',
		eyebrow: 'Optional',
		subdued: true
	}
];

export const footerLinks: ActionLink[] = [
	{ label: 'Tools', href: 'https://tools.recica.dev', external: true },
	{ label: 'CV', href: siteConfig.cvPath },
	{ label: 'GitHub', href: 'https://github.com/drilonrecica', external: true },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/drilonrecica', external: true },
	{ label: 'Email', href: `mailto:${siteConfig.email}` }
];
