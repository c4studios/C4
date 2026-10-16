/**
 * SEO page registry — single source of truth for the programmatic SEO build.
 *
 * Imported by BOTH the React app (App.jsx routes, Footer links, SeoPage
 * resolver) and scripts/prerender.mjs (Node) — so it must stay plain ESM:
 * no JSX, no '@/' aliases, no browser APIs, no app imports.
 *
 * Each entry:
 *   slug         flat URL slug — page lives at `/${slug}`
 *   type         'pillar' | 'suburb' | 'industry' | 'comparison' | 'article'
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

/* ── Suburb-page services (web design and SEO only) ────────────────── */
// AI & Automation left on 9 Oct 2026 with C4i, which is C4Site's now. Its
// pillar (/ai-automation-perth) and its 12 suburb pages are no longer
// generated; public/_redirects sends all 13 old paths to C4Site's
// /ai-automation-perth/. Don't add the service back here.
const SUBURB_SERVICES = [
  { prefix: 'web-design',    label: 'Web Design',      pillar: 'web-design-perth',    serviceType: 'Web design' },
  { prefix: 'seo',           label: 'SEO',             pillar: 'seo-perth',           serviceType: 'Search engine optimisation' },
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
    description: 'Perth web development for online stores, web apps, portals and integrations. React and Next.js builds at a fixed price, from the studio behind Quotr.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-design-perth'],
      industries: ['ecommerce-for-retail-and-makers', 'websites-for-recruitment-agencies', 'websites-for-law-firms'],
      comparisons: ['wordpress-vs-nextjs', 'how-much-does-a-website-cost-perth', 'how-long-does-a-website-take'],
    },
  },
  {
    slug: 'seo-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'SEO Perth', serviceType: 'Search engine optimisation',
    title: 'SEO Perth — Search Optimisation Done Honestly | C4 Studios',
    description: 'SEO for Perth businesses without the lock-in: one-off fixes from $400 or monthly plans from $249. Plain-English reporting, no smoke and mirrors.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-design-perth', 'ai-search-optimisation-perth'],
      industries: ['websites-for-trades', 'websites-for-allied-health', 'websites-for-cafes'],
      comparisons: ['do-small-businesses-need-seo', 'how-much-does-a-website-cost-perth'],
    },
  },
  /* Re-angled 16 Oct 2026 to branding and brand identity (SEO audit H4,
     brain site_issues 167). On 9 Oct it had been retitled "Logo Design
     Perth" when Logo Design became the fourth arm with its own page at
     /logo-design, and that left the two pages chasing the same search.
     Search Console (web, 27 Aug to 13 Oct 2026, exported 16 Oct) settled
     which keeps what. This page had 466 impressions at an average position
     of 37.7, and /logo-design 15 at 60.3, though it only launched on 9 Oct.
     The export doesn't split searches by page, but the branding ones are
     the bigger set: "perth branding" (96), "branding perth" (84), "brand
     identity perth" (30) and "branding studio perth" (19), against "perth
     logo design" (29). So /logo-design owns "logo design Perth", and this
     page is about Brand Essentials and Full Brand Identity, with "logo
     design" linked to /logo-design. Same slug and prices; the page file's
     header lists what changed. */
  {
    slug: 'branding-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'Branding Perth', serviceType: 'Brand identity design',
    title: 'Branding Perth — Brand Identity Packages | C4 Studios',
    description: 'Branding and brand identity for Perth businesses: Brand Essentials at $1,200 and Full Brand Identity from $2,500. Fixed scope, and every file is yours.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['web-design-perth', 'photo-video-perth'],
      industries: ['websites-for-cafes', 'websites-for-gyms', 'ecommerce-for-retail-and-makers'],
      comparisons: ['diy-website-vs-hiring-a-designer', 'how-much-does-a-website-cost-perth'],
    },
  },
  /* Retitled 16 Oct 2026 as the plain buyer's page for "photographer" and
     "videographer Perth" searches (SEO audit H4). /Lens is the brand and the
     work, so this page leads with prices and what each shoot delivers.
     Search Console (web, 27 Aug to 13 Oct 2026): 261 impressions here at an
     average position of 39.1, and 54 for /Lens at 10.3 ("c4 lens" had 14;
     the export doesn't split searches by page). The generic searches were
     "360 videography perth" (30), "in-studio videography" (19),
     "videography perth" (11) and "product videographer in perth" (8).
     Nothing on file says C4 Lens shoots 360 video or works from a studio,
     so the page claims neither. */
  {
    slug: 'photo-video-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'Photo & Video Perth', serviceType: 'Commercial photography and videography',
    title: 'Photographer & Videographer Perth — Prices | C4 Studios',
    description: 'Commercial photographer and videographer in Perth: photos from $200, photo and video from $1,200. Each package says how many edited files you get.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['branding-perth', 'web-design-perth'],
      industries: ['websites-for-churches', 'websites-for-gyms', 'websites-for-cafes'],
      comparisons: [],
    },
  },
  {
    slug: 'ai-search-optimisation-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'AI Search Optimisation Perth', serviceType: 'AI search optimisation (GEO)',
    title: 'AI Search Optimisation Perth (GEO) | C4 Studios',
    description: 'Show up when Perth customers ask ChatGPT, Perplexity or Google AI who to hire. GEO and AI-search optimisation from the studio that ranks itself.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['seo-perth', 'web-design-perth'],
      industries: ['websites-for-trades', 'websites-for-law-firms', 'websites-for-allied-health'],
      comparisons: ['do-small-businesses-need-seo', 'how-much-does-a-website-cost-perth'],
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
    // Not "pastor": that's a title Caleb doesn't hold. He preaches occasionally,
    // as the page itself says (15 Oct 2026).
    description: 'Church and ministry websites by a founder who preaches occasionally: service times visitors find fast, sustainable sermon libraries, giving that works.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'photo-video-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-law-firms', type: 'industry', status: 'live', phase: 3,
    name: 'Websites for Law Firms',
    title: 'Websites for Law Firms Perth | C4 Studios',
    description: 'Law firm websites built by a UWA JD student: practice-area pages that answer real questions, and intake that filters matters before they reach a lawyer.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'websites-for-automotive', type: 'industry', status: 'live', phase: 4,
    name: 'Websites for Automotive & Motorsport',
    title: 'Websites for Automotive & Motorsport | C4 Studios',
    // 499 was the original Square migration (site_issues 115). The live DS
    // Racing shop (www.dsracingkarts.com.au/shop, public page) showed 8,330
    // products on 15 Oct 2026, and "over 8,000" stays true as it grows.
    // Check the live shop before raising it.
    description: 'Websites and stores for Perth workshops, parts suppliers and race teams — from the studio behind a karting parts store that lists over 8,000 products.',
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
    description: 'Recruitment websites that serve candidates and clients without compromise: a jobs board for one side, sector pages and a brief-us path for the other.',
    priority: 0.8, changefreq: 'monthly',
    links: { pillars: ['web-design-perth'], comparisons: ['how-much-does-a-website-cost-perth'] },
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

/* ── Comparisons (6) ───────────────────────────────────────────────── */
// Question-led pieces, live since 13 June 2026 (the date of the commits that
// put them live: 80d329b for the cost guide, df6914d for the rest). Until
// 15 Oct 2026 they rendered through the service-page shell and /insights
// listed only `type: 'article'`, so the index showed one piece while seven
// readable answers sat outside it. They're articles to a reader, so they now
// render through ArticleTemplate and appear on /insights (liveArticles below).
// The type stays 'comparison' so llms.txt keeps them under "Guides".
//
// Extra fields, as for articles: published / updated (ISO dates; `updated` is
// the last commit that changed the piece's words), readMinutes (words / 200,
// rounded up), dek (the /insights display line), photo (a key in
// src/content/seo/photos.js, the hero and the index image) and image (the
// share card, built from the photo by scripts/article-photos.mjs).
//
// Titles and deks rewritten 15 Oct 2026 (Caleb: "these titles need to be more
// 'clickable'"). Each <title> keeps the phrase people search; each dek states
// one thing the piece itself says. Don't put a claim in a dek that the piece
// can't back.
const COMPARISONS = [
  /* Rewritten 16 Oct 2026 to the article standard: every price re-read in
     src/data/pricing.js that day, and the market figures cut for want of a
     source (the content module's header lists both). The description and dek
     now say these are our prices, since the piece only quotes ours. If it
     ships later than 16 Oct, move `updated` and `verified` to that day. */
  {
    slug: 'how-much-does-a-website-cost-perth', type: 'comparison', status: 'live', phase: 2,
    name: 'How much does a website cost in Perth?',
    title: 'How Much Does a Website Cost in Perth? (2026) | C4 Studios',
    description: 'Our 2026 Perth website prices: landing pages are $500 and business sites $1,500 to $2,500, plus the add-ons and running costs that change the total.',
    dek: 'Every website package we sell, from $500 for a landing page, and why two quotes for the same site can look nothing alike.',
    photo: 'price-board',
    image: '/insights/how-much-does-a-website-cost-perth-og.jpg',
    published: '2026-06-13', updated: '2026-10-16', verified: '2026-10-16', readMinutes: 7,
    priority: 0.85, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'why-web-designers-hide-their-prices'] },
  },
  {
    slug: 'wix-squarespace-vs-custom-website', type: 'comparison', status: 'live', phase: 4,
    // Rewritten 16 Oct 2026 with Wix's and Squarespace's own prices, read
    // from Perth that day. The content module's header lists every source.
    name: 'Wix or Squarespace, or a custom-built website?',
    title: 'Wix or Squarespace vs Custom: the 5-Year Maths | C4 Studios',
    description: 'Five years of Wix and Squarespace at today’s Australian prices, set against a custom build: when a builder is the better buy, and when it isn’t.',
    dek: 'Five years of Wix or Squarespace on their cheapest paid plans costs less than our business website. Here’s when a builder stops being the better buy.',
    photo: 'estate',
    image: '/insights/wix-squarespace-vs-custom-website-og.jpg',
    published: '2026-06-13', updated: '2026-10-16', verified: '2026-10-16', readMinutes: 7,
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'diy-website-vs-hiring-a-designer', 'website-redesign-vs-starting-again'] },
  },
  /* Rewritten 16 Oct 2026 to the article standard, every figure read at
     WordPress.org, the Next.js docs or Vercel's docs that day (the content
     module's header lists them). The old description promised speed, security
     and upkeep-cost verdicts the piece no longer makes, so it changed with it.
     If it ships later than 16 Oct, move `updated` and `verified` to that day. */
  {
    slug: 'wordpress-vs-nextjs', type: 'comparison', status: 'live', phase: 4,
    name: 'WordPress or Next.js for a business website?',
    title: 'WordPress vs Next.js, From a Next.js Studio | C4 Studios',
    description: 'From a studio that builds in Next.js: when WordPress is the better choice for a business site, and why both need security updates.',
    dek: 'We build in Next.js and say so up front. Then we read both projects’ own documentation, and WordPress still wins for some sites.',
    photo: 'power-boards',
    image: '/insights/wordpress-vs-nextjs-og.jpg',
    published: '2026-06-13', updated: '2026-10-16', verified: '2026-10-16', readMinutes: 7,
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-development-perth', 'website-redesign-vs-starting-again'] },
  },
  {
    slug: 'diy-website-vs-hiring-a-designer', type: 'comparison', status: 'live', phase: 4,
    // Rewritten 16 Oct 2026. The June "40 to 60 hours" had no source and is
    // gone; the content module's header lists every source and what not to add.
    name: 'Build it yourself, or hire a web designer?',
    title: 'DIY Website vs a Web Designer: Count Your Hours | C4 Studios',
    description: 'Building your own website is cheaper in cash. Whether it’s cheaper overall depends on your hours, so here’s how to count them, plus a DIY checklist.',
    dek: 'Doing it yourself is cheaper in cash, and sometimes it’s the right call. Whether it’s cheaper overall comes down to hours only you can count.',
    photo: 'table-saw',
    image: '/insights/diy-website-vs-hiring-a-designer-og.jpg',
    published: '2026-06-13', updated: '2026-10-16', verified: '2026-10-16', readMinutes: 7,
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['wix-squarespace-vs-custom-website', 'web-design-perth', 'how-much-does-a-website-cost-perth'] },
  },
  {
    slug: 'how-long-does-a-website-take', type: 'comparison', status: 'live', phase: 4,
    name: 'How long does a website take to build?',
    title: 'How Long Does a Website Take to Build? | C4 Studios',
    description: 'Real timelines from a working studio: landing pages 1–2 weeks, business sites 3–5, stores 4–8. Where the time actually goes, and how to go faster.',
    dek: 'The build is the quick part. Content arriving and someone saying yes is what sets the calendar.',
    photo: 'calendar',
    image: '/insights/how-long-does-a-website-take-og.jpg',
    published: '2026-06-13', updated: '2026-06-13', readMinutes: 4,
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-design-perth'] },
  },
  {
    slug: 'do-small-businesses-need-seo', type: 'comparison', status: 'live', phase: 4,
    name: 'Do small businesses actually need SEO?',
    title: 'Do Small Businesses Need SEO? Not All of Them | C4 Studios',
    description: 'An honest answer from people who sell it: the last-ten-customers test, what to do free first, and when a retainer is just a donation.',
    dek: 'From a studio that sells SEO: not every business needs it. Count where your last ten customers came from first.',
    photo: 'dockets',
    image: '/insights/do-small-businesses-need-seo-og.jpg',
    published: '2026-06-13', updated: '2026-10-08', readMinutes: 4,
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['seo-perth'] },
  },
];

