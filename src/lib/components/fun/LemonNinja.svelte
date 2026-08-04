<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { fun, splash, JUICE } from '$lib/state/fun.svelte';
	import LemonIcon from '$lib/components/ui/LemonIcon.svelte';

	type Kind = { rind: string; flesh: string };
	type Fruit = {
		id: number;
		x: number;
		y: number;
		vx: number;
		vy: number;
		rot: number;
		vrot: number;
		size: number;
		kind: Kind;
		half: -1 | 0 | 1;
	};

	const KINDS: Kind[] = [
		{ rind: '#f2e63c', flesh: '#fff8b4' },
		{ rind: '#c2e23f', flesh: '#e8f5b8' },
		{ rind: '#ee7b2f', flesh: '#ffd6ac' },
		{ rind: '#f7b32b', flesh: '#ffe7ab' }
	];

	const GRAVITY = 0.0017;
	const ROUND_MS = 30_000;
	const SPAWN_MS = 780;

	let fruits = $state<Fruit[]>([]);
	let trail = $state<{ x: number; y: number }[]>([]);
	let score = $state(0);
	let missed = $state(0);
	let timeLeft = $state(ROUND_MS);
	let over = $state(false);

	let nextId = 0;
	let frame = 0;
	let lastFrame = 0;
	let spawnAcc = 0;
	let pointer: { x: number; y: number } | null = null;
	let trailPoints: { x: number; y: number; t: number }[] = [];

	const trailPath = $derived(trail.map((p) => `${p.x},${p.y}`).join(' '));

	function reset() {
		fruits = [];
		trail = [];
		trailPoints = [];
		pointer = null;
		score = 0;
		missed = 0;
		timeLeft = ROUND_MS;
		over = false;
		spawnAcc = SPAWN_MS;
		lastFrame = 0;
	}

	function close() {
		fun.ninjaOpen = false;
	}

	function spawn() {
		const w = window.innerWidth;
		const h = window.innerHeight;
		const size = w < 640 ? 46 + Math.random() * 18 : 58 + Math.random() * 26;
		const x = w * (0.14 + Math.random() * 0.72);
		const vy = -Math.sqrt(2 * GRAVITY * h * (0.55 + Math.random() * 0.2));

		fruits.push({
			id: nextId++,
			x,
			y: h + size,
			vx: ((w / 2 - x) / w) * 0.34 + (Math.random() - 0.5) * 0.12,
			vy,
			rot: Math.random() * 360,
			vrot: (Math.random() - 0.5) * 0.32,
			size,
			kind: KINDS[Math.floor(Math.random() * KINDS.length)],
			half: 0
		});
	}

	function sliceFruit(fruit: Fruit, index: number) {
		score += 1;
		splash(fruit.x, fruit.y, {
			count: 18,
			spread: Math.PI * 2,
			power: 180,
			colors: [fruit.kind.rind, fruit.kind.flesh, ...JUICE]
		});

		const halves: Fruit[] = [-1, 1].map((dir) => ({
			...fruit,
			id: nextId++,
			vx: fruit.vx + dir * (0.16 + Math.random() * 0.1),
			vy: fruit.vy * 0.5 - 0.12,
			vrot: dir * (0.25 + Math.random() * 0.2),
			half: dir as -1 | 1
		}));
		fruits.splice(index, 1, ...halves);
	}

	function distanceToSegment(
		px: number,
		py: number,
		ax: number,
		ay: number,
		bx: number,
		by: number
	) {
		const dx = bx - ax;
		const dy = by - ay;
		const lengthSq = dx * dx + dy * dy;
		const t =
			lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
		return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
	}

	function onPointerMove(event: PointerEvent) {
		if (over) return;
		const next = { x: event.clientX, y: event.clientY };
		const previous = pointer;
		pointer = next;
		trailPoints.push({ ...next, t: performance.now() });

		if (!previous) return;
		if (Math.hypot(next.x - previous.x, next.y - previous.y) < 7) return;

		for (let i = fruits.length - 1; i >= 0; i--) {
			const fruit = fruits[i];
			if (fruit.half !== 0) continue;
			const hit =
				distanceToSegment(fruit.x, fruit.y, previous.x, previous.y, next.x, next.y) <
				fruit.size * 0.55;
			if (hit) sliceFruit(fruit, i);
		}
	}

	function loop(now: number) {
		frame = requestAnimationFrame(loop);
		const dt = lastFrame ? Math.min(now - lastFrame, 48) : 16;
		lastFrame = now;

		if (!over) {
			timeLeft = Math.max(0, timeLeft - dt);
			spawnAcc += dt;
			if (spawnAcc >= SPAWN_MS && timeLeft > 1200) {
				spawnAcc = 0;
				spawn();
			}
			if (timeLeft === 0 && fruits.length === 0) over = true;
		}

		const limit = window.innerHeight + 200;
		for (let i = fruits.length - 1; i >= 0; i--) {
			const fruit = fruits[i];
			fruit.vy += GRAVITY * dt;
			fruit.x += fruit.vx * dt;
			fruit.y += fruit.vy * dt;
			fruit.rot += fruit.vrot * dt;
			if (fruit.y > limit) {
				if (fruit.half === 0) missed += 1;
				fruits.splice(i, 1);
			}
		}

		trailPoints = trailPoints.filter((p) => now - p.t < 130);
		trail = trailPoints.map(({ x, y }) => ({ x, y }));
	}

	$effect(() => {
		if (!fun.ninjaOpen) return;

		reset();
		frame = requestAnimationFrame(loop);
		const { overflow } = document.body.style;
		document.body.style.overflow = 'hidden';

		return () => {
			cancelAnimationFrame(frame);
			document.body.style.overflow = overflow;
			fruits = [];
			trail = [];
		};
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (fun.ninjaOpen && event.key === 'Escape') close();
	}}
