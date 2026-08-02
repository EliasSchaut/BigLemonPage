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

### Database

Postgres via Docker + Drizzle ORM:

- `pnpm db:start` — start local Postgres (`compose.yaml`, port 5432)
- `pnpm db:push` — push schema directly (dev)
- `pnpm db:generate` / `pnpm db:migrate` — generate and run migrations
- `pnpm db:studio` — Drizzle Studio

Requires `DATABASE_URL` in `.env` (both `drizzle.config.ts` and the app throw if unset).

## Architecture

- **SvelteKit 2 + Svelte 5 with runes mode forced** for all project files via `vite.config.ts` (`compilerOptions.runes`) — use `$props()`, `$state()`, `$derived()`, etc.; legacy `export let` / `$:` syntax will not compile outside `node_modules`.
- **Tailwind CSS v4** via the Vite plugin — no `tailwind.config.js`; configuration lives in CSS (`src/routes/layout.css`, imported by the root layout). `@tailwindcss/forms` is enabled there via `@plugin`.
- **Database layer**: schema in `src/lib/server/db/schema.ts`, client (postgres-js + Drizzle) exported as `db` from `src/lib/server/db/index.ts`. Server-only by convention of the `$lib/server` path.
- **Deployment target**: Node server (`@sveltejs/adapter-node`).

## Code style

Prettier is enforced (`prettier.config.js`): tabs, single quotes, no trailing commas, 100-char lines, with the Svelte and Tailwind class-sorting plugins.
