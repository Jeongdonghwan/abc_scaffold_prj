import { SITE_URL, SITE_NAME, BRAND, LEGAL_NAME, CONTACT, BUSINESS, UPDATED } from './site';

// 업체 — 주소·영업시간은 확인 전이라 값이 있을 때만 넣는다(lib/site.ts TODO)
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  legalName: LEGAL_NAME,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/f02.jpg`,
  telephone: CONTACT.phone,
  ...(BUSINESS.address ? { address: { '@type': 'PostalAddress', addressCountry: 'KR', streetAddress: BUSINESS.address } } : {}),
  areaServed: ['서울특별시', '경기도 파주시', '경기도 김포시'],
  knowsAbout: ['비계', '강관비계', '시스템비계', '이지아이휀스', 'EGI휀스', '가설울타리', '방음벽'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? BRAND : it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.type,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  dateModified: UPDATED,
  areaServed: { '@type': 'Place', name: o.area },
  provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀 ItemList — 같은 도메인 절대 URL, path 는 인코딩된 경로
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name,
    ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}),
  })),
});
