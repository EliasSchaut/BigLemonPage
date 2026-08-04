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

export interface EventItem {
	start: string;
	end?: string;
	name: string;
	city: string;
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
	accent: string;
	accentSoft: string;
	pitch: string;
	note: string;
	specs: BarSpec[];
	image?: Image;
}

export interface GalleryShot {
	placeholder: string;
	wide?: boolean;
	tall?: boolean;
	image?: Image;
}
