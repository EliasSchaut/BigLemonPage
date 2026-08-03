// Zentrale Inhalte der Website — aus dem Prototyp (prototype/BigLemon.dc.html) übernommen.
//
// Doppelte Rolle: Startwerte für den CMS-Seed (scripts/seed-directus.ts) und
// Fallback zur Laufzeit, falls Directus nicht erreichbar ist. Deshalb bleiben
// diese Daten erhalten, auch wenn die Inhalte längst aus dem CMS kommen.

import type { Bar, BarSpec, BookingPackage, Drink, EventItem, GalleryShot } from './types';

export type {
	Bar,
	BarSpec,
	BookingPackage,
	Drink,
	EventItem,
	EventMonth,
	GalleryShot,
	Image
} from './types';

export const CONTACT = {
	phoneDisplay: '0176 26043698',
	phoneHref: 'tel:+4917626043698',
	email: 'welcome@biglemon.de',
	owner: 'Christopher Moravec',
	company: 'BigLemon Deutschland',
	street: 'Angelstraße 110',
	city: '68199 Mannheim',
	instagram: 'https://www.instagram.com/biglemonbar/',
	facebook: 'https://www.facebook.com/www.biglemon.de/',
	vatId: 'DE 272012285'
};

/** Stammdaten für Meta-Tags und strukturierte Daten. */
export const SITE = {
	name: 'BigLemon',
	title: 'BigLemon — Die mobile Cocktailbar für euer Fest',
	description:
		'Die BigLemon ist eine 3 Meter große, fahrbare Riesenzitrone voller frisch gepresster Cocktails — buchbar für Hochzeiten, Firmenfeiern, Stadtfeste und Festivals in Mannheim, Rhein-Neckar und bundesweit.',
	/** Kurzfassung für Social-Vorschauen, wo wenig Platz ist. */
	shortDescription:
		'Mobile Cocktailbar aus Mannheim: frisch gepresste Cocktails aus einer 3 Meter großen Riesenzitrone.',
	keywords: [
		'mobile Cocktailbar',
		'Cocktailbar mieten',
		'Cocktailbar Mannheim',
		'mobile Bar Hochzeit',
		'Barkeeper buchen',
		'Cocktails Firmenfeier',
		'Stadtfest Bar',
		'Rhein-Neckar',
		'BigLemon'
	],
	ogImage: '/og-image.jpg',
	locale: 'de_DE',
	/** Regionen, in denen die Bar üblicherweise unterwegs ist. */
	areaServed: ['Mannheim', 'Rhein-Neckar', 'Rhein-Main', 'Deutschland']
};

export const NAV_LINKS = [
	{ href: '/#bar', label: 'Die Bar' },
	{ href: '/#drinks', label: 'Drinks' },
	{ href: '/#termine', label: 'Termine' },
	{ href: '/#galerie', label: 'Galerie' },
	{ href: '/#bars', label: 'Unsere Bars' },
	{ href: '/#kontakt', label: 'Kontakt' }
];

export const MARQUEE_ITEMS = [
	'HOCHZEITEN',
	'FIRMENFEIERN',
	'GEBURTSTAGE',
	'STADTFESTE',
	'KERWEN',
	'FESTIVALS',
	'CSD'
];

export const DRINKS: Drink[] = [
	{
		name: 'Lemon Fresh',
		tag: 'KLASSIKER',
		desc: 'Handgepresste Zitrone, Rohrzucker, Soda, viel Eis. Der Drink, für den die Leute wiederkommen.',
		alc: false
	},
	{
		name: 'Strawberry Lemon',
		tag: 'FRUCHTIG',
		desc: 'Frische Erdbeere trifft Limette und Minze. Süß, sauer, sommerlich.',
		alc: false
	},
	{
		name: 'Coco Lime',
		tag: 'CREMIG',
		desc: 'Kokosmilch, Limette und Rohrzucker — cremig gemixt, karibisch im Kopf.',
		alc: false
	},
	{
		name: 'Orange Sunrise',
		tag: 'VITAMIN',
		desc: 'Frisch gepresste Orange mit Maracuja. Die Vitaminbombe für den Nachmittag.',
		alc: false
	},
	{
		name: 'Caipi Lemon',
		tag: 'MIT SCHUSS',
		desc: 'Limette, Rohrzucker, Cachaça, crushed Ice. Handgestampft, wie es sich gehört.',
		alc: true
	},
	{
		name: 'Big Hugo',
		tag: 'MIT SCHUSS',
		desc: 'Holunder, Limette, Minze und Prosecco. Der Aperitif für den Sonnenuntergang.',
		alc: true
	}
];

