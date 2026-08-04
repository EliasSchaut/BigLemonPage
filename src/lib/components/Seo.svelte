<script lang="ts">
	import { page } from '$app/state';
	import { SITE } from '$lib/data/content';

	interface Props {
		title: string;
		description?: string;
		image?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		jsonLd?: unknown;
	}

	let {
		title,
		description = SITE.description,
		image = SITE.ogImage,
		type = 'website',
		noindex = false,
		jsonLd
	}: Props = $props();

	const canonical = $derived(new URL(page.url.pathname, page.url.origin).href);
	const imageUrl = $derived(new URL(image, page.url.origin).href);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={SITE.keywords.join(', ')} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<meta name="robots" content="index, follow, max-image-preview:large" />
	{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:locale" content={SITE.locale} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Die BigLemon — mobile Cocktailbar in Zitronenform" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if jsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`}
	{/if}
</svelte:head>
