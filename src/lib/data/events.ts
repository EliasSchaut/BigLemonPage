// Datumslogik der Termine. Framework- und serverfrei, damit Fallback (content.ts)
// und CMS-Daten durch dieselbe Formatierung laufen und nicht auseinanderdriften.

import type { EventItem, EventMonth } from './types';

/** Fest verdrahtet statt Intl — unabhängig davon, welche ICU-Daten im Container liegen. */
export const MONTH_NAMES = [
	'Januar',
	'Februar',
	'März',
	'April',
	'Mai',
	'Juni',
	'Juli',
	'August',
	'September',
	'Oktober',
	'November',
	'Dezember'
];

/** Heutiges Datum als ISO-String in deutscher Zeitzone. 'sv-SE' liefert genau YYYY-MM-DD. */
export function todayInBerlin(): string {
	return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
}

/**
 * Formatiert einen Termin für die Anzeige:
 * eintägig `13.06.`, gleicher Monat `08.–10.05.`, monatsübergreifend `31.07.–02.08.`
 * (Trennzeichen ist der Halbgeviertstrich U+2013.)
 */
export function formatEventDate(event: EventItem): string {
	const [, startMonth, startDay] = event.start.split('-');
	if (!event.end || event.end === event.start) return `${startDay}.${startMonth}.`;

	const [, endMonth, endDay] = event.end.split('-');
	return startMonth === endMonth
		? `${startDay}.–${endDay}.${endMonth}.`
		: `${startDay}.${startMonth}.–${endDay}.${endMonth}.`;
}

/** Läuft der Termin heute noch oder liegt er in der Zukunft? */
export function isUpcoming(event: EventItem, today = todayInBerlin()): boolean {
	return (event.end ?? event.start) >= today;
}

/**
 * Sortiert chronologisch und gruppiert nach dem Monat des *Startdatums* —
 * ein Termin wie 31.07.–02.08. erscheint damit unter Juli.
 */
export function groupByMonth(events: EventItem[]): EventMonth[] {
	const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
	const months: EventMonth[] = [];

	for (const event of sorted) {
		const name = MONTH_NAMES[Number(event.start.slice(5, 7)) - 1] ?? '';
		const last = months.at(-1);
		if (last?.name === name) last.items.push(event);
		else months.push({ name, items: [event] });
	}

	return months;
}

/** Kommende Termine, chronologisch nach Monat gruppiert. */
export function upcomingByMonth(events: EventItem[], today = todayInBerlin()): EventMonth[] {
	return groupByMonth(events.filter((event) => isUpcoming(event, today)));
}

/**
 * Alle Termine nach Monat gruppiert, jeder Eintrag mit `past` markiert. Ein Monat
 * kann beides enthalten — deshalb wird pro Termin markiert und nicht pro Monat
 * getrennt, sonst erschiene dieselbe Monatsueberschrift zweimal.
 */
export function allByMonth(events: EventItem[], today = todayInBerlin()): EventMonth[] {
	return groupByMonth(events).map((month) => ({
		name: month.name,
		items: month.items.map((event) => ({ ...event, past: !isUpcoming(event, today) }))
	}));
}
