<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tone?: 'olive' | 'lime' | 'prime' | 'muted';
		class?: string;
		children: Snippet;
	}

	let { tone = 'olive', class: cls = '', children }: Props = $props();

	const tones = {
		olive: 'text-olive',
		lime: 'text-lime',
		prime: 'text-prime',
		muted: 'text-second/60'
	};
</script>

<div class="text-[12.5px] font-extrabold tracking-eyebrow {tones[tone]} {cls}">
	{@render children()}
</div>
