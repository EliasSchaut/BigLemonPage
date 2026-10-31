import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	DIRECTUS_URL: { schema: optional },
	DIRECTUS_ASSET_URL: { schema: optional },
	DIRECTUS_TOKEN: { schema: optional },
	CMS_CACHE_TTL: { schema: optional },
	SMTP_HOST: { schema: optional },
	SMTP_PORT: { schema: optional },
	SMTP_SECURE: { schema: optional },
	SMTP_USER: { schema: optional },
	SMTP_PASS: { schema: optional },
	SMTP_FROM: { schema: optional },
	CONTACT_EMAIL: { schema: optional }
});
