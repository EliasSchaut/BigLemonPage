# BigLemonPage

Website für **BigLemon**, die mobile Cocktailbar aus Mannheim ([biglemon.de](https://www.biglemon.de)).

SvelteKit 2 (Svelte 5, Runes) · Tailwind CSS v4 · Directus als CMS · Nodemailer für das Anfrageformular · Deployment als Node-Server (`@sveltejs/adapter-node`).

Termine, Drinks, Bars, Pakete und alle Fotos pflegt der Kunde selbst in Directus. Fällt das CMS aus, rendert die Seite unverändert aus den Werten in `src/lib/data/content.ts` — die Website ist also nie von Directus abhängig.

---

## Voraussetzungen

- **Node** ≥ 20 (entwickelt und getestet mit 24)
- **pnpm** (`corepack enable`)
- **Docker** mit Compose — für Directus (samt eigener Postgres) und MailDev

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

Beim **allerersten Start** muss Directus noch befüllt werden:

```bash
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

> Die Website spricht **keine Datenbank** an — sie liest ihre Inhalte über HTTP aus Directus. Postgres gehört allein Directus; der `web`-Container bekommt deshalb bewusst keine Datenbankvariablen.

### Datenbank (nur für Directus)

| Variable                             | Pflicht | Zweck                                                                                                                                                                                                                       |
| ------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD` | **ja**  | Zugangsdaten der Postgres-Instanz. Fehlen sie, bricht `docker compose` mit einer klaren Meldung ab, statt mit Standardwerten zu starten.                                                                                    |
| `POSTGRES_DB`                        | nein    | Standard `directus`. Wird beim ersten Start eines leeren Volumes automatisch angelegt.                                                                                                                                      |
| `DIRECTUS_DB_URL`                    | nein    | Vollständiger Connection-String. Nur nötig, wenn Directus auf eine Datenbank **außerhalb** dieses Stacks zeigen soll (z. B. eine verwaltete Postgres). Ohne Angabe baut `compose.yaml` die URL aus den `POSTGRES_*`-Werten. |

Directus bekommt keine Einzelwerte mehr, sondern einen `DB_CONNECTION_STRING` — die Zugangsdaten stehen damit nur an einer Stelle. Sonderzeichen im Passwort müssen URL-kodiert sein.

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

### Image für einen anderen Prozessor bauen (Apple Silicon → x86-Server)

Auf einem M-Mac entsteht standardmäßig ein `arm64`-Image. Läuft der Server auf x86, muss die Zielplattform mit angegeben werden — Docker Desktop emuliert das (dank Rosetta ohne nennenswerten Zeitverlust, hier ~30 s):

```bash
# nur amd64, lokal verfügbar
docker buildx build --platform linux/amd64 -t kidilias/biglemon:latest --load .
```

Für ein Image, das **beide** Architekturen bedient, braucht buildx einen eigenen Builder — der voreingestellte `docker`-Treiber kann keine Manifest-Listen erzeugen:

```bash
docker buildx create --name multiarch --driver docker-container --bootstrap   # einmalig
docker buildx build --builder multiarch \
  --platform linux/amd64,linux/arm64 \
  -t kidilias/biglemon:latest --push .
```

`--push` ist hier Pflicht: Mehr-Architektur-Images lassen sich nicht mit `--load` in den lokalen Docker-Speicher legen, sie brauchen eine Registry.

> Wer ohnehin direkt auf dem Server baut (`docker compose -f compose.yaml up -d --build`), braucht davon nichts — dort wird nativ für die richtige Architektur gebaut.

### Ohne Docker

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm install --prod --frozen-lockfile
ORIGIN=https://biglemon.de PORT=3000 node build/index.js
```

Auf den Server gehören dann **`build/`**, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` und die Produktionsabhängigkeiten — `@directus/sdk` und `nodemailer` werden _nicht_ mitgebundelt. Sinnvoll als systemd-Unit mit Neustart bei Absturz.

In beiden Fällen gehört ein Reverse Proxy (nginx, Caddy, Traefik) für TLS davor.

### Domains und Reverse Proxy

Website und CMS können sich eine Domain teilen (`biglemon.de` und `biglemon.de/cms/`) oder auf zwei Namen liegen. Eine fertige nginx-Konfiguration für die Pfad-Variante liegt in [`deploy/nginx.conf.example`](./deploy/nginx.conf.example).

Die passenden Werte in der `.env`:

| Variable               | Pfad-Variante             | Subdomain-Variante        |
| ---------------------- | ------------------------- | ------------------------- |
| `ORIGIN`               | `https://biglemon.de`     | `https://biglemon.de`     |
| `DIRECTUS_PUBLIC_URL`  | `https://biglemon.de/cms` | `https://cms.biglemon.de` |
| `DIRECTUS_ASSET_URL`   | `https://biglemon.de/cms` | `https://cms.biglemon.de` |
| `DIRECTUS_URL`         | `http://directus:8055`    | `http://directus:8055`    |
| `DIRECTUS_TRUST_PROXY` | `true`                    | `true`                    |

`DIRECTUS_PUBLIC_URL` und `DIRECTUS_ASSET_URL` müssen die **öffentliche** Adresse samt Präfix enthalten — die eine baut Directus in Weiterleitungen und Mails ein, die andere landet als Bild-URL im HTML. `DIRECTUS_URL` bleibt die interne Compose-Adresse und wird nur serverseitig benutzt.

#### Besonderheiten der Pfad-Variante

Vier Dinge entscheiden, ob es funktioniert:

1. **Der Slash am Ende von `proxy_pass` ist Pflicht.** `proxy_pass http://127.0.0.1:8055/;` schneidet das Präfix ab, sodass Directus `/server/ping` statt `/cms/server/ping` sieht. Ohne den Slash läuft jede Anfrage ins Leere.
2. **`client_max_body_size` hochsetzen.** nginx lehnt Uploads über 1 MB sonst mit **413** ab — im Test scheiterte bereits ein 1,6-MB-Foto. Handyfotos sind schnell 5–12 MB, und Bilder hochladen ist die Hauptaufgabe des CMS.
3. **`absolute_redirect off;`** — sonst verliert die automatische Weiterleitung von `/cms` auf `/cms/` den Port bzw. das `https`.
4. **`DIRECTUS_TRUST_PROXY=true`**, sonst sehen die Rate-Limiter nur die IP des Proxys. Der Standard hat sich in Directus 12 auf `false` geändert.

Getestet mit Directus 12.2.0 hinter nginx: Admin-Oberfläche, API, Login samt Session-Cookie und Bild-Transformationen laufen unter dem Präfix. Möglich ist das, weil die Admin-App relative Asset-Pfade (`./assets/…`) verwendet.

> Das Session-Cookie von Directus wird mit `Path=/` gesetzt und damit auch an die Website mitgeschickt. Unkritisch (`HttpOnly`, `SameSite=Lax`), aber ein Argument für die Subdomain-Variante, wenn eine saubere Trennung gewünscht ist. Bei einer eigenen CMS-Domain gehört diese zusätzlich auf `noindex`.

### Erststart auf dem Server

```bash
docker compose -f compose.yaml up -d
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

## SEO und Metadaten

`src/lib/components/Seo.svelte` erzeugt Titel, Description, Keywords, Canonical, Open Graph, Twitter Card und optionale strukturierte Daten. Die Textbausteine stehen zentral in `SITE` (`src/lib/data/content.ts`), das Vorschaubild unter `static/og-image.jpg` (1200×630).

Die Startseite liefert zusätzlich `LocalBusiness`-JSON-LD aus `src/lib/data/structured-data.ts` — mit Kontaktdaten, Einsatzgebieten und Social-Profilen. Die Termine sind bewusst **nicht** als `Event` ausgezeichnet: BigLemon ist auf Stadtfesten und CSDs Anbieter, nicht Veranstalter; sie als eigene Events zu melden wäre gegenüber Suchmaschinen falsch.

`robots.txt` und `sitemap.xml` sind Routen statt statischer Dateien, weil beide absolute URLs brauchen.

> **Wichtig:** Alle absoluten URLs (Canonical, `og:image`, Sitemap) leiten sich aus `ORIGIN` ab. Ist die Variable in Produktion nicht gesetzt, stehen dort die falschen Adressen und Social-Vorschauen bleiben leer.

## Was im Code bleibt

Bewusst **nicht** im CMS, damit Design und Rechtstexte nicht versehentlich kaputtgehen:

- Sektionsüberschriften und Marketing-Copy (`src/lib/components/sections/`)
- Impressum und Datenschutzerklärung (`src/routes/rechtliches/+page.svelte`)
- Stammdaten wie Telefon, E-Mail, Anschrift (`CONTACT` in `src/lib/data/content.ts`)
- Markenfarben — im CMS stehen nur Token-Namen (`lemon`, `sun`, …), die der Code auflöst

Weitere Details zur Architektur stehen in [CLAUDE.md](./CLAUDE.md).
