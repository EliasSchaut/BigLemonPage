<script lang="ts">
	import type { PageData } from './$types';
	import Hero from '$lib/components/sections/Hero.svelte';
	import Marquee from '$lib/components/sections/Marquee.svelte';
	import WhyBar from '$lib/components/sections/WhyBar.svelte';
	import Drinks from '$lib/components/sections/Drinks.svelte';
	import Events from '$lib/components/sections/Events.svelte';
	import Gallery from '$lib/components/sections/Gallery.svelte';
	import Bars from '$lib/components/sections/Bars.svelte';
	import Booking from '$lib/components/sections/booking/Booking.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>BigLemon — Die mobile Cocktailbar für euer Fest</title>
	<meta
		name="description"
		content="Die BigLemon: eine 3 Meter große, fahrbare Riesenzitrone voller frisch gepresster Cocktails — für Hochzeiten, Firmenfeiern, Stadtfeste und Festivals."
	/>
</svelte:head>

<Hero />
<Marquee />
<WhyBar />
<Drinks drinks={data.drinks} />
<Events months={data.eventMonths} />
<Gallery shots={data.gallery} />
<Bars bars={data.bars} />
<Booking packages={data.packages} bars={data.bars} />
<Contact />
