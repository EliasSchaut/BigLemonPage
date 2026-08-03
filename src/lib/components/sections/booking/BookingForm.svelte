<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { CONTACT } from '$lib/data/content';
	import type { Bar, BookingPackage } from '$lib/data/types';
	import { booking } from '$lib/state/booking.svelte';

	let { packages, bars }: { packages: BookingPackage[]; bars: Bar[] } = $props();

	// Verschwindet ein Eintrag aus dem CMS, zeigt das <select> sonst nichts an
	// und würde beim Absenden einen leeren Wert schicken.
	$effect(() => {
		if (bars.length > 0 && booking.bar !== 'offen' && !bars.some((b) => b.key === booking.bar)) {
			booking.bar = bars[0].key;
		}
	});
	$effect(() => {
		if (
			packages.length > 0 &&
			booking.pkg !== 'offen' &&
			!packages.some((p) => p.key === booking.pkg)
		) {
			booking.pkg = packages[0].key;
		}
	});

	const inputClasses =
		'min-h-12 rounded-field border-[1.5px] border-second/16 bg-white px-[15px] py-3.5 text-[15.5px] text-second';
	const errorClasses = 'border-red-600';

	let sending = $state(false);
	let sent = $state(false);
	let errors = $state<Record<string, string>>({});
	let errorMessage = $state('');

	function scrollToForm() {
		document.getElementById('anfrage')?.scrollIntoView({ behavior: 'smooth' });
	}

	const submit: SubmitFunction = () => {
		sending = true;

		// Ohne update() bleiben die eingegebenen Werte im Formular stehen,
		// falls die Anfrage abgelehnt wurde.
		return async ({ result }) => {
			sending = false;

			if (result.type === 'success') {
				sent = true;
				errors = {};
				errorMessage = '';
				scrollToForm();
				return;
			}

			if (result.type === 'failure') {
				errors = (result.data?.errors as Record<string, string>) ?? {};
				errorMessage = (result.data?.message as string) ?? '';
				return;
			}

			errors = {};
			errorMessage = 'Da ist etwas schiefgelaufen. Bitte versucht es später noch einmal.';
		};
	};

	function reset() {
		sent = false;
		errors = {};
		errorMessage = '';
	}
</script>

<div
	id="anfrage"
	class="scroll-mt-[84px] rounded-[26px] bg-cream p-[clamp(26px,3.4vw,38px)] text-second"
