import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSiteContent } from '$lib/server/cms';
import { sendAnfrageMail } from '$lib/server/mail';

const MAX_LENGTHS = {
	name: 120,
	email: 200,
	phone: 60,
	date: 40,
	location: 120,
	guests: 40,
	message: 5000
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(data: FormData, name: string): string {
	const value = data.get(name);
	return typeof value === 'string' ? value.trim() : '';
}

export const load: PageServerLoad = async () => getSiteContent();

export const actions = {
	anfrage: async ({ request }) => {
		const data = await request.formData();

		if (field(data, 'website')) {
			return { success: true };
		}

		const values = {
			name: field(data, 'name'),
			email: field(data, 'email'),
			phone: field(data, 'phone'),
			date: field(data, 'date'),
			location: field(data, 'location'),
			guests: field(data, 'guests'),
			message: field(data, 'message')
		};

		const barKey = field(data, 'bar');
		const packageKey = field(data, 'package');

		const errors: Record<string, string> = {};

		if (!values.name) errors.name = 'Bitte gebt euren Namen an.';
		if (!values.email) errors.email = 'Bitte gebt eine E-Mail-Adresse an.';
		else if (!EMAIL_PATTERN.test(values.email))
			errors.email = 'Diese E-Mail-Adresse sieht ungültig aus.';
		if (!values.phone) errors.phone = 'Bitte gebt eine Telefonnummer an.';
		if (!values.message) errors.message = 'Bitte schreibt uns kurz, worum es geht.';

		for (const [key, limit] of Object.entries(MAX_LENGTHS)) {
			if (values[key as keyof typeof values].length > limit) {
				errors[key] = `Bitte maximal ${limit} Zeichen.`;
			}
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const { bars, packages } = await getSiteContent();
		const barLabels: Record<string, string> = {
			...Object.fromEntries(bars.map((bar) => [bar.key, bar.name])),
			offen: 'Noch offen — Beratung gewünscht'
		};
		const packageLabels: Record<string, string> = {
			...Object.fromEntries(packages.map((pkg) => [pkg.key, `${pkg.name} (${pkg.size})`])),
			offen: 'Noch offen / individuell'
		};

		try {
			await sendAnfrageMail({
				...values,
				bar: barLabels[barKey] ?? 'Noch offen',
				package: packageLabels[packageKey] ?? 'Noch offen'
			});
		} catch (error) {
			console.error('Anfrage konnte nicht versendet werden:', error);
			return fail(500, {
				values,
				message:
					'Die Anfrage konnte gerade nicht versendet werden. Bitte versucht es später noch einmal oder ruft uns an.'
			});
		}

		return { success: true };
	}
} satisfies Actions;
