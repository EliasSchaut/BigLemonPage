<script lang="ts">
	import { CONTACT, PACKAGES } from '$lib/data/content';
	import { booking } from '$lib/state/booking.svelte';

	const inputClasses =
		'min-h-12 rounded-field border-[1.5px] border-second/16 bg-white px-[15px] py-3.5 text-[15.5px] text-second';

	function submit(e: SubmitEvent) {
		e.preventDefault();
		// TODO: Anfrage an Backend/E-Mail senden (Form-Action), sobald vorhanden
		booking.sent = true;
		document.getElementById('anfrage')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div
	id="anfrage"
	class="scroll-mt-[84px] rounded-[26px] bg-cream p-[clamp(26px,3.4vw,38px)] text-second"
>
	{#if booking.sent}
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
				onclick={() => (booking.sent = false)}
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
		<form onsubmit={submit}>
			<div class="mb-3.5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Name *</span>
					<input
						type="text"
						name="name"
						required
						placeholder="Vor- und Nachname"
						class={inputClasses}
					/>
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">E-Mail *</span>
					<input
						type="email"
						name="email"
						required
						placeholder="name@beispiel.de"
						class={inputClasses}
					/>
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Telefon *</span>
					<input type="tel" name="phone" required placeholder="0176 0000000" class={inputClasses} />
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
						placeholder="z. B. 68199 Mannheim"
						class={inputClasses}
					/>
				</label>
				<label class="flex flex-col gap-[7px]">
					<span class="text-[13px] font-bold text-second-600">Erwartete Gäste</span>
					<input type="text" name="guests" placeholder="z. B. 120" class={inputClasses} />
				</label>
			</div>
			<label class="mb-3.5 flex flex-col gap-[7px]">
				<span class="text-[13px] font-bold text-second-600">Gewünschte Bar</span>
				<select name="bar" bind:value={booking.bar} class={inputClasses}>
					<option value="biglemon">BigLemon — die Riesenzitrone</option>
					<option value="biglemon2">BigLemon 2 — die zweite Zitrone</option>
					<option value="bigorange">BigOrange — die Riesenorange</option>
					<option value="offen">Noch offen — beratet uns gerne</option>
				</select>
			</label>
			<label class="mb-3.5 flex flex-col gap-[7px]">
				<span class="text-[13px] font-bold text-second-600">Gewünschtes Paket</span>
				<select name="package" bind:value={booking.pkg} class={inputClasses}>
					{#each PACKAGES as pkg (pkg.key)}
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
					placeholder="Was für ein Fest ist es? Wie lange soll die Bar laufen? Gibt es Strom vor Ort?"
					class="{inputClasses} min-h-0 resize-y leading-normal"></textarea>
			</label>
			<button
				type="submit"
				class="min-h-14 w-full cursor-pointer rounded-full border-none bg-second p-[18px] text-[16.5px] font-extrabold text-prime transition-colors hover:bg-second-700"
			>
				Unverbindlich anfragen
			</button>
			<p class="mt-3.5 mb-0 text-[12.5px] leading-normal text-second-550">
				* Pflichtfeld. Eure Daten nutzen wir ausschließlich zur Bearbeitung der Anfrage — Details in
				der
				<a href="/rechtliches#datenschutz" class="text-second underline">Datenschutzerklärung</a>.
			</p>
		</form>
	{/if}
</div>