>
	{#if sent}
		<div class="flex flex-col items-start gap-3.5 py-5">
			<div
				class="flex size-[60px] items-center justify-center rounded-full bg-lime text-3xl text-second"
			>
				✓
			</div>
			<h3 class="m-0 font-display text-[28px] font-extrabold tracking-[-.02em]">
				Anfrage ist raus!
			</h3>
			<p class="m-0 text-base leading-relaxed text-second-600">
				Danke — wir schauen in den Kalender und melden uns innerhalb von 48 Stunden bei euch. Bei
				eiligen Terminen: einfach kurz durchrufen unter
				<a href={CONTACT.phoneHref} class="text-second underline">{CONTACT.phoneDisplay}</a>.
			</p>
			<button
				type="button"
				onclick={reset}
				class="mt-1.5 cursor-pointer rounded-full border-[1.5px] border-second/20 bg-transparent px-[22px] py-3 text-[15px] font-bold"
			>
				Weitere Anfrage stellen
			</button>
		</div>
	{:else}
		<h3
			class="m-0 mb-2 font-display text-[clamp(24px,2.8vw,30px)] font-extrabold tracking-[-.02em]"
		>
			Termin anfragen
		</h3>
		<p class="m-0 mb-6 text-[15.5px] leading-relaxed text-second-600">
			Kurz ausfüllen — je mehr wir wissen, desto genauer das Angebot.
		</p>

		{#if errorMessage}
			<p
				class="mb-5 rounded-field border-[1.5px] border-red-600/30 bg-red-600/8 px-4 py-3 text-[14.5px] leading-normal text-red-800"
				role="alert"
			>
				{errorMessage}
			</p>
		{/if}

		<form method="POST" action="/?/anfrage" use:enhance={submit}>
			<!-- Honeypot gegen Bots: unsichtbar und vom Screenreader ausgenommen. -->
			<div class="hidden" aria-hidden="true">
				<label>
					Website
					<input type="text" name="website" tabindex="-1" autocomplete="off" />
				</label>
			</div>

			<div class="mb-3.5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Name *</span>
					<input
						type="text"
						name="name"
						required
						maxlength="120"
						placeholder="Vor- und Nachname"
						aria-invalid={errors.name ? 'true' : undefined}
						class="{inputClasses} {errors.name ? errorClasses : ''}"
					/>
					{#if errors.name}
						<span class="text-[12.5px] font-semibold text-red-800">{errors.name}</span>
					{/if}
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">E-Mail *</span>
					<input
						type="email"
						name="email"
						required
						maxlength="200"
						placeholder="name@beispiel.de"
						aria-invalid={errors.email ? 'true' : undefined}
						class="{inputClasses} {errors.email ? errorClasses : ''}"
					/>
					{#if errors.email}
						<span class="text-[12.5px] font-semibold text-red-800">{errors.email}</span>
					{/if}
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Telefon *</span>
					<input
						type="tel"
						name="phone"
						required
						maxlength="60"
						placeholder="0176 0000000"
						aria-invalid={errors.phone ? 'true' : undefined}
						class="{inputClasses} {errors.phone ? errorClasses : ''}"
					/>
					{#if errors.phone}
						<span class="text-[12.5px] font-semibold text-red-800">{errors.phone}</span>
					{/if}
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Datum der Veranstaltung</span>
					<input type="date" name="date" class={inputClasses} />
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Ort / PLZ</span>
					<input
						type="text"
						name="location"
						maxlength="120"
						placeholder="z. B. 68199 Mannheim"
						class={inputClasses}
					/>
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Erwartete Gäste</span>
					<input
						type="text"
						name="guests"
						maxlength="40"
						placeholder="z. B. 120"
						class={inputClasses}
					/>
				</label>
			</div>
			<label class="mb-3.5 flex flex-col gap-[7px]">
				<span class="text-[13px] font-bold text-second-600">Gewünschte Bar</span>
				<select name="bar" bind:value={booking.bar} class={inputClasses}>
					{#each bars as bar (bar.key)}
						<option value={bar.key}>{bar.name}</option>
					{/each}
					<option value="offen">Noch offen — beratet uns gerne</option>
				</select>
			</label>
			<label class="mb-3.5 flex flex-col gap-[7px]">
				<span class="text-[13px] font-bold text-second-600">Gewünschtes Paket</span>
				<select name="package" bind:value={booking.pkg} class={inputClasses}>
					{#each packages as pkg (pkg.key)}
						<option value={pkg.key}>{pkg.name} — {pkg.size}</option>
					{/each}
					<option value="offen">Weiß ich noch nicht / individuell</option>
				</select>
			</label>
			<label class="mb-5 flex flex-col gap-[7px]">
				<span class="text-[13px] font-bold text-second-600">Eure Nachricht *</span>
				<textarea
					name="message"
					required
					rows="4"
					maxlength="5000"
					placeholder="Was für ein Fest ist es? Wie lange soll die Bar laufen? Gibt es Strom vor Ort?"
					aria-invalid={errors.message ? 'true' : undefined}
					class="{inputClasses} min-h-0 resize-y leading-normal {errors.message
						? errorClasses
						: ''}"></textarea>
				{#if errors.message}
					<span class="text-[12.5px] font-semibold text-red-800">{errors.message}</span>
				{/if}
			</label>
			<button
				type="submit"
				disabled={sending}
				class="min-h-14 w-full cursor-pointer rounded-full border-none bg-second p-[18px] text-[16.5px] font-extrabold text-prime transition-colors hover:bg-second-700 disabled:cursor-progress disabled:opacity-70"
			>
				{sending ? 'Wird gesendet …' : 'Unverbindlich anfragen'}
			</button>
			<p class="mt-3.5 mb-0 text-[12.5px] leading-normal text-second-550">
				* Pflichtfeld. Eure Daten nutzen wir ausschließlich zur Bearbeitung der Anfrage — Details in
				der
				<a href="/rechtliches#datenschutz" class="text-second underline">Datenschutzerklärung</a>.
			</p>
		</form>
	{/if}
</div>
