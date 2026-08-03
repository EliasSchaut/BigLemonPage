// Uebersetzt Directus-Rohdaten in die App-Typen. Alles hier ist defensiv:
// fehlende Felder duerfen die Seite nie zum Absturz bringen.

import type { Bar, BarSpec, BookingPackage, Drink, EventItem, GalleryShot } from '$lib/data/types';
import type { BarRow, DrinkRow, EventRow, GalleryRow, PackageRow } from './schema';
import { SLOTS, toImage } from './assets';

/**
 * Markenfarben bleiben im Code — im CMS steht nur ein Token-Name. Ein Color-Picker
 * waere genau das Werkzeug, mit dem sich das Design brechen liesse, und `accentSoft`
 * ist ein abgeleiteter Wert, der sonst auseinanderdriftet.
 */
const ACCENTS = {
	lemon: { accent: '#F2E63C', accentSoft: 'rgba(242,230,60,.26)' },
	sun: { accent: '#F7B32B', accentSoft: 'rgba(247,179,43,.26)' },
	mandarin: { accent: '#EE7B2F', accentSoft: 'rgba(238,123,47,.26)' },
	lime: { accent: '#C2E23F', accentSoft: 'rgba(194,226,63,.26)' }
} as const;

const accentFor = (token: string | null) => ACCENTS[token as keyof typeof ACCENTS] ?? ACCENTS.lemon;

/** Notnagel, falls im CMS der technische Schluessel geleert wurde. */
const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

export function mapEvents(rows: EventRow[]): EventItem[] {
	return rows
		.filter((row) => row.date_start && row.name)
		.map((row) => ({
			start: row.date_start,
			// Ein Enddatum gleich dem Start bedeutet dasselbe wie kein Enddatum.
			end: row.date_end && row.date_end !== row.date_start ? row.date_end : undefined,
			name: row.name,
			city: row.city ?? ''
		}));
}

export function mapDrinks(rows: DrinkRow[]): Drink[] {
	return rows.map((row) => ({
		name: row.name,
		tag: row.tag ?? '',
		desc: row.desc ?? '',
		alc: row.alc ?? false,
		image: toImage(row.image, SLOTS.drink, row.name)
	}));
}

export function mapBars(rows: BarRow[]): Bar[] {
	return rows.map((row) => {
		const { accent, accentSoft } = accentFor(row.accent);
		return {
			key: row.key?.trim() || slugify(row.name),
			name: row.name,
			tag: row.tag ?? '',
			cta: row.cta?.trim() || `${row.name} anfragen`,
			accent,
			accentSoft,
			pitch: row.pitch ?? '',
			note: row.note ?? '',
			// JSON-Felder kommen als null zurueck, solange sie nie angefasst wurden.
			specs: (row.specs ?? [])
				.filter((spec): spec is BarSpec => Boolean(spec?.label && spec?.value))
				.map((spec) => ({ label: spec.label, value: spec.value })),
			image: toImage(row.image, SLOTS.bar, row.name)
		};
	});
}

export function mapPackages(rows: PackageRow[]): BookingPackage[] {
	return rows.map((row, index) => ({
		key: row.key?.trim() || slugify(row.name),
		name: row.name,
		label: row.label?.trim() || `PAKET ${String(index + 1).padStart(2, '0')}`,
		size: row.size ?? '',
		desc: row.desc ?? '',
		includes: (row.includes ?? []).map((item) => item?.text ?? '').filter(Boolean)
	}));
}

export function mapGallery(rows: GalleryRow[]): GalleryShot[] {
	return rows.map((row) => {
		const wide = row.size === 'breit' || row.size === 'gross';
		const tall = row.size === 'hoch' || row.size === 'gross';
		const caption = row.caption?.trim() || 'Foto';
		const slot = wide ? SLOTS.galleryWide : tall ? SLOTS.galleryTall : SLOTS.galleryNormal;

		return {
			placeholder: `Foto: ${caption}`,
			wide: wide || undefined,
			tall: tall || undefined,
			image: toImage(row.image, slot, caption)
		};
	});
}
