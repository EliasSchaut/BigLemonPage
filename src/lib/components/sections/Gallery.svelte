<script lang="ts">
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import ImageSlot from '$lib/components/ui/ImageSlot.svelte';
	import GlowBackdrop from '$lib/components/ui/GlowBackdrop.svelte';
	import type { GalleryShot } from '$lib/data/types';

	let { shots }: { shots: GalleryShot[] } = $props();
</script>

<section
	id="galerie"
	class="relative scroll-mt-(--header-h) overflow-hidden bg-second px-5 py-[clamp(64px,8vw,110px)]"
>
	<GlowBackdrop
		wall
		wallMask="linear-gradient(#000 0%,#000 42%,transparent 78%)"
		shade="linear-gradient(105deg,rgb(15 21 56/.82) 0%,rgb(15 21 56/.5) 52%,rgb(15 21 56/.32) 100%)"
		glow="radial-gradient(680px 520px at 100% 6%,rgb(242 230 60/.38),transparent 62%),radial-gradient(520px 420px at 0% 84%,rgb(194 226 63/.3),transparent 62%),radial-gradient(340px 300px at 44% 0%,rgb(255 243 122/.2),transparent 66%)"
	/>
	<div class="relative mx-auto max-w-[1240px]">
		<SectionIntro
			eyebrow="GALERIE"
			eyebrowTone="lime"
			tone="light"
			lead="Von der Kerwe bis zur Messe Frankfurt — ein paar Eindrücke aus den letzten Saisons."
			class="mb-[clamp(28px,4vw,44px)] max-w-[640px]"
		>
			Bei uns ist immer was los.
		</SectionIntro>

		<div
			class="grid auto-rows-[170px] grid-cols-2 gap-3.5 min-[620px]:grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]"
		>
			{#each shots as shot (shot.placeholder)}
				<div
					class="relative overflow-hidden rounded-[20px] {shot.wide
						? 'min-[700px]:col-span-2'
						: ''} {shot.tall ? 'row-span-2' : ''}"
				>
					<ImageSlot placeholder={shot.placeholder} {...shot.image} />
				</div>
			{/each}
		</div>
	</div>
</section>
