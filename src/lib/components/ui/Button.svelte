<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		variant?: 'primary' | 'dark' | 'outline-cream' | 'outline-prime' | 'outline-dark';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit';
		disabled?: boolean;
		'aria-expanded'?: boolean;
		'aria-controls'?: string;
		onclick?: (e: MouseEvent) => void;
		class?: string;
		children: Snippet;
	}

	let {
		href,
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		onclick,
		class: cls = '',
		children,
		...aria
	}: Props = $props();

	const variants = {
		primary: 'bg-prime text-second font-extrabold shadow-glow hover:bg-prime-200',
		dark: 'bg-second text-prime font-extrabold hover:bg-second-700',
		'outline-cream':
			'border-[1.5px] border-cream/30 text-cream font-bold hover:border-prime hover:text-prime',
		'outline-prime':
			'border-[1.5px] border-prime/40 text-prime font-bold hover:bg-prime hover:text-second',
		'outline-dark':
			'border-[1.5px] border-second/20 text-second font-bold hover:bg-second hover:text-prime'
	};
	const sizes = {
		sm: 'px-5 py-[11px] text-[14.5px]',
		md: 'min-h-12 px-6 py-3 text-[15px]',
		lg: 'px-[30px] py-[17px] text-base'
	};

	const classes = $derived(
		`inline-flex cursor-pointer items-center justify-center rounded-full text-center leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${cls}`
	);
</script>

{#if href}
	<a {href} {onclick} class={classes}>{@render children()}</a>
{:else}
	<button {type} {disabled} {onclick} class={classes} {...aria}>{@render children()}</button>
{/if}