/* ── Suburb pages (24 = 2 services × 12 suburbs), generated ────────── */
// Per-page overrides for the generated entries. Phases 5/6 flip a suburb
// page live by adding { status: 'live', title, description } under its slug
// — everything else (link graph, schema fields) stays generated. The twelve
// ai-automation-* overrides came out with the service on 9 Oct 2026.
const SUBURB_PAGE_META = {
  /* ── Phase 5 — batch 1 (top 6 suburbs × 2 services) ── */
  'web-design-perth-cbd': {
    status: 'live',
    title: 'Web Design Perth CBD — City-Grade Websites | C4 Studios',
    description: 'Websites for Perth CBD firms and retailers that survive comparison with national competitors. Credibility-first design from $1,500, surcharge published.',
  },
  'seo-perth-cbd': {
    status: 'live',
    title: 'SEO Perth CBD — Winnable City Terms | C4 Studios',
    description: 'SEO for Perth CBD businesses: which competitive city terms are winnable, which are not worth the money, and where specificity beats agency budgets.',
  },
  'web-design-fremantle': {
    status: 'live',
    title: 'Web Design Fremantle — Local Websites | C4 Studios',
    description: 'Websites with Fremantle character intact — for makers, venues and creatives who would rather not look corporate. From $800; we have built for this town.',
  },
  'seo-fremantle': {
    status: 'live',
    title: 'SEO Fremantle — Visitors & Locals | C4 Studios',
    description: 'Fremantle SEO that works both markets: weekend visitors and local services. Honest packages from $400, no tourism premium.',
  },
  'web-design-joondalup': {
    status: 'live',
    title: 'Web Design Joondalup & the North | C4 Studios',
    description: 'Websites built for Joondalup corridor reality — catchment structure, booking-first design and AHPRA-aware practice sites. From $1,500.',
  },
  'seo-joondalup': {
    status: 'live',
    title: 'SEO Joondalup — Northern Corridor | C4 Studios',
    description: 'SEO for Joondalup and the northern corridor: map-pack wins, service-area coverage and honest advice on which suburbs are winnable.',
  },
  'web-design-osborne-park': {
    status: 'live',
    title: 'Web Design Osborne Park — Showrooms | C4 Studios',
    description: 'Websites for Osborne Park showrooms, wholesalers and trades: range online, quote flows and B2B credibility. From $1,500; catalogues from $3,500.',
  },
  'seo-osborne-park': {
    status: 'live',
    title: 'SEO Osborne Park — Category Pages | C4 Studios',
    description: 'SEO for the Osborne Park strip: category pages that fill carparks, B2B search capture and metro service-area coverage from a depot address.',
  },
  'web-design-subiaco': {
    status: 'live',
    title: 'Web Design Subiaco — Practices & Retail | C4 Studios',
    description: 'Restrained, credible websites for Subiaco specialists and Rokeby Road boutiques. Premium by discipline, from $1,500 — medical surcharge published.',
  },
  'seo-subiaco': {
    status: 'live',
    title: 'SEO Subiaco — Patients & Referrers | C4 Studios',
    description: 'SEO for the Subiaco double audience — patients and referrers — done inside AHPRA rules, plus Rokeby Road retail visibility. From $400.',
  },
  'web-design-victoria-park': {
    status: 'live',
    title: 'Web Design Victoria Park — Venues | C4 Studios',
    description: 'Websites for the Albany Highway venues and the motor mile: menu-first, mobile-fast, multilingual where it counts. Venue sites from $800.',
  },
  'seo-victoria-park': {
    status: 'live',
    title: 'SEO Victoria Park — Albany Hwy Strip | C4 Studios',
    description: 'SEO for the Vic Park strip: cuisine-specific searches, review velocity and the map-pack tiebreakers when competitors are metres apart.',
  },

  /* ── Phase 6 — batch 2 (remaining 6 suburbs × 2 services) ── */
  'web-design-claremont': {
    status: 'live',
    title: 'Web Design Claremont — Rebuilt Properly | C4 Studios',
    description: 'Websites for Claremont and western-suburbs businesses whose reputations outgrew their sites. Rebuilds that keep your domain equity, from $1,500.',
  },
  'seo-claremont': {
    status: 'live',
    title: 'SEO Claremont — Old Domains, New Wins | C4 Studios',
    description: 'Established Claremont businesses sit on aged-domain authority they have never used. We clear the technical dust and let it rank. From $400.',
  },
  'web-design-scarborough': {
    status: 'live',
    title: 'Web Design Scarborough — Beach Economy | C4 Studios',
    description: 'Visual-first websites for foreshore venues and the fitness cluster — imagery-led, mobile-fast, built around the beach year. From $800.',
  },
  'seo-scarborough': {
    status: 'live',
    title: 'SEO Scarborough — The Season Curve | C4 Studios',
    description: 'Seasonal SEO done on a calendar: build winter, win summer. Surge pages, locals-base terms and the January fitness machine. From $400.',
  },
  'web-design-canning-vale': {
    status: 'live',
    title: 'Web Design Canning Vale — B2B & Industrial | C4 Studios',
    description: 'Capability-statement websites for the estate: tender-ready credibility, compliance up front, trade account pathways. From $1,500.',
  },
  'seo-canning-vale': {
    status: 'live',
    title: 'SEO Canning Vale — Supplier Searches | C4 Studios',
    description: 'B2B SEO for the industrial estate: capability terms procurement actually types, supplier-diligence pages and problem-search capture. From $400.',
  },
  'web-design-midland': {
    status: 'live',
    title: 'Web Design Midland — The Eastern Gateway | C4 Studios',
    description: 'Websites for the gateway: trip-insurance answers for hills and valley customers, booked-ahead workshops, trades toolkit. From $1,500.',
  },
  'seo-midland': {
    status: 'live',
    title: 'SEO Midland — Metro Plus Regional | C4 Studios',
    description: 'Midland gets searched from two directions. We build for both: local map-pack work plus the hills-and-valley catchment competitors ignore. From $400.',
  },
  'web-design-rockingham': {
    status: 'live',
    title: 'Web Design Rockingham — New Residents | C4 Studios',
    description: 'In a growth corridor the website is the referral: newcomer-first answers, corridor coverage and booking that closes. From $1,500.',
  },
  'seo-rockingham': {
    status: 'live',
    title: 'SEO Rockingham — Win the Waves | C4 Studios',
    description: 'Posting seasons and estate settlements deliver households choosing every provider at once. Be ranked and review-rich when they land. From $400.',
  },
  'web-design-mandurah': {
    status: 'live',
    title: 'Web Design Mandurah — Peel Capital | C4 Studios',
    description: 'Websites that let Mandurah businesses beat the drive-to-Perth alternative: local legibility, honest readability, Peel-wide structure. From $1,500.',
  },
  'seo-mandurah': {
    status: 'live',
    title: 'SEO Mandurah — Own the Peel | C4 Studios',
    description: 'Google treats the Peel as its own market — thinner competition, same prize. Regional SEO fundamentals that win front pages. From $400.',
  },
};

