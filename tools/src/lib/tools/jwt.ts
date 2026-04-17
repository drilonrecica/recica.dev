function decodeBase64UrlSegment(segment: string) {
	if (!/^[A-Za-z0-9\-_]+$/.test(segment)) {
		throw new Error('JWT segments must use Base64URL characters only.');
	}

	const padded = segment
		.replace(/-/g, '+')
		.replace(/_/g, '/')
		.padEnd(Math.ceil(segment.length / 4) * 4, '=');
	const binary = atob(padded);
	const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
	return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export type JwtInspectResult =
	| {
			ok: true;
			header: Record<string, unknown>;
			payload: Record<string, unknown>;
			signatureLength: number;
			timestamps: Array<{ key: string; iso: string; expired?: boolean }>;
	  }
	| { ok: false; error: string };

export function inspectJwt(input: string): JwtInspectResult {
	const token = input.trim();
	if (!token) {
		return { ok: false, error: 'Enter a JWT to inspect.' };
	}

	const parts = token.split('.');
	if (parts.length !== 3) {
		return { ok: false, error: 'JWTs must contain header, payload, and signature sections.' };
	}

	try {
		const [headerSegment, payloadSegment, signatureSegment] = parts;
		if (
			headerSegment === undefined ||
			payloadSegment === undefined ||
			signatureSegment === undefined
		) {
			return { ok: false, error: 'JWTs must contain header, payload, and signature sections.' };
		}

		const header = JSON.parse(decodeBase64UrlSegment(headerSegment)) as Record<string, unknown>;
		const payload = JSON.parse(decodeBase64UrlSegment(payloadSegment)) as Record<string, unknown>;
		const nowSeconds = Math.floor(Date.now() / 1000);
		const timestamps = ['iat', 'nbf', 'exp']
			.filter((key) => typeof payload[key] === 'number')
			.map((key) => {
				const seconds = payload[key] as number;
				return key === 'exp'
					? {
							key,
							iso: new Date(seconds * 1000).toISOString(),
							expired: seconds < nowSeconds
						}
					: {
							key,
							iso: new Date(seconds * 1000).toISOString()
						};
			});

		return {
			ok: true,
			header,
			payload,
			signatureLength: signatureSegment.length,
			timestamps
		};
	} catch (error) {
		return {
			ok: false,
			error:
				error instanceof TypeError
					? 'JWT segments are not valid UTF-8 JSON.'
					: error instanceof Error
						? error.message
						: 'Could not inspect this JWT.'
		};
	}
}
