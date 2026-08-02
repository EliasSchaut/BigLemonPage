<script lang="ts">
	import { MARQUEE_ITEMS } from '$lib/data/content';

	// Inhalt verdoppeln: die Animation schiebt um -50 %, so entsteht die Endlosschleife
	const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
</script>

<div
	class="overflow-hidden border-t-2 border-second bg-prime py-[15px] whitespace-nowrap text-second"
>
	<div
		class="inline-flex animate-marquee gap-[34px] pr-[34px] font-display text-base font-extrabold tracking-[.02em]"
	>
		{#each items as item, i (i)}
			<span>{item}</span><span aria-hidden="true">★</span>
		{/each}
	</div>
</div>
