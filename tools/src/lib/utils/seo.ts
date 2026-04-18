import type { ToolDefinition } from '$lib/types/tool';

export const siteName = 'Recica Tools';
export const siteTagline = 'Practical tools, built in the Recica Lab.';
export const defaultSocialImagePath = '/og-default.svg';

/**
 * Safely serializes JSON-LD data for inline script tags by escaping HTML characters
 * @param value - The data to serialize
 * @returns JSON string safe for HTML inline scripts
 */
export function serializeJsonLd(value: unknown): string {
	return JSON.stringify(value).replaceAll('<', '\\u003c');
}

/**
 * Builds Website schema markup for structured data
 * @param origin - The site origin URL
 * @param description - Site description
 * @returns Website schema object
 */
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

/**
 * Builds Organization schema markup with founder information
 * @param origin - The site origin URL
 * @returns Organization schema object
 */
export function buildOrganizationSchema(origin: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteName,
		url: origin,
		sameAs: ['https://recica.dev', 'https://labs.recica.dev', 'https://github.com/drilonrecica'],
		founder: {
			'@type': 'Person',
			name: 'Drilon Reçica',
			jobTitle: 'Senior Mobile & Product Engineer',
			url: 'https://recica.dev'
		}
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

export function buildToolListSchema(origin: string, tools: ToolDefinition[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: `${siteName} Tool Directory`,
		itemListOrder: 'https://schema.org/ItemListOrderAscending',
		numberOfItems: tools.length,
		itemListElement: tools.map((tool, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: tool.name,
			url: new URL(tool.route, origin).toString()
		}))
	};
}

export function buildToolSchema(
	origin: string,
	tool: ToolDefinition,
	description: string,
	seoTitle?: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: seoTitle || tool.name,
		applicationCategory: 'UtilitiesApplication',
		applicationSubCategory: tool.category,
		operatingSystem: 'Any',
		browserRequirements: 'Requires JavaScript. Runs in a modern browser.',
		isAccessibleForFree: true,
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		url: new URL(tool.route, origin).toString(),
		description,
		keywords: tool.keywords.join(', '),
		featureList: tool.localOnly
			? ['Runs locally in your browser', 'No account required', 'No upload required']
			: ['No account required'],
		publisher: {
			'@type': 'Organization',
			name: siteName,
			url: origin
		}
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
