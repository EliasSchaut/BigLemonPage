# syntax=docker/dockerfile:1

# Mehrstufig, damit im finalen Image weder Quellcode noch Build-Werkzeuge liegen.
# adapter-node bundelt @directus/sdk und nodemailer nicht mit — die Produktions-
# abhaengigkeiten muessen deshalb ins Laufzeit-Image.

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

# --- Nur Produktionsabhaengigkeiten -----------------------------------------
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# --- Build ------------------------------------------------------------------
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- Laufzeit ---------------------------------------------------------------
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

# Nicht als root laufen — der Node-Basisimage bringt den Benutzer bereits mit.
USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "build/index.js"]
