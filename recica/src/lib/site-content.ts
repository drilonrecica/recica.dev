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
	origin: 'https://recica.dev',
	labsUrl: 'https://labs.recica.dev',
	toolsUrl: 'https://tools.recica.dev',
	role: 'Senior Mobile & Product Engineer',
	title: 'Drilon Reçica — Senior Mobile, Android & Product Engineer',
	description:
		'Senior Mobile, Android & Product Engineer specializing in product architecture, legacy modernization, accessible mobile delivery, and practical developer tools.',
	supportingLine:
		'Android products, practical developer tools, and modern engineering that holds up in production.',
	email: 'drilonrecica.dev@gmail.com',
	cvPath: '/cv.pdf',
	image: '/og-image.png',
	imageAlt: 'Drilon Reçica flagship site preview',
	twitterHandle: '@drilonre',
	socialLinks: [
		'https://github.com/drilonrecica',
		'https://linkedin.com/in/drilonrecica',
		'https://x.com/drilonre'
	]
} as const;

export const sectionCopy: SectionCopy = {
	hero: {
		intro:
			'I lead Android and mobile product engineering, modernize existing systems, and ship delivery that stands up in production.'
	},
	proof: {
		kicker: 'Proof',
		title: 'Depth that shows up in production.',
		description:
			'Android depth, modernization work, accessibility, and 0-to-1 delivery across very different product environments.'
	},
	work: {
		kicker: 'Selected Work',
		title: 'Selected work that shows the level I operate at.',
		description:
			'Three projects that show delivery ownership across public mobility, 0-to-1 product work, and customer-facing retail.'
	},
	tools: {
		kicker: 'Featured Tools',
		title: 'Practical tools, built the same way.',
		description:
			'I build browser-based utilities and public experiments for the kind of technical work teams do every day: fast, local-first, and useful without extra ceremony.',
		footer:
			'Tools stay privacy-first. Labs stays public and exploratory.'
	},
	experience: {
		kicker: 'Experience Snapshot',
		title: 'Enough context to scan quickly, with the full CV one click away.'
	},
	about: {
		kicker: 'How I Work',
		title: 'Clear thinking, durable systems, and product-minded execution.',
		description:
			'Principles that shape how I build software, make systems safer to evolve, and work with teams.'
	},
	collaboration: {
		kicker: 'Collaboration',
		title: 'Open to senior mobile product work, modernization, and selective consulting.',
		description:
			'Best fit where product judgment, technical ownership, and reliable delivery matter as much as implementation.'
	},
	contact: {
		kicker: 'Contact',
		title: 'Email is the fastest way in.',
		description:
			'Best for senior roles, consulting, and product conversations.',
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
			'Large public mobility product balancing legacy architecture, accessibility requirements, and continuous delivery in a live Android codebase.',
		bullets: [
			'Led migration paths from MVP and RxJava toward MVVM, Coroutines, and Flow in critical parts of the app.',
			'Improved accessibility and UI consistency while reducing coupling in core product flows.'
		],
		outcome:
			'Made ongoing delivery safer in a large public mobility app without relying on a disruptive rewrite.',
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
			'Early-stage product moving from concept to a launch-ready foundation across app architecture, backend systems, and deployment.',
		bullets: [
			'Owned ideation, technical direction, and end-to-end implementation as an early core team member.',
			'Built the backend in Deno and TypeScript, shipped the Flutter app from scratch, and set up the product foundations around it.'
		],
		outcome:
			'Took a 0-to-1 product from concept to a launch-ready foundation across product, app, backend, and deployment.',
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
			'Customer-facing retail product where scan-led shopping flows need to stay fast, clear, and reliable in real store use.',
		bullets: [
			'Built shopping flows linking scanning, in-store actions, and checkout-adjacent interactions inside a large production Android app.',
			'Improved UI quality and modernization in a retail environment where hesitation directly damages the experience.'
		],
		outcome:
			'Improved in-store reliability and UX clarity in a product where shopper confidence depends on speed and low friction.',
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
		summary: 'Modernizing a live public mobility app without slowing delivery.'
	},
	{
		title: 'Qisara',
		role: 'Tech Lead & Senior Software Engineer',
		period: '2023 — 2024',
		summary: '0-to-1 product delivery across product, app, backend, and infrastructure.'
	},
	{
		title: 'EDEKA – Scan & Go',
		role: 'Senior Android Developer',
		period: 'Aug 2022 — Nov 2023',
		summary: 'Shipping retail flows where scan-to-checkout speed and clarity mattered in store.'
	},
	{
		title: 'RMVGo',
		role: 'Senior Android Developer',
		period: 'Jun 2020 — Aug 2022',
		summary: 'Stabilized and improved a transit app under everyday production use.'
	},
	{
		title: 'easyCredit / Fymio & ErgoDirekt',
		role: 'Senior Android Developer',
		period: '2015 — 2020',
		summary: 'Built fintech and insurance products across Kotlin, Java, architecture, and early Flutter.'
	}
];

export const principles: Principle[] = [
	{
		title: 'Product-minded engineering',
		description:
			'I treat product context as part of engineering, not as a separate concern handed over later.'
	},
	{
		title: 'Modernization without reckless rewrites',
		description:
			'I move legacy systems forward incrementally, with cleaner boundaries and safer delivery at each step.'
	},
	{
		title: 'Strong mobile foundations',
		description:
			'I bias toward mobile architectures teams can maintain under real release pressure.'
	},
	{
		title: 'Ownership beyond the app surface',
		description:
			'I am comfortable owning the seams between app, backend, infrastructure, and product decisions.'
	}
];

export const contactLinks: ContactLink[] = [
	{
		label: 'Email',
		href: `mailto:${siteConfig.email}`,
		description: 'Best route for roles, consulting, or product conversations.',
		eyebrow: 'Primary',
		primary: true
	},
	{
		label: 'LinkedIn',
		href: 'https://linkedin.com/in/drilonrecica',
		description: 'Background, work history, and the quickest professional checkpoint.',
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
		description: 'Occasional public notes.',
		eyebrow: 'Optional',
		subdued: true
	}
];

export const footerLinks: ActionLink[] = [
	{ label: 'Tools', href: siteConfig.toolsUrl, external: true },
	{ label: 'Labs', href: siteConfig.labsUrl, external: true },
	{ label: 'CV', href: siteConfig.cvPath },
	{ label: 'GitHub', href: 'https://github.com/drilonrecica', external: true },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/drilonrecica', external: true },
	{ label: 'Email', href: `mailto:${siteConfig.email}` }
];
