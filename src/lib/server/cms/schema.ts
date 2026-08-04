export interface FileRow {
	id: string;
	alt: string | null;
	title: string | null;
	width: number | null;
	height: number | null;
	modified_on: string | null;
}

export interface EventRow {
	name: string;
	city: string;
	date_start: string;
	date_end: string | null;
}

export interface DrinkRow {
	sort?: number | null;
	name: string;
	tag: string | null;
	desc: string | null;
	alc: boolean | null;
	image: FileRow | null;
}

export interface BarRow {
	sort?: number | null;
	key: string | null;
	name: string;
	tag: string | null;
	cta: string | null;
	accent: string | null;
	pitch: string | null;
	note: string | null;
	image: FileRow | null;
	specs: { label?: string; value?: string }[] | null;
}

export interface PackageRow {
	sort?: number | null;
	key: string | null;
	name: string;
	label: string | null;
	size: string | null;
	desc: string | null;
	includes: { text?: string }[] | null;
}

export interface GalleryRow {
	sort?: number | null;
	caption: string | null;
	size: string | null;
	image: FileRow | null;
}

export interface CmsSchema {
	directus_files: FileRow[];
	events: EventRow[];
	drinks: DrinkRow[];
	bars: BarRow[];
	packages: PackageRow[];
	gallery: GalleryRow[];
}

export const FILE_FIELDS: (keyof FileRow)[] = [
	'id',
	'alt',
	'title',
	'width',
	'height',
	'modified_on'
];
