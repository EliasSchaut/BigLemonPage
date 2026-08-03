// Datentypen der Website-Inhalte. Bewusst frei von Framework- und Server-Imports,
// damit sie sowohl im Client als auch im Seed-Skript nutzbar sind.

/** Fertig aufbereitetes Bild — die URLs baut der CMS-Mapper, die Komponente reicht sie nur durch. */
export interface Image {
	src: string;
	srcset?: string;
	sizes?: string;
	alt: string;
	width?: number;
	height?: number;
}

export interface Drink {
	name: string;
	tag: string;
	desc: string;
	alc: boolean;
	image?: Image;
}

/** Ein Termin. Datumsangaben als ISO-String (YYYY-MM-DD); `end` fehlt bei eintägigen Terminen. */
export interface EventItem {
	start: string;
	end?: string;
	name: string;
	city: string;
	/** Vom Server gesetzt: liegt der Termin bereits in der Vergangenheit? */
	past?: boolean;
}

export interface EventMonth {
	name: string;
	items: EventItem[];
}

export interface BookingPackage {
	key: string;
	name: string;
	label: string;
	size: string;
	desc: string;
	includes: string[];
}

export interface BarSpec {
	label: string;
	value: string;
}

export interface Bar {
	key: string;
	name: string;
	tag: string;
	cta: string;
	/** Aufgelöste Akzentfarbe. Im CMS steht nur ein Token-Name, der Mapper löst ihn auf. */
	accent: string;
	accentSoft: string;
	pitch: string;
	note: string;
	specs: BarSpec[];
	image?: Image;
}

/** Galerie-Kachel. `wide`/`tall` steuern die Rasterfläche. */
export interface GalleryShot {
	placeholder: string;
	wide?: boolean;
	tall?: boolean;
	image?: Image;
}