/**
 * Termine der Saison 2026. Flache Liste mit ISO-Daten — Sortierung und
 * Monatsgruppierung leitet `$lib/data/events` daraus ab.
 */
export const EVENTS: EventItem[] = [
	{ start: '2026-05-08', end: '2026-05-10', name: 'Frühlingsfest', city: 'Lorsch' },
	{ start: '2026-05-29', end: '2026-05-31', name: 'Schützenfest', city: 'Gummersbach' },
	{ start: '2026-05-30', end: '2026-05-31', name: 'Berger Straßenfest', city: 'Frankfurt-Bergen' },
	{ start: '2026-06-04', end: '2026-06-07', name: 'CSD', city: 'Düsseldorf' },
	{ start: '2026-06-13', name: 'Weststadtfest', city: 'Weinheim' },
	{ start: '2026-06-26', end: '2026-06-28', name: 'Altstadtfest', city: 'Trier' },
	{ start: '2026-07-03', end: '2026-07-05', name: 'CSD', city: 'Köln' },
	{ start: '2026-07-03', end: '2026-07-05', name: 'Lanzparkfest', city: 'Mannheim-Lindenhof' },
	{ start: '2026-07-10', end: '2026-07-11', name: 'Straßenfest', city: 'Neckarrems' },
	{ start: '2026-07-12', name: 'CSD', city: 'Olpe' },
	{ start: '2026-07-18', name: 'Sommernachtsfest', city: 'Heimkirchen' },
	{ start: '2026-07-24', end: '2026-07-27', name: 'CSD', city: 'Stuttgart' },
	{ start: '2026-07-25', name: 'CSD', city: 'Berlin' },
	{ start: '2026-07-25', name: 'CSD', city: 'Duisburg' },
	{ start: '2026-07-31', end: '2026-08-02', name: 'Torbogenfest', city: 'Göllheim' },
	{ start: '2026-08-12', name: 'Bernemer Mittwoch', city: 'Frankfurt-Bornheim' },
	{ start: '2026-08-21', end: '2026-08-23', name: 'Jazz & Joy', city: 'Worms' },
	{ start: '2026-08-22', end: '2026-08-23', name: 'Kerwe', city: 'Sandhofen' },
	{ start: '2026-08-28', end: '2026-08-30', name: 'Altstadtfest', city: 'Siegburg' },
	{ start: '2026-08-28', end: '2026-08-30', name: 'Jubiläumsfeier', city: 'Germersheim' },
	{ start: '2026-09-04', end: '2026-09-06', name: 'Altstadtfest', city: 'Brilon' },
	{ start: '2026-09-11', end: '2026-09-13', name: 'Altstadtfest', city: 'Speyer' },
	{ start: '2026-09-18', end: '2026-09-20', name: 'Stadtfest', city: 'Hennef' },
	{ start: '2026-09-27', name: 'Kerwe', city: 'Niederkirchen' }
];

export const PACKAGES: BookingPackage[] = [
	{
		key: 'basic',
		name: 'Basic',
		label: 'PAKET 01',
		size: '10 bis 50 Personen',
		desc: 'Für die private Feier im Garten, den runden Geburtstag oder das Vereinsjubiläum. Die Bar kommt, bleibt ein paar Stunden und macht aus dem Abend einen Anlass.',
		includes: [
			'Anlieferung und kompletter Aufbau der BigLemon',
			'Ein Barkeeper an der Presse',
			'Frisch gepresste Säfte und Cocktails aus der Karte',
			'Gläser, Eis und Zubehör inklusive'
		]
	},
	{
		key: 'plus',
		name: 'Plus',
		label: 'PAKET 02',
		size: '50 bis 120 Personen',
		desc: 'Der Klassiker für Hochzeiten, Straßenfeste und größere Firmenfeiern. Zwei Leute hinter der Theke, damit die Schlange nie steht.',
		includes: [
			'Anlieferung, Aufbau und Abbau',
			'Zweiköpfiges Barkeeper-Team',
			'Erweiterte Drinkauswahl mit und ohne Alkohol',
			'Beleuchtung der Bar für den Abendbetrieb',
			'Individuelle Absprache der Laufzeit'
		]
	},
	{
		key: 'premium',
		name: 'Premium',
		label: 'PAKET 03',
		size: '120 bis 200 Personen',
		desc: 'Für Stadtfeste, Festivals und alles, wo es richtig voll wird. Mehrtägig möglich — wir sind das von der Kerwe gewohnt.',
		includes: [
			'Mehrtägiger Betrieb möglich',
			'Volles Crew-Team im Schichtbetrieb',
			'Komplette Karte plus Sonderwünsche',
			'Abstimmung mit Veranstalter und Standplanung',
			'Nachschub-Logistik über die gesamte Laufzeit'
		]
	},
	{
		key: 'enterprise',
		name: 'Enterprise',
		label: 'PAKET 04',
		size: 'Messe, Sommerfest, Kundenevent',
		desc: 'Ihr braucht ein Highlight am Stand oder auf dem Betriebsgelände? Die BigLemon zieht Leute an, bevor ihr das erste Wort gesagt habt.',
		includes: [
			'Einsatz auf Messen und Firmengeländen',
			'Branding-Möglichkeiten an der Bar auf Anfrage',
			'Alkoholfreies Konzept auf Wunsch',
			'Abrechnung auf Rechnung, Bewirtungsbeleg inklusive',
			'Kombination mit Amore Catering möglich'
		]
	}
];

