<script lang="ts">
	import type { Drink } from '$lib/data/types';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
	import ImageSlot from '$lib/components/ui/ImageSlot.svelte';
	import GlowBackdrop from '$lib/components/ui/GlowBackdrop.svelte';

	let { drinks }: { drinks: Drink[] } = $props();
</script>

<section
	id="drinks"
	class="relative scroll-mt-(--header-h) overflow-hidden px-5 py-[clamp(64px,8vw,110px)]"
	style:background="linear-gradient(180deg,#0F1538,#151C48)"
>
	<GlowBackdrop
		wall
		wallMask="radial-gradient(125% 115% at 50% 50%,transparent 24%,#000 86%)"
		shade="radial-gradient(95% 85% at 50% 46%,rgb(15 21 56/.84) 32%,rgb(15 21 56/.46) 100%)"
		glow="radial-gradient(1250px 1000px at -6% -12%,rgb(242 230 60/.5),rgb(242 230 60/.16) 46%,transparent 74%),radial-gradient(560px 460px at 100% 96%,rgb(255 243 122/.3),transparent 62%),radial-gradient(380px 320px at 84% 14%,rgb(194 226 63/.2),transparent 64%)"
	/>
	<div class="relative mx-auto max-w-[1240px]">
		<div class="mb-[clamp(30px,4vw,48px)] flex flex-wrap items-end justify-between gap-6">
			<SectionIntro
				eyebrow="DIE DRINKLISTE"
				eyebrowTone="lime"
				tone="light"
				lead="Bei uns lässt sich alles mit allem mischen — mit Schuss oder ohne. Eine Auswahl aus dem, was am häufigsten über die Theke geht."
				class="max-w-[640px]"
			>
				Erlaubt ist,<br />was schmeckt.
			</SectionIntro>
			<Button href="/#buchen" variant="outline-prime" class="whitespace-nowrap">
				Komplette Karte anfragen
			</Button>
		</div>

		<div class="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-5">
			{#each drinks as drink}
				<article
					class="flex flex-col overflow-hidden rounded-[22px] border border-cream/11 bg-cream/4 transition-colors hover:border-prime/45 hover:bg-prime/7"
				>
					<div class="relative h-[190px] bg-second-750">
						<ImageSlot placeholder="Foto: {drink.name}" {...drink.image} />
					</div>
					<div class="flex flex-1 flex-col gap-[9px] px-5 pt-5 pb-[22px]">
						<div class="flex items-baseline justify-between gap-3">
							<h3 class="m-0 font-display text-xl font-bold tracking-[-.01em] text-cream">
								{drink.name}
							</h3>
							<Tag class={drink.alc ? 'bg-prime/16 text-prime' : 'bg-lime/16 text-lime'}>
								{drink.tag}
							</Tag>
						</div>
						<p class="m-0 text-[14.5px] leading-[1.55] text-second-300/90">{drink.desc}</p>
					</div>
				</article>
			{/each}
		</div>

		<p class="mt-[26px] mb-0 text-sm text-second-500">
			Alle Drinks gibt es auch alkoholfrei. Sonderwünsche? Sagt Bescheid — wir mixen fast alles.
		</p>
	</div>
</section>
