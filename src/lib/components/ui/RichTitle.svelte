<script lang="ts">
	import { parseTitle } from '#lib/data/title.ts';

	let { title, highlightClass }: { title: string; highlightClass: string } = $props();

	const lines = $derived(parseTitle(title));
</script>

{#each lines as line, lineIndex}
	{#if lineIndex > 0}<br />{/if}
	{#each line as segment}
		{#if segment.highlight}<span class={highlightClass}>{segment.text}</span
			>{:else}{segment.text}{/if}
	{/each}
{/each}
