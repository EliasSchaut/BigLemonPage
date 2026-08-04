import { createDirectus, rest, staticToken } from '@directus/sdk';
import { env } from '$env/dynamic/private';
import type { CmsSchema } from './schema';

const baseUrl = (env.DIRECTUS_URL ?? 'http://localhost:8055').replace(/\/$/, '');

export const assetBase = (env.DIRECTUS_ASSET_URL ?? baseUrl).replace(/\/$/, '');

const TIMEOUT_MS = 3000;

function build() {
	const client = createDirectus<CmsSchema>(baseUrl).with(
		rest({
			onRequest: (options) => ({ ...options, signal: AbortSignal.timeout(TIMEOUT_MS) })
		})
	);
	return env.DIRECTUS_TOKEN ? client.with(staticToken(env.DIRECTUS_TOKEN)) : client;
}

export const directus = build();