/>

{#if fun.ninjaOpen}
	<div
		role="presentation"
		onpointermove={onPointerMove}
		transition:fade={{ duration: 220 }}
		class="fixed inset-0 z-100 touch-none overflow-hidden bg-second/86 backdrop-blur-[3px]"
	>
		<div
			class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6"
		>
			<div
				class="pointer-events-auto rounded-2xl border border-prime/25 bg-second-900/85 px-4 py-3"
			>
				<div class="font-display text-2xl leading-none font-extrabold text-prime">
					{score}
					<span class="text-[13px] font-bold text-second-300">gepresst</span>
				</div>
				<div class="mt-1 text-[12px] font-semibold text-second-400">
					{missed} danebengegangen · {Math.ceil(timeLeft / 1000)}s
				</div>
			</div>
			<button
				type="button"
				onclick={close}
				class="pointer-events-auto cursor-pointer rounded-2xl border border-prime/25 bg-second-900/85 px-4 py-3 text-[13px] font-bold text-cream transition-colors hover:text-prime"
			>
				Schließen
			</button>
		</div>

		{#if score === 0 && !over}
			<p
				class="pointer-events-none absolute inset-x-0 top-1/2 m-0 -translate-y-1/2 px-6 text-center font-display text-[clamp(20px,4vw,32px)] font-extrabold text-cream/70"
				transition:fade
			>
				Wisch quer durch die Früchte!
			</p>
		{/if}

		{#each fruits as fruit (fruit.id)}
			<div
				class="pointer-events-none absolute will-change-transform"
				style:left="{fruit.x}px"
				style:top="{fruit.y}px"
				style:width="{fruit.size}px"
				style:height="{fruit.size}px"
				style:transform="translate(-50%,-50%) rotate({fruit.rot}deg)"
			>
				<div
					class="size-full drop-shadow-[0_10px_18px_rgb(0_0_0/.45)]"
					style:clip-path={fruit.half === -1
						? 'inset(0 0 50% 0)'
						: fruit.half === 1
							? 'inset(50% 0 0 0)'
							: undefined}
				>
					<LemonIcon slice rind={fruit.kind.rind} flesh={fruit.kind.flesh} class="size-full" />
				</div>
			</div>
		{/each}

		{#if trail.length > 1}
			<svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
				<polyline
					points={trailPath}
					fill="none"
					stroke="#fff8b4"
					stroke-width="5"
					stroke-linecap="round"
					stroke-linejoin="round"
					opacity=".85"
				/>
			</svg>
		{/if}

		{#if over}
			<div class="absolute inset-0 grid place-items-center p-6" transition:fade={{ duration: 200 }}>
				<div
					in:scale={{ duration: 260, start: 0.9 }}
					class="max-w-[380px] rounded-card border border-prime/25 bg-second-900/95 p-7 text-center"
				>
					<div
						class="font-display text-[clamp(28px,6vw,40px)] leading-tight font-extrabold text-prime"
					>
						{score} Früchte
					</div>
					<p class="mt-2 mb-6 text-[15px] leading-relaxed text-second-200">
						{score >= 12
							? 'Respekt — daraus wird richtig gute Limonade.'
							: 'Für ein Glas Limonade reicht das schon mal.'}
					</p>
					<div class="flex flex-wrap justify-center gap-3">
						<button
							type="button"
							onclick={reset}
							class="cursor-pointer rounded-[14px] bg-prime px-5 py-3 font-extrabold text-second transition-colors hover:bg-prime-200"
						>
							Nochmal pressen
						</button>
						<button
							type="button"
							onclick={close}
							class="cursor-pointer rounded-[14px] border border-cream/25 px-5 py-3 font-bold text-cream transition-colors hover:text-prime"
						>
							Fertig
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