export const CUSTOM_PACKAGE: BookingPackage = {
	key: 'offen',
	name: 'Individuelles Angebot',
	label: 'INDIVIDUELL',
	size: 'Größe noch offen',
	desc: 'Ihr wisst noch nicht, welches Paket passt? Schickt uns Anlass, Datum, Ort und die erwartete Gästezahl — wir schlagen euch die passende Variante vor.',
	includes: [
		'Beratung zur passenden Bar und Paketgröße',
		'Angebot mit Festpreis nach euren Eckdaten',
		'Alles frei kombinierbar'
	]
};

const PLATZ: BarSpec[] = [
	{ label: 'PLATZBEDARF', value: 'ca. 3 × 3 m' },
	{ label: 'STROM', value: 'nicht nötig' },
	{ label: 'WASSER', value: 'nicht nötig' }
];

export const BARS: Bar[] = [
	{
		key: 'biglemon',
		name: 'BigLemon',
		tag: 'DAS ORIGINAL',
		cta: 'BigLemon anfragen',
		accent: '#F2E63C',
		accentSoft: 'rgba(242,230,60,.26)',
		pitch:
			'Die erste Riesenzitrone, drei Meter groß und fahrbar. Aufklappen, anstellen, staunen — und dazu frisch gepresste Cocktails direkt aus der Presse.',
		note: 'Das Original — seit Jahren auf Festen zwischen Mannheim und Frankfurt.',
		specs: PLATZ
	},
	{
		key: 'biglemon2',
		name: 'BigLemon 2',
		tag: 'DIE ZWEITE ZITRONE',
		cta: 'BigLemon 2 anfragen',
		accent: '#F7B32B',
		accentSoft: 'rgba(247,179,43,.26)',
		pitch:
			'Baugleich zur ersten, mit eigener Crew. Damit laufen zwei Theken parallel auf einem großen Fest — oder zwei Termine am selben Wochenende.',
		note: 'Für lange Schlangen oder parallele Termine — zweimal die gleiche Bar.',
		specs: PLATZ
	},
	{
		key: 'bigorange',
		name: 'BigOrange',
		tag: 'DIE ORANGE',
		cta: 'BigOrange anfragen',
		accent: '#EE7B2F',
		accentSoft: 'rgba(238,123,47,.26)',
		pitch:
			'Gleiche Technik, andere Frucht: die Riesenorange in warmem Orange. Ein frischer Farbakzent, wenn es zum Fest oder zum Branding besser passt.',
		note: 'Wie die BigLemon, nur in Orange — schön als Duo mit einer Zitrone.',
		specs: PLATZ
	}
];

export const OPEN_BAR: Pick<Bar, 'name' | 'note' | 'accent'> = {
	name: 'Noch offen',
	note: 'Wir beraten euch, welche Bar zu eurem Fest passt.',
	accent: '#C2E23F'
};

/** Galerie-Kacheln. `wide` verdoppelt die Spaltenbreite, `tall` die Zeilenhöhe. */
export const GALLERY_SHOTS: GalleryShot[] = [
	{ placeholder: 'Foto: Die Bar auf dem Stadtfest', wide: true, tall: true },
	{ placeholder: 'Foto: Chriss beim Mixen' },
	{ placeholder: 'Foto: Altstadtfest Ladenburg' },
	{ placeholder: 'Foto: Drinks in der Hand', tall: true },
	{ placeholder: 'Foto: Museumsuferfest Frankfurt' },
	{ placeholder: 'Foto: Die Lemon Family' },
	{ placeholder: 'Foto: Bar bei Nacht', wide: true },
	{ placeholder: 'Foto: Frisch gepresst' }
];

/** Kennzahlen im Hero. Die Anzahl der Feste kommt aus dem CMS und steht deshalb nicht hier. */
export const HERO_STATS = [
	{ value: '50+', label: 'verschiedene Cocktails' },
	{ value: '0', label: 'Künstliche Aromen' }
];
