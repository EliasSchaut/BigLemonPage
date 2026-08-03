// Einstiegspunkt für die Website-Inhalte.
//
// Fragt Directus, cacht das Ergebnis und fällt bei jedem Problem auf die Werte
// aus content.ts zurück — die Seite bleibt damit auch ohne CMS vollständig.

import { readItems } from '@directus/sdk';
import { BARS, DRINKS, EVENTS, GALLERY_SHOTS, PACKAGES } from '$lib/data/content';
import { allByMonth } from '$lib/data/events';
import type { Bar, BookingPackage, Drink, EventMonth, GalleryShot } from '$lib/data/types';
import { directus } from './client';
import { cached } from './cache';
import { mapBars, mapDrinks, mapEvents, mapGallery, mapPackages } from './map';
import { FILE_FIELDS } from './schema';

export interface SiteContent {
	drinks: Drink[];
	bars: Bar[];
	packages: BookingPackage[];
	/** Alle Termine nach Monat gruppiert; vergangene sind mit `past` markiert. */
	eventMonths: EventMonth[];
	/** Anzahl aller im CMS gepflegten Termine — Grundlage der Kennzahl im Hero. */
	eventCount: number;
	gallery: GalleryShot[];
}

const CACHE_KEY = 'site';

/** Verschachtelte Bildfelder — das SDK erwartet dafür Objekt-Syntax. */
const image = { image: FILE_FIELDS } as const;

/** Inhalte aus dem Code — Startwerte für den CMS-Seed und Fallback zur Laufzeit. */
export function fallbackContent(): SiteContent {
	return {
		drinks: DRINKS,
		bars: BARS,
		packages: PACKAGES,
		eventMonths: allByMonth(EVENTS),
		eventCount: EVENTS.length,
		gallery: GALLERY_SHOTS
	};
}

async function loadFromDirectus(): Promise<SiteContent> {
	const [events, drinks, bars, packages, gallery] = await Promise.all([
		directus.request(
			readItems('events', {
				fields: ['name', 'city', 'date_start', 'date_end'],
				sort: ['date_start'],
				limit: -1
			})
		),
		directus.request(
			readItems('drinks', {
				fields: ['name', 'tag', 'desc', 'alc', image],
				sort: ['sort'],
				limit: -1
			})
		),
		directus.request(
			readItems('bars', {
				fields: ['key', 'name', 'tag', 'cta', 'accent', 'pitch', 'note', 'specs', image],
				sort: ['sort'],
				limit: -1
			})
		),
		directus.request(
			readItems('packages', {
				fields: ['key', 'name', 'label', 'size', 'desc', 'includes'],
				sort: ['sort'],
				limit: -1
			})
		),
		directus.request(
			readItems('gallery', {
				fields: ['caption', 'size', image],
				sort: ['sort'],
				limit: -1
			})
		)
	]);

	const defaults = fallbackContent();

	// Eine leere Terminliste ist zulässig (Saisonende), eine leere Drinkliste
	// dagegen fast sicher ein Konfigurationsfehler — dort lieber die Werte aus
	// content.ts zeigen als eine leere Sektion.
	return {
		drinks: drinks.length > 0 ? mapDrinks(drinks) : defaults.drinks,
		bars: bars.length > 0 ? mapBars(bars) : defaults.bars,
		packages: packages.length > 0 ? mapPackages(packages) : defaults.packages,
		eventMonths: allByMonth(mapEvents(events)),
		eventCount: events.length,
		gallery: gallery.length > 0 ? mapGallery(gallery) : defaults.gallery
	};
}

export function getSiteContent(): Promise<SiteContent> {
	return cached(CACHE_KEY, loadFromDirectus, fallbackContent);
}

export { invalidate } from './cache';
