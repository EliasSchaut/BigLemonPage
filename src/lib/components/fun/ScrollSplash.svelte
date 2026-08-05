<script lang="ts">
	import { splash, prefersReducedMotion } from '$lib/state/fun.svelte';

	const WINDOW_MS = 260;

	const TOUCH = {
		distance: 1150,
		emitMs: 110,
		columns: [0.25, 0.75],
		count: 4,
		power: 280,
		scale: 1
	};

	const POINTER = {
		distance: 620,
		emitMs: 220,
		columns: [0.16, 0.5, 0.84],
		count: 8,
		power: 430,
		scale: 1.6
	};

	let samples: { t: number; y: number }[] = [];
	let lastEmit = 0;
	let coarsePointer: boolean | undefined;

	function tuning() {
		coarsePointer ??= window.matchMedia('(pointer: coarse)').matches;
		return coarsePointer ? TOUCH : POINTER;
	}

	function onScroll() {
		if (prefersReducedMotion()) return;

		const now = performance.now();
		samples.push({ t: now, y: window.scrollY });
		samples = samples.filter((s) => now - s.t <= WINDOW_MS);
		if (samples.length < 3) return;

		const { distance, emitMs, columns, count, power, scale } = tuning();

		const travelled = samples[samples.length - 1].y - samples[0].y;
		if (Math.abs(travelled) < distance || now - lastEmit < emitMs) return;

		lastEmit = now;

		const down = travelled > 0;
		const edgeY = down ? window.innerHeight + 10 : -10;
		const angle = down ? -Math.PI / 2 : Math.PI / 2;

		for (const fraction of columns) {
			splash(window.innerWidth * fraction + (Math.random() - 0.5) * 260, edgeY, {
				count,
				angle,
				spread: Math.PI * 0.7,
				power,
				scale
			});
		}
	}
</script>

<svelte:window onscroll={onScroll} />
