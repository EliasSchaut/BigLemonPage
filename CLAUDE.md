# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

New website for BigLemon, a mobile cocktail bar in Mannheim (biglemon.de). Freshly scaffolded SvelteKit app — the actual site is being rebuilt from a static HTML prototype. Content is in German.

- `prototype/` — static HTML prototype (`BigLemon.dc.html`, `Rechtliches.dc.html`) with brand assets. This is the design reference for the SvelteKit implementation.
- `context/biglemon-de-scrape.md` — full scrape of the old biglemon.de site (company data, page structure, all copy). Source of truth for content, contact details, and Impressum data.
- `context/Grafiken & Visitenkarte/` — original brand graphics; web-ready versions live in `prototype/assets/`.

## Commands

Package manager is **pnpm**.

- `pnpm dev` — start dev server (Vite)
- `pnpm build` / `pnpm preview` — production build (adapter-node) / preview
- `pnpm check` — typecheck via svelte-check (also runs `svelte-kit sync` first)
- `pnpm lint` — Prettier check; `pnpm format` to fix
- No test setup exists yet.

### E-Mail

Das Anfrageformular verschickt per SMTP (Nodemailer). Konfiguration über `.env`, alle Variablen sind in `.env.example` dokumentiert: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_EMAIL`. Ohne `CONTACT_EMAIL` geht die Mail an die Adresse aus `CONTACT` in `src/lib/data/content.ts`.

Lokal fängt **MailDev** (aus `compose.override.yaml`) allen Versand ab: Postfach unter `http://localhost:1080`, SMTP auf Port 1025. Für `pnpm dev` dazu `SMTP_HOST=127.0.0.1` und `SMTP_PORT=1025` setzen; der `web`-Container ist bereits darauf gerichtet.

### CMS (Directus)

Termine, Drinks, Bars, Pakete und die Galeriebilder pflegt der Kunde in Directus (`http://localhost:8055`, läuft über `compose.yaml` auf einer eigenen Datenbank `directus`).

- `docker compose up -d` — Postgres + Directus starten (Zugangsdaten kommen aus `POSTGRES_USER`/`POSTGRES_PASSWORD` in der `.env`; Directus erhaelt daraus einen `DB_CONNECTION_STRING`, `DIRECTUS_DB_URL` ueberschreibt ihn fuer externe Datenbanken)
- `node --env-file=.env scripts/setup-directus-schema.mjs` — Collections, Bild-Relationen, öffentliche Leserechte und die Rolle „Redaktion" anlegen (idempotent, ersetzt einen Schema-Snapshot)
- `node --env-file=.env --experimental-strip-types scripts/seed-directus.ts` — Startwerte aus `content.ts` übertragen (überspringt befüllte Collections)

**Lizenz:** Directus 12 erzwingt Lizenzstufen. Ohne Key läuft die Instanz im Core-Tier — dort sind feldbeschränkte Berechtigungen gesperrt (das Setup-Skript weicht automatisch auf Vollzugriff aus) und nach 30 Tagen Karenz können Nicht-Admin-Logins blockiert werden.

