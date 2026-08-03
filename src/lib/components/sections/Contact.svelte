<script lang="ts">
	import lemonFrei from '$lib/assets/images/lemon-frei.png';
	import { CONTACT } from '$lib/data/content';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
</script>

<section id="kontakt" class="scroll-mt-[84px] bg-prime px-5 py-[clamp(64px,8vw,110px)] text-second">
	<div
		class="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(30px,5vw,60px)]"
	>
		<div>
			<SectionIntro
				eyebrow="KONTAKT"
				eyebrowTone="muted"
				lead="Ruft an oder schreibt uns. Wir sagen ehrlich, ob euer Termin noch frei ist — und was realistisch machbar ist."
				class="mb-8 [&>p]:max-w-[480px] [&>p]:text-[17.5px] [&>p]:text-second/75"
			>
				Lieber direkt reden?
			</SectionIntro>

			<div class="flex max-w-[440px] flex-col gap-3">
				<a
					href={CONTACT.phoneHref}
					class="flex min-h-14 items-center gap-4 rounded-[18px] bg-second px-[22px] py-[18px] transition-colors hover:bg-second-700"
				>
					<span class="text-[22px] text-prime">☎</span>
					<span class="flex flex-col">
						<span class="text-[12.5px] font-semibold text-second-400">Mobil</span>
						<span class="text-lg font-bold text-cream">{CONTACT.phoneDisplay}</span>
					</span>
				</a>
				<a
					href="mailto:{CONTACT.email}"
					class="flex min-h-14 items-center gap-4 rounded-[18px] bg-white px-[22px] py-[18px] transition-colors hover:bg-cream"
				>
					<span class="text-[22px]">✉</span>
					<span class="flex flex-col">
						<span class="text-[12.5px] font-semibold text-second-550">E-Mail</span>
						<span class="text-lg font-bold">{CONTACT.email}</span>
					</span>
				</a>
				<div class="flex flex-wrap gap-3">
					<a
						href={CONTACT.instagram}
						target="_blank"
						rel="noopener"
						aria-label="BigLemon auf Instagram"
						title="Instagram"
						class="flex min-h-14 flex-[1_1_120px] items-center justify-center gap-2.5 rounded-[18px] bg-second px-5 py-[17px] text-cream transition-colors hover:bg-second-700 hover:text-prime"
					>
						<SocialIcon name="instagram" />
					</a>
					<a
						href={CONTACT.facebook}
						target="_blank"
						rel="noopener"
						aria-label="BigLemon auf Facebook"
						title="Facebook"
						class="flex min-h-14 flex-[1_1_120px] items-center justify-center gap-2.5 rounded-[18px] bg-white px-5 py-[17px] text-second transition-colors hover:bg-cream hover:text-second-700"
					>
						<SocialIcon name="facebook" />
					</a>
				</div>
			</div>
		</div>

		<div class="relative flex min-h-[280px] items-center justify-center" aria-hidden="true">
			<div class="absolute aspect-square w-[min(80%,340px)] rounded-full bg-second/8"></div>
			<img
				src={lemonFrei}
				alt=""
				class="relative block w-[min(78%,320px)] drop-shadow-[0_30px_40px_rgb(15_21_56/.28)]"
			/>
		</div>
	</div>
</section>
