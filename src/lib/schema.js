/**
 * JSON-LD schema builders.
 *
 * Each function returns a plain JSON-LD object suitable for passing into
 * useDocumentHead's `jsonLd` prop. Combine multiple by passing an array.
 */
import { ORG_INFO, SITE_URL, absoluteUrl } from '@/lib/seo';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_INFO.name,
    legalName: ORG_INFO.legalName,
    url: SITE_URL,
    logo: ORG_INFO.logo,
    image: ORG_INFO.logo,
    description: ORG_INFO.description,
    foundingDate: ORG_INFO.foundingDate,
    founder: { '@type': 'Person', name: ORG_INFO.founder },
    email: ORG_INFO.email,
    areaServed: ORG_INFO.areaServed.map((name) => ({ '@type': 'Place', name })),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Perth',
      addressRegion: 'WA',
      addressCountry: ORG_INFO.country,
    },
    sameAs: ORG_INFO.sameAs,
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#founder`,
    name: ORG_INFO.founder,
    jobTitle: 'Founder',
    worksFor: { '@id': `${SITE_URL}/#organization` },
    url: absoluteUrl('/About'),
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#localbusiness`,
    name: ORG_INFO.name,
    image: ORG_INFO.logo,
    url: SITE_URL,
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
    founder: { '@type': 'Person', name: ORG_INFO.founder },
    foundingDate: ORG_INFO.foundingDate,
    knowsAbout: [
      'Web design',
      'Web development',
      'AI automation',
      'Workflow automation',
      'SaaS development',
      'Branding',
      'SEO',
      'Photography',
      'Videography',
    ],
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web design and development' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'C4i: private and cloud AI systems, automations and agents' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'C4 Lens: photography, videography and brand identity' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'C4Sight: workplace AI training and workshops' } },
    ],
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

export function caseStudyArticleSchema(study, testimonial) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${study.name} — ${study.tags?.[0] || 'Case Study'} | C4 Studios`,
    description: study.oneLiner,
    image: study.cover ? absoluteUrl(study.cover) : undefined,
    author: { '@type': 'Organization', name: ORG_INFO.name, url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#localbusiness` },
    datePublished: study.year ? `${study.year}-01-01` : undefined,
    about: study.client,
    keywords: (study.tags || []).join(', '),
    mainEntityOfPage: absoluteUrl(`/CaseStudy/${study.slug}`),
  };

  // Attach the matching client testimonial as a Review of the delivered work.
  // No numeric ratingValue is invented — the testimonials are unqualified
  // praise but were never given as star ratings, so we publish the review body
  // and author only. (Star rich-result snippets come from Google Business
  // Profile reviews, not self-published testimonials.)
  if (testimonial?.quote) {
    schema.review = {
      '@type': 'Review',
      reviewBody: testimonial.quote,
      author: { '@type': 'Person', name: testimonial.name },
      itemReviewed: {
        '@type': 'CreativeWork',
        name: `${study.name} — website by C4 Studios`,
      },
    };
  }

  return schema;
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
