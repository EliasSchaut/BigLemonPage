<script lang="ts">
	import type { Bar } from '$lib/data/types';
	import { booking } from '$lib/state/booking.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
	import ImageSlot from '$lib/components/ui/ImageSlot.svelte';

	let { bars }: { bars: Bar[] } = $props();

	function chooseBar(key: string) {
		booking.bar = key;
		document.getElementById('buchen')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section
	id="bars"
	class="scroll-mt-(--header-h) bg-cream px-5 py-[clamp(64px,8vw,110px)] text-second"
>
	<div class="mx-auto max-w-[1240px]">
		<SectionIntro
			eyebrow="DREI BARS, EIN TEAM"
			lead="Alle drei rollen mit derselben Crew und derselben Handpresse an — sie unterscheiden sich in Größe, Auftritt und Tempo. Bei der Paketauswahl könnt ihr die Bar direkt mit angeben."
			class="mb-[clamp(30px,4vw,48px)] max-w-[700px]"
		>
			Wählt die Bar, die zu eurem Fest passt.
		</SectionIntro>

		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-5">
			{#each bars as bar}
				<article
					class="flex flex-col overflow-hidden rounded-card border-[1.5px] border-second/10 bg-white transition-[border-color,box-shadow] hover:border-prime hover:shadow-card-lg"
				>
					<div class="h-1.5" style:background={bar.accent}></div>
					<div class="relative h-[210px] bg-cream-200">
						<ImageSlot
							placeholder="Foto: {bar.name}"
							class="border-second/15 bg-second/3"
							{...bar.image}
						/>
					</div>
					<div class="flex flex-1 flex-col gap-3.5 p-6">
						<div class="flex flex-wrap items-center gap-2.5">
							<h3 class="m-0 font-display text-[23px] font-extrabold tracking-[-.02em]">
								{bar.name}
							</h3>
							<Tag class="text-second" style="background:{bar.accentSoft}">{bar.tag}</Tag>
						</div>
						<p class="m-0 flex-1 text-[15px] leading-relaxed text-second-600">{bar.pitch}</p>
						<div class="mt-0.5 flex flex-col">
							{#each bar.specs as spec}
								<div class="flex justify-between gap-3.5 border-t border-second/9 py-2.5">
									<span class="text-[13px] font-bold tracking-[.04em] text-olive">
										{spec.label}
									</span>
									<span class="text-right text-[14.5px] font-semibold">{spec.value}</span>
								</div>
							{/each}
						</div>
						<button
							type="button"
							onclick={() => chooseBar(bar.key)}
							class="mt-auto min-h-[52px] cursor-pointer rounded-full border-none bg-second px-[22px] py-[15px] text-[15.5px] font-extrabold text-prime transition-colors hover:bg-second-700"
						>
							{bar.cta}
						</button>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
