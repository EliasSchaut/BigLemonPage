import type { RequestHandler } from './$types';

const PAGES = [{ path: '/', changefreq: 'weekly', priority: '1.0' }];

export const GET: RequestHandler = ({ url }) => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
	(page) => `	<url>
		<loc>${new URL(page.path, url.origin).href}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`
).join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
