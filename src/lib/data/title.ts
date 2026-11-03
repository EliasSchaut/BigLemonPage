export interface TitleSegment {
	text: string;
	highlight: boolean;
}

export function parseTitle(title: string): TitleSegment[][] {
	return title
		.trim()
		.split(/\r?\n/)
		.map((line) =>
			line
				.trim()
				.split(/\*([^*]+)\*/)
				.map((text, index) => ({ text, highlight: index % 2 === 1 }))
				.filter((segment) => segment.text)
		)
		.filter((line) => line.length > 0);
}
