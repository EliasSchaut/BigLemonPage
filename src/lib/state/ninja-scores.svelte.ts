export type NinjaMode = 'normal' | 'hart';

export const NINJA_MODES: NinjaMode[] = ['normal', 'hart'];

const STORAGE_KEY = 'biglemon:lemon-ninja';
const LIMIT = 5;

export const board = $state<Record<NinjaMode, number[]>>({ normal: [], hart: [] });

let storedMode: NinjaMode = 'normal';
let loaded = false;

function isMode(value: unknown): value is NinjaMode {
	return value === 'normal' || value === 'hart';
}

function persist() {
	try {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ mode: storedMode, scores: { normal: board.normal, hart: board.hart } })
		);
	} catch {}
}

export function loadBoard() {
	if (loaded) return;
	loaded = true;

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return;

		const saved = JSON.parse(raw);
		if (isMode(saved?.mode)) storedMode = saved.mode;

		for (const mode of NINJA_MODES) {
			const list = saved?.scores?.[mode];
			if (!Array.isArray(list)) continue;
			board[mode] = list
				.filter((value) => Number.isInteger(value) && value > 0)
				.sort((a: number, b: number) => b - a)
				.slice(0, LIMIT);
		}
	} catch {
		storedMode = 'normal';
	}
}

export function savedMode(): NinjaMode {
	return storedMode;
}

export function chooseMode(mode: NinjaMode) {
	storedMode = mode;
	persist();
}

export function submitScore(mode: NinjaMode, score: number): number {
	if (score <= 0) return -1;

	const list = [...board[mode], score].sort((a, b) => b - a).slice(0, LIMIT);
	board[mode] = list;
	persist();

	return list.indexOf(score);
}
