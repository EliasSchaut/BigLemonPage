<script lang="ts">
	import logoLight from '$lib/assets/images/logo-light.png';
	import { CONTACT } from '$lib/data/content';
	import GlowBackdrop from '$lib/components/ui/GlowBackdrop.svelte';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
	import FooterLemon from '$lib/components/fun/FooterLemon.svelte';
</script>

<footer
	class="relative overflow-hidden bg-second-950 px-5 pt-[clamp(30px,4vw,44px)] pb-[22px] text-second-450"
>
	<GlowBackdrop
		glow="radial-gradient(520px 300px at 92% 0%,rgb(242 230 60/.3),transparent 64%),radial-gradient(420px 280px at 4% 100%,rgb(194 226 63/.22),transparent 66%)"
	/>
	<div class="relative mx-auto max-w-[1240px]">
		<div
			class="flex flex-wrap items-start justify-between gap-x-10 gap-y-6 border-b border-cream/10 pb-[22px]"
		>
			<div>
				<img src={logoLight} alt="Big Lemon" class="mb-3 block h-[42px] w-auto" />
				<p class="m-0 max-w-[320px] text-[14px] leading-[1.55]">
					„Lieber Natur Pur" — Cocktails, die begeistern. Die etwas andere mobile Cocktailbar aus
					Mannheim.
				</p>
			</div>
			<div class="flex flex-col gap-1.5 text-[14px] sm:items-end sm:text-right">
				<a href={CONTACT.phoneHref} class="transition-colors hover:text-prime">
					{CONTACT.phoneDisplay}
				</a>
				<a href="mailto:{CONTACT.email}" class="transition-colors hover:text-prime">
					{CONTACT.email}
				</a>
				<span>{CONTACT.street} · {CONTACT.city}</span>
				<span class="mt-1 flex gap-4">
					<a
						href={CONTACT.instagram}
						target="_blank"
						rel="noopener"
						aria-label="Instagram"
						title="Instagram"
						class="flex items-center transition-colors hover:text-prime"
					>
						<SocialIcon name="instagram" />
					</a>
					<a
						href={CONTACT.facebook}
						target="_blank"
						rel="noopener"
						aria-label="Facebook"
						title="Facebook"
						class="flex items-center transition-colors hover:text-prime"
					>
						<SocialIcon name="facebook" />
					</a>
				</span>
			</div>
		</div>
		<div class="flex flex-wrap items-center justify-between gap-3.5 pt-4 text-[13px]">
			<span>© 2026 Elias Schaut</span>
			<span class="flex flex-wrap items-center gap-5">
				<a
					href="/rechtliches"
					title="Impressum & Datenschutz"
					class="transition-colors hover:text-prime"
				>
					Legal Stuff
				</a>
				<FooterLemon />
			</span>
		</div>
	</div>
</footer>
