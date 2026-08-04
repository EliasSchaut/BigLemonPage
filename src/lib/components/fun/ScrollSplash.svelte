<script lang="ts">
	import { splash, prefersReducedMotion } from '$lib/state/fun.svelte';

	const WINDOW_MS = 260;
	const DISTANCE_PX = 1150;
	const EMIT_MS = 110;

	let samples: { t: number; y: number }[] = [];
	let lastEmit = 0;

	function onScroll() {
		if (prefersReducedMotion()) return;

		const now = performance.now();
		samples.push({ t: now, y: window.scrollY });
		samples = samples.filter((s) => now - s.t <= WINDOW_MS);
		if (samples.length < 3) return;

		const travelled = samples[samples.length - 1].y - samples[0].y;
		if (Math.abs(travelled) < DISTANCE_PX || now - lastEmit < EMIT_MS) return;

		lastEmit = now;

		const down = travelled > 0;
		const edgeY = down ? window.innerHeight + 10 : -10;
		const angle = down ? -Math.PI / 2 : Math.PI / 2;

		for (const fraction of [0.25, 0.75]) {
			splash(window.innerWidth * fraction + (Math.random() - 0.5) * 260, edgeY, {
				count: 4,
				angle,
				spread: Math.PI * 0.7,
				power: 280
			});
		}
	}
</script>

<svelte:window onscroll={onScroll} />
