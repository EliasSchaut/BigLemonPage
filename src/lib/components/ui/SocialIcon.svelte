<script lang="ts">
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
	{@html icons[name]}
</span>
