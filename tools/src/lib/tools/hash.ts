export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export async function hashText(input: string, algorithm: HashAlgorithm) {
	const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
	return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join(
		''
	);
}
