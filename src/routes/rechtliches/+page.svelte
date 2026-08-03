<script lang="ts">
	import { CONTACT } from '$lib/data/content';
	import Eyebrow from '$lib/components/ui/Eyebrow.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const privacySections = [
		{
			title: '1. Verantwortlicher',
			text: `${CONTACT.company}, ${CONTACT.owner}, ${CONTACT.street}, ${CONTACT.city}, ${CONTACT.email}, ${CONTACT.phoneDisplay}.`
		},
		{
			title: '2. Aufruf dieser Website (Server-Logfiles)',
			text: 'Beim Aufruf unserer Seite werden durch unseren Hoster automatisch IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, übertragene Datenmenge, Browsertyp und Betriebssystem verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse an einem sicheren, störungsfreien Betrieb. Die Logfiles werden nach spätestens 30 Tagen gelöscht.'
		},
		{
			title: '3. Anfrage- und Kontaktformular',
			text: 'Wenn ihr uns über das Formular, per E-Mail oder telefonisch eine Anfrage schickt, verarbeiten wir die angegebenen Daten (Name, E-Mail, Telefon, Ort, Datum, Gästezahl, Nachricht) ausschließlich zur Bearbeitung der Anfrage und für Anschlussfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertrag bzw. Vertragsanbahnung), im Übrigen lit. f DSGVO. Anfragen ohne Buchung löschen wir nach zwölf Monaten; bei einer Buchung gelten die steuerlichen Aufbewahrungsfristen von bis zu zehn Jahren.'
		},
		{
			title: '4. Empfänger und Auftragsverarbeiter',
			text: 'Eure Daten geben wir nicht zu Werbezwecken weiter. Zugriff haben ausschließlich unser Hosting- und E-Mail-Dienstleister auf Grundlage eines Auftragsverarbeitungsvertrags (Art. 28 DSGVO) sowie — bei einer Buchung — unser Steuerbüro.'
		},
		{
			title: '5. Cookies',
			text: 'Diese Website setzt keine Tracking-Cookies und nutzt keine Analyse- oder Werbedienste. Technisch notwendige Cookies werden nur gesetzt, soweit sie für den Betrieb der Seite erforderlich sind (§ 25 Abs. 2 TDDDG).'
		},
		{
			title: '6. Eure Rechte',
			text: `Ihr habt jederzeit das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21). Eine Nachricht an ${CONTACT.email} genügt.`
		},
		{
			title: '7. Beschwerderecht',
			text: 'Ihr könnt euch bei einer Datenschutz-Aufsichtsbehörde beschweren, für uns zuständig ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Lautenschlagerstraße 20, 70173 Stuttgart.'
		}
	];
</script>

<Seo
	title="Impressum & Datenschutz — BigLemon"
	description="Impressum und Datenschutzerklärung der BigLemon Deutschland, mobile Cocktailbar aus Mannheim."
	noindex
/>

<div class="bg-cream px-5 pt-[clamp(40px,6vw,76px)] pb-[clamp(56px,7vw,90px)] text-second">
	<div class="mx-auto max-w-[960px]">
		<Eyebrow class="mb-4">RECHTLICHES</Eyebrow>
		<h1
			class="m-0 mb-5 font-display text-[clamp(30px,4.4vw,50px)] leading-[1.03] font-extrabold tracking-[-.03em]"
		>
			Impressum &amp; Datenschutz
		</h1>
		<div class="mb-9 flex flex-wrap gap-2.5">
			<Button href="#impressum" variant="outline-dark">Impressum</Button>
			<Button href="#datenschutz" variant="outline-dark">Datenschutzerklärung</Button>
		</div>

		<section id="impressum" class="mb-11 scroll-mt-[90px]">
			<h2
				class="m-0 mb-5 font-display text-[clamp(24px,3vw,32px)] font-extrabold tracking-[-.02em]"
			>
				Impressum
			</h2>
			<div
				class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[26px] rounded-[22px] border-[1.5px] border-second/10 bg-white p-[clamp(24px,3vw,34px)]"
			>
				<div>
					<h3 class="m-0 mb-3 font-display text-[19px] font-bold">Angaben gemäß § 5 DDG</h3>
					<p class="m-0 text-[15.5px] leading-[1.7] text-second-600">
						{CONTACT.company}<br />{CONTACT.owner}<br />{CONTACT.street}<br />{CONTACT.city}
					</p>
					<p class="m-0 mt-4 text-[15.5px] leading-[1.7] text-second-600">
						Telefon:
						<a href={CONTACT.phoneHref} class="text-second underline">{CONTACT.phoneDisplay}</a>
						<br />
						E-Mail:
						<a href="mailto:{CONTACT.email}" class="text-second underline">{CONTACT.email}</a>
					</p>
				</div>
				<div>
					<h3 class="m-0 mb-3 font-display text-[19px] font-bold">
						Umsatzsteuer &amp; Verantwortung
					</h3>
					<p class="m-0 text-[15.5px] leading-[1.7] text-second-600">
						USt-IdNr. gemäß § 27 a UStG: {CONTACT.vatId}
					</p>
					<p class="m-0 mt-4 text-[15.5px] leading-[1.7] text-second-600">
						Verantwortlich für den Inhalt: {CONTACT.owner}, Adresse wie oben.
					</p>
					<p class="m-0 mt-4 text-[15.5px] leading-[1.7] text-second-600">
						Plattform der EU zur außergerichtlichen Streitbeilegung:
						<a href="https://ec.europa.eu/consumers/odr" class="text-second underline">
							ec.europa.eu/consumers/odr
						</a>. Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren
						vor einer Verbraucherschlichtungsstelle teilzunehmen.
					</p>
				</div>
			</div>
		</section>

		<section id="datenschutz" class="scroll-mt-[90px]">
			<h2
				class="m-0 mb-5 font-display text-[clamp(24px,3vw,32px)] font-extrabold tracking-[-.02em]"
			>
				Datenschutzerklärung
			</h2>
			<div
				class="flex flex-col gap-6 rounded-[22px] border-[1.5px] border-second/10 bg-white p-[clamp(24px,3vw,34px)]"
			>
				<div
					class="rounded-[14px] bg-prime/16 px-[18px] py-4 text-[14.5px] leading-relaxed text-second-600"
				>
					Textgerüst — bitte vor dem Livegang mit eurem Hoster (Auftragsverarbeitungsvertrag) und
					ggf. anwaltlich abgleichen. Wenn Karten, Analyse-Tools oder Social-Media-Plugins
					dazukommen, müssen sie hier ergänzt werden.
				</div>
				{#each privacySections as section (section.title)}
					<div>
						<h3 class="m-0 mb-2.5 font-display text-[19px] font-bold">{section.title}</h3>
						<p class="m-0 text-[15.5px] leading-[1.7] text-second-600">{section.text}</p>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
