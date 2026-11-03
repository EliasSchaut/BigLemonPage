<script lang="ts">
	import Eyebrow from './Eyebrow.svelte';
	import RichTitle from './RichTitle.svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		lead?: string;
		eyebrowTone?: 'olive' | 'lime' | 'prime' | 'muted';
		tone?: 'light' | 'dark';
		class?: string;
	}

	let {
		eyebrow,
		title,
		lead,
		eyebrowTone = 'olive',
		tone = 'dark',
		class: cls = ''
	}: Props = $props();
</script>

<div class={cls}>
	{#if eyebrow}
		<Eyebrow tone={eyebrowTone} class="mb-4">{eyebrow}</Eyebrow>
	{/if}
	<h2
		class="m-0 mb-4 font-display text-[clamp(32px,4.6vw,54px)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance {tone ===
		'light'
			? 'text-cream'
			: 'text-second'}"
	>
		<RichTitle {title} highlightClass={tone === 'light' ? 'text-prime' : 'text-olive'} />
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
