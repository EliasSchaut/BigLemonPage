export type Droplet = {
	id: number;
	x: number;
	y: number;
	dx: number;
	dy: number;
	size: number;
	color: string;
	duration: number;
};

export const droplets = $state<Droplet[]>([]);

export const fun = $state({ ninjaOpen: false });

export const JUICE = ['#f2e63c', '#fff37a', '#fff8b4', '#c2e23f'];

let nextId = 0;

export function prefersReducedMotion() {
	return (
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

type SplashOptions = {
	count?: number;
	angle?: number;
	spread?: number;
	power?: number;
	colors?: string[];
};

export function splash(x: number, y: number, options: SplashOptions = {}) {
	if (prefersReducedMotion()) return;

	const {
		count = 14,
		angle = -Math.PI / 2,
		spread = Math.PI * 0.85,
		power = 240,
		colors = JUICE
	} = options;

	for (let i = 0; i < count; i++) {
		const a = angle + (Math.random() - 0.5) * spread;
		const dist = power * (0.4 + Math.random() * 0.8);
		const drop: Droplet = {
			id: nextId++,
			x,
			y,
			dx: Math.cos(a) * dist,
			dy: Math.sin(a) * dist + 60 + Math.random() * 90,
			size: 5 + Math.random() * 13,
			color: colors[Math.floor(Math.random() * colors.length)],
			duration: 620 + Math.random() * 420
		};
		droplets.push(drop);
		setTimeout(() => {
			const index = droplets.indexOf(drop);
			if (index > -1) droplets.splice(index, 1);
		}, drop.duration);
	}
}
