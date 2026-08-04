<script lang="ts">
	import type { Snippet } from 'svelte';
	import Eyebrow from './Eyebrow.svelte';

	interface Props {
		eyebrow: string;
		eyebrowTone?: 'olive' | 'lime' | 'prime' | 'muted';
		tone?: 'light' | 'dark';
		lead?: string;
		class?: string;
		children: Snippet;
	}

	let {
		eyebrow,
		eyebrowTone = 'olive',
		tone = 'dark',
		lead,
		class: cls = '',
		children
	}: Props = $props();
</script>

<div class={cls}>
	<Eyebrow tone={eyebrowTone} class="mb-4">{eyebrow}</Eyebrow>
	<h2
		class="m-0 mb-4 font-display text-[clamp(32px,4.6vw,54px)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance {tone ===
		'light'
			? 'text-cream'
			: 'text-second'}"
	>
		{@render children()}
	</h2>
	{#if lead}
		<p
			class="m-0 text-[17px] leading-[1.65] text-pretty {tone === 'light'
				? 'text-second-300'
				: 'text-second-600'}"
		>
			{lead}
		</p>
	{/if}
</div>
