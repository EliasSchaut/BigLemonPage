<script lang="ts">
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';

	const lemonSlice = 'repeating-conic-gradient(from 12deg,#FFF8B4 0deg 36deg,#EFE24A 36deg 45deg)';
</script>

<section id="bar" class="scroll-mt-[84px] bg-cream px-5 py-[clamp(64px,8vw,110px)] text-second">
	<div class="mx-auto max-w-[1240px]">
		<SectionIntro
			eyebrow="WARUM DIE BIGLEMON"
			lead="Durch ihre auffallende Form und das extravagante Design ist die BigLemon der Hingucker auf jedem Event — von der privaten Feier bis zur Großveranstaltung. Jeder kennt sie, jeder liebt sie."
			class="mb-[clamp(34px,5vw,56px)] max-w-[720px]"
		>
			Kein Bier. Kein Wein. Eine Attraktion, die nebenbei Drinks macht.
		</SectionIntro>

		<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[18px]">
			<div class="flex min-h-[230px] flex-col gap-3 rounded-card bg-second p-[30px] text-cream">
				<div
					class="mb-1.5 size-[46px] rounded-full shadow-[0_0_0_3px_#F2E63C]"
					style:background={lemonSlice}
				></div>
				<h3 class="m-0 font-display text-[22px] font-bold tracking-[-.01em]">Der Foto-Magnet</h3>
				<p class="m-0 text-[15px] leading-relaxed text-second-300">
					Eine begehbare Riesenzitrone sieht man nicht alle Tage. Wer vorbeigeht, bleibt stehen —
					und nimmt ein Bild mit nach Hause.
				</p>
			</div>

			<div
				class="flex min-h-[230px] flex-col gap-3 rounded-card border-[1.5px] border-second/10 bg-white p-[30px]"
			>
				<div
					class="mb-1.5 flex size-[46px] items-center justify-center rounded-[14px] bg-lime font-display text-[22px] font-extrabold text-second"
				>
					0%
				</div>
				<h3 class="m-0 font-display text-[22px] font-bold tracking-[-.01em]">Lieber Natur pur</h3>
				<p class="m-0 text-[15px] leading-relaxed text-second-600">
					Zitronen, Orangen und Limetten werden vor den Augen der Gäste von Hand gepresst. Keine
					Konzentrate, keine künstlichen Aromen.
				</p>
			</div>

			<div
				class="flex min-h-[230px] flex-col gap-3 rounded-card border-[1.5px] border-second/10 bg-white p-[30px]"
			>
				<div
					class="mb-1.5 flex size-[46px] items-center justify-center rounded-[14px] bg-prime text-[22px] font-extrabold text-second"
				>
					↻
				</div>
				<h3 class="m-0 font-display text-[22px] font-bold tracking-[-.01em]">Wir kommen zu euch</h3>
				<p class="m-0 text-[15px] leading-relaxed text-second-600">
					Die Bar ist fahrbar und überall einsatzbereit — Marktplatz, Festwiese, Firmenhof oder
					Hochzeitsgarten. Aufbau übernehmen wir.
				</p>
			</div>

			<div
				class="flex min-h-[230px] flex-col gap-3 rounded-card border-[1.5px] border-second/10 bg-white p-[30px]"
			>
				<div
					class="mb-1.5 flex size-[46px] items-center justify-center rounded-[14px] bg-second text-[22px] text-prime"
				>
					★
				</div>
				<h3 class="m-0 font-display text-[22px] font-bold tracking-[-.01em]">Crew mit Routine</h3>
				<p class="m-0 text-[15px] leading-relaxed text-second-600">
					Seit Jahren auf Stadtfesten, Messen und CSDs unterwegs. Wir kennen die Abläufe, halten das
					Tempo und bleiben auch im Andrang freundlich.
				</p>
			</div>
		</div>
	</div>
</section>
