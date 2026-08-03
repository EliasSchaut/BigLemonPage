<script lang="ts">
	import { page } from '$app/state';
	import { CONTACT } from '$lib/data/content';
	import Button from '$lib/components/ui/Button.svelte';
	import GlowBackdrop from '$lib/components/ui/GlowBackdrop.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const isNotFound = $derived(page.status === 404);

	const heading = $derived(
		isNotFound ? 'Diese Seite ist uns ausgegangen.' : 'Da ist uns etwas übergelaufen.'
	);

	const text = $derived(
		isNotFound
			? 'Die Adresse gibt es nicht (mehr). Vielleicht hat sich ein Tippfehler eingeschlichen — oder wir haben die Seite umbenannt.'
			: 'Auf unserer Seite ist gerade etwas schiefgelaufen. Versucht es in einem Moment noch einmal, oder meldet euch direkt bei uns.'
	);
</script>

<Seo title="{page.status} — {isNotFound ? 'Seite nicht gefunden' : 'Fehler'} | BigLemon" noindex />

<section class="relative overflow-hidden bg-second px-5 py-[clamp(80px,13vw,150px)]">
	<GlowBackdrop
		glow="radial-gradient(760px 560px at 50% 0%,rgb(242 230 60/.26),transparent 64%),radial-gradient(560px 460px at 50% 100%,rgb(194 226 63/.18),transparent 66%)"
	/>

	<div class="relative mx-auto flex max-w-[720px] flex-col items-center text-center">
		<div
			class="mb-6 font-display text-[clamp(96px,18vw,180px)] leading-[.82] font-extrabold tracking-[-.055em] text-prime"
		>
			{page.status}
		</div>

		<h1
			class="m-0 mb-6 font-display text-[clamp(34px,5.2vw,56px)] leading-[1.04] font-extrabold tracking-[-.03em] text-balance text-cream"
		>
			{heading}
		</h1>

		<p
			class="m-0 max-w-[560px] text-[clamp(17px,1.9vw,21px)] leading-[1.6] text-pretty text-second-200"
		>
			{text}
		</p>

		<div class="mt-10 flex flex-wrap justify-center gap-3.5">
			<Button href="/" size="lg">Zur Startseite</Button>
			<Button href="/#termine" variant="outline-cream" size="lg">Termine ansehen</Button>
		</div>

		<p
			class="mt-16 mb-0 max-w-[520px] border-t border-cream/12 pt-10 text-[15.5px] leading-[1.8] text-second-400"
		>
			Ihr wolltet eine Anfrage stellen? Ruft uns an unter
			<a href={CONTACT.phoneHref} class="font-semibold text-prime hover:text-prime-200">
				{CONTACT.phoneDisplay}
			</a>
			oder schreibt an
			<a href="mailto:{CONTACT.email}" class="font-semibold text-prime hover:text-prime-200">
				{CONTACT.email}
			</a>.
		</p>
	</div>
</section>
