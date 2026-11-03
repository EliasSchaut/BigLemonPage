import {
	BARS,
	DRINKS,
	EVENTS,
	GALLERY_SHOTS,
	MARQUEE_ITEMS,
	PACKAGES,
	SECTIONS,
	type SectionKey
} from '../src/lib/data/content.ts';

const URL_BASE = process.env.DIRECTUS_URL ?? 'http://localhost:8055';
const STATIC_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!STATIC_TOKEN && (!EMAIL || !PASSWORD)) {
	console.error(
		'DIRECTUS_ADMIN_TOKEN oder DIRECTUS_ADMIN_EMAIL und DIRECTUS_ADMIN_PASSWORD muessen gesetzt sein.'
	);
	process.exit(1);
}

let token = '';

async function api(path: string, options: RequestInit = {}) {
	const res = await fetch(`${URL_BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers
		}
	});
	const body = await res.text().then((t) => (t ? JSON.parse(t) : {}));
	if (!res.ok) throw new Error(`${path}: ${body.errors?.[0]?.message ?? res.statusText}`);
	return body.data;
}

const ACCENT_TOKENS: Record<string, string> = {
	'#F2E63C': 'lemon',
	'#F7B32B': 'sun',
	'#EE7B2F': 'mandarin',
	'#C2E23F': 'lime'
};

const stripPhotoPrefix = (value: string) => value.replace(/^Foto:\s*/i, '');

function galleryTileSize(shot: { wide?: boolean; tall?: boolean }): string {
	if (shot.wide && shot.tall) return 'gross';
	if (shot.wide) return 'breit';
	if (shot.tall) return 'hoch';
	return 'normal';
}

const SECTION_LABELS: Record<SectionKey, string> = {
	hero: 'Startseite oben',
	warum: 'Warum die BigLemon',
	drinks: 'Drinkliste',
	termine: 'Termine',
	galerie: 'Galerie',
	bars: 'Bars',
	buchen: 'Buchung',
	kontakt: 'Kontakt'
};

const SEEDS: { collection: string; uniqueBy?: string; rows: Record<string, unknown>[] }[] = [
	{
		collection: 'events',
		rows: EVENTS.map((event) => ({
			name: event.name,
			city: event.city,
			date_start: event.start,
			date_end: event.end ?? null
		}))
	},
	{
		collection: 'drinks',
		rows: DRINKS.map((drink, index) => ({
			sort: index + 1,
			name: drink.name,
			tag: drink.tag,
			desc: drink.desc,
			alc: drink.alc,
			featured: drink.featured ?? false
		}))
	},
	{
		collection: 'bars',
		rows: BARS.map((bar, index) => ({
			sort: index + 1,
			key: bar.key,
			name: bar.name,
			tag: bar.tag,
			cta: bar.cta,
			accent: ACCENT_TOKENS[bar.accent.toUpperCase()] ?? 'lemon',
			pitch: bar.pitch,
			note: bar.note,
			specs: bar.specs.map((spec) => ({ label: spec.label, value: spec.value }))
		}))
	},
	{
		collection: 'packages',
		rows: PACKAGES.map((pkg, index) => ({
			sort: index + 1,
			key: pkg.key,
			name: pkg.name,
			label: pkg.label,
			size: pkg.size,
			desc: pkg.desc,
			includes: pkg.includes.map((text) => ({ text }))
		}))
	},
	{
		collection: 'gallery',
		rows: GALLERY_SHOTS.map((shot, index) => ({
			sort: index + 1,
			caption: stripPhotoPrefix(shot.placeholder),
			size: galleryTileSize(shot)
		}))
	},
	{
		collection: 'sections',
		uniqueBy: 'key',
		rows: (Object.keys(SECTIONS) as SectionKey[]).map((key, index) => ({
			sort: index + 1,
			key,
			label: SECTION_LABELS[key],
			...SECTIONS[key]
		}))
	},
	{
		collection: 'marquee',
		rows: MARQUEE_ITEMS.map((text, index) => ({ sort: index + 1, text }))
	}
];

async function authenticate() {
	if (STATIC_TOKEN) return STATIC_TOKEN;

	const login = await fetch(`${URL_BASE}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: EMAIL, password: PASSWORD })
	}).then((r) => r.json());

	const accessToken = login.data?.access_token;
	if (!accessToken) {
		console.error('Login fehlgeschlagen:', login.errors?.[0]?.message ?? login);
		process.exit(1);
	}
	return accessToken;
}

token = await authenticate();
const me = await api('/users/me?fields=email,role.name').catch((error) => {
	console.error('Anmeldung bei Directus fehlgeschlagen:', error.message);
	process.exit(1);
});
console.log(`Angemeldet als ${me.email ?? 'Token-Benutzer'} (${me.role?.name ?? 'ohne Rolle'})
`);

for (const { collection, uniqueBy, rows } of SEEDS) {
	if (uniqueBy) {
		const existing: Record<string, unknown>[] = await api(
			`/items/${collection}?limit=-1&fields=${uniqueBy}`
		);
		const have = new Set(existing.map((row) => row[uniqueBy]));
		const missing = rows.filter((row) => !have.has(row[uniqueBy]));
		if (missing.length === 0) {
			console.log(`  = ${collection} vollstaendig — uebersprungen`);
			continue;
		}
		await api(`/items/${collection}`, { method: 'POST', body: JSON.stringify(missing) });
		console.log(`  + ${collection}: ${missing.length} fehlende Eintraege ergaenzt`);
		continue;
	}

	const existing = await api(`/items/${collection}?limit=1`);
	if (existing.length > 0) {
		console.log(`  = ${collection} enthaelt bereits Daten — uebersprungen`);
		continue;
	}
	await api(`/items/${collection}`, { method: 'POST', body: JSON.stringify(rows) });
	console.log(`  + ${collection}: ${rows.length} Eintraege`);
}

console.log('\nSeed abgeschlossen.');
