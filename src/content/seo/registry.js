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
      pillars: ['web-design-perth', 'ai-search-optimisation-perth'],
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
      pillars: ['web-development-perth', 'seo-perth', 'ai-search-optimisation-perth'],
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
  {
    slug: 'ai-search-optimisation-perth', type: 'pillar', status: 'live', phase: 2,
    name: 'AI Search Optimisation Perth', serviceType: 'AI search optimisation (GEO)',
    title: 'AI Search Optimisation Perth (GEO) | C4 Studios',
    description: 'Show up when Perth customers ask ChatGPT, Perplexity or Google AI who to hire. GEO and AI-search optimisation from the studio that ranks itself.',
    priority: 0.9, changefreq: 'monthly',
    links: {
      pillars: ['seo-perth', 'web-design-perth', 'ai-automation-perth'],
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
// Per-page overrides for the generated entries. Phases 5/6 flip a suburb
// page live by adding { status: 'live', title, description } under its slug
// — everything else (link graph, schema fields) stays generated.
const SUBURB_PAGE_META = {
  /* ── Phase 5 — batch 1 (top 6 suburbs × 3 services) ── */
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
  'ai-automation-perth-cbd': {
    status: 'live',
    title: 'AI & Automation Perth CBD for Firms | C4 Studios',
    description: 'Automation for CBD firms: intake, document assembly and chasing that recover billable hours. Workflows from $750, confidentiality by design.',
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
  'ai-automation-fremantle': {
    status: 'live',
    title: 'AI & Automation Fremantle | C4 Studios',
    description: 'Automation for Freo independents: bookings, orders and invoice chasing handled quietly while the personal touch stays personal. Workflows from $750.',
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
  'ai-automation-joondalup': {
    status: 'live',
    title: 'AI & Automation Joondalup | C4 Studios',
    description: 'Automation for the Joondalup appointment economy — reminders that kill no-shows, recalls that refill calendars. Workflows from $750.',
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
  'ai-automation-osborne-park': {
    status: 'live',
    title: 'AI & Automation Osborne Park | C4 Studios',
    description: 'Automation for the working strip: quotes that follow themselves up, invoices that chase, account reorders on autopilot. From $750.',
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
  'ai-automation-subiaco': {
    status: 'live',
    title: 'AI & Automation Subiaco | C4 Studios',
    description: 'Discreet automation for specialist suites: referral intake, recalls and report chasing inside the systems you already trust. From $750.',
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
  'ai-automation-victoria-park': {
    status: 'live',
    title: 'AI & Automation Victoria Park | C4 Studios',
    description: 'Automation for the Vic Park speed economy — instant enquiry replies, booking reminders and dealer lead routing. Workflows from $750.',
  },

  /* ── Phase 6 — batch 2 (remaining 6 suburbs × 3 services) ── */
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
  'ai-automation-claremont': {
    status: 'live',
    title: 'AI & Automation Claremont | C4 Studios',
    description: 'Clienteling, automated: client-book follow-ups, appointment lifecycles and post-purchase care for relationship businesses. From $750.',
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
  'ai-automation-scarborough': {
    status: 'live',
    title: 'AI & Automation Scarborough | C4 Studios',
    description: 'Membership-lifecycle automation for the fitness cluster: intro follow-through, waitlists, pause-and-return flows, payment recovery. From $750.',
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
  'ai-automation-canning-vale': {
    status: 'live',
    title: 'AI & Automation Canning Vale | C4 Studios',
    description: 'Dispatch-chain automation for warehouses and distributors: order updates that send themselves, PO chasing, reorder prompts. From $750.',
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
  'ai-automation-midland': {
    status: 'live',
    title: 'AI & Automation Midland | C4 Studios',
    description: 'Distance-tolerant service for the gateway: photo-first quoting, ready-for-pickup notices and stock answers that save second trips. From $750.',
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
  'ai-automation-rockingham': {
    status: 'live',
    title: 'AI & Automation Rockingham | C4 Studios',
    description: 'Growth without headcount: instant enquiry handling, onboarding rails and booking lifecycles for corridor businesses scaling fast. From $750.',
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
  'ai-automation-mandurah': {
    status: 'live',
    title: 'AI & Automation Mandurah | C4 Studios',
    description: 'Automation behind the phone manner: after-the-call admin, trade waitlists and seasonal surge handling for Peel businesses. From $750.',
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
//   readMinutes          shown on the index card
//   dek                  one-line standfirst for the index card
const ARTICLES = [
  {
    slug: 'why-web-designers-hide-their-prices', type: 'article', status: 'live', phase: 7,
    name: 'Why Web Designers Hide Their Prices',
    title: 'Why Web Designers Hide Their Prices | C4 Studios',
    description: 'The three real reasons agencies quote on request, what "it depends" is actually protecting, and how to compare quotes when one is hiding the number.',
    dek: 'Naming the reasons from inside the industry, then publishing ours anyway.',
    image: '/insights/why-web-designers-hide-their-prices-og.jpg',
    published: '2026-08-03', updated: '2026-08-03', readMinutes: 6,
    priority: 0.65, changefreq: 'yearly',
    links: { pillars: ['how-much-does-a-website-cost-perth', 'web-design-perth', 'diy-website-vs-hiring-a-designer'] },
  },
  {
    slug: 'ai-detectors-dont-work', type: 'article', status: 'draft', phase: 7,
    name: 'AI Detectors Don’t Work',
    title: 'AI Detectors Don’t Work | C4 Studios',
    description: 'What independent testing found, who gets falsely flagged, the universities that switched detection off, and what schools should do instead.',
    dek: 'What we tell schools in paid sessions, published with the receipts.',
    published: '2026-08-03', updated: '2026-08-03', readMinutes: 8,
    priority: 0.65, changefreq: 'yearly',
    links: { pillars: ['ai-automation-perth'] },
  },
  {
    slug: 'private-ai-vs-chatgpt-subscriptions', type: 'article', status: 'draft', phase: 7,
    name: 'Private AI vs ChatGPT Subscriptions',
    title: 'Private AI vs ChatGPT Subscriptions | C4 Studios',
    description: 'The honest cost comparison: what a per-seat subscription stack really costs a small team, what on-premise costs, and where each one wins.',
    dek: 'The per-seat maths, run properly, including where subscriptions win.',
    published: '2026-08-03', updated: '2026-08-03', readMinutes: 7,
    priority: 0.65, changefreq: 'yearly',
    links: { pillars: ['ai-automation-perth'] },
  },
  {
    slug: 'one-page-ai-policy', type: 'article', status: 'draft', phase: 7,
    name: 'The One-Page AI Policy',
    title: 'The One-Page AI Policy Your Business Needs | C4 Studios',
    description: 'Most AI policies are unread PDFs. Here is the one-page version, what each line is for, and how to adapt it — free to copy.',
    dek: 'A policy people will actually read, free to take and adapt.',
    published: '2026-08-03', updated: '2026-08-03', readMinutes: 5,
    priority: 0.65, changefreq: 'yearly',
    links: { pillars: ['ai-automation-perth'] },
  },
];

/* ── Combined registry ─────────────────────────────────────────────── */
export const SEO_PAGES = [...PILLARS, ...INDUSTRIES, ...COMPARISONS, ...SUBURB_PAGES, ...ARTICLES];

export function liveSeoPages() {
  return SEO_PAGES.filter((p) => p.status === 'live');
}

/** Live articles, newest first — drives the /insights index. */
export function liveArticles() {
  return SEO_PAGES
    .filter((p) => p.type === 'article' && p.status === 'live')
    .sort((a, b) => (b.published || '').localeCompare(a.published || ''));
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
  if (entry.type === 'article') {
    if (!entry.published) problems.push('missing published date');
    if (!entry.dek) problems.push('missing dek');
    for (const field of ['published', 'updated']) {
      if (entry[field] && !/^\d{4}-\d{2}-\d{2}$/.test(entry[field])) {
        problems.push(`${field} is not an ISO date (YYYY-MM-DD)`);
      }
    }
  }
  return problems;
}
