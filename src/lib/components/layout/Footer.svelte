<script lang="ts">
	import logoLight from '$lib/assets/images/logo-light.png';
	import { CONTACT, NAV_LINKS } from '$lib/data/content';
	import GlowBackdrop from '$lib/components/ui/GlowBackdrop.svelte';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
</script>

<footer
	class="relative overflow-hidden bg-second-950 px-5 pt-[clamp(44px,6vw,68px)] pb-[34px] text-second-450"
>
	<GlowBackdrop
		glow="radial-gradient(520px 300px at 92% 0%,rgb(242 230 60/.3),transparent 64%),radial-gradient(420px 280px at 4% 100%,rgb(194 226 63/.22),transparent 66%)"
	/>
	<div class="relative mx-auto max-w-[1240px]">
		<div
			class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[34px] border-b border-cream/10 pb-[34px]"
		>
			<div>
				<img src={logoLight} alt="Big Lemon" class="mb-[18px] block h-[52px] w-auto" />
				<p class="m-0 max-w-[280px] text-[14.5px] leading-relaxed">
					„Lieber Natur Pur" — Cocktails, die begeistern. Die etwas andere mobile Cocktailbar aus
					Mannheim.
				</p>
			</div>
			<div class="flex flex-col gap-[11px]">
				<div class="mb-1 text-[12.5px] font-extrabold tracking-[.16em] text-cream">SEITE</div>
				{#each [...NAV_LINKS, { href: '/#buchen', label: 'Buchung' }] as link (link.href)}
					<a href={link.href} class="text-[14.5px] transition-colors hover:text-prime">
						{link.label}
					</a>
				{/each}
			</div>
			<div class="flex flex-col gap-[11px]">
				<div class="mb-1 text-[12.5px] font-extrabold tracking-[.16em] text-cream">KONTAKT</div>
				<a href={CONTACT.phoneHref} class="text-[14.5px] transition-colors hover:text-prime">
					{CONTACT.phoneDisplay}
				</a>
				<a href="mailto:{CONTACT.email}" class="text-[14.5px] transition-colors hover:text-prime">
					{CONTACT.email}
				</a>
				<span class="text-[14.5px] leading-[1.55]">{CONTACT.street}<br />{CONTACT.city}</span>
				<span class="mt-1.5 flex gap-4">
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
		<div class="flex flex-wrap justify-between gap-3.5 pt-[22px] text-[13px]">
			<span>© 2026 {CONTACT.company}</span>
			<span class="flex flex-wrap gap-5">
				<a href="/rechtliches" class="transition-colors hover:text-prime">Impressum</a>
				<a href="/rechtliches#datenschutz" class="transition-colors hover:text-prime">Datenschutz</a
				>
			</span>
		</div>
	</div>
</footer>
