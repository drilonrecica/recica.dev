export const siteName = 'Labs by Drilon Recica';
export const siteTagline = 'Experiments, prototypes, and product explorations.';
export const defaultSocialImagePath = '/og-labs.svg';
export const defaultRobotsDirectives =
	'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const personCanonicalUrl = 'https://recica.dev';
const personSchemaId = `${personCanonicalUrl}#person`;

export function serializeJsonLd(value: unknown): string {
	return JSON.stringify(value).replaceAll('<', '\\u003c');
}

function buildPersonReference() {
	return {
		'@type': 'Person',
		'@id': personSchemaId,
		name: 'Drilon Reçica',
		url: personCanonicalUrl
	};
}

export function buildWebsiteSchema(origin: string, description: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteName,
		url: origin,
		description,
		inLanguage: 'en',
		creator: buildPersonReference(),
		publisher: buildPersonReference()
	};
}

export function buildCollectionPageSchema(
	origin: string,
	path: string,
	name: string,
	description: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name,
		url: new URL(path, origin).toString(),
		description,
		about: buildPersonReference(),
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
		about: buildPersonReference(),
		isPartOf: {
			'@type': 'WebSite',
			name: siteName,
			url: origin
		}
	};
}

export function buildItemListSchema(
	origin: string,
	name: string,
	items: Array<{ name: string; path: string; description?: string }>
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name,
		numberOfItems: items.length,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'WebPage',
				name: item.name,
				url: new URL(item.path, origin).toString(),
				description: item.description
			}
		}))
	};
}

export function buildWebApplicationSchema(
	origin: string,
	path: string,
	name: string,
	description: string,
	imagePath: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name,
		url: new URL(path, origin).toString(),
		description,
		applicationCategory: 'EducationalApplication',
		operatingSystem: 'Web',
		browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
		inLanguage: 'en',
		isAccessibleForFree: true,
		image: new URL(imagePath, origin).toString(),
		creator: buildPersonReference(),
		publisher: buildPersonReference(),
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		}
	};
}

export function buildPersonSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': personSchemaId,
		name: 'Drilon Reçica',
		jobTitle: 'Senior Mobile & Product Engineer',
		url: personCanonicalUrl,
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