const SUBURB_PAGES = SUBURB_SERVICES.flatMap((service) =>
  SUBURBS.map((suburb) => {
    const slug = `${service.prefix}-${suburb.key}`;
    return {
      slug,
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
      ...(SUBURB_PAGE_META[slug] || {}),
    };
  })
);

/* ── Articles ──────────────────────────────────────────────────────── */
// Editorial pages. Deliberately the same FLAT slug shape as every other
// programmatic page, so they inherit routing, prerender, sitemap coverage
// and code-splitting for free. A nested /insights/<slug> form would need
// the content-module glob in SeoPage.jsx made recursive, and any route
// without a matching static file falls through the `_redirects` catch-all
// and serves crawlers the homepage — the exact failure that made 32 detail
// pages declare themselves duplicates of the front page. Index lives at
// /insights and links out to these; the articles themselves sit at root.
//
// Extra fields beyond the standard entry:
//   published / updated  ISO dates, required for Article JSON-LD
//   readMinutes          shown on the index card (words / 200, rounded up)
//   dek                  the line /insights sets large: one thing the piece
//                        says, worded to make someone want to read it
//   photo                key in src/content/seo/photos.js: the hero on the
//                        article and its image on /insights
//   image                the share card (og:image), cut from the photo with
//                        the title set in HTML by scripts/article-photos.mjs
//   verified             ISO date every figure was last re-read at its source;
//                        only set when that actually happened
//
// A new piece goes out every second week from 15 Oct 2026 (Caleb, that day:
// "id say a NEW ARTICLE ONCE A FORTNIGHT").
//
// The six live AI articles moved to c4site.com.au on 9 Oct 2026, keeping
// their slugs under /articles/. Their entries came out of this list, and that
// alone takes them out of the routes, the prerender, the sitemap, llms.txt and
// the /insights index. public/_redirects sends each old address to its new
// page. A clean-up the same day deleted their content modules, along with the
// eleven AI drafts that were in this list. Ten of those drafts had bodies, and
// each one is in c4site-website/src/content/articles/ under the same slug.
// SeoPage.jsx lazy-loads every file in pages/, so a module there ships as a
// public chunk whether or not its entry is live.
const ARTICLES = [
  /* Written 16 Oct 2026, the second fortnightly piece and a new address: Caleb
     ruled that day that a rewrite at an old address doesn't count as the
     fortnight's new piece. Every quote was re-read at Google's and the ACCC's
     pages that day; the content module's header lists them and what must not
     be added. If it ships later than 16 Oct, move `published`, `updated` and
     `verified` to the day it goes live. readMinutes is the reading text (hero,
     sections bar the source list, FAQs and CTA) over 200, rounded up. */
  {
    slug: 'google-business-profile-rules', type: 'article', status: 'live', phase: 7,
    name: 'What should go in your Google Business Profile?',
    title: 'Google Business Profile: Leave the Keywords Out | C4 Studios',
    description: 'The rules for a Google Business Profile, quoted from Google. Why keywords in the name can get it suspended, and when to hide your home address.',
    dek: 'Add your suburb or trade to the name on your Business Profile and Google says it could be suspended. The rest of its rules are just as specific.',
    photo: 'groceries-sign',
    image: '/insights/google-business-profile-rules-og.jpg',
    published: '2026-10-16', updated: '2026-10-16', verified: '2026-10-16', readMinutes: 10,
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['seo-perth', 'do-small-businesses-need-seo', 'diy-website-vs-hiring-a-designer'] },
  },
  /* Written 15 Oct 2026 at the address of the June decision page it replaces,
     so the URL keeps whatever it had earned. Every figure was re-read at its
     source that day; the content module's header lists them and what must
     not be added. If it ships later than 15 Oct, move `published`, `updated`
     and `verified` to the day it goes live. */
  {
    slug: 'website-redesign-vs-starting-again', type: 'article', status: 'live', phase: 7,
    name: 'Website redesign or start again?',
    title: 'Website Redesign or Start Again? How to Decide | C4 Studios',
    description: 'Redesign or rebuild your website? The two checks that decide it, and what Google’s own guide says happens to your rankings when your addresses change.',
    dek: 'A rebuild can keep your Google rankings. Google’s own guide says the old addresses should redirect for at least a year.',
    photo: 'demolition',
    image: '/insights/website-redesign-vs-starting-again-og.jpg',
    published: '2026-10-15', updated: '2026-10-15', verified: '2026-10-15', readMinutes: 8,
    priority: 0.7, changefreq: 'monthly',
    links: { pillars: ['web-design-perth', 'how-much-does-a-website-cost-perth', 'wordpress-vs-nextjs'] },
  },
  {
    slug: 'why-web-designers-hide-their-prices', type: 'article', status: 'live', phase: 7,
    name: 'Why do web designers hide their prices?',
    title: 'Why Web Designers Hide Their Prices (We Don’t) | C4 Studios',
    description: 'The three real reasons agencies quote on request, what "it depends" is actually protecting, and how to compare quotes when one is hiding the number.',
    dek: 'The reasons studios keep their prices off the site, named from inside the industry. Then every one of ours, in full.',
    photo: 'tags',
    image: '/insights/why-web-designers-hide-their-prices-og.jpg',
    published: '2026-08-03', updated: '2026-08-03', readMinutes: 6,
    priority: 0.65, changefreq: 'yearly',
    links: { pillars: ['how-much-does-a-website-cost-perth', 'web-design-perth', 'diy-website-vs-hiring-a-designer'] },
  },
];

