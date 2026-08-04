<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import logoLight from '$lib/assets/images/logo-light.png';
	import { NAV_LINKS } from '$lib/data/content';
	import Button from '$lib/components/ui/Button.svelte';
	import MenuLemonIcon from '$lib/components/ui/MenuLemonIcon.svelte';

	let menuOpen = $state(false);
	const closeMenu = () => (menuOpen = false);

	let headerHeight = $state(0);

	$effect(() => {
		if (headerHeight) document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
	});
</script>

<header
	bind:offsetHeight={headerHeight}
	class="sticky top-0 z-60 border-b border-prime/18 bg-second/82 backdrop-blur-[14px] backdrop-saturate-100"
>
	<div class="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3.5">
		<a href="/#start" class="flex items-center gap-3.5 text-cream" onclick={closeMenu}>
			<img src={logoLight} alt="Big Lemon" class="block h-11 w-auto flex-none" />
			<span class="block h-[26px] w-px bg-prime/30"></span>
			<span
				class="max-w-[92px] text-[9.5px] leading-normal font-bold tracking-[.22em] text-second-400"
			>
				MOBILE<br />COCKTAILBAR
			</span>
		</a>

		<nav class="hidden items-center gap-7 min-[940px]:flex">
			{#each NAV_LINKS as link (link.href)}
				<a
					href={link.href}
					class="text-[14.5px] font-semibold text-second-100 transition-colors hover:text-prime"
				>
					{link.label}
				</a>
			{/each}
			<Button href="/#buchen" size="sm">Bar anfragen</Button>
		</nav>

		<button
			type="button"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
			aria-expanded={menuOpen}
			class="flex size-[46px] cursor-pointer items-center justify-center rounded-[14px] border border-prime/30 bg-prime/8 text-prime min-[940px]:hidden"
		>
			<MenuLemonIcon open={menuOpen} />
		</button>
	</div>

	{#if menuOpen}
		<nav
			transition:slide={{ duration: 320, easing: cubicOut }}
			class="absolute inset-x-0 top-full flex flex-col gap-0.5 overflow-hidden border-b border-prime/18 bg-second/97 px-4 pt-2 pb-5 backdrop-blur-[14px] min-[940px]:hidden"
		>
			{#each NAV_LINKS as link (link.href)}
				<a
					href={link.href}
					onclick={closeMenu}
					class="rounded-xl p-3.5 text-[17px] font-semibold text-cream"
				>
					{link.label}
				</a>
			{/each}
			<a
				href="/#buchen"
				onclick={closeMenu}
				class="mt-2.5 rounded-[14px] bg-prime p-4 text-center font-extrabold text-second"
			>
				Bar anfragen
			</a>
		</nav>
	{/if}
</header>
