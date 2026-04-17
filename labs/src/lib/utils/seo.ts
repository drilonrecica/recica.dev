export const siteName = 'Labs by Drilon Recica';
export const siteTagline = 'Experiments, prototypes, and product explorations.';
export const defaultSocialImagePath = '/og-labs.svg';

export function serializeJsonLd(value: unknown): string {
	return JSON.stringify(value).replaceAll('<', '\\u003c');
}

export function buildWebsiteSchema(origin: string, description: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteName,
		url: origin,
		description,
		inLanguage: 'en'
	};
}

export function buildCollectionPageSchema(origin: string, description: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `${siteName} Home`,
		url: origin,
		description,
		isPartOf: {
			'@type': 'WebSite',
			name: siteName,
			url: origin
		}
	};
}

export function buildWebPageSchema(
	origin: string,
	path: string,
	name: string,
	description: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name,
		url: new URL(path, origin).toString(),
		description,
		isPartOf: {
			'@type': 'WebSite',
			name: siteName,
			url: origin
		}
	};
}

export function buildPersonSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Drilon Reçica',
		jobTitle: 'Senior Mobile & Product Engineer',
		url: 'https://recica.dev',
		sameAs: ['https://github.com/drilonrecica', 'https://www.linkedin.com/in/drilonrecica']
	};
}

export function buildFaqSchema(items: ReadonlyArray<{ question: string; answer: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	};
}

export function buildBreadcrumbSchema(
	origin: string,
	items: Array<{ name: string; path: string }>
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: new URL(item.path, origin).toString()
		}))
	};
}