/* ── Combined registry ─────────────────────────────────────────────── */
export const SEO_PAGES = [...PILLARS, ...INDUSTRIES, ...COMPARISONS, ...SUBURB_PAGES, ...ARTICLES];

export function liveSeoPages() {
  return SEO_PAGES.filter((p) => p.status === 'live');
}

/** The types a reader would call an article. Both render through
 *  ArticleTemplate, carry Article JSON-LD and are listed on /insights. */
export const ARTICLE_TYPES = ['article', 'comparison'];

export function isArticleLike(entry) {
  return Boolean(entry) && ARTICLE_TYPES.includes(entry.type);
}

/** Live articles, newest first — drives the /insights index. Pieces published
 *  the same day keep their order in this file. */
export function liveArticles() {
  return SEO_PAGES
    .filter((p) => isArticleLike(p) && p.status === 'live')
    .map((p, i) => [p, i])
    .sort(([a, ai], [b, bi]) => (b.published || '').localeCompare(a.published || '') || ai - bi)
    .map(([p]) => p);
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
  // Article JSON-LD needs real dates; a live article without them would ship
  // structured data Google rejects, so fail the build instead.
  if (isArticleLike(entry)) {
    if (!entry.published) problems.push('missing published date');
    if (!entry.dek) problems.push('missing dek');
    if (entry.image && !/^\/insights\/[\w-]+-og\.jpg$/.test(entry.image)) problems.push('image is not /insights/<slug>-og.jpg');
    for (const field of ['published', 'updated', 'verified']) {
      if (entry[field] && !/^\d{4}-\d{2}-\d{2}$/.test(entry[field])) {
        problems.push(`${field} is not an ISO date (YYYY-MM-DD)`);
      }
    }
  }
  return problems;
}
