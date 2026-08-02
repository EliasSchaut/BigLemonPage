<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		style?: string;
		children: Snippet;
	}

	let { class: cls = '', style, children }: Props = $props();
</script>

<span
	class="rounded-full px-[9px] py-[5px] text-[11px] font-extrabold tracking-[.08em] whitespace-nowrap {cls}"
	{style}
>
	{@render children()}
</span>
