import type { RequestHandler } from './$types';

// Als Route statt statischer Datei, weil die Sitemap-Zeile eine absolute URL
// braucht — die Domain steht erst zur Laufzeit fest.
export const GET: RequestHandler = ({ url }) => {
	const body = `User-agent: *
Allow: /
Disallow: /cms/admin

Sitemap: ${new URL('/sitemap.xml', url.origin).href}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=3600' }
	});
};
