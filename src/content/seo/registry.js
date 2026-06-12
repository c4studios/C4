/**
 * SEO page registry — single source of truth for the programmatic SEO build.
 *
 * Imported by BOTH the React app (App.jsx routes, Footer links, SeoPage
 * resolver) and scripts/prerender.mjs (Node) — so it must stay plain ESM:
 * no JSX, no '@/' aliases, no browser APIs, no app imports.
 *
 * Each entry:
 *   slug         flat URL slug — page lives at `/${slug}`
 *   type         'pillar' | 'suburb' | 'industry' | 'comparison'
 *   status       'draft' | 'live' — only live entries get a route, prerender
 *                and sitemap coverage. Flip to live when the content module
 *                at src/content/seo/pages/<slug>.js ships.
 *   phase        build phase that ships this page (2–6), for planning only
 *   name         link/breadcrumb label
 *   title        <title> (≤60 chars) — required before going live
 *   description  meta description (≤155 chars) — required before going live
 *   links        internal-link graph (slugs); templates only render targets
 *                that are live, so links "light up" as later phases ship
 */

/* ── Suburbs ───────────────────────────────────────────────────────── */
// shortName for sideways "nearby areas" links; neighbours chosen for real
// geographic adjacency; industries reflect each area's business character.
const SUBURBS = [
  { key: 'perth-cbd',     shortName: 'Perth CBD',     batchPhase: 5, neighbours: ['subiaco', 'victoria-park', 'osborne-park'], industries: ['websites-for-law-firms', 'websites-for-recruitment-agencies'] },
  { key: 'fremantle',     shortName: 'Fremantle',     batchPhase: 5, neighbours: ['claremont', 'rockingham', 'perth-cbd'],     industries: ['websites-for-cafes', 'ecommerce-for-retail-and-makers'] },
  { key: 'subiaco',       shortName: 'Subiaco',       batchPhase: 5, neighbours: ['perth-cbd', 'claremont', 'osborne-park'],   industries: ['websites-for-allied-health', 'websites-for-law-firms'] },
  { key: 'joondalup',     shortName: 'Joondalup',     batchPhase: 5, neighbours: ['osborne-park', 'scarborough'],              industries: ['websites-for-allied-health', 'websites-for-gyms'] },
  { key: 'osborne-park',  shortName: 'Osborne Park',  batchPhase: 5, neighbours: ['scarborough', 'joondalup', 'perth-cbd'],    industries: ['websites-for-trades', 'websites-for-automotive'] },
  { key: 'victoria-park', shortName: 'Victoria Park', batchPhase: 5, neighbours: ['perth-cbd', 'canning-vale', 'midland'],     industries: ['websites-for-automotive', 'websites-for-cafes'] },
  { key: 'claremont',     shortName: 'Claremont',     batchPhase: 6, neighbours: ['subiaco', 'fremantle', 'scarborough'],      industries: ['ecommerce-for-retail-and-makers', 'websites-for-allied-health'] },
  { key: 'scarborough',   shortName: 'Scarborough',   batchPhase: 6, neighbours: ['osborne-park', 'claremont', 'joondalup'],   industries: ['websites-for-gyms', 'websites-for-cafes'] },
  { key: 'canning-vale',  shortName: 'Canning Vale',  batchPhase: 6, neighbours: ['victoria-park', 'rockingham', 'midland'],   industries: ['websites-for-trades', 'ecommerce-for-retail-and-makers'] },
  { key: 'midland',       shortName: 'Midland',       batchPhase: 6, neighbours: ['perth-cbd', 'victoria-park', 'canning-vale'], industries: ['websites-for-trades', 'websites-for-automotive'] },
  { key: 'rockingham',    shortName: 'Rockingham',    batchPhase: 6, neighbours: ['mandurah', 'fremantle', 'canning-vale'],    industries: ['websites-for-trades', 'websites-for-gyms'] },
  { key: 'mandurah',      shortName: 'Mandurah',      batchPhase: 6, neighbours: ['rockingham', 'fremantle'],                  industries: ['websites-for-cafes', 'websites-for-trades'] },
];

