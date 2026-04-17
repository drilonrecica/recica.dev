export type ParsedColor = {
	r: number;
	g: number;
	b: number;
	a: number;
};

export type ColorResult =
	| {
			ok: true;
			value: ParsedColor;
	  }
	| {
			ok: false;
			error: string;
	  };

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 2) {
	return Number(value.toFixed(digits));
}

function parseHex(input: string): ParsedColor | null {
	const hex = input.replace('#', '').trim();
	if (![3, 4, 6, 8].includes(hex.length) || !/^[0-9a-f]+$/i.test(hex)) {
		return null;
	}

	const normalized =
		hex.length === 3 || hex.length === 4
			? hex
					.split('')
					.map((character) => `${character}${character}`)
					.join('')
			: hex;

	return {
		r: parseInt(normalized.slice(0, 2), 16),
		g: parseInt(normalized.slice(2, 4), 16),
		b: parseInt(normalized.slice(4, 6), 16),
		a: normalized.length === 8 ? round(parseInt(normalized.slice(6, 8), 16) / 255, 3) : 1
	};
}

function parseRgb(input: string): ParsedColor | null {
	const match = input.match(/^rgba?\((.+)\)$/i);
	if (!match) return null;

	const body = match[1];
	if (body === undefined) return null;

	const parts = body.split(',').map((part) => part.trim());
	if (parts.length !== 3 && parts.length !== 4) return null;

	const [rawR, rawG, rawB, rawAlpha] = parts;
	if (rawR === undefined || rawG === undefined || rawB === undefined) return null;

	const r = Number(rawR);
	const g = Number(rawG);
	const b = Number(rawB);
	const alpha = rawAlpha === undefined ? 1 : Number(rawAlpha);

	if ([r, g, b, alpha].some((value) => Number.isNaN(value))) return null;
	if ([r, g, b].some((value) => value < 0 || value > 255) || alpha < 0 || alpha > 1) return null;

	return { r, g, b, a: alpha };
}

function hslToRgb(h: number, s: number, l: number) {
	const saturation = s / 100;
	const lightness = l / 100;
	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const huePrime = h / 60;
	const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
	const [red, green, blue] =
		huePrime >= 0 && huePrime < 1
			? [chroma, x, 0]
			: huePrime < 2
				? [x, chroma, 0]
				: huePrime < 3
					? [0, chroma, x]
					: huePrime < 4
						? [0, x, chroma]
						: huePrime < 5
							? [x, 0, chroma]
							: [chroma, 0, x];

	const match = lightness - chroma / 2;
	return {
		r: Math.round((red + match) * 255),
		g: Math.round((green + match) * 255),
		b: Math.round((blue + match) * 255)
	};
}

function parseHsl(input: string): ParsedColor | null {
	const match = input.match(/^hsla?\((.+)\)$/i);
	if (!match) return null;

	const body = match[1];
	if (body === undefined) return null;

	const parts = body.split(',').map((part) => part.trim().replace(/%$/, ''));
	if (parts.length !== 3 && parts.length !== 4) return null;

	const [rawH, rawS, rawL, rawAlpha] = parts;
	if (rawH === undefined || rawS === undefined || rawL === undefined) return null;

	const h = Number(rawH);
	const s = Number(rawS);
	const l = Number(rawL);
	const alpha = rawAlpha === undefined ? 1 : Number(rawAlpha);

	if ([h, s, l, alpha].some((value) => Number.isNaN(value))) return null;
	if (s < 0 || s > 100 || l < 0 || l > 100 || alpha < 0 || alpha > 1) return null;

	const normalizedHue = ((h % 360) + 360) % 360;
	return { ...hslToRgb(normalizedHue, s, l), a: alpha };
}

function rgbToHsl({ r, g, b, a }: ParsedColor) {
	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;
	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const delta = max - min;
	let hue = 0;

	if (delta !== 0) {
		if (max === red) hue = ((green - blue) / delta) % 6;
		else if (max === green) hue = (blue - red) / delta + 2;
		else hue = (red - green) / delta + 4;
	}

	const lightness = (max + min) / 2;
	const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

	return {
		h: Math.round((hue * 60 + 360) % 360),
		s: round(saturation * 100),
		l: round(lightness * 100),
		a: round(a, 3)
	};
}

export function parseColor(input: string): ColorResult {
	const trimmed = input.trim();
	if (!trimmed) {
		return { ok: false, error: 'Enter a color value to convert.' };
	}

	const parsed = trimmed.startsWith('#')
		? parseHex(trimmed)
		: /^rgba?\(/i.test(trimmed)
			? parseRgb(trimmed)
			: /^hsla?\(/i.test(trimmed)
				? parseHsl(trimmed)
				: null;

	if (!parsed) {
		return { ok: false, error: 'Could not parse this color. Use HEX, RGB(A), or HSL(A).' };
	}

	return {
		ok: true,
		value: {
			r: clamp(parsed.r, 0, 255),
			g: clamp(parsed.g, 0, 255),
			b: clamp(parsed.b, 0, 255),
			a: clamp(parsed.a, 0, 1)
		}
	};
}

export function formatColorOutputs(color: ParsedColor) {
	const alphaHex = Math.round(color.a * 255)
		.toString(16)
		.padStart(2, '0')
		.toUpperCase();
	const hex = `#${[color.r, color.g, color.b]
		.map((value) => value.toString(16).padStart(2, '0').toUpperCase())
		.join('')}${color.a < 1 ? alphaHex : ''}`;
	const hsl = rgbToHsl(color);

	return {
		hex,
		rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
		rgba: `rgba(${color.r}, ${color.g}, ${color.b}, ${round(color.a, 3)})`,
		hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
		hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`
	};
}
