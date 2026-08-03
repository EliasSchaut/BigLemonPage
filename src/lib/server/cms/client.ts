import { createDirectus, rest, staticToken } from '@directus/sdk';
import { env } from '$env/dynamic/private';
import type { CmsSchema } from './schema';

const baseUrl = (env.DIRECTUS_URL ?? 'http://localhost:8055').replace(/\/$/, '');

/**
 * URL, die im Browser landet. Weicht in Produktion von DIRECTUS_URL ab: SSR spricht
 * intern den Compose-Servicenamen an, das <img> braucht die oeffentliche Adresse.
 */
export const assetBase = (env.DIRECTUS_ASSET_URL ?? baseUrl).replace(/\/$/, '');

const TIMEOUT_MS = 3000;

function build() {
	// Ohne Timeout haengt ein blockierendes Directus die SSR unbegrenzt.
	const client = createDirectus<CmsSchema>(baseUrl).with(
		rest({
			onRequest: (options) => ({ ...options, signal: AbortSignal.timeout(TIMEOUT_MS) })
		})
	);
	return env.DIRECTUS_TOKEN ? client.with(staticToken(env.DIRECTUS_TOKEN)) : client;
}

export const directus = build();
