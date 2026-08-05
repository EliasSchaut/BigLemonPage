<script lang="ts">
	import lemonFrei from '$lib/assets/images/lemon-frei.png';
	import { HERO_STATS } from '$lib/data/content';
	import Button from '$lib/components/ui/Button.svelte';
	import GlowBackdrop from '$lib/components/ui/GlowBackdrop.svelte';

	let { eventCount = 0 }: { eventCount?: number } = $props();

	const stats = $derived([
		{ value: String(eventCount), label: 'Feste im Kalender' },
		...HERO_STATS
	]);
</script>

<section
	id="start"
	class="relative overflow-hidden bg-second px-5 pt-[clamp(48px,7vw,90px)] pb-[clamp(60px,8vw,110px)]"
>
	<GlowBackdrop
		wall
		wallOpacity={0.46}
		wallMask="radial-gradient(125% 120% at 88% 26%,#000 12%,transparent 70%)"
		shade="linear-gradient(100deg,rgb(15 21 56/.93) 0%,rgb(15 21 56/.66) 44%,rgb(15 21 56/.14) 100%)"
		glow="radial-gradient(760px 560px at 100% 0%,rgb(242 230 60/.42),transparent 62%),radial-gradient(620px 520px at 0% 100%,rgb(194 226 63/.34),transparent 62%),radial-gradient(420px 340px at 14% 6%,rgb(255 243 122/.26),transparent 64%),radial-gradient(460px 380px at 66% 94%,rgb(242 230 60/.24),transparent 64%)"
	/>
	<div
		class="pointer-events-none absolute -top-40 -right-30 size-[520px] animate-pulse-glow rounded-full blur-[20px]"
		style:background="radial-gradient(circle,rgb(242 230 60/.34),transparent 68%)"
	></div>

	<div
		class="relative mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(28px,5vw,60px)]"
	>
		<div>
			<img
				src={lemonFrei}
				alt="Die BigLemon — mobile Cocktailbar in Zitronenform"
				class="mb-5 block w-[118px] drop-shadow-[0_14px_24px_rgb(0_0_0/.45)] max-[619px]:hidden min-[940px]:hidden"
			/>
			<div
				class="mb-[22px] inline-flex items-center gap-[9px] rounded-full border border-lime/35 bg-lime/12 py-2 pr-[15px] pl-2.5"
			>
				<span class="block size-2 rounded-full bg-lime shadow-[0_0_12px_#C2E23F]"></span>
				<span class="text-[12.5px] font-bold tracking-[.1em] text-lime">
					TERMINE 2026 — JETZT SICHERN
				</span>
			</div>
			<h1
				class="m-0 mb-[22px] font-display text-[clamp(40px,6.6vw,74px)] leading-[.96] font-extrabold tracking-[-.035em] text-balance text-cream"
			>
				Die Zitrone,<br />die euer Fest<br /><span class="text-prime">unvergesslich</span> macht.
			</h1>
			<p
				class="m-0 mb-8 max-w-[520px] text-[clamp(16px,1.7vw,19.5px)] leading-[1.65] text-pretty text-second-200"
			>
				Eine 3 Meter große, fahrbare Riesenzitrone voller frisch gepresster Cocktails. Wir rollen
				an, bauen auf, mixen — und ihr habt den Hingucker, über den am Montag noch alle reden.
			</p>
			<div class="mb-[38px] flex flex-wrap gap-3.5">
				<Button href="/#buchen" size="lg" class="shadow-glow-lg">Bar für euer Fest anfragen</Button>
				<Button href="/#drinks" variant="outline-cream" size="lg">Drinkliste ansehen</Button>
			</div>
			<div
				class="grid max-w-[560px] grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-[18px] border-t border-cream/13 pt-[26px]"
			>
				{#each stats as stat}
					<div>
						<div class="font-display text-3xl leading-none font-extrabold text-prime">
							{stat.value}
						</div>
						<div class="mt-1.5 text-[13px] font-semibold text-second-400">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>

		<div
			class="relative flex min-h-[340px] items-center justify-center max-[939px]:hidden"
			aria-hidden="true"
		>
			<div
				class="absolute aspect-square w-[min(78%,420px)] rounded-full blur-lg"
				style:background="radial-gradient(circle,rgb(242 230 60/.35),rgb(242 230 60/0) 70%)"
			></div>
			<div
				class="absolute aspect-square w-[min(70%,380px)] animate-spin-slow rounded-full border-[1.5px] border-dashed border-prime/30"
			></div>
			<img
				src={lemonFrei}
				alt=""
				class="relative block w-[min(100%,430px)] animate-float drop-shadow-[0_40px_60px_rgb(0_0_0/.5)]"
			/>
		</div>
	</div>
</section>
