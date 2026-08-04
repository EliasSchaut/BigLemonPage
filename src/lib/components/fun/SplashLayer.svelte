<script lang="ts">
	import { droplets } from '$lib/state/fun.svelte';
</script>

<div class="pointer-events-none fixed inset-0 z-90 overflow-hidden" aria-hidden="true">
	{#each droplets as drop (drop.id)}
		<span
			class="droplet"
			style:left="{drop.x}px"
			style:top="{drop.y}px"
			style:width="{drop.size}px"
			style:height="{drop.size * 1.25}px"
			style:background={drop.color}
			style:--dx="{drop.dx}px"
			style:--dy="{drop.dy}px"
			style:animation-duration="{drop.duration}ms"
		></span>
	{/each}
</div>

<style>
	.droplet {
		position: absolute;
		border-radius: 52% 48% 44% 56% / 62% 58% 42% 38%;
		filter: drop-shadow(0 2px 6px rgb(242 230 60 / 0.5));
		animation: squirt cubic-bezier(0.16, 0.72, 0.3, 1) forwards;
	}

	@keyframes squirt {
		0% {
			transform: translate3d(-50%, -50%, 0) scale(0.35);
			opacity: 0;
		}
		14% {
			opacity: 1;
		}
		100% {
			transform: translate3d(calc(-50% + var(--dx)), calc(-50% + var(--dy)), 0) scale(0.6)
				rotate(180deg);
			opacity: 0;
		}
	}
</style>
