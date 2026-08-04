<script lang="ts">
	interface Props {
		rind?: string;
		flesh?: string;
		slice?: boolean;
		class?: string;
	}

	let {
		rind = 'currentColor',
		flesh = '#FFF8B4',
		slice = false,
		class: klass = ''
	}: Props = $props();

	const BODY =
		'M2.6 16C6.2 9.6 10.8 6.6 16 6.6s9.8 3 13.4 9.4c-3.6 6.4-8.2 9.4-13.4 9.4S6.2 22.4 2.6 16Z';
</script>

<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" class={klass}>
	<path d={BODY} fill={rind} />
	{#if slice}
		<g transform="translate(16 16) scale(.7) translate(-16 -16)">
			<path d={BODY} fill={flesh} />
		</g>
		<g stroke={rind} stroke-width="1" stroke-linecap="round" opacity=".55">
			<path d="M16 10.4v11.2" />
			<path d="M7.4 16h17.2" />
		</g>
	{/if}
</svg>
