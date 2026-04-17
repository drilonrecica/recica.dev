export const experimentStatuses = [
	'concept',
	'coming-soon',
	'in-progress',
	'prototype',
	'live',
	'shipped',
	'archived'
] as const;

export type ExperimentStatus = (typeof experimentStatuses)[number];

export type ExperimentType = 'interactive-lab' | 'concept';
export type ExperimentVisualTheme = 'editorial-light' | 'product-dark';
export type HomeVisibility = 'featured' | 'teaser' | 'hidden';
export type LabsRoutePath =
	| '/'
	| '/404'
	| '/health'
	| '/parental-gate-lab'
	| '/robots.txt'
	| '/sitemap.xml';

export interface ExperimentDefinition {
	slug: string;
	title: string;
	shortTitle?: string;
	status: ExperimentStatus;
	type: ExperimentType;
	oneLiner: string;
	summary: string;
	featured: boolean;
	year: number;
	ctaLabel: string;
	ctaHref?: LabsRoutePath;
	visualTheme: ExperimentVisualTheme;
	isLive: boolean;
	isComingSoon: boolean;
	sortOrder: number;
	homeVisibility: HomeVisibility;
	descriptionLong?: string;
	whyItExists?: string;
	futurePotential?: string;
}
