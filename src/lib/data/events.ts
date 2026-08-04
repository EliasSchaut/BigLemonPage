import type { EventItem, EventMonth } from './types';

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

export function todayInBerlin(): string {
	return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
}

export function formatEventDate(event: EventItem): string {
	const [, startMonth, startDay] = event.start.split('-');
	if (!event.end || event.end === event.start) return `${startDay}.${startMonth}.`;

	const [, endMonth, endDay] = event.end.split('-');
	return startMonth === endMonth
		? `${startDay}.–${endDay}.${endMonth}.`
		: `${startDay}.${startMonth}.–${endDay}.${endMonth}.`;
}

export function isUpcoming(event: EventItem, today = todayInBerlin()): boolean {
	return (event.end ?? event.start) >= today;
}

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

export function upcomingByMonth(events: EventItem[], today = todayInBerlin()): EventMonth[] {
	return groupByMonth(events.filter((event) => isUpcoming(event, today)));
}

export function allByMonth(events: EventItem[], today = todayInBerlin()): EventMonth[] {
	return groupByMonth(events).map((month) => ({
		name: month.name,
		items: month.items.map((event) => ({ ...event, past: !isUpcoming(event, today) }))
	}));
}
