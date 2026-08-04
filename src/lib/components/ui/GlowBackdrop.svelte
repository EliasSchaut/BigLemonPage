<script lang="ts">
	import barWall from '$lib/assets/images/bar-hintergrund.jpg';

	interface Props {
		wall?: boolean;
		wallOpacity?: number;
		wallMask?: string;
		glow?: string;
		glowOpacity?: number;
		shade?: string;
	}

	let {
		wall = false,
		wallOpacity = 0.46,
		wallMask,
		glow,
		glowOpacity = 0.85,
		shade
	}: Props = $props();
</script>

{#if wall}
	<div
		class="pointer-events-none absolute inset-0 bg-cover bg-center saturate-[1.45]"
		style:background-image="url('{barWall}')"
		style:opacity={wallOpacity}
		style:mask-image={wallMask}
		style:-webkit-mask-image={wallMask}
	></div>
{/if}
{#if shade}
	<div class="pointer-events-none absolute inset-0" style:background={shade}></div>
{/if}
{#if glow}
	<div
		class="pointer-events-none absolute inset-0 mix-blend-screen"
		style:background={glow}
		style:opacity={glowOpacity}
	></div>
{/if}
