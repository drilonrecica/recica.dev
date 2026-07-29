export type ToolStatus = 'mvp' | 'planned';
export type ToolRoute =
	| '/qr'
	| '/json'
	| '/password'
	| '/url'
	| '/base64'
	| '/regex'
	| '/uuid'
	| '/hash'
	| '/query'
	| '/case'
	| '/counter'
	| '/env'
	| '/color'
	| '/jwt'
	| '/markdown'
	| '/html'
	| '/device'
	| '/barcode'
	| '/sql'
	| '/robots'
	| '/sitemap'
	| '/slug'
	| '/timestamp'
	| '/diff';

export type ToolDefinition = {
	id: string;
	number: number;
	name: string;
	route: ToolRoute;
	description: string;
	directAnswer: string;
	category: string;
	localOnly: boolean;
	inputPolicy: {
		label: string;
		maxBytes?: number;
	};
	limitations: string[];
	whenToUse: string;
	example: string;
	supportedFormats: string[];
	commonErrors: string[];
	reference: {
		label: string;
		href: string;
	};
	reviewedOn: string;
	keywords: string[];
	status?: ToolStatus;
};