/* ── Suburb-page services (web design, SEO, AI & automation only) ──── */
const SUBURB_SERVICES = [
  { prefix: 'web-design',    label: 'Web Design',      pillar: 'web-design-perth',    serviceType: 'Web design' },
  { prefix: 'seo',           label: 'SEO',             pillar: 'seo-perth',           serviceType: 'Search engine optimisation' },
  { prefix: 'ai-automation', label: 'AI & Automation', pillar: 'ai-automation-perth', serviceType: 'AI and workflow automation' },
];

/* ── Pillars (6) ───────────────────────────────────────────────────── */
const PILLARS = [
  {
    slug: 'web-design-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'Web Design Perth', serviceType: 'Web design',
    title: 'Web Design Perth — Custom Websites | C4 Studios',
    description: 'Custom-coded websites for Perth businesses from a founder-led studio. Business sites from $1,500 with fixed quotes, real timelines and no templates.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-development-perth', 'seo-perth', 'branding-perth'],
      industries: ['websites-for-gyms', 'websites-for-churches', 'websites-for-law-firms', 'websites-for-trades', 'websites-for-cafes'],
      comparisons: ['how-much-does-a-website-cost-perth', 'wix-squarespace-vs-custom-website', 'diy-website-vs-hiring-a-designer', 'website-redesign-vs-starting-again', 'how-long-does-a-website-take'],
    },
  },
  {
    slug: 'web-development-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'Web Development Perth', serviceType: 'Web development',
    title: 'Web Development Perth — Apps & Ecommerce | C4 Studios',
    description: 'Perth web development for online stores, web apps, portals and integrations. React and Next.js builds from a studio that ships its own software.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-design-perth', 'ai-automation-perth'],
      industries: ['ecommerce-for-retail-and-makers', 'websites-for-recruitment-agencies', 'websites-for-law-firms'],
      comparisons: ['wordpress-vs-nextjs', 'how-much-does-a-website-cost-perth', 'how-long-does-a-website-take'],
    },
  },
  {
    slug: 'seo-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'SEO Perth', serviceType: 'Search engine optimisation',
    title: 'SEO Perth — Search Optimisation Done Honestly | C4 Studios',
    description: 'SEO for Perth businesses without the lock-in: one-off fixes from $400 or monthly growth plans from $500. Plain-English reporting, no smoke and mirrors.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-design-perth'],
      industries: ['websites-for-trades', 'websites-for-allied-health', 'websites-for-cafes'],
      comparisons: ['do-small-businesses-need-seo', 'how-much-does-a-website-cost-perth'],
    },
  },
  {
    slug: 'ai-automation-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'AI & Automation Perth', serviceType: 'AI and workflow automation',
    title: 'AI & Automation Perth for Business | C4 Studios',
    description: 'Practical AI and workflow automation for Perth businesses — single workflows from $750 to custom AI agents, built by a studio that runs its own.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-development-perth', 'seo-perth'],
      industries: ['websites-for-recruitment-agencies', 'websites-for-law-firms', 'websites-for-trades'],
      comparisons: ['how-much-does-a-website-cost-perth'],
    },
  },
  {
    slug: 'branding-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'Branding Perth', serviceType: 'Brand identity design',
    title: 'Branding Perth — Logos to Full Identity | C4 Studios',
    description: 'Brand design in Perth priced honestly: logos from $250, brand essentials at $1,200, full identity systems from $2,500. Fixed scope, files you own.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-design-perth', 'photo-video-perth'],
      industries: ['websites-for-cafes', 'websites-for-gyms', 'ecommerce-for-retail-and-makers'],
      comparisons: ['diy-website-vs-hiring-a-designer', 'how-much-does-a-website-cost-perth'],
    },
  },
  {
    slug: 'photo-video-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'Photo & Video Perth', serviceType: 'Commercial photography and videography',
    title: 'Photo & Video Perth — C4 Lens | C4 Studios',
    description: 'Commercial photography and videography in Perth: headshots, brand shoots, drone and short-form content with exact deliverables, from $200.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['branding-perth', 'web-design-perth'],
      industries: ['websites-for-churches', 'websites-for-gyms', 'websites-for-cafes'],
      comparisons: [],
    },
  },
];