Der Key des kostenlosen [Open Innovation Grant](https://directus.com/oig) (<5 Mio. $ Umsatz, <50 Mitarbeitende) gehört als `DIRECTUS_LICENSE_KEY` in die `.env`; `compose.yaml` reicht ihn als `LICENSE_KEY` durch. Danach `docker compose up -d directus` und das Setup-Skript erneut ausführen — es grenzt den öffentlichen Lesezugriff auf `directus_files` dann auf die benötigten Felder ein.

Zwei Fallstricke: Der Key bindet sich beim ersten Start **fest an Projekt und `PUBLIC_URL`** — eine lokale Aktivierung verbraucht eine der begrenzten Aktivierungen für `http://localhost:8055`. Und `LICENSE_KEY` und `LICENSE_TOKEN` schließen sich aus; sind beide gesetzt, startet Directus nicht.

## Architecture

- **SvelteKit 2 + Svelte 5 with runes mode forced** for all project files via `vite.config.ts` (`compilerOptions.runes`) — use `$props()`, `$state()`, `$derived()`, etc.; legacy `export let` / `$:` syntax will not compile outside `node_modules`.
- **Tailwind CSS v4** via the Vite plugin — no `tailwind.config.js`; configuration lives in CSS (`src/routes/layout.css`, imported by the root layout). `@tailwindcss/forms` is enabled there via `@plugin`.
- **Keine Datenbank in der App**: Die Website liest ihre Inhalte ausschließlich per HTTP aus Directus. Postgres läuft nur als Directus-Backend — der `web`-Container bekommt bewusst keine DB-Zugangsdaten.
- **Inhalte**: `src/lib/data/content.ts` hat eine Doppelrolle — Startwerte für den CMS-Seed _und_ Fallback zur Laufzeit; die Datei bleibt daher gepflegt. `src/lib/server/cms/` fragt Directus (`index.ts`), cacht prozessweit mit stale-if-error (`cache.ts`) und übersetzt die Rohdaten in die App-Typen (`map.ts`). Fällt Directus aus, rendert die Seite unverändert aus `content.ts`. Datumsformatierung und Monatsgruppierung der Termine liegen in `src/lib/data/events.ts` (framework- und serverfrei, damit CMS- und Fallback-Daten dieselbe Logik durchlaufen). Markenfarben und Galerie-Layout bleiben im Code: im CMS stehen nur Token-Namen, die `map.ts` auflöst.
- **Mail-Versand**: `src/lib/server/mail/` — `index.ts` baut den (gepoolten) Nodemailer-Transport aus `$env/dynamic/private` und verschickt; `template.ts` ersetzt `{{platzhalter}}` in den Vorlagen unter `templates/` (HTML-Werte werden escaped). Die Vorlagen werden per `?raw` in den Server-Build gebündelt und sind in `.prettierignore` ausgenommen. Aufgerufen von der Form-Action `anfrage` in `src/routes/+page.server.ts`.
- **Deployment target**: Node server (`@sveltejs/adapter-node`). In Produktion muss `ORIGIN` auf die öffentliche URL gesetzt sein, sonst lehnt der CSRF-Schutz die Formular-POSTs mit 403 ab.

## Fallstricke

- `bars.key` / `packages.key` sind ein Vertrag zwischen CMS, Anfrageformular, `booking.svelte.ts` und dem Label-Mapping in der Anfrage-Mail — im CMS als „technischer Schlüssel" markiert und nicht zu ändern.
- Bildfelder brauchen einen Eintrag in `directus_relations`, sonst liefert die API nur die UUID statt der Bilddaten. Beim Anlegen per API entsteht der nicht automatisch — `setup-directus-schema.mjs` legt ihn explizit an.
- In `$state`-Arrays landen beim Schreiben **Proxys** der Objekte, nicht die Originale. `array.indexOf(objekt)` findet deshalb nie etwas — in `fun.svelte.ts` blieb so jeder Safttropfen für immer im DOM stehen. Aufräumen daher immer über eine ID (`findIndex`) oder den Schleifenindex, nie über Objektidentität.
- `{#each}` über CMS-Daten bleibt **ohne Key**. Doppelte Keys (zwei Fotos ohne Bildunterschrift, zwei gleich benannte Drinks, zweimal dieselbe Spec-Zeile) wirft Svelte beim Hydrieren als `each_key_duplicate` — SSR prüft Keys nicht, die Seite blitzt also kurz auf und ist dann leer. Ein Pflegefehler im CMS darf die Seite nicht abschießen; die Listen werden ohnehin nie umsortiert, Keys bringen hier nichts.
- Fotos direkt aus dem Handy (4284×5712) liefen ab Directus 12.2.0 mit `400 ILLEGAL_ASSET_TRANSFORMATION`. Die neue Ausgabegrenze (`ASSETS_TRANSFORM_IMAGE_MAX_OUTPUT_DIMENSION`, Default 3000) wird für jeden Transform-Schritt geprüft, beginnend bei der Originalgröße — und `resolvePreset` stellt den `toFormat`-Schritt (aus `quality`/`format`) vor das `resize`. Damit meldet Schritt 1 die volle Fotogröße, und alles über 3000 px fliegt raus, bevor verkleinert wird. `compose.yaml` setzt die Grenze deshalb auf 6000. Ohne `quality`/`format` in der URL entfällt der Schritt und dieselben Bilder gehen durch — falls die Grenze mal wieder greift, ist das der schnelle Gegentest.
- Termine liegen als Feldtyp `date` (nicht `datetime`), sonst verschiebt die Zeitzonenkonvertierung Datumsangaben um einen Tag.
- Das Volume `directus_uploads` liegt nicht in Postgres und gehört separat ins Backup — sonst sind nach einem Restore alle Fotos weg.

## Code style

Prettier is enforced (`prettier.config.js`): tabs, single quotes, no trailing commas, 100-char lines, with the Svelte and Tailwind class-sorting plugins.

**No comments in code.** Write code that explains itself instead. If a comment is genuinely unavoidable, write it in English — never German. Rationale that would otherwise go into a comment belongs in this file (see "Fallstricke").
