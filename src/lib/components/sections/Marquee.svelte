<script lang="ts">
	let { items }: { items: string[] } = $props();

	const MIN_PER_HALF = 7;

	const half = $derived(
		Array.from({ length: Math.ceil(MIN_PER_HALF / Math.max(items.length, 1)) }, () => items).flat()
	);
	const track = $derived([...half, ...half]);
</script>

<div
	class="overflow-hidden border-t-2 border-second bg-prime py-[15px] whitespace-nowrap text-second"
>
	<div
		class="inline-flex animate-marquee gap-[34px] pr-[34px] font-display text-base font-extrabold tracking-[.02em]"
	>
		{#each track as item}
			<span>{item}</span><span aria-hidden="true">★</span>
		{/each}
	</div>
</div>
