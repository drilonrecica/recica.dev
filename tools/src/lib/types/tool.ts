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
	name: string;
	route: ToolRoute;
	description: string;
	category: string;
	localOnly: boolean;
	keywords: string[];
	status?: ToolStatus;
};
