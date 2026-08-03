<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();
</script>

<!-- Favicon, Apple-Touch-Icon und Manifest stehen in src/app.html -->

<Header />
<main>
	{@render children()}
</main>
<Footer />
