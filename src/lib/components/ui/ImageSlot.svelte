<script lang="ts">
	interface Props {
		/** Beschriftung des Platzhalters, solange noch kein Foto vorliegt */
		placeholder: string;
		src?: string;
		srcset?: string;
		sizes?: string;
		alt?: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		class?: string;
	}

	let {
		placeholder,
		src,
		srcset,
		sizes,
		alt = '',
		width,
		height,
		loading = 'lazy',
		class: cls = ''
	}: Props = $props();
</script>

{#if src}
	<img
		{src}
		{srcset}
		{sizes}
		{alt}
		{width}
		{height}
		{loading}
		decoding="async"
		class="absolute inset-0 size-full object-cover {cls}"
	/>
{:else}
	<div
		class="absolute inset-0 flex items-center justify-center border border-dashed border-cream/25 bg-cream/5 p-4 {cls}"
	>
		<span class="text-center text-[13px] font-semibold text-second-400">{placeholder}</span>
	</div>
{/if}
