export type BarcodeFormat = 'code128' | 'ean13' | 'upca';

export type BarcodeResult =
	| {
			ok: true;
			svg: string;
			text: string;
	  }
	| { ok: false; error: string };

const CODE128_PATTERNS = [
	'11011001100',
	'11001101100',
	'11001100110',
	'10010011000',
	'10010001100',
	'10001001100',
	'10011001000',
	'10011000100',
	'10001100100',
	'11001001000',
	'11001000100',
	'11000100100',
	'10110011100',
	'10011011100',
	'10011001110',
	'10111001100',
	'10011101100',
	'10011100110',
	'11001110010',
	'11001011100',
	'11001001110',
	'11011100100',
	'11001110100',
	'11101101110',
	'11101001100',
	'11100101100',
	'11100100110',
	'11101100100',
	'11100110100',
	'11100110010',
	'11011011000',
	'11011000110',
	'11000110110',
	'10100011000',
	'10001011000',
	'10001000110',
	'10110001000',
	'10001101000',
	'10001100010',
	'11010001000',
	'11000101000',
	'11000100010',
	'10110111000',
	'10110001110',
	'10001101110',
	'10111011000',
	'10111000110',
	'10001110110',
	'11101110110',
	'11010001110',
	'11000101110',
	'11011101000',
	'11011100010',
	'11011101110',
	'11101011000',
	'11101000110',
	'11100010110',
	'11101101000',
	'11101100010',
	'11100011010',
	'11101111010',
	'11001000010',
	'11110001010',
	'10100110000',
	'10100001100',
	'10010110000',
	'10010000110',
	'10000101100',
	'10000100110',
	'10110010000',
	'10110000100',
	'10011010000',
	'10011000010',
	'10000110100',
	'10000110010',
	'11000010010',
	'11001010000',
	'11110111010',
	'11000010100',
	'10001111010',
	'10100111100',
	'10010111100',
	'10010011110',
	'10111100100',
	'10011110100',
	'10011110010',
	'11110100100',
	'11110010100',
	'11110010010',
	'11011011110',
	'11011110110',
	'11110110110',
	'10101111000',
	'10100011110',
	'10001011110',
	'10111101000',
	'10111100010',
	'11110101000',
	'11110100010',
	'10111011110',
	'10111101110',
	'11101011110',
	'11110101110',
	'11010000100',
	'11010010000',
	'11010011100',
	'1100011101011'
];

const EAN_L = [
	'0001101',
	'0011001',
	'0010011',
	'0111101',
	'0100011',
	'0110001',
	'0101111',
	'0111011',
	'0110111',
	'0001011'
];
const EAN_G = [
	'0100111',
	'0110011',
	'0011011',
	'0100001',
	'0011101',
	'0111001',
	'0000101',
	'0010001',
	'0001001',
	'0010111'
];
const EAN_R = [
	'1110010',
	'1100110',
	'1101100',
	'1000010',
	'1011100',
	'1001110',
	'1010000',
	'1000100',
	'1001000',
	'1110100'
];
const EAN_PARITY = [
	'LLLLLL',
	'LLGLGG',
	'LLGGLG',
	'LLGGGL',
	'LGLLGG',
	'LGGLLG',
	'LGGGLL',
	'LGLGLG',
	'LGLGGL',
	'LGGLGL'
];

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function renderSvg(sequence: string, text: string, height = 80) {
	const moduleWidth = 2;
	const margin = 12;
	const labelHeight = 24;
	const width = (sequence.length + margin * 2) * moduleWidth;
	const bars = Array.from(sequence).flatMap((digit, index) =>
		digit === '1'
			? [
					`<rect x="${(margin + index) * moduleWidth}" y="8" width="${moduleWidth}" height="${height}" fill="#111827" />`
				]
			: []
	);

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + labelHeight + 16}" viewBox="0 0 ${width} ${height + labelHeight + 16}">
	<rect width="100%" height="100%" fill="#ffffff" />
	${bars.join('')}
	<text x="${width / 2}" y="${height + labelHeight}" text-anchor="middle" font-family="monospace" font-size="16" fill="#111827">${escapeXml(text)}</text>
</svg>`;
}

function calculateModulo10CheckDigit(digits: string) {
	const values = digits.split('').map(Number);
	const sum = values.reduce(
		(total, digit, index) => total + digit * ((digits.length - index) % 2 === 0 ? 3 : 1),
		0
	);
	return (10 - (sum % 10)) % 10;
}

function encodeEan13(input: string): BarcodeResult {
	if (!/^\d{12,13}$/.test(input)) {
		return { ok: false, error: 'EAN-13 accepts 12 digits plus an optional check digit.' };
	}

	const full = input.length === 12 ? `${input}${calculateModulo10CheckDigit(input)}` : input;
	const expectedCheck = calculateModulo10CheckDigit(full.slice(0, 12));
	if (Number(full[12]) !== expectedCheck) {
		return { ok: false, error: 'EAN-13 check digit is invalid.' };
	}

	const parity = EAN_PARITY[Number(full[0])];
	if (!parity) {
		return { ok: false, error: 'EAN-13 could not be encoded.' };
	}
	const left = full
		.slice(1, 7)
		.split('')
		.map(
			(digit, index) => (parity[index] === 'L' ? EAN_L[Number(digit)] : EAN_G[Number(digit)]) ?? ''
		)
		.join('');
	const right = full
		.slice(7)
		.split('')
		.map((digit) => EAN_R[Number(digit)] ?? '')
		.join('');

	return {
		ok: true,
		svg: renderSvg(`101${left}01010${right}101`, full),
		text: full
	};
}

function encodeUpca(input: string): BarcodeResult {
	if (!/^\d{11,12}$/.test(input)) {
		return { ok: false, error: 'UPC-A accepts 11 digits plus an optional check digit.' };
	}

	const full = input.length === 11 ? `${input}${calculateModulo10CheckDigit(input)}` : input;
	const expectedCheck = calculateModulo10CheckDigit(full.slice(0, 11));
	if (Number(full[11]) !== expectedCheck) {
		return { ok: false, error: 'UPC-A check digit is invalid.' };
	}

	const left = full
		.slice(0, 6)
		.split('')
		.map((digit) => EAN_L[Number(digit)] ?? '')
		.join('');
	const right = full
		.slice(6)
		.split('')
		.map((digit) => EAN_R[Number(digit)] ?? '')
		.join('');

	return {
		ok: true,
		svg: renderSvg(`101${left}01010${right}101`, full),
		text: full
	};
}

function encodeCode128(input: string): BarcodeResult {
	if (!input) {
		return { ok: false, error: 'Enter text to generate a barcode.' };
	}

	if (!/^[\x20-\x7e]+$/.test(input)) {
		return { ok: false, error: 'Code 128 supports printable ASCII characters in this version.' };
	}

	const values = input.split('').map((character) => character.charCodeAt(0) - 32);
	const checksum =
		(104 + values.reduce((total, value, index) => total + value * (index + 1), 0)) % 103;
	const sequence =
		[104, ...values, checksum].map((value) => CODE128_PATTERNS[value] ?? '').join('') +
		(CODE128_PATTERNS[106] ?? '');

	return {
		ok: true,
		svg: renderSvg(sequence, input),
		text: input
	};
}

export function generateBarcode(format: BarcodeFormat, input: string): BarcodeResult {
	const normalized = input.trim();
	if (format === 'ean13') return encodeEan13(normalized);
	if (format === 'upca') return encodeUpca(normalized);
	return encodeCode128(normalized);
}
