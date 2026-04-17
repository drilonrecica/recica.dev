export type UrlMode = 'full' | 'component';
export type UrlAction = 'encode' | 'decode';

export function transformUrl(input: string, mode: UrlMode, action: UrlAction) {
	try {
		const transform =
			action === 'encode'
				? mode === 'full'
					? encodeURI
					: encodeURIComponent
				: mode === 'full'
					? decodeURI
					: decodeURIComponent;

		return { ok: true as const, output: transform(input) };
	} catch {
		return {
			ok: false as const,
			error: 'Could not decode this value. Check for malformed percent-encoded characters.'
		};
	}
}
