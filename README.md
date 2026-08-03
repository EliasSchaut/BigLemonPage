# BigLemonPage

Website für **BigLemon**, die mobile Cocktailbar aus Mannheim ([biglemon.de](https://www.biglemon.de)).

SvelteKit 2 (Svelte 5, Runes) · Tailwind CSS v4 · Directus als CMS · Nodemailer für das Anfrageformular · Deployment als Node-Server (`@sveltejs/adapter-node`).

Termine, Drinks, Bars, Pakete und alle Fotos pflegt der Kunde selbst in Directus. Fällt das CMS aus, rendert die Seite unverändert aus den Werten in `src/lib/data/content.ts` — die Website ist also nie von Directus abhängig.

---

## Voraussetzungen

- **Node** ≥ 20 (entwickelt und getestet mit 24)
- **pnpm** (`corepack enable`)
- **Docker** mit Compose — für Postgres und Directus

## Lokale Entwicklung

```bash
cp .env.example .env          # Werte eintragen, siehe unten
pnpm install
docker compose up -d          # Postgres, Directus, MailDev (+ Website im Container)
pnpm dev                      # http://localhost:5173
```

`docker compose up` lädt automatisch `compose.override.yaml` mit und startet damit **MailDev** als Mailfänger. Wer die Website über `pnpm dev` entwickelt, braucht den `web`-Container nicht:

```bash
docker compose up -d db directus maildev
```

| Dienst               | URL                   |
| -------------------- | --------------------- |
| Website (`pnpm dev`) | http://localhost:5173 |
| Website (Container)  | http://localhost:3000 |
| Directus             | http://localhost:8055 |
| MailDev-Postfach     | http://localhost:1080 |

### Mail beim Entwickeln

MailDev fängt jede ausgehende Mail ab — es geht nichts nach außen. Der `web`-Container ist über das Override bereits darauf gerichtet. Für `pnpm dev` gehört in die `.env`:

```
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

Abgeschickte Anfragen landen dann im Postfach unter http://localhost:1080.

Beim **allerersten Start** muss die Directus-Datenbank angelegt und befüllt werden:

```bash
docker compose exec db createdb -U root directus
docker compose up -d directus
node --env-file=.env scripts/setup-directus-schema.mjs                     # Collections, Rechte, Rolle
node --env-file=.env --experimental-strip-types scripts/seed-directus.ts   # Startdaten
```

Beide Skripte sind idempotent und können gefahrlos erneut laufen.

### Weitere Befehle

| Befehl                        | Zweck                            |
| ----------------------------- | -------------------------------- |
| `pnpm build` / `pnpm preview` | Produktionsbuild / lokal ansehen |
| `pnpm check`                  | Typecheck (svelte-check)         |
| `pnpm lint` / `pnpm format`   | Prettier prüfen / anwenden       |

Ein Testsetup gibt es noch nicht.

---

## Umgebungsvariablen

Alle Variablen sind in `.env.example` dokumentiert. Kurzübersicht, was wofür gebraucht wird:

### Node-Server (die Website)

| Variable                                           | Pflicht               | Zweck                                                                                                             |
| -------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ORIGIN`                                           | **ja, in Produktion** | Öffentliche URL, z. B. `https://biglemon.de`. Fehlt sie, lehnt der CSRF-Schutz die Formular-POSTs mit **403** ab. |
| `PORT`                                             | nein                  | Standard `3000`.                                                                                                  |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | für Mailversand       | Zugangsdaten des Postfachs.                                                                                       |
| `SMTP_FROM`                                        | für Mailversand       | Absender. Muss zum SMTP-Postfach passen, sonst greifen SPF/DMARC.                                                 |
| `CONTACT_EMAIL`                                    | nein                  | Empfänger der Anfragen. Ohne Angabe: die Adresse aus `src/lib/data/content.ts`.                                   |
| `SMTP_SECURE`                                      | nein                  | Erzwingt implizites TLS. Ohne Angabe: `true` bei Port 465, sonst STARTTLS.                                        |
| `DIRECTUS_URL`                                     | nein                  | Wo der Server Directus erreicht. Im Compose-Netz `http://directus:8055`.                                          |
| `DIRECTUS_ASSET_URL`                               | nein                  | URL, die in den Bild-Tags landet, z. B. `https://cms.biglemon.de`.                                                |
| `DIRECTUS_TOKEN`                                   | nein                  | Nur nötig, wenn die Collections nicht öffentlich lesbar sein sollen.                                              |
| `CMS_CACHE_TTL`                                    | nein                  | Sekunden, die Inhalte im Prozess gecacht werden (Standard 60).                                                    |

> `DATABASE_URL` braucht die Website **nicht** zur Laufzeit — Postgres nutzt derzeit nur Directus. Die Variable ist ausschließlich für die `drizzle-kit`-Befehle da.

### Directus-Container

`SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PUBLIC_URL` und optional `LICENSE_KEY` werden in `compose.yaml` aus `DIRECTUS_*`-Variablen der `.env` durchgereicht.

---

## Deployment

Die Website läuft als Container (`Dockerfile`, mehrstufig: Build-Werkzeuge und Quellcode landen nicht im Laufzeit-Image, das ~256 MB groß ist und als unprivilegierter Benutzer startet).

### Mit Docker Compose (empfohlen)

> **Wichtig:** In Produktion ausdrücklich nur die Basisdatei angeben. Ohne `-f compose.yaml` zieht Compose das Entwicklungs-Override mit und schickt sämtliche Mail an MailDev statt an den echten Server.

```bash
docker compose -f compose.yaml up -d --build
```

Vorher in der `.env` setzen: `ORIGIN`, `DIRECTUS_ASSET_URL` und die `SMTP_*`-Werte. Der `web`-Service reicht sie durch und spricht Directus intern über `http://directus:8055` an.

### Ohne Docker

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm install --prod --frozen-lockfile
ORIGIN=https://biglemon.de PORT=3000 node build/index.js
```

Auf den Server gehören dann **`build/`**, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` und die Produktionsabhängigkeiten — `@directus/sdk` und `nodemailer` werden _nicht_ mitgebundelt. Sinnvoll als systemd-Unit mit Neustart bei Absturz.

In beiden Fällen gehört ein Reverse Proxy (nginx, Caddy, Traefik) für TLS davor.

### Domains

Zwei Namen sind nötig:

| Domain            | Ziel                    | Hinweis                                                                                                                                                             |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `biglemon.de`     | Node-Server (Port 3000) | `ORIGIN` muss exakt darauf zeigen.                                                                                                                                  |
| `cms.biglemon.de` | Directus (Port 8055)    | `DIRECTUS_PUBLIC_URL` darauf setzen, per `robots.txt`/Header auf `noindex`, und `DIRECTUS_TRUST_PROXY=true` setzen — sonst sehen die Rate-Limiter nur die Proxy-IP. |

`DIRECTUS_ASSET_URL` muss auf die **öffentliche** CMS-Domain zeigen, weil diese URLs im HTML landen. `DIRECTUS_URL` darf dagegen die interne Adresse sein.

### Erststart auf dem Server

```bash
docker compose -f compose.yaml up -d db
docker compose exec db createdb -U root directus
docker compose -f compose.yaml up -d directus
node --env-file=.env scripts/setup-directus-schema.mjs
node --env-file=.env --experimental-strip-types scripts/seed-directus.ts
```

Danach in Directus unter **Benutzer → Neu** ein Konto für die Redaktion anlegen, Rolle „Redaktion", Sprache auf Deutsch.

### Directus-Lizenz

Directus 12 erzwingt Lizenzstufen. Ohne Key läuft die Instanz im **Core-Tier**: feldbeschränkte Berechtigungen sind gesperrt, und nach 30 Tagen Karenz können Logins von Nicht-Admins blockiert werden — also genau der Zugang des Kunden.

Der kostenlose [Open Innovation Grant](https://directus.com/oig) (< 5 Mio. $ Umsatz, < 50 Mitarbeitende) hebt das auf. Key als `DIRECTUS_LICENSE_KEY` in die `.env`, dann:

```bash
docker compose up -d directus
node --env-file=.env scripts/setup-directus-schema.mjs   # grenzt die Dateirechte ein
```

Zwei Fallstricke:

- Der Key bindet sich beim ersten Start **fest an Projekt und `PUBLIC_URL`**. Eine lokale Aktivierung verbraucht eine der begrenzten Aktivierungen für `http://localhost:8055` — im Zweifel den Key nur in Produktion eintragen.
- `LICENSE_KEY` und `LICENSE_TOKEN` schließen sich aus; sind beide gesetzt, startet Directus nicht.

Ob der Key greift, zeigt `license.source` in `GET /server/info` (mit Admin-Token).

---

## Betrieb

### Backup

Zwei Dinge gehören gesichert — beide sind nötig, eines allein reicht nicht:

```bash
# 1. Inhalte
docker compose exec -T db pg_dump -U root directus > directus-$(date +%F).sql

# 2. Hochgeladene Fotos (liegen NICHT in Postgres)
docker run --rm -v biglemonpage_directus_uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

Fehlt das Volume im Backup, sind nach einem Restore alle Fotos weg, während die Datenbankeinträge noch darauf verweisen.

### Updates

- **Website:** `docker compose -f compose.yaml up -d --build` (bzw. ohne Docker: neu bauen, `build/` ersetzen, Prozess neu starten).
- **Directus:** Version in `compose.yaml` ist bewusst gepinnt. Vor einem Sprung Release Notes lesen (Lizenz- und Berechtigungsverhalten haben sich in v12 geändert), vorher Backup ziehen.
- **Postgres:** ebenfalls gepinnt. Ein Major-Upgrade braucht `pg_dump`/`pg_restore` — das Volume ist nicht versionsübergreifend lesbar.

### Wenn die Seite plötzlich alte Inhalte zeigt

Dann liefert der Fallback. Im Server-Log steht eine Zeile mit `[cms]` und dem Grund. Häufigste Ursachen: Directus läuft nicht, `DIRECTUS_URL` ist falsch, oder die öffentlichen Leserechte fehlen (Directus antwortet dann mit **403**, nicht mit einer leeren Liste). `scripts/setup-directus-schema.mjs` stellt die Rechte wieder her.

---

## Was im Code bleibt

Bewusst **nicht** im CMS, damit Design und Rechtstexte nicht versehentlich kaputtgehen:

- Sektionsüberschriften und Marketing-Copy (`src/lib/components/sections/`)
- Impressum und Datenschutzerklärung (`src/routes/rechtliches/+page.svelte`)
- Stammdaten wie Telefon, E-Mail, Anschrift (`CONTACT` in `src/lib/data/content.ts`)
- Markenfarben — im CMS stehen nur Token-Namen (`lemon`, `sun`, …), die der Code auflöst

Weitere Details zur Architektur stehen in [CLAUDE.md](./CLAUDE.md).
