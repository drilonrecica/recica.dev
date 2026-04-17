import QRCode from 'qrcode';

export type QrPresetId = 'text' | 'url' | 'wifi' | 'email' | 'phone' | 'sms';
export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';
export type QrWifiSecurity = 'WPA/WPA2' | 'WEP' | 'None';

export type QrRenderOptions = {
	width: number;
	margin: number;
	errorCorrectionLevel: QrErrorCorrection;
};

export type QrTextValues = {
	preset: 'text';
	text: string;
};

export type QrUrlValues = {
	preset: 'url';
	url: string;
};

export type QrWifiValues = {
	preset: 'wifi';
	ssid: string;
	security: QrWifiSecurity;
	password: string;
	hidden: boolean;
};

export type QrEmailValues = {
	preset: 'email';
	email: string;
	subject: string;
	body: string;
};

export type QrPhoneValues = {
	preset: 'phone';
	phone: string;
};

export type QrSmsValues = {
	preset: 'sms';
	phone: string;
	message: string;
};

export type QrPresetValueMap = {
	text: QrTextValues;
	url: QrUrlValues;
	wifi: QrWifiValues;
	email: QrEmailValues;
	phone: QrPhoneValues;
	sms: QrSmsValues;
};

export type QrPresetValues = QrPresetValueMap[QrPresetId];

export type QrBuildResult =
	| { ok: true; payload: string }
	| { ok: false; fieldErrors: Record<string, string>; message?: string };

export type QrRenderResult<T> = { ok: true; value: T } | { ok: false; message: string };

function escapeWifiValue(value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/:/g, '\\:')
		.replace(/"/g, '\\"');
}

function normalizePhoneNumber(phone: string): string | null {
	const trimmed = phone.trim();
	if (!trimmed) return null;

	const hasLeadingPlus = trimmed.startsWith('+');
	const digits = trimmed.replace(/[^\d]/g, '');

	if (digits.length < 3) return null;
	return `${hasLeadingPlus ? '+' : ''}${digits}`;
}

function normalizeQrError(error: unknown): string {
	if (error instanceof Error) {
		const message = error.message.toLowerCase();
		if (message.includes('too big') || message.includes('amount of data')) {
			return 'This payload is too large for a QR code with the selected settings.';
		}
	}

	return 'Could not generate a QR code for that payload.';
}

function buildMailto(email: string, subject: string, body: string): string {
	const params = new URLSearchParams();
	if (subject.trim()) params.set('subject', subject.trim());
	if (body.trim()) params.set('body', body.trim());

	const query = params.toString();
	return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}

function buildWifiPayload(values: QrWifiValues): QrBuildResult {
	const fieldErrors: Record<string, string> = {};
	const ssid = values.ssid.trim();

	if (!ssid) {
		fieldErrors.ssid = 'SSID is required.';
	}

	if (values.security !== 'None' && !values.password.trim()) {
		fieldErrors.password = 'Password is required unless security is None.';
	}

	if (Object.keys(fieldErrors).length > 0) {
		return {
			ok: false,
			fieldErrors,
			message: 'Enter the required network details to generate a Wi-Fi QR code.'
		};
	}

	const type = values.security === 'None' ? 'nopass' : values.security === 'WEP' ? 'WEP' : 'WPA';
	const hidden = values.hidden ? 'H:true;' : '';
	const passwordSegment =
		values.security === 'None' ? '' : `P:${escapeWifiValue(values.password)};`;

	return {
		ok: true,
		payload: `WIFI:T:${type};S:${escapeWifiValue(ssid)};${passwordSegment}${hidden};`
	};
}

export function buildQrPayload(preset: QrPresetId, values: QrPresetValues): QrBuildResult {
	if (values.preset !== preset) {
		return {
			ok: false,
			fieldErrors: {},
			message: 'Preset state is out of sync.'
		};
	}

	switch (values.preset) {
		case 'text':
			if (!values.text.trim()) {
				return {
					ok: false,
					fieldErrors: { text: 'Enter text to generate a QR code.' },
					message: 'Add some text to generate a QR code.'
				};
			}

			return { ok: true, payload: values.text };

		case 'url': {
			const input = values.url.trim();
			if (!input) {
				return {
					ok: false,
					fieldErrors: { url: 'URL is required.' },
					message: 'Enter a full URL to generate a QR code.'
				};
			}

			try {
				const normalized = new URL(input).toString();
				return { ok: true, payload: normalized };
			} catch {
				return {
					ok: false,
					fieldErrors: { url: 'Enter a valid absolute URL.' },
					message: 'Fix the URL before generating a QR code.'
				};
			}
		}

		case 'wifi':
			return buildWifiPayload(values);

		case 'email': {
			const fieldErrors: Record<string, string> = {};
			const email = values.email.trim();

			if (!email) {
				fieldErrors.email = 'Email is required.';
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				fieldErrors.email = 'Enter a valid email address.';
			}

			if (Object.keys(fieldErrors).length > 0) {
				return {
					ok: false,
					fieldErrors,
					message: 'Fix the email address before generating a QR code.'
				};
			}

			return {
				ok: true,
				payload: buildMailto(email, values.subject, values.body)
			};
		}

		case 'phone': {
			const normalizedPhone = normalizePhoneNumber(values.phone);
			if (!normalizedPhone) {
				return {
					ok: false,
					fieldErrors: { phone: 'Enter a valid phone number.' },
					message: 'Enter a valid phone number to generate a call QR code.'
				};
			}

			return { ok: true, payload: `tel:${normalizedPhone}` };
		}

		case 'sms': {
			const normalizedPhone = normalizePhoneNumber(values.phone);
			if (!normalizedPhone) {
				return {
					ok: false,
					fieldErrors: { phone: 'Enter a valid phone number.' },
					message: 'Enter a valid phone number to generate an SMS QR code.'
				};
			}

			const message = values.message.trim();
			return {
				ok: true,
				payload: message
					? `SMSTO:${normalizedPhone}:${encodeURIComponent(message)}`
					: `SMSTO:${normalizedPhone}`
			};
		}
	}
}

export async function renderQrCanvas(
	payload: string,
	options: QrRenderOptions,
	canvas: HTMLCanvasElement
): Promise<QrRenderResult<undefined>> {
	try {
		await QRCode.toCanvas(canvas, payload, {
			errorCorrectionLevel: options.errorCorrectionLevel,
			margin: options.margin,
			width: options.width
		});

		return { ok: true, value: undefined };
	} catch (error) {
		return {
			ok: false,
			message: normalizeQrError(error)
		};
	}
}

export async function renderQrSvg(
	payload: string,
	options: QrRenderOptions
): Promise<QrRenderResult<string>> {
	try {
		const svg = await QRCode.toString(payload, {
			errorCorrectionLevel: options.errorCorrectionLevel,
			margin: options.margin,
			type: 'svg',
			width: options.width
		});

		return { ok: true, value: svg };
	} catch (error) {
		return {
			ok: false,
			message: normalizeQrError(error)
		};
	}
}
