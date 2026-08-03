<script lang="ts">
	// Die Markendateien aus assets/svgs werden per ?raw eingebettet, damit sie
	// die Textfarbe erben (currentColor) — ein <img> koennte beim Hover nicht umfaerben.
	import instagram from '$lib/assets/svgs/instagram-light.svg?raw';
	import facebook from '$lib/assets/svgs/facebook-light.svg?raw';

	interface Props {
		name: 'instagram' | 'facebook';
		size?: number;
	}

	let { name, size = 22 }: Props = $props();

	const icons = { instagram, facebook };
</script>

<span
	class="inline-flex shrink-0 items-center justify-center [&>svg]:size-full"
	style:width="{size}px"
	style:height="{size}px"
	aria-hidden="true"
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags — statische Datei aus dem Build -->
	{@html icons[name]}
</span>
