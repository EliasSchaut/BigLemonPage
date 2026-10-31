<script lang="ts">
	import { scale } from 'svelte/transition';
	import {
		INGREDIENT_GROUPS,
		MAX_INGREDIENTS,
		inventName,
		isAlcoholic,
		type Ingredient
	} from '#lib/data/eigenkreation.ts';
	import { prefersReducedMotion } from '#lib/state/fun.svelte.ts';
	import { booking } from '#lib/state/booking.svelte.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import Eyebrow from '#lib/components/ui/Eyebrow.svelte';
	import LemonIcon from '#lib/components/ui/LemonIcon.svelte';
	import Tag from '#lib/components/ui/Tag.svelte';

	let { class: cls = '' }: { class?: string } = $props();

	let dialog: HTMLDialogElement;
	let open = $state(false);
	let chosen = $state<Ingredient[]>([]);
	let name = $state<string | undefined>();

	const full = $derived(chosen.length >= MAX_INGREDIENTS);
	const alc = $derived(isAlcoholic(chosen));

	function isChosen(ingredient: Ingredient) {
		return chosen.some((entry) => entry.label === ingredient.label);
	}

	function toggle(ingredient: Ingredient) {
		const index = chosen.findIndex((entry) => entry.label === ingredient.label);
		if (index > -1) chosen.splice(index, 1);
		else if (!full) chosen.push(ingredient);
	}

	function mix() {
		name = inventName(chosen, name);
	}

	function restart() {
		chosen = [];
		name = undefined;
	}

	function request() {
		const ingredients = chosen.map((ingredient) => ingredient.label).join(', ');
		const wish = `Wir hätten gern unsere Eigenkreation „${name}“ (${ingredients}) auf unserem Fest.`;
		if (!booking.message.includes(wish)) {
			booking.message = booking.message.trim()
				? `${booking.message.trim()}

${wish}`
				: wish;
		}
		dialog.close();
	}

	function show() {
		open = true;
		dialog.showModal();
	}

	$effect(() => {
		if (!open) return;
		const { overflow } = document.documentElement.style;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			document.documentElement.style.overflow = overflow;
		};
	});
</script>

<button
	type="button"
	onclick={show}
	class="group flex reveal cursor-pointer flex-col overflow-hidden rounded-[22px] border border-dashed border-prime/40 bg-prime/5 text-left hover:border-prime hover:bg-prime/10 {cls}"
>
	<div class="relative flex h-[190px] items-center justify-center bg-second-750">
		<LemonIcon
			slice
			rind="#F2E63C"
			class="size-24 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[24deg]"
		/>
		<span
			class="absolute top-4 right-4 rounded-full bg-prime px-3 py-1.5 text-[12px] font-extrabold text-second"
		>
			Selbst mixen
		</span>
	</div>
	<div class="flex flex-1 flex-col gap-[9px] px-5 pt-5 pb-[22px]">
		<div class="flex items-baseline justify-between gap-3">
			<h3 class="m-0 font-display text-xl font-bold tracking-[-.01em] text-cream">Eigenkreation</h3>
			<Tag class="bg-prime/16 text-prime">DEIN DRINK</Tag>
		</div>
		<p class="m-0 text-[14.5px] leading-[1.55] text-second-300/90">
			Ihr sucht die Zutaten aus, wir geben dem Ganzen einen Namen. Garantiert einzigartig.
		</p>
	</div>
</button>

<dialog
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(event) => {
		if (event.target === dialog) dialog.close();
	}}
	aria-labelledby="eigenkreation-title"
	class="m-auto max-h-[min(92dvh,860px)] w-[min(100%-32px,720px)] overflow-y-auto overscroll-contain rounded-[26px] border border-prime/25 bg-second-900 p-0 text-cream shadow-2xl backdrop:bg-second/80 backdrop:backdrop-blur-[3px]"
>
	<div class="flex flex-col gap-6 p-[clamp(20px,4vw,36px)]">
		<div class="flex items-start justify-between gap-4">
			<div>
				<Eyebrow tone="lime">EIGENKREATION</Eyebrow>
				<h2
					id="eigenkreation-title"
					class="m-0 mt-2 font-display text-[clamp(26px,4vw,36px)] leading-[1.05] font-extrabold tracking-[-.02em]"
				>
					{name ? 'Frisch gemixt.' : 'Was kommt rein?'}
				</h2>
			</div>
			<button
				type="button"
				onclick={() => dialog.close()}
				class="cursor-pointer rounded-2xl border border-prime/25 px-4 py-3 text-[13px] font-bold text-cream transition-colors hover:text-prime"
			>
				Schließen
			</button>
		</div>

		{#if name}
			<div class="flex flex-col items-center gap-5 py-4 text-center">
				<LemonIcon slice rind="#F2E63C" class="size-16" />
				{#key name}
					<p
						in:scale={{ start: 0.7, duration: prefersReducedMotion() ? 0 : 320 }}
						class="m-0 font-display text-[clamp(32px,7vw,54px)] leading-[1.02] font-extrabold tracking-[-.02em] [overflow-wrap:anywhere] text-prime"
						aria-live="polite"
					>
						{name}
					</p>
				{/key}
				<Tag class={alc ? 'bg-prime/16 text-prime' : 'bg-lime/16 text-lime'}>
					{alc ? 'MIT SCHUSS' : 'ALKOHOLFREI'}
				</Tag>
				<p class="m-0 text-[15px] text-second-200">
					{chosen.map((ingredient) => ingredient.label).join(' · ')}
				</p>
				<div class="flex flex-wrap justify-center gap-3 pt-2">
					<Button onclick={mix}>Neuer Name</Button>
					<Button variant="outline-cream" onclick={restart}>Andere Zutaten</Button>
				</div>
				<a
					href="/#anfrage"
					onclick={request}
					class="text-[14px] font-bold text-second-300 underline decoration-prime/50 underline-offset-4 transition-colors hover:text-prime"
				>
					Den wollt ihr auf eurem Fest? Fragt uns an.
				</a>
			</div>
		{:else}
			<p class="m-0 -mt-2 text-[15px] leading-[1.55] text-second-300">
				Bis zu {MAX_INGREDIENTS} Zutaten — dann bekommt euer Drink seinen Namen.
			</p>

			{#each INGREDIENT_GROUPS as group}
				<fieldset class="m-0 flex flex-col gap-3 border-0 p-0">
					<legend class="mb-3 p-0 text-[12.5px] font-extrabold tracking-eyebrow text-second-400">
						{group.name.toUpperCase()}
					</legend>
					<div class="flex flex-wrap gap-2">
						{#each group.items as ingredient}
							{@const active = isChosen(ingredient)}
							<button
								type="button"
								onclick={() => toggle(ingredient)}
								aria-pressed={active}
								disabled={!active && full}
								class="min-h-10 cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-[14px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35 {active
									? 'border-prime bg-prime text-second'
									: 'border-cream/20 bg-cream/5 text-second-50 hover:border-prime/60'}"
							>
								{ingredient.label}
							</button>
						{/each}
					</div>
				</fieldset>
			{/each}

			<div
				class="sticky bottom-0 -mx-[clamp(20px,4vw,36px)] -mb-[clamp(20px,4vw,36px)] flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 bg-second-900/95 px-[clamp(20px,4vw,36px)] py-4"
			>
				<span class="text-[14px] font-semibold text-second-300">
					{chosen.length} / {MAX_INGREDIENTS} Zutaten
				</span>
				<Button onclick={mix} disabled={chosen.length < 2}>Mixen!</Button>
			</div>
		{/if}
	</div>
</dialog>
