import { assetBase } from './client';
import type { FileRow } from './schema';
import type { Image } from '$lib/data/types';

/**
 * Baut die Bild-URLs fuer einen Slot.
 *
 * Immer Breite *und* Hoehe mit `fit=cover`: das macht die Dateigroesse unabhaengig
 * vom Seitenverhaeltnis des Originals (ein Hochformat-Foto laedt sonst ein
 * Vielfaches) und aktiviert den Focal-Point-Editor in Directus — ein schlechter
 * Zuschnitt laesst sich damit im CMS korrigieren statt im CSS.
 */
function url(file: FileRow, width: number, ratio: number): string {
	const params = new URLSearchParams({
		width: String(width),
		height: String(Math.round(width / ratio)),
		fit: 'cover',
		quality: '78',
		format: 'auto'
	});
	// Cache-Buster, damit ein ersetztes Bild sofort durchschlaegt.
	if (file.modified_on) params.set('v', file.modified_on);
	return `${assetBase}/assets/${file.id}?${params}`;
}

export interface SlotSpec {
	/** 1x-Breiten fuer das srcset; die erste ist die Basisbreite. */
	widths: number[];
	/** Zielverhaeltnis Breite/Hoehe. */
	ratio: number;
	sizes: string;
}

export function toImage(
	file: FileRow | null | undefined,
	slot: SlotSpec,
	altFallback = ''
): Image | undefined {
	if (!file?.id) return undefined;

	const base = slot.widths[0];
	return {
		src: url(file, base, slot.ratio),
		srcset: slot.widths.map((w) => `${url(file, w, slot.ratio)} ${w}w`).join(', '),
		sizes: slot.sizes,
		// Der Alternativtext haengt am Bild, damit er nur einmal gepflegt wird.
		alt: file.alt?.trim() || file.title?.trim() || altFallback,
		width: base,
		height: Math.round(base / slot.ratio)
	};
}

export const SLOTS = {
	drink: {
		widths: [300, 600, 900],
		ratio: 4 / 3,
		sizes: '(max-width: 620px) 100vw, 300px'
	},
	bar: {
		widths: [340, 680, 1020],
		ratio: 3 / 2,
		sizes: '(max-width: 620px) 100vw, 340px'
	},
	galleryNormal: {
		widths: [320, 640],
		ratio: 4 / 3,
		sizes: '(max-width: 620px) 50vw, 300px'
	},
	galleryWide: {
		widths: [640, 1280],
		ratio: 3 / 2,
		sizes: '(max-width: 700px) 100vw, 620px'
	},
	galleryTall: {
		widths: [320, 640],
		ratio: 2 / 3,
		sizes: '(max-width: 620px) 50vw, 300px'
	}
} satisfies Record<string, SlotSpec>;
