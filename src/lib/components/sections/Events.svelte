<script lang="ts">
	import type { EventMonth } from '$lib/data/types';
	import { formatEventDate } from '$lib/data/events';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';

	let { months }: { months: EventMonth[] } = $props();
</script>

<section id="termine" class="scroll-mt-[84px] bg-cream px-5 py-[clamp(64px,8vw,110px)] text-second">
	<div class="mx-auto max-w-[1240px]">
		<SectionIntro
			eyebrow="AKTUELLES — SAISON 2026"
			lead="Wir sind auch 2026 wieder einsatzbereit. Die Liste wird durchgängig aktualisiert — vielleicht sind wir bald in eurer Nähe. Freie Wochenenden vergeben wir nach Eingang."
			class="mb-[clamp(30px,4vw,46px)] max-w-[680px]"
		>
			Hier findet ihr uns.
		</SectionIntro>

		{#if months.length === 0}
			<p
				class="m-0 rounded-card border-[1.5px] border-second/10 bg-white px-[22px] py-6 text-[16px] leading-relaxed text-second-600"
			>
				Die Termine für die kommende Saison stehen noch nicht fest. Schreibt uns einfach — wir sagen
				euch, ob euer Wunschtermin frei ist.
			</p>
		{:else}
			<div class="flex flex-col gap-[34px]">
				{#each months as month (month.name)}
					<div>
						<div class="mb-3.5 flex items-center gap-4">
							<h3 class="m-0 font-display text-[26px] font-extrabold tracking-[-.02em]">
								{month.name}
							</h3>
							<span class="block h-px flex-1 bg-second/14"></span>
							<span class="text-[13px] font-bold text-olive">
								{month.items.length}
								{month.items.length === 1 ? 'Termin' : 'Termine'}
							</span>
						</div>
						<div class="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-3">
							{#each month.items as event (event.start + event.name + event.city)}
								<div
									class="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-second/9 bg-white px-[18px] py-4 transition-[border-color,box-shadow] hover:border-prime hover:shadow-card"
								>
									<div
										class="w-[60px] flex-none border-r-2 border-prime pr-3 font-display text-[14.5px] leading-[1.25] font-extrabold"
									>
										{formatEventDate(event)}
									</div>
									<div class="min-w-0">
										<div class="text-[15.5px] leading-[1.3] font-bold">{event.name}</div>
										<div class="mt-[3px] text-[13.5px] text-second-550">{event.city}</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
