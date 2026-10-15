/**
 * JSON-LD schema builders.
 *
 * Each function returns a plain JSON-LD object suitable for passing into
 * useDocumentHead's `jsonLd` prop. Combine multiple by passing an array.
 */
import { ORG_INFO, PROFILES, SITE_URL, absoluteUrl } from '@/lib/seo';

/* The two entities every page's markup points back to. Each names the other
   by @id, and an @id only resolves against a node on the same page, so a page
   that references either one ships both: use entitySchemas(). A dangling @id
   is dropped, and the author or publisher it named goes with it. */
export const BUSINESS_ID = `${SITE_URL}/#localbusiness`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

/* One node for the business (SEO audit M2, 15 Oct 2026). It used to be two,
   an Organization (#organization) and a ProfessionalService (#localbusiness)
   with no link between them, so Google's Rich Results Test listed two separate
   "C4 Studios". ProfessionalService is deprecated in schema.org, and
   LocalBusiness is an Organization, so this one node carries what both said.
   No legalName: C4 Studios is a registered business name, and the legal
   entity behind it is a sole trader. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: ORG_INFO.name,
    url: SITE_URL,
    logo: ORG_INFO.logo,
    image: ORG_INFO.logo,
    description: ORG_INFO.description,
    email: ORG_INFO.email,
    telephone: ORG_INFO.telephone,
    sameAs: ORG_INFO.sameAs,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Perth',
      addressRegion: 'WA',
      addressCountry: ORG_INFO.country,
    },
    areaServed: ORG_INFO.areaServed.map((name) => ({ '@type': 'Place', name })),
    founder: { '@id': FOUNDER_ID },
    foundingDate: ORG_INFO.foundingDate,
    // AI and workflow automation went to C4Site with C4i on 9 Oct 2026. Logo
    // design came in the same day as the fourth arm, and brand identity moved
    // to it from C4 Lens.
    knowsAbout: [
      'Web design',
      'Web development',
      'SaaS development',
      'Logo design',
      'Branding',
      'SEO',
      'Photography',
      'Videography',
    ],
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web design and development' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'C4 Lens: photography and videography' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO and copywriting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Logo design: logos, brand essentials and full brand identities' } },
    ],
  };
}

/* The founder. The headshot is the one /About shows, captioned with his
   name, and the personal LinkedIn is his profile, not the business's, so it
   anchors this node rather than the business sameAs. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: ORG_INFO.founder,
    jobTitle: 'Founder',
    image: absoluteUrl('/founder-headshot.png'),
    url: absoluteUrl('/About'),
    worksFor: { '@id': BUSINESS_ID },
    sameAs: [PROFILES.linkedinPersonal],
  };
}

/** The business and its founder together. Spread it into any page's jsonLd
 *  whose blocks point at either @id. */
export function entitySchemas() {
  return [localBusinessSchema(), personSchema()];
}

/* /About is the page that identifies the founder: the Person's url, and so
   the author link behind every article and case study. */
export function profilePageSchema(path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl(path),
    mainEntity: { '@id': FOUNDER_ID },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_INFO.name,
    publisher: { '@id': `${SITE_URL}/#localbusiness` },
    inLanguage: 'en-AU',
  };
}

export function serviceSchema({ name, description, url, serviceType, areaServed, offers }) {
  const out = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(url),
    serviceType,
    provider: { '@id': `${SITE_URL}/#localbusiness` },
    areaServed: (areaServed || ORG_INFO.areaServed).map((p) => ({ '@type': 'Place', name: p })),
  };
  if (offers && offers.length) {
    out.offers = offers.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: o.price,
      priceCurrency: o.currency || 'AUD',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(o.url || url),
    }));
  }
  return out;
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** A case study's first capture of the site: the first desktop screenshot,
 *  which for most studies is the home page hero. */
export function caseStudyCapture(study) {
  return study?.desktopScreenshots?.[0]?.url || study?.screenshots?.[0]?.url || study?.thumbnail || null;
}

/* The case-study write-up, by the founder, published by the business. Ship
   entitySchemas() beside it so both @ids resolve.

   The image is the first capture rather than the cover, because every study
   has captures and ten have no cover.

   No datePublished. caseStudyData.jsx holds no publication date for any study,
   and the two exact dates it does hold are build windows (Sharp Bricklaying,
   As He Leads), not the day the write-up went up: As He Leads went live on
   4 Sep 2026 and its case study was added on 5 Oct. Add a real one per study,
   or none.

   No Review either (SEO audit L2, 15 Oct 2026). A testimonial about C4's own
   work, marked up on C4's own site, is a self-serving review to Google. The
   testimonial is still on the page, word for word; only the markup went. */
export function caseStudyArticleSchema(study) {
  const capture = caseStudyCapture(study);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${study.name}: ${study.tags?.[0] || 'case study'}`,
    description: study.oneLiner,
    image: capture ? absoluteUrl(capture) : undefined,
    author: { '@id': FOUNDER_ID },
    publisher: { '@id': BUSINESS_ID },
    about: study.client,
    keywords: (study.tags || []).join(', '),
    mainEntityOfPage: absoluteUrl(`/CaseStudy/${study.slug}`),
  };
}

/**
 * Editorial articles (the /insights set).
 *
 * `author` is the Person, not the Organization: these are opinion pieces
 * written by one identifiable human, and E-E-A-T rewards a named author with
 * a real profile over a faceless brand byline. `publisher` still points at the
 * LocalBusiness node so the entity graph stays joined up.
 *
 * No `image` is emitted unless the entry actually has one — a broken or
 * invented image URL is worse than the field being absent.
 */
export function articleSchema(entry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.name,
    description: entry.description,
    image: entry.image ? absoluteUrl(entry.image) : undefined,
    author: { '@id': `${SITE_URL}/#founder` },
    publisher: { '@id': `${SITE_URL}/#localbusiness` },
    datePublished: entry.published,
    dateModified: entry.updated || entry.published,
    inLanguage: 'en-AU',
    isAccessibleForFree: true,
    mainEntityOfPage: absoluteUrl(`/${entry.slug}`),
  };
}

export function videoObjectSchema({
  name,
  description,
  thumbnailUrl,
  contentUrl,
  uploadDate,
  duration,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: absoluteUrl(thumbnailUrl),
    contentUrl: absoluteUrl(contentUrl),
    uploadDate,
    duration,
    publisher: { '@id': `${SITE_URL}/#localbusiness` },
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
