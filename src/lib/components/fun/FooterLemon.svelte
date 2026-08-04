<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { fun, splash } from '$lib/state/fun.svelte';
	import LemonIcon from '$lib/components/ui/LemonIcon.svelte';

	let hoverCapable = $state(false);
	let hovered = $state(false);
	let pinned = $state(false);
	let wrapper: HTMLDivElement;

	const open = $derived(hovered || pinned);

	$effect(() => {
		hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	});

	function toggle(event: MouseEvent) {
		pinned = !pinned;
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		splash(box.left + box.width / 2, box.top + box.height / 2, {
			count: 10,
			spread: Math.PI * 2,
			power: 120
		});
	}

	function dismiss() {
		pinned = false;
		hovered = false;
	}

	function startNinja() {
		dismiss();
		fun.ninjaOpen = true;
	}
</script>

<svelte:window
	onpointerdown={(event) => {
		if (open && wrapper && !wrapper.contains(event.target as Node)) dismiss();
	}}
	onkeydown={(event) => {
		if (open && event.key === 'Escape') dismiss();
	}}
/>

<div
	bind:this={wrapper}
	role="presentation"
	class="relative flex items-center"
	onmouseenter={() => hoverCapable && (hovered = true)}
	onmouseleave={() => (hovered = false)}
	onfocusin={() => (hovered = true)}
	onfocusout={(event) => {
		if (!wrapper.contains(event.relatedTarget as Node)) hovered = false;
	}}
>
	<button
		type="button"
		onclick={toggle}
		aria-expanded={open}
		class="cursor-pointer rounded-full p-1 text-prime transition-transform duration-300 hover:scale-110 hover:rotate-12"
	>
		<span class="sr-only">Zitronen-Spruch anzeigen</span>
		<LemonIcon slice class="size-6 drop-shadow-[0_2px_8px_rgb(242_230_60/.45)]" />
	</button>

	{#if open}
		<div
			transition:fly={{ y: 8, duration: 220, easing: cubicOut }}
			class="absolute right-0 bottom-[calc(100%+10px)] z-20 w-[248px] rounded-[16px] border border-prime/30 bg-second-900 p-4 text-left shadow-[0_18px_40px_rgb(0_0_0/.45)]"
		>
			<p class="m-0 text-[13.5px] leading-[1.5] font-semibold text-cream">
				„Wenn dir das Leben Zitronen gibt, mache Limonade draus.“
			</p>
			<button
				type="button"
				onclick={startNinja}
				class="mt-3 cursor-pointer rounded-[10px] bg-prime px-3 py-2 text-[12.5px] font-extrabold text-second transition-colors hover:bg-prime-200"
			>
				Selber pressen 🔪
			</button>
			<span
				class="absolute right-[13px] -bottom-[7px] size-3 rotate-45 border-r border-b border-prime/30 bg-second-900"
			></span>
		</div>
	{/if}
</div>
