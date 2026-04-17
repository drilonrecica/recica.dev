export type PasswordOptions = {
	length: number;
	uppercase: boolean;
	lowercase: boolean;
	numbers: boolean;
	symbols: boolean;
};

const CHARSETS = {
	uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
	lowercase: 'abcdefghijkmnopqrstuvwxyz',
	numbers: '23456789',
	symbols: '!@#$%^&*()-_=+[]{};:,.?/|~'
} as const;

function secureRandomInt(max: number) {
	if (max <= 0) return 0;

	const uint32Max = 0x1_0000_0000;
	const threshold = uint32Max - (uint32Max % max);
	const buffer = new Uint32Array(1);

	while (true) {
		crypto.getRandomValues(buffer);
		const value = buffer[0];
		if (value === undefined) continue;
		if (value < threshold) {
			return value % max;
		}
	}
}

function pickCharacter(charset: string) {
	const character = charset[secureRandomInt(charset.length)];
	if (character === undefined) {
		throw new Error('Character set cannot be empty.');
	}
	return character;
}

function shuffle(values: string[]) {
	for (let index = values.length - 1; index > 0; index -= 1) {
		const swapIndex = secureRandomInt(index + 1);
		const currentValue = values[index];
		const swapValue = values[swapIndex];
		if (currentValue === undefined || swapValue === undefined) continue;
		[values[index], values[swapIndex]] = [swapValue, currentValue];
	}

	return values;
}

export function getEnabledCharsets(options: PasswordOptions) {
	return Object.entries(CHARSETS)
		.filter(([key]) => options[key as keyof typeof CHARSETS])
		.map(([, charset]) => charset);
}

export function validatePasswordOptions(options: PasswordOptions) {
	const enabledCharsets = getEnabledCharsets(options);

	if (!enabledCharsets.length) {
		return 'Enable at least one character set.';
	}

	if (!Number.isInteger(options.length) || options.length < enabledCharsets.length) {
		return `Length must be at least ${enabledCharsets.length} for the selected character sets.`;
	}

	return null;
}

export function generatePassword(options: PasswordOptions) {
	const validationError = validatePasswordOptions(options);

	if (validationError) {
		throw new Error(validationError);
	}

	const enabledCharsets = getEnabledCharsets(options);
	const allCharacters = enabledCharsets.join('');
	const password = enabledCharsets.map((charset) => pickCharacter(charset));

	while (password.length < options.length) {
		password.push(pickCharacter(allCharacters));
	}

	return shuffle(password).join('');
}
