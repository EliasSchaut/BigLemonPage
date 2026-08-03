/**
 * Legt das Datenmodell und die oeffentlichen Leserechte in Directus an.
 *
 * Idempotent: vorhandene Collections/Felder/Rechte werden uebersprungen, das
 * Skript kann also gefahrlos erneut laufen.
 *
 *   node --env-file=.env scripts/setup-directus-schema.mjs
 */

const URL_BASE = process.env.DIRECTUS_URL ?? 'http://localhost:8055';
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
	console.error('DIRECTUS_ADMIN_EMAIL und DIRECTUS_ADMIN_PASSWORD muessen gesetzt sein.');
	process.exit(1);
}

let token = '';

async function api(path, options = {}) {
	const res = await fetch(`${URL_BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers
		}
	});
	const text = await res.text();
	const body = text ? JSON.parse(text) : {};
	if (!res.ok) {
		const message = body.errors?.[0]?.message ?? res.statusText;
		throw Object.assign(new Error(`${path}: ${message}`), { status: res.status });
	}
	return body.data;
}

/** Deutsches Label fuer ein Feld. */
const de = (translation) => [{ language: 'de-DE', translation }];

const pk = {
	field: 'id',
	type: 'integer',
	meta: { hidden: true, interface: 'input', readonly: true },
	schema: { is_primary_key: true, has_auto_increment: true }
};

const sortField = {
	field: 'sort',
	type: 'integer',
	meta: { hidden: true, interface: 'input' }
};

const imageField = (label = 'Foto', note = null) => ({
	field: 'image',
	type: 'uuid',
	meta: {
		interface: 'file-image',
		special: ['file'],
		translations: de(label),
		note,
		width: 'full'
	},
	schema: { foreign_key_table: 'directus_files' }
});

const text = (field, label, extra = {}) => ({
	field,
	type: 'string',
	meta: { interface: 'input', translations: de(label), width: 'half', ...extra.meta },
	schema: extra.schema ?? {}
});

const longText = (field, label, note) => ({
	field,
	type: 'text',
	meta: { interface: 'input-multiline', translations: de(label), note, width: 'full' }
});

const COLLECTIONS = [
	{
		collection: 'events',
		meta: {
			icon: 'event',
			note: 'Termine der laufenden Saison. Abgelaufene Termine verschwinden automatisch von der Website.',
			display_template: '{{date_start}} — {{name}} ({{city}})',
			sort: 1,
			translations: [
				{ language: 'de-DE', translation: 'Termine', singular: 'Termin', plural: 'Termine' }
			]
		},
		fields: [
			pk,
			{
				...text('name', 'Veranstaltung', {
					meta: { required: true },
					schema: { is_nullable: false }
				})
			},
			{ ...text('city', 'Ort', { meta: { required: true }, schema: { is_nullable: false } }) },
			{
				field: 'date_start',
				type: 'date',
				meta: {
					interface: 'datetime',
					required: true,
					translations: de('Beginn'),
					width: 'half'
				},
				schema: { is_nullable: false }
			},
			{
				field: 'date_end',
				type: 'date',
				meta: {
					interface: 'datetime',
					translations: de('Ende'),
					note: 'Leer lassen, wenn der Termin nur einen Tag dauert.',
					width: 'half'
				}
			}
		]
	},
	{
		collection: 'drinks',
		meta: {
			icon: 'local_bar',
			note: 'Die Drinkliste auf der Startseite.',
			display_template: '{{name}}',
			sort: 2,
			sort_field: 'sort',
			translations: [
				{ language: 'de-DE', translation: 'Drinks', singular: 'Drink', plural: 'Drinks' }
			]
		},
		fields: [
			pk,
			sortField,
			{ ...text('name', 'Name', { meta: { required: true }, schema: { is_nullable: false } }) },
			{
				...text('tag', 'Etikett', {
					meta: { note: 'Kurzes Schlagwort auf der Karte, z. B. KLASSIKER.' }
				})
			},
			longText('desc', 'Beschreibung'),
			{
				field: 'alc',
				type: 'boolean',
				meta: {
					interface: 'boolean',
					translations: de('Mit Alkohol'),
					width: 'half',
					options: { label: 'Enthaelt Alkohol' }
				},
				schema: { default_value: false }
			},
			imageField('Foto')
		]
	},
	{
		collection: 'bars',
		meta: {
			icon: 'directions_car',
			note: 'Die drei Bars. Reihenfolge per Drag & Drop.',
			display_template: '{{name}}',
			sort: 3,
			sort_field: 'sort',
			translations: [{ language: 'de-DE', translation: 'Bars', singular: 'Bar', plural: 'Bars' }]
		},
		fields: [
			pk,
			sortField,
			{
				...text('key', 'Technischer Schluessel', {
					meta: {
						required: true,
						note: 'Wird vom Anfrageformular verwendet — bitte nicht aendern.',
						validation: { key: { _regex: '^[a-z0-9-]+$' } }
					},
					schema: { is_nullable: false, is_unique: true }
				})
			},
			{ ...text('name', 'Name', { meta: { required: true }, schema: { is_nullable: false } }) },
			{ ...text('tag', 'Etikett', { meta: { note: 'Badge auf der Karte, z. B. DAS ORIGINAL.' } }) },
			{ ...text('cta', 'Button-Text') },
			{
				field: 'accent',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					translations: de('Akzentfarbe'),
					note: 'Farbe des Balkens auf der Karte. Nur Markenfarben zur Auswahl.',
					width: 'half',
					options: {
						choices: [
							{ text: 'Zitronengelb', value: 'lemon' },
							{ text: 'Sonnengelb', value: 'sun' },
							{ text: 'Orange', value: 'mandarin' },
							{ text: 'Limettengruen', value: 'lime' }
						]
					}
				},
				schema: { default_value: 'lemon' }
			},
			longText('pitch', 'Beschreibung', 'Der Text auf der Bar-Karte.'),
			longText('note', 'Hinweis in der Buchung', 'Erscheint, wenn diese Bar ausgewaehlt wurde.'),
			imageField('Foto'),
			{
				field: 'specs',
				type: 'json',
				meta: {
					interface: 'list',
					translations: de('Eckdaten'),
					note: 'Die Tabelle unten auf der Karte.',
					width: 'full',
					options: {
						template: '{{label}}: {{value}}',
						fields: [
							{
								field: 'label',
								name: 'Bezeichnung',
								type: 'string',
								meta: { interface: 'input', width: 'half' }
							},
							{
								field: 'value',
								name: 'Wert',
								type: 'string',
								meta: { interface: 'input', width: 'half' }
							}
						]
					}
				}
			}
		]
	},
	{
		collection: 'packages',
		meta: {
			icon: 'inventory_2',
			note: 'Die Buchungspakete.',
			display_template: '{{name}}',
			sort: 4,
			sort_field: 'sort',
			translations: [
				{ language: 'de-DE', translation: 'Pakete', singular: 'Paket', plural: 'Pakete' }
			]
		},
		fields: [
			pk,
			sortField,
			{
				...text('key', 'Technischer Schluessel', {
					meta: {
						required: true,
						note: 'Wird vom Anfrageformular verwendet — bitte nicht aendern.',
						validation: { key: { _regex: '^[a-z0-9-]+$' } }
					},
					schema: { is_nullable: false, is_unique: true }
				})
			},
			{ ...text('name', 'Name', { meta: { required: true }, schema: { is_nullable: false } }) },
			{ ...text('label', 'Ueberschrift', { meta: { note: 'z. B. PAKET 01.' } }) },
			{ ...text('size', 'Groesse', { meta: { note: 'z. B. 50 bis 120 Personen.' } }) },
			longText('desc', 'Beschreibung'),
			{
				field: 'includes',
				type: 'json',
				meta: {
					interface: 'list',
					translations: de('Enthaltene Leistungen'),
					width: 'full',
					options: {
						template: '{{text}}',
						fields: [
							{
								field: 'text',
								name: 'Leistung',
								type: 'string',
								meta: { interface: 'input', width: 'full' }
							}
						]
					}
				}
			}
		]
	},
	{
		collection: 'gallery',
		meta: {
			icon: 'photo_library',
			note: 'Die Bildergalerie. Reihenfolge per Drag & Drop.',
			display_template: '{{caption}}',
			sort: 5,
			sort_field: 'sort',
			translations: [
				{ language: 'de-DE', translation: 'Galerie', singular: 'Galeriebild', plural: 'Galerie' }
			]
		},
		fields: [
			pk,
			sortField,
			imageField('Foto'),
			{
				...text('caption', 'Bildunterschrift', {
					meta: {
						width: 'full',
						note: 'Dient als Platzhaltertext und als Alternativtext, falls am Bild keiner hinterlegt ist.'
					}
				})
			},
			{
				field: 'size',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					translations: de('Kachelgroesse'),
					note: 'Wie viel Platz das Bild im Raster einnimmt.',
					width: 'half',
					options: {
						choices: [
							{ text: 'Normal', value: 'normal' },
							{ text: 'Breit (2 Spalten)', value: 'breit' },
							{ text: 'Hoch (2 Zeilen)', value: 'hoch' },
							{ text: 'Gross (2x2)', value: 'gross' }
						]
					}
				},
				schema: { default_value: 'normal' }
			}
		]
	}
];

async function ensureCollections() {
	const existing = new Set((await api('/collections')).map((c) => c.collection));

	for (const definition of COLLECTIONS) {
		if (existing.has(definition.collection)) {
			console.log(`  = ${definition.collection} existiert bereits`);
			const haveFields = new Set(
				(await api(`/fields/${definition.collection}`)).map((f) => f.field)
			);
			for (const field of definition.fields) {
				if (haveFields.has(field.field)) continue;
				await api(`/fields/${definition.collection}`, {
					method: 'POST',
					body: JSON.stringify(field)
				});
				console.log(`    + Feld ${field.field}`);
			}
			continue;
		}

		await api('/collections', {
			method: 'POST',
			body: JSON.stringify({
				collection: definition.collection,
				meta: definition.meta,
				schema: { name: definition.collection },
				fields: definition.fields
			})
		});
		console.log(`  + ${definition.collection} (${definition.fields.length} Felder)`);
	}
}

/**
 * Ein Bildfeld per API anzulegen erzeugt zwar den Fremdschluessel, aber keinen
 * Relations-Eintrag — ohne den liefert die API nur die UUID statt der Bilddaten.
 */
async function ensureImageRelations() {
	const existing = await api('/relations');
	const have = new Set(existing.map((r) => `${r.collection}.${r.field}`));

	for (const definition of COLLECTIONS) {
		if (!definition.fields.some((f) => f.field === 'image')) continue;
		if (have.has(`${definition.collection}.image`)) {
			console.log(`  = Relation ${definition.collection}.image existiert bereits`);
			continue;
		}
		await api('/relations', {
			method: 'POST',
			body: JSON.stringify({
				collection: definition.collection,
				field: 'image',
				related_collection: 'directus_files'
			})
		});
		console.log(`  + Relation ${definition.collection}.image`);
	}
}

/** Alternativtext gehoert ans Bild, damit er nur einmal gepflegt wird. */
async function ensureFileAltField() {
	const fields = await api('/fields/directus_files');
	if (fields.some((f) => f.field === 'alt')) {
		console.log('  = directus_files.alt existiert bereits');
		return;
	}
	await api('/fields/directus_files', {
		method: 'POST',
		body: JSON.stringify({
			field: 'alt',
			type: 'string',
			meta: {
				interface: 'input',
				translations: de('Alternativtext'),
				note: 'Beschreibt das Bild fuer Screenreader und Suchmaschinen.',
				width: 'full'
			}
		})
	});
	console.log('  + directus_files.alt');
}

const PUBLIC_READ = {
	events: ['*'],
	drinks: ['*'],
	bars: ['*'],
	packages: ['*'],
	gallery: ['*'],
	// /assets liefert Bilder nur aus, wenn directus_files oeffentlich lesbar ist.
	directus_files: [
		'id',
		'alt',
		'title',
		'width',
		'height',
		'type',
		'filename_download',
		'focal_point_x',
		'focal_point_y',
		'modified_on'
	]
};

async function ensurePublicRead() {
	const policies = await api('/policies?limit=-1');
	const publicPolicy = policies.find((p) => p.name?.toLowerCase().includes('public'));
	if (!publicPolicy) throw new Error('Public Policy nicht gefunden');

	const existing = await api(
		`/permissions?limit=-1&filter[policy][_eq]=${publicPolicy.id}&filter[action][_eq]=read`
	);
	const have = new Map(existing.map((p) => [p.collection, p]));

	for (const [collection, fields] of Object.entries(PUBLIC_READ)) {
		const current = have.get(collection);
		if (current) {
			const wantsNarrower = fields[0] !== '*' && current.fields?.[0] === '*';
			if (!wantsNarrower) {
				console.log(`  = Leserecht ${collection} steht bereits richtig`);
				continue;
			}
			// Nach dem Aktivieren einer Lizenz laesst sich der zuvor noetige
			// Vollzugriff nachtraeglich auf die benoetigten Felder eingrenzen.
			try {
				await api(`/permissions/${current.id}`, {
					method: 'PATCH',
					body: JSON.stringify({ fields })
				});
				console.log(`  ~ Leserecht ${collection} auf ${fields.length} Felder eingegrenzt`);
			} catch (error) {
				if (error.status === 403) {
					console.log(
						`  = Leserecht ${collection} bleibt offen (Feldbeschraenkung braucht Lizenz)`
					);
				} else {
					throw error;
				}
			}
			continue;
		}
		const grant = (allowed) =>
			api('/permissions', {
				method: 'POST',
				body: JSON.stringify({
					policy: publicPolicy.id,
					collection,
					action: 'read',
					fields: allowed,
					permissions: {},
					validation: {}
				})
			});

		try {
			await grant(fields);
			console.log(`  + Leserecht ${collection}`);
		} catch (error) {
			// Ohne Lizenz gilt schon eine Feldliste als "custom permission rule".
			// Dann bleibt nur Vollzugriff — mit Open-Innovation-Grant-Key laesst
			// sich das nachtraeglich durch erneutes Ausfuehren verschaerfen.
			if (error.status === 403 && fields[0] !== '*') {
				await grant(['*']);
				console.log(
					`  + Leserecht ${collection} (alle Felder — Feldbeschraenkung braucht eine Lizenz)`
				);
			} else {
				throw error;
			}
		}
	}
}

const EDITABLE = ['events', 'drinks', 'bars', 'packages', 'gallery'];

/**
 * Rolle fuer den Redakteur: darf Inhalte und Bilder pflegen, aber weder das
 * Datenmodell noch Einstellungen anfassen — das Design bleibt damit unantastbar.
 */
async function ensureEditorRole() {
	const roles = await api('/roles?limit=-1');
	if (roles.some((r) => r.name === 'Redaktion')) {
		console.log('  = Rolle "Redaktion" existiert bereits');
		return;
	}

	const policy = await api('/policies', {
		method: 'POST',
		body: JSON.stringify({
			name: 'Redaktion',
			icon: 'edit_note',
			description: 'Inhalte und Bilder pflegen',
			admin_access: false,
			app_access: true
		})
	});

	for (const collection of EDITABLE) {
		for (const action of ['create', 'read', 'update', 'delete']) {
			await api('/permissions', {
				method: 'POST',
				body: JSON.stringify({
					policy: policy.id,
					collection,
					action,
					fields: ['*'],
					permissions: {},
					validation: {}
				})
			});
		}
	}
	// Ohne Rechte auf directus_files kann der Redakteur keine Fotos hochladen.
	for (const action of ['create', 'read', 'update', 'delete']) {
		await api('/permissions', {
			method: 'POST',
			body: JSON.stringify({
				policy: policy.id,
				collection: 'directus_files',
				action,
				fields: ['*'],
				permissions: {},
				validation: {}
			})
		});
	}

	const role = await api('/roles', {
		method: 'POST',
		body: JSON.stringify({
			name: 'Redaktion',
			icon: 'edit_note',
			description: 'Pflegt Termine, Drinks, Bars, Pakete und Fotos.',
			policies: [{ policy: policy.id }]
		})
	});

	console.log(`  + Rolle "Redaktion" (${role.id})`);
	console.log('    Benutzer dafuer anlegen: Directus -> Benutzer -> Neu, Rolle "Redaktion",');
	console.log('    Sprache auf Deutsch stellen.');
}

const login = await fetch(`${URL_BASE}/auth/login`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email: EMAIL, password: PASSWORD })
}).then((r) => r.json());

token = login.data?.access_token;
if (!token) {
	console.error('Login fehlgeschlagen:', login.errors?.[0]?.message ?? login);
	process.exit(1);
}

console.log('Collections:');
await ensureCollections();
console.log('Bild-Relationen:');
await ensureImageRelations();
console.log('Dateifelder:');
await ensureFileAltField();
console.log('Oeffentliche Leserechte:');
await ensurePublicRead();
console.log('Redaktionsrolle:');
await ensureEditorRole();
console.log('\nDatenmodell steht.');
