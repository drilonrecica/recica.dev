export type UuidVersion = 'v4' | 'v7';

function formatUuid(bytes: Uint8Array): string {
	const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function randomBytes() {
	return crypto.getRandomValues(new Uint8Array(16));
}

function generateUuidV4() {
	const bytes = randomBytes();
	bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
	bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
	return formatUuid(bytes);
}

function generateUuidV7(now = Date.now()) {
	const bytes = randomBytes();
	bytes[0] = Math.floor(now / 2 ** 40) & 0xff;
	bytes[1] = Math.floor(now / 2 ** 32) & 0xff;
	bytes[2] = Math.floor(now / 2 ** 24) & 0xff;
	bytes[3] = Math.floor(now / 2 ** 16) & 0xff;
	bytes[4] = Math.floor(now / 2 ** 8) & 0xff;
	bytes[5] = now & 0xff;
	bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x70;
	bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
	return formatUuid(bytes);
}

export function generateUuid(version: UuidVersion, now = Date.now()) {
	return version === 'v4' ? generateUuidV4() : generateUuidV7(now);
}

export function generateUuidBatch(version: UuidVersion, count: number) {
	return Array.from({ length: count }, (_, index) => generateUuid(version, Date.now() + index));
}