/* ── Industries (9) ────────────────────────────────────────────────── */
const INDUSTRIES = [
  {
    slug: 'websites-for-gyms', type: 'industry', status: 'live', phase: 3,
    name: 'Websites for Gyms & Fitness Studios',
    title: 'Websites for Gyms & Fitness Studios Perth | C4 Studios',
    description: 'Gym websites that fill classes: phone-first timetables, open membership pricing and booking wired in. Built in Perth, with real fitness builds behind it.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'photo-video-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-churches', type: 'industry', status: 'live', phase: 3,
    name: 'Websites for Churches & Ministries',
    title: 'Church Websites & Media Systems Perth | C4 Studios',
    description: 'Websites for churches and ministries by an occasional pastor: service times visitors find fast, sustainable sermon libraries, giving that works.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'photo-video-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-law-firms', type: 'industry', status: 'live', phase: 3,
    name: 'Websites for Law Firms',
    title: 'Websites for Law Firms Perth | C4 Studios',
    description: 'Law firm websites built by a UWA JD student: practice-area pages that answer real questions, intake that filters, and automation for routine work.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'ai-automation-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-automotive', type: 'industry', status: 'live', phase: 4,
    name: 'Websites for Automotive & Motorsport',
    title: 'Websites for Automotive & Motorsport | C4 Studios',
    description: 'Websites and stores for Perth workshops, parts suppliers and race teams — from the studio behind a 499-part karting store with Square integration.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'web-development-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-trades', type: 'industry', status: 'live', phase: 4,
    name: 'Websites for Trades & Construction',
    title: 'Websites for Trades & Construction Perth | C4 Studios',
    description: 'Trade websites that win jobs: photo quote forms, job galleries, licence details up front and local SEO built in. From $1,500, live inside a month.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'seo-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-recruitment-agencies', type: 'industry', status: 'live', phase: 4,
    name: 'Websites for Recruitment Agencies',
    title: 'Websites for Recruitment Agencies | C4 Studios',
    description: 'Recruitment websites that serve candidates and clients without compromise — jobs boards, sector pages, brief-us paths, plus automation and outbound.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'ai-automation-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-cafes', type: 'industry', status: 'live', phase: 4,
    name: 'Websites for Cafes & Hospitality',
    title: 'Websites for Cafes & Hospitality Perth | C4 Studios',
    description: 'Hospitality websites for the hungry-and-deciding: structured menus instead of PDFs, hours synced with Google, bookings wired in. From $800.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'branding-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-allied-health', type: 'industry', status: 'live', phase: 4,
    name: 'Websites for Allied Health & Medical',
    title: 'Websites for Allied Health & Medical | C4 Studios',
    description: 'Practice websites that put patients at ease: booking integration, clear fees and AHPRA-aware wording. Built in Perth, surcharge published up front.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'seo-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'ecommerce-for-retail-and-makers', type: 'industry', status: 'live', phase: 4,
    name: 'E-commerce for Retail & Makers',
    title: 'Ecommerce for Retail & Makers Perth | C4 Studios',
    description: 'Online stores for makers and retailers from $3,500 — variants, personalisation, shipping rules and Square sync, with the product-data truth told early.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-development-perth', 'web-design-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
];

/* ── Comparisons (7) ───────────────────────────────────────────────── */
const COMPARISONS = [
  {
    slug: 'how-much-does-a-website-cost-perth', type: 'comparison', status: 'live', phase: 2,
    name: 'How Much Does a Website Cost in Perth?',
    title: 'How Much Does a Website Cost in Perth? (2026) | C4 Studios',
    description: 'Perth website costs in 2026: landing pages from $500, business sites $1,500–$2,500, ecommerce from $3,500. What moves the price and what to avoid.',
    priority: 0.85, changefreq: 'monthly',
    links: { pillars: ['web-design-perth'] },
  },
  {
    slug: 'wix-squarespace-vs-custom-website', type: 'comparison', status: 'live', phase: 4,
    name: 'Wix or Squarespace vs a Custom-Built Website',
    title: 'Wix or Squarespace vs Custom Website | C4 Studios',
    description: 'The honest comparison: when a site builder is genuinely fine, when custom wins, and the five-year subscription maths nobody shows you.',
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-design-perth'] },
  },
  {
    slug: 'wordpress-vs-nextjs', type: 'comparison', status: 'live', phase: 4,
    name: 'WordPress vs Next.js for Business Websites',
    title: 'WordPress vs Next.js for Business Sites | C4 Studios',
    description: 'Declared bias, honest answer: where WordPress still earns its keep, where Next.js wins on speed and security, and what upkeep really costs.',
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-development-perth'] },
  },
  {
    slug: 'website-redesign-vs-starting-again', type: 'comparison', status: 'live', phase: 4,
    name: 'Website Redesign vs Starting Again',
    title: 'Website Redesign vs Starting Again | C4 Studios',
    description: 'Renovate or rebuild? The checklist we use to decide, the redirect map that protects your rankings, and when sunk cost is the real enemy.',
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-design-perth'] },
  },
  {
    slug: 'diy-website-vs-hiring-a-designer', type: 'comparison', status: 'live', phase: 4,
    name: 'DIY Website vs Hiring a Web Designer',
    title: 'DIY Website vs Hiring a Web Designer | C4 Studios',
    description: 'The honest maths on building it yourself — 40 to 60 hours at your hourly rate — plus a free checklist for doing DIY properly if that is your road.',
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'branding-perth'] },
  },
  {
    slug: 'how-long-does-a-website-take', type: 'comparison', status: 'live', phase: 4,
    name: 'How Long Does a Website Take to Build?',
    title: 'How Long Does a Website Take to Build? | C4 Studios',
    description: 'Real timelines from a working studio: landing pages 1–2 weeks, business sites 3–5, stores 4–8. Where the time actually goes, and how to go faster.',
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-design-perth'] },
  },
  {
    slug: 'do-small-businesses-need-seo', type: 'comparison', status: 'live', phase: 4,
    name: 'Do Small Businesses Actually Need SEO?',
    title: 'Do Small Businesses Actually Need SEO? | C4 Studios',
    description: 'An honest answer from people who sell it: the last-ten-customers test, what to do free first, and when a retainer is just a donation.',
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['seo-perth'] },
  },
];

