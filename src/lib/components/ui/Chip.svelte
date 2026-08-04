<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		active?: boolean;
		color?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let { active = false, color = '#F2E63C', onclick, children }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	class="min-h-12 cursor-pointer rounded-full border-[1.5px] px-6 py-3 text-[15px] font-extrabold transition-colors {active
		? 'text-second'
		: 'border-cream/20 bg-cream/5 text-second-50'}"
	style={active ? `background:${color};border-color:${color}` : undefined}
>
	{@render children()}
</button>
