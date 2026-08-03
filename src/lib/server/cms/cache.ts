import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

/**
 * Kleiner Prozess-Cache vor Directus. Drei Eigenschaften sind entscheidend:
 *  - `stale-if-error`: liegt ein abgelaufener Wert vor, wird der einem Fehler vorgezogen
 *  - Negative-Cache: nach einem Fehler wird kurz nicht erneut versucht, sonst
 *    verlaengert ein totes Directus jeden Request um den Timeout
 *  - Der Fallback landet nie im Cache — sonst blieben nach der Erholung
 *    noch eine volle TTL lang die Notdaten stehen
 */

const TTL_MS = (Number(env.CMS_CACHE_TTL ?? (dev ? 5 : 60)) || 60) * 1000;
const ERROR_COOLDOWN_MS = 15_000;

interface Entry<T> {
	value: T;
	expires: number;
}

const store = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
const cooldownUntil = new Map<string, number>();

export async function cached<T>(
	key: string,
	load: () => Promise<T>,
	fallback: () => T
): Promise<T> {
	const now = Date.now();
	const hit = store.get(key) as Entry<T> | undefined;

	if (hit && hit.expires > now) return hit.value;
	if ((cooldownUntil.get(key) ?? 0) > now) return hit?.value ?? fallback();

	// Parallele Requests teilen sich einen Ladevorgang.
	let pending = inflight.get(key) as Promise<T> | undefined;
	if (!pending) {
		pending = load()
			.then((value) => {
				store.set(key, { value, expires: Date.now() + TTL_MS });
				cooldownUntil.delete(key);
				return value;
			})
			.finally(() => inflight.delete(key));
		inflight.set(key, pending);
	}

	try {
		return await pending;
	} catch (error) {
		cooldownUntil.set(key, Date.now() + ERROR_COOLDOWN_MS);
		console.error(
			`[cms] "${key}" nicht erreichbar — nutze ${hit ? 'veraltete Cache-Daten' : 'Fallback aus content.ts'}:`,
			error instanceof Error ? error.message : error
		);
		return hit?.value ?? fallback();
	}
}

/** Leert den Cache, z. B. nach einer Änderung im CMS. */
export function invalidate(key?: string) {
	if (key) store.delete(key);
	else store.clear();
	cooldownUntil.clear();
}
