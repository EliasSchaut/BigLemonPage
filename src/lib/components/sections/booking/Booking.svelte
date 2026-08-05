<script lang="ts">
	import barWall from '$lib/assets/images/bar-hintergrund.jpg';
	import { CUSTOM_PACKAGE, OPEN_BAR } from '$lib/data/content';
	import type { Bar, BookingPackage } from '$lib/data/types';
	import { booking } from '$lib/state/booking.svelte';
	import Eyebrow from '$lib/components/ui/Eyebrow.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import Chip from '$lib/components/ui/Chip.svelte';
	import GlowBackdrop from '$lib/components/ui/GlowBackdrop.svelte';
	import BookingForm from './BookingForm.svelte';

	let { packages, bars }: { packages: BookingPackage[]; bars: Bar[] } = $props();

	const activePackage = $derived(packages.find((p) => p.key === booking.pkg) ?? CUSTOM_PACKAGE);
	const activeBar = $derived(bars.find((b) => b.key === booking.bar) ?? OPEN_BAR);
</script>

<section
	id="buchen"
	class="relative scroll-mt-(--header-h) overflow-hidden bg-cover bg-center px-5 py-[clamp(64px,8vw,110px)]"
	style:background-image="linear-gradient(rgb(15 21 56/.93),rgb(15 21 56/.96)),url('{barWall}')"
>
	<GlowBackdrop
		glow="radial-gradient(700px 540px at 0% 4%,rgb(242 230 60/.42),transparent 60%),radial-gradient(620px 500px at 100% 100%,rgb(255 243 122/.36),transparent 62%),radial-gradient(360px 320px at 62% 20%,rgb(194 226 63/.22),transparent 66%)"
	/>
	<div class="relative mx-auto max-w-[1240px]">
		<SectionIntro
			eyebrow="DIE BIGLEMON KOMMT ZU EUCH"
			eyebrowTone="prime"
			tone="light"
			lead="Jedes Paket lässt sich nach euren Wünschen ergänzen. Passt nichts genau? Dann schickt uns die Eckdaten — wir kalkulieren ein Angebot, das auf eure Veranstaltung zugeschnitten ist."
			class="mb-[clamp(28px,4vw,44px)] max-w-[700px]"
		>
			Vier Pakete — oder ein Angebot ganz nach euren Vorstellungen.
		</SectionIntro>

		<div class="mb-[26px] flex flex-col gap-4">
			<div>
				<div class="mb-2.5 text-xs font-extrabold tracking-[.16em] text-second-450">1 — PAKET</div>
				<div class="flex flex-wrap gap-2.5">
					{#each packages as pkg}
						<Chip active={pkg.key === booking.pkg} onclick={() => (booking.pkg = pkg.key)}>
							{pkg.name}
						</Chip>
					{/each}
				</div>
			</div>
			<div>
				<div class="mb-2.5 text-xs font-extrabold tracking-[.16em] text-second-450">2 — BAR</div>
				<div class="flex flex-wrap gap-2.5">
					{#each bars as bar}
						<Chip
							active={bar.key === booking.bar}
							color={bar.accent}
							onclick={() => (booking.bar = bar.key)}
						>
							{bar.name}
						</Chip>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[22px]">
			<div class="rounded-[26px] border border-prime/28 bg-cream/5 p-[clamp(26px,3.4vw,38px)]">
				<Eyebrow tone="lime" class="mb-3 tracking-[.16em]">{activePackage.label}</Eyebrow>
				<h3
					class="m-0 mb-2 font-display text-[clamp(26px,3.2vw,36px)] font-extrabold tracking-[-.02em] text-cream"
				>
					{activePackage.name}
				</h3>
				<div class="mb-[18px] text-[17px] font-bold text-prime">{activePackage.size}</div>
				<p class="m-0 mb-6 text-base leading-[1.65] text-second-300">{activePackage.desc}</p>
				<div class="flex flex-col gap-3 border-t border-cream/13 pt-[22px]">
					{#each activePackage.includes as item}
						<div class="flex items-start gap-3">
							<span
								class="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full bg-prime text-xs font-black text-second"
							>
								✓
							</span>
							<span class="text-[15.5px] leading-normal text-second-50">{item}</span>
						</div>
					{/each}
				</div>
				<div
					class="mt-[22px] flex flex-col gap-1 rounded-[14px] border border-lime/30 bg-lime/12 px-[18px] py-4"
				>
					<span class="text-xs font-extrabold tracking-[.14em]" style:color={activeBar.accent}>
						GEWÄHLTE BAR
					</span>
					<span class="text-[16.5px] font-bold text-cream">{activeBar.name}</span>
					<span class="text-sm leading-normal text-second-300">{activeBar.note}</span>
				</div>
				<div
					class="mt-3.5 rounded-[14px] bg-prime/10 px-[18px] py-4 text-[14.5px] leading-[1.55] text-second-50"
				>
					Preis je nach Termin, Anfahrt und Dauer — wir melden uns in der Regel innerhalb von 48
					Stunden mit einem Festpreis.
				</div>
			</div>

			<BookingForm {packages} {bars} />
		</div>
	</div>
</section>
