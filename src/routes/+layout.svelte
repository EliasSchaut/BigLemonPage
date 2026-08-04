<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import SplashLayer from '$lib/components/fun/SplashLayer.svelte';
	import ScrollSplash from '$lib/components/fun/ScrollSplash.svelte';
	import LemonNinja from '$lib/components/fun/LemonNinja.svelte';

	let { children } = $props();
</script>

<Header />
<main>
	{@render children()}
</main>
<Footer />

<ScrollSplash />
<SplashLayer />
<LemonNinja />
