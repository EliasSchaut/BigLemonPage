// Zentrale Inhalte der Website — aus dem Prototyp (prototype/BigLemon.dc.html) übernommen.

export const CONTACT = {
	phoneDisplay: '0176 26043698',
	phoneHref: 'tel:+4917626043698',
	email: 'welcome@biglemon.de',
	owner: 'Christopher Moravec',
	company: 'BigLemon Deutschland',
	street: 'Angelstraße 110',
	city: '68199 Mannheim',
	instagram: 'https://www.instagram.com/biglemonbar',
	facebook: 'https://www.facebook.com/biglemonbar',
	vatId: 'DE 272012285'
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

export interface Drink {
	name: string;
	tag: string;
	desc: string;
	alc: boolean;
}

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

export interface EventItem {
	date: string;
	name: string;
	city: string;
}

export interface EventMonth {
	name: string;
	items: EventItem[];
}

export const MONTHS: EventMonth[] = [
	{
		name: 'Mai',
		items: [
			{ date: '08.–10.05.', name: 'Frühlingsfest', city: 'Lorsch' },
			{ date: '29.–31.05.', name: 'Schützenfest', city: 'Gummersbach' },
			{ date: '30.–31.05.', name: 'Berger Straßenfest', city: 'Frankfurt-Bergen' }
		]
	},
	{
		name: 'Juni',
		items: [
			{ date: '04.–07.06.', name: 'CSD', city: 'Düsseldorf' },
			{ date: '13.06.', name: 'Weststadtfest', city: 'Weinheim' },
			{ date: '26.–28.06.', name: 'Altstadtfest', city: 'Trier' }
		]
	},
	{
		name: 'Juli',
		items: [
			{ date: '03.–05.07.', name: 'CSD', city: 'Köln' },
			{ date: '03.–05.07.', name: 'Lanzparkfest', city: 'Mannheim-Lindenhof' },
			{ date: '10.–11.07.', name: 'Straßenfest', city: 'Neckarrems' },
			{ date: '12.07.', name: 'CSD', city: 'Olpe' },
			{ date: '18.07.', name: 'Sommernachtsfest', city: 'Heimkirchen' },
			{ date: '24.–27.07.', name: 'CSD', city: 'Stuttgart' },
			{ date: '25.07.', name: 'CSD', city: 'Berlin' },
			{ date: '25.07.', name: 'CSD', city: 'Duisburg' },
			{ date: '31.07.–02.08.', name: 'Torbogenfest', city: 'Göllheim' }
		]
	},
	{
		name: 'August',
		items: [
			{ date: '12.08.', name: 'Bernemer Mittwoch', city: 'Frankfurt-Bornheim' },
			{ date: '21.–23.08.', name: 'Jazz & Joy', city: 'Worms' },
			{ date: '22.–23.08.', name: 'Kerwe', city: 'Sandhofen' },
			{ date: '28.–30.08.', name: 'Altstadtfest', city: 'Siegburg' },
			{ date: '28.–30.08.', name: 'Jubiläumsfeier', city: 'Germersheim' }
		]
	},
	{
		name: 'September',
		items: [
			{ date: '04.–06.09.', name: 'Altstadtfest', city: 'Brilon' },
			{ date: '11.–13.09.', name: 'Altstadtfest', city: 'Speyer' },
			{ date: '18.–20.09.', name: 'Stadtfest', city: 'Hennef' },
			{ date: '27.09.', name: 'Kerwe', city: 'Niederkirchen' }
		]
	}
];

export interface BookingPackage {
	key: string;
	name: string;
	label: string;
	size: string;
	desc: string;
	includes: string[];
}

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

const PLATZ: { label: string; value: string }[] = [
	{ label: 'PLATZBEDARF', value: 'ca. 3 × 3 m' },
	{ label: 'STROM', value: 'nicht nötig' },
	{ label: 'WASSER', value: 'nicht nötig' }
];

export interface Bar {
	key: string;
	name: string;
	tag: string;
	cta: string;
	accent: string;
	accentSoft: string;
	pitch: string;
	note: string;
	specs: { label: string; value: string }[];
}

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

export const HERO_STATS = [
	{ value: '24', label: 'Feste in 2026' },
	{ value: '50+', label: 'verschiedene Cocktails' },
	{ value: '0', label: 'Künstliche Aromen' }
];
