import { readItems } from '@directus/sdk';
import {
	BARS,
	DRINKS,
	EVENTS,
	GALLERY_SHOTS,
	MARQUEE_ITEMS,
	PACKAGES,
	SECTIONS
} from '#lib/data/content.ts';
import { allByMonth } from '#lib/data/events.ts';
import type {
	Bar,
	BookingPackage,
	Drink,
	EventMonth,
	GalleryShot,
	SectionTexts
} from '#lib/data/types.ts';
import { directus } from './client';
import { cached } from './cache';
import {
	mapBars,
	mapDrinks,
	mapEvents,
	mapGallery,
	mapMarquee,
	mapPackages,
	mapSections
} from './map';
import { FILE_FIELDS } from './schema';

export interface SiteContent {
	drinks: Drink[];
	bars: Bar[];
	packages: BookingPackage[];
	eventMonths: EventMonth[];
	eventCount: number;
	gallery: GalleryShot[];
	sections: SectionTexts;
	marquee: string[];
}

const CACHE_KEY = 'site';

const image = { image: FILE_FIELDS } as const;

export function fallbackContent(): SiteContent {
	return {
		drinks: DRINKS,
		bars: BARS,
		packages: PACKAGES,
		eventMonths: allByMonth(EVENTS),
		eventCount: EVENTS.length,
		gallery: GALLERY_SHOTS,
		sections: SECTIONS,
		marquee: MARQUEE_ITEMS
	};
}

async function loadFromDirectus(): Promise<SiteContent> {
	const [events, drinks, bars, packages, gallery, sections, marquee] = await Promise.all([
		directus.request(
			readItems('events', {
				fields: ['name', 'city', 'date_start', 'date_end'],
				sort: ['date_start'],
				limit: -1
			})
		),
		directus.request(
			readItems('drinks', {
				fields: ['name', 'tag', 'desc', 'alc', 'featured', image],
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
		),
		directus.request(
			readItems('sections', {
				fields: ['key', 'eyebrow', 'title', 'lead'],
				limit: -1
			})
		),
		directus.request(
			readItems('marquee', {
				fields: ['text'],
				sort: ['sort'],
				limit: -1
			})
		)
	]);

	const defaults = fallbackContent();
	const marqueeItems = mapMarquee(marquee);

	return {
		drinks: drinks.length > 0 ? mapDrinks(drinks) : defaults.drinks,
		bars: bars.length > 0 ? mapBars(bars) : defaults.bars,
		packages: packages.length > 0 ? mapPackages(packages) : defaults.packages,
		eventMonths: allByMonth(mapEvents(events)),
		eventCount: events.length,
		gallery: gallery.length > 0 ? mapGallery(gallery) : defaults.gallery,
		sections: mapSections(sections, defaults.sections),
		marquee: marqueeItems.length > 0 ? marqueeItems : defaults.marquee
	};
}

export function getSiteContent(): Promise<SiteContent> {
	return cached(CACHE_KEY, loadFromDirectus, fallbackContent);
}

export { invalidate } from './cache';
