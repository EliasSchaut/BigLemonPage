import { createDirectus, rest, staticToken } from '@directus/sdk';
import { DIRECTUS_ASSET_URL, DIRECTUS_TOKEN, DIRECTUS_URL } from '$app/env/private';
import type { CmsSchema } from './schema';

const baseUrl = (DIRECTUS_URL ?? 'http://localhost:8055').replace(/\/$/, '');

export const assetBase = (DIRECTUS_ASSET_URL ?? baseUrl).replace(/\/$/, '');

const TIMEOUT_MS = 3000;

function build() {
	const client = createDirectus<CmsSchema>(baseUrl).with(
		rest({
			onRequest: (options) => ({ ...options, signal: AbortSignal.timeout(TIMEOUT_MS) })
		})
	);
	return DIRECTUS_TOKEN ? client.with(staticToken(DIRECTUS_TOKEN)) : client;
}

export const directus = build();
