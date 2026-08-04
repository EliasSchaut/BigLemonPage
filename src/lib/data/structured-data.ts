import { CONTACT, SITE } from './content';

export function localBusinessJsonLd(origin: string) {
	const url = (path: string) => new URL(path, origin).href;

	return {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': url('/#business'),
		name: CONTACT.company,
		alternateName: SITE.name,
		description: SITE.description,
		url: origin,
		image: url(SITE.ogImage),
		logo: url('/icon-512.png'),
		telephone: CONTACT.phoneHref.replace('tel:', ''),
		email: CONTACT.email,
		founder: { '@type': 'Person', name: CONTACT.owner },
		vatID: CONTACT.vatId,
		address: {
			'@type': 'PostalAddress',
			streetAddress: CONTACT.street,
			postalCode: CONTACT.city.split(' ')[0],
			addressLocality: CONTACT.city.split(' ').slice(1).join(' '),
			addressCountry: 'DE'
		},
		areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
		sameAs: [CONTACT.instagram, CONTACT.facebook],
		slogan: '„Lieber Natur Pur" — Cocktails, die begeistern.',
		priceRange: '$$',
		knowsLanguage: 'de'
	};
}