/* ── Suburb pages (36 = 3 services × 12 suburbs), generated ────────── */
const SUBURB_PAGES = SUBURB_SERVICES.flatMap((service) =>
  SUBURBS.map((suburb) => ({
    slug: `${service.prefix}-${suburb.key}`,
    type: 'suburb', status: 'draft', phase: suburb.batchPhase,
    name: `${service.label} ${suburb.shortName}`,
    shortName: suburb.shortName,
    service: service.prefix,
    serviceLabel: service.label,
    serviceType: service.serviceType,
    pillar: service.pillar,
    title: null, description: null,
    priority: 0.65, changefreq: 'monthly',
    links: {
      // sideways links go to the SAME service in neighbouring suburbs
      neighbours: suburb.neighbours.map((n) => `${service.prefix}-${n}`),
      industries: suburb.industries,
    },
  }))
);

/* ── Combined registry ─────────────────────────────────────────────── */
export const SEO_PAGES = [...PILLARS, ...INDUSTRIES, ...COMPARISONS, ...SUBURB_PAGES];

export function liveSeoPages() {
  return SEO_PAGES.filter((p) => p.status === 'live');
}

export function seoPageBySlug(slug) {
  return SEO_PAGES.find((p) => p.slug === slug) || null;
}

/** Suburb children of a pillar (for pillar → suburb link hubs). */
export function suburbChildrenOf(pillarSlug) {
  return SEO_PAGES.filter((p) => p.type === 'suburb' && p.pillar === pillarSlug);
}

/** Resolve a list of slugs to live entries only — dead links never render. */
export function resolveLiveSlugs(slugs) {
  return (slugs || [])
    .map((slug) => seoPageBySlug(slug))
    .filter((p) => p && p.status === 'live');
}

/**
 * Validation used by scripts/prerender.mjs — a live entry without real
 * metadata is a build error, not a warning, so half-finished pages can
 * never ship silently.
 */
export function validateSeoEntry(entry) {
  const problems = [];
  if (entry.status !== 'live') return problems;
  if (!entry.title) problems.push('missing title');
  if (!entry.description) problems.push('missing description');
  if (entry.title && entry.title.length > 60) problems.push(`title is ${entry.title.length} chars (max 60)`);
  if (entry.description && entry.description.length > 155) problems.push(`description is ${entry.description.length} chars (max 155)`);
  return problems;
}
