export interface Ingredient {
	label: string;
	stem: string;
	alc?: boolean;
	filler?: boolean;
}

export interface IngredientGroup {
	name: string;
	items: Ingredient[];
}

export const MAX_INGREDIENTS = 5;

export const INGREDIENT_GROUPS: IngredientGroup[] = [
	{
		name: 'Mit Schuss',
		items: [
			{ label: 'Gin', stem: 'Gin', alc: true },
			{ label: 'Wodka', stem: 'Wodka', alc: true },
			{ label: 'Rum', stem: 'Rum', alc: true },
			{ label: 'Tequila', stem: 'Tequila', alc: true },
			{ label: 'Aperol', stem: 'Aperol', alc: true },
			{ label: 'Prosecco', stem: 'Prosecco', alc: true }
		]
	},
	{
		name: 'Frucht',
		items: [
			{ label: 'Zitrone', stem: 'Zitronen' },
			{ label: 'Limette', stem: 'Limetten' },
			{ label: 'Maracuja', stem: 'Maracuja' },
			{ label: 'Ananas', stem: 'Ananas' },
			{ label: 'Mango', stem: 'Mango' },
			{ label: 'Erdbeere', stem: 'Erdbeer' },
			{ label: 'Wassermelone', stem: 'Melonen' },
			{ label: 'Orange', stem: 'Orangen' },
			{ label: 'Cranberry', stem: 'Cranberry' }
		]
	},
	{
		name: 'Kräuter & Extras',
		items: [
			{ label: 'Minze', stem: 'Minz' },
			{ label: 'Basilikum', stem: 'Basilikum' },
			{ label: 'Gurke', stem: 'Gurken' },
			{ label: 'Ingwer', stem: 'Ingwer' },
			{ label: 'Holunder', stem: 'Holunder' },
			{ label: 'Vanille', stem: 'Vanille' },
			{ label: 'Kokos', stem: 'Kokos' },
			{ label: 'Chili', stem: 'Chili' }
		]
	},
	{
		name: 'Zum Auffüllen',
		items: [
			{ label: 'Soda', stem: 'Soda', filler: true },
			{ label: 'Tonic', stem: 'Tonic', filler: true },
			{ label: 'Ginger Beer', stem: 'Ginger', filler: true },
			{ label: 'Bitter Lemon', stem: 'Lemon', filler: true }
		]
	}
];

const STYLES = [
	'Fizz',
	'Smash',
	'Mule',
	'Sour',
	'Spritz',
	'Punch',
	'Cooler',
	'Sunrise',
	'Breeze',
	'Twist',
	'Splash',
	'Colada'
];

const LOCALS = ['Monnemer', 'Mannheimer', 'Neckarstädter', 'Jungbuscher', 'Quadratestädter'];

const SUFFIXES = ['traum', 'rakete', 'kuss', 'blitz', 'welle', 'zauber', 'bombe', 'wunder'];

type Template = (a: string, b: string | undefined, virgin: boolean) => string | undefined;

const TEMPLATES: Template[] = [
	(a) => `${a} ${pick(STYLES)}`,
	(a, b) => (b ? `${a}-${b}-${pick(STYLES)}` : undefined),
	(a) => `${pick(LOCALS)} ${a}-${pick(STYLES)}`,
	(a) => `${a}${pick(SUFFIXES)}`,
	(a, b) => (b ? `${a}${b.toLowerCase()}${pick(SUFFIXES)}` : undefined),
	(a) => `Big ${a} ${pick(STYLES)}`,
	(a, _b, virgin) => (virgin ? `Virgin ${a} ${pick(STYLES)}` : undefined)
];

function pick<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

function shuffled<T>(items: readonly T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function isAlcoholic(ingredients: Ingredient[]): boolean {
	return ingredients.some((ingredient) => ingredient.alc);
}

export function inventName(ingredients: Ingredient[], previous?: string): string {
	const flavours = ingredients.filter((ingredient) => !ingredient.filler);
	const pool = shuffled(flavours.length > 0 ? flavours : ingredients).map((i) => i.stem);
	const virgin = !isAlcoholic(ingredients);

	for (let attempt = 0; attempt < 12; attempt++) {
		const [a, b] = shuffled(pool);
		const name = pick(TEMPLATES)(a, b, virgin);
		if (name && name !== previous) return name;
	}
	return `${pool[0]} ${pick(STYLES)}`;
}
