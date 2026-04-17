import { describe, expect, it } from 'vitest';
import { buildQrPayload, renderQrSvg } from '$lib/tools/qr';

describe('qr tools', () => {
	it('builds a text payload', () => {
		const result = buildQrPayload('text', {
			preset: 'text',
			text: 'Recica Lab'
		});

		expect(result).toEqual({
			ok: true,
			payload: 'Recica Lab'
		});
	});

	it('normalizes a URL payload', () => {
		const result = buildQrPayload('url', {
			preset: 'url',
			url: 'https://recica.dev/tools?tool=qr'
		});

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.payload).toBe('https://recica.dev/tools?tool=qr');
	});

	it('builds a Wi-Fi payload with hidden network support', () => {
		const result = buildQrPayload('wifi', {
			preset: 'wifi',
			ssid: 'Recica Lab',
			security: 'WPA/WPA2',
			password: 'secret123',
			hidden: true
		});

		expect(result).toEqual({
			ok: true,
			payload: 'WIFI:T:WPA;S:Recica Lab;P:secret123;H:true;;'
		});
	});

	it('allows Wi-Fi payloads without a password when security is none', () => {
		const result = buildQrPayload('wifi', {
			preset: 'wifi',
			ssid: 'Guest',
			security: 'None',
			password: '',
			hidden: false
		});

		expect(result).toEqual({
			ok: true,
			payload: 'WIFI:T:nopass;S:Guest;;'
		});
	});

	it('builds email, phone, and sms payloads', () => {
		const email = buildQrPayload('email', {
			preset: 'email',
			email: 'hello@recica.dev',
			subject: 'Lab update',
			body: 'Meet at 14:00'
		});
		const phone = buildQrPayload('phone', {
			preset: 'phone',
			phone: '+1 (555) 123-4567'
		});
		const sms = buildQrPayload('sms', {
			preset: 'sms',
			phone: '+1 (555) 123-4567',
			message: 'Meet at 14:00'
		});

		expect(email).toEqual({
			ok: true,
			payload: 'mailto:hello@recica.dev?subject=Lab+update&body=Meet+at+14%3A00'
		});
		expect(phone).toEqual({
			ok: true,
			payload: 'tel:+15551234567'
		});
		expect(sms).toEqual({
			ok: true,
			payload: 'SMSTO:+15551234567:Meet%20at%2014%3A00'
		});
	});

	it('returns deterministic field errors for invalid payloads', () => {
		const wifi = buildQrPayload('wifi', {
			preset: 'wifi',
			ssid: '',
			security: 'WPA/WPA2',
			password: '',
			hidden: false
		});
		const email = buildQrPayload('email', {
			preset: 'email',
			email: 'nope',
			subject: '',
			body: ''
		});

		expect(wifi.ok).toBe(false);
		if (wifi.ok) return;
		expect(wifi.fieldErrors).toEqual({
			password: 'Password is required unless security is None.',
			ssid: 'SSID is required.'
		});

		expect(email.ok).toBe(false);
		if (email.ok) return;
		expect(email.fieldErrors).toEqual({
			email: 'Enter a valid email address.'
		});
	});

	it('renders svg markup for valid payloads', async () => {
		const result = await renderQrSvg('https://recica.dev', {
			errorCorrectionLevel: 'M',
			margin: 1,
			width: 256
		});

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.value).toContain('<svg');
	});

	it('returns a controlled error for oversized payloads', async () => {
		const result = await renderQrSvg('x'.repeat(8000), {
			errorCorrectionLevel: 'H',
			margin: 1,
			width: 256
		});

		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.message).toMatch(/too large/i);
	});
});
