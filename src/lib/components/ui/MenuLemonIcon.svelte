<script lang="ts">
	let { open = false }: { open?: boolean } = $props();

	const uid = $props.id();

	const BODY =
		'M1.26 16C5.22 8.96 10.28 5.66 16 5.66s10.78 3.3 14.74 10.34c-3.96 7.04-9.02 10.34-14.74 10.34S5.22 23.04 1.26 16Z';
</script>

<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" class="size-[26px]">
	<defs>
		<clipPath id="{uid}-1"><rect x="0" y="4" width="32" height="8.1" /></clipPath>
		<clipPath id="{uid}-2"><rect x="0" y="13.5" width="32" height="5" /></clipPath>
		<clipPath id="{uid}-3"><rect x="0" y="19.9" width="32" height="8.1" /></clipPath>
	</defs>

	<g class="fruit" class:open>
		<g class="slice top" clip-path="url(#{uid}-1)">
			<path d={BODY} fill="currentColor" />
		</g>
		<g class="slice middle" clip-path="url(#{uid}-2)">
			<path d={BODY} fill="currentColor" />
		</g>
		<g class="slice bottom" clip-path="url(#{uid}-3)">
			<path d={BODY} fill="currentColor" />
		</g>
	</g>
</svg>

<style>
	.slice {
		transform-box: view-box;
		transform-origin: 16px 16px;
		transition:
			transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.2s ease;
	}
	.open .top {
		transform: rotate(45deg) translateY(6.45px);
	}
	.open .bottom {
		transform: rotate(-45deg) translateY(-6.45px);
	}
	.open .middle {
		transform: scaleX(0.1);
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.slice {
			transition-duration: 0.01ms;
		}
	}
</style>
