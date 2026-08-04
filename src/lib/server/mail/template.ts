export type TemplateValues = Record<string, string>;

const PLACEHOLDER = /\{\{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\}\}/g;

const HTML_ENTITIES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

export function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
}

/**
 * Ersetzt alle Platzhalter der Vorlage. Fehlt ein Wert, wird das als Fehler
 * gemeldet statt still ein "{{...}}" in der fertigen Mail zu hinterlassen.
 */
export function renderTemplate(
	template: string,
	values: TemplateValues,
	transform: (value: string) => string = (value) => value
): string {
	const missing: string[] = [];

	const rendered = template.replace(PLACEHOLDER, (_match, key: string) => {
		const value = values[key];
		if (value === undefined) {
			missing.push(key);
			return '';
		}
		return transform(value);
	});

	if (missing.length > 0) {
		throw new Error(`Fehlende Template-Werte: ${[...new Set(missing)].join(', ')}`);
	}

	return rendered;
}

/** Wie renderTemplate, escaped die eingesetzten Werte aber für HTML-Vorlagen. */
export function renderHtmlTemplate(template: string, values: TemplateValues): string {
	return renderTemplate(template, values, escapeHtml);
}
