/**
 * Case Study Data
 *
 * Each entry is keyed by its URL slug. Add new case studies by
 * adding a new key to CASE_STUDIES — no other files need to change.
 *
 * Screenshot / thumbnail placeholders:
 *   - Set `thumbnail` to '' to show a styled "Thumbnail pending" state
 *   - Set screenshot `url` to '' to show a numbered placeholder tile
 *   - Replace with real URLs when assets are ready
 */

export const CASE_STUDIES = {
  'transform-fremantle': {
    slug: 'transform-fremantle',
    name: 'Transform Fremantle',
    oneLiner: 'A purpose-built community platform uniting churches across Fremantle — designed to coordinate prayer, share resources, and grow a movement.',
    client: 'Transform Fremantle',
    location: 'Fremantle, WA',
    timeline: '3 weeks',
    budget: '$1k – $2.5k',
    role: 'Solo (design, development, deployment)',
    liveUrl: 'https://transformfreo.com/',
    year: '2026',
    category: 'web_design',
    tags: ['Website', 'Community', 'Non-Profit'],
    featured: true,
    budgetOrder: 2,

    cover: '/covers/transform-fremantle.png',
    brandColor: '#1e3a5f',
    thumbnail: '/captures/transformfreo-com/desktop/01-hero.png',

    overview: 'Transform Fremantle is an interdenominational Christian movement uniting churches across the City of Fremantle in coordinated prayer. They needed a digital home that could communicate vision, coordinate five weekly prayer meetings across different venues, host downloadable resources, and invite the community to connect — all while reflecting the warmth and gravity of the mission. The result is a clean, purposeful platform that treats the content with the seriousness it deserves while remaining approachable and easy to navigate.',

    screenshots: [
      { url: '/captures/transformfreo-com/desktop/01-hero.png', caption: 'Hero — harbour backdrop with mission statement and navigation' },
      { url: '/captures/transformfreo-com/desktop/02-schedule.png', caption: 'Prayer Meetings — five-day weekly schedule across Fremantle churches' },
      { url: '/captures/transformfreo-com/desktop/03-vision.png', caption: 'Vision & Aim — four numbered pillars of the movement' },
      { url: '/captures/transformfreo-com/desktop/04-connect.png', caption: 'Connect — contact form with validation and ways to reach us' },
      { url: '/captures/transformfreo-com/desktop/05-resources.png', caption: 'Resources — downloadable PDF library with branded cards' },
    ],

    desktopScreenshots: [
      { url: '/captures/transformfreo-com/desktop/01-hero.png', caption: 'Hero — harbour backdrop with mission statement and navigation' },
      { url: '/captures/transformfreo-com/desktop/02-schedule.png', caption: 'Prayer Meetings — five-day weekly schedule across Fremantle churches' },
      { url: '/captures/transformfreo-com/desktop/03-vision.png', caption: 'Vision & Aim — four numbered pillars of the movement' },
      { url: '/captures/transformfreo-com/desktop/04-connect.png', caption: 'Connect — contact form with validation and ways to reach us' },
      { url: '/captures/transformfreo-com/desktop/05-resources.png', caption: 'Resources — downloadable PDF library with branded cards' },
    ],

    mobileScreenshots: [
      { url: '/captures/transformfreo-com/mobile/01-hero.png', caption: 'Mobile — hero and mission introduction' },
      { url: '/captures/transformfreo-com/mobile/02-schedule.png', caption: 'Mobile — prayer meetings schedule' },
      { url: '/captures/transformfreo-com/mobile/03-vision.png', caption: 'Mobile — vision and aim pillars' },
      { url: '/captures/transformfreo-com/mobile/04-connect.png', caption: 'Mobile — contact form' },
      { url: '/captures/transformfreo-com/mobile/05-resources.png', caption: 'Mobile — resource library' },
    ],

    delivered: [
      'Logo design — anchor and compass-inspired mark in navy and gold, sized for web, social, and print',
      'Complete website — design, development, content structuring, and deployment',
      'Platform migration from Base44 scaffold to standalone Vite + Vercel architecture',
      'Homepage with hero, vision statement, and prayer meeting schedule',
      'Five-day prayer schedule with church names, addresses, times, and map links',
      'About page with mission statement and unity principles',
      'Vision & Aim page with four structured aims and supporting copy',
      'Statement of Faith page with formatted Apostles\' Creed',
      'Downloadable PDF resource library with automated build-time manifest',
      'Connect page with contact form, phone, Instagram, and bank transfer details',
      'Serverless contact form with email delivery, anti-spam, and rate limiting',
      'Responsive design optimised for mobile and desktop',
    ],

    features: [
      'Five-page SPA with branded hero sections and consistent layout system',
      'Weekly prayer schedule with five venues, times, and embedded map links',
      'Contact form with serverless email delivery via Vercel Functions and Resend',
      'Honeypot anti-spam and IP-based rate limiting on form submissions',
      'Automated PDF resource pipeline with SHA-256 cache busting and build-time verification',
      'Resource overrides system for managing display names and deprecation without code changes',
      'Vision & Aim page with numbered pillars and iconography',
      'Mobile-first responsive layout with sticky blurred header and hamburger navigation',
      'Smooth page transitions and micro-animations via Framer Motion',
      'Bank transfer details section for supporters',
    ],

    stack: [
      'React 18 (Vite SPA)',
      'JavaScript (JSX)',
      'Tailwind CSS 3.4 + shadcn/ui',
      'React Router DOM v7',
      'Framer Motion',
      'Lucide React',
      'Vercel Serverless Functions',
      'Resend (transactional email)',
      'Supabase Storage (image CDN)',
      'Vercel (hosting)',
    ],

    integrations: [
      'Serverless email delivery via Resend with formatted HTML templates',
      'Supabase Storage for image and PDF asset hosting',
      'Google Maps links for each prayer venue',
      'Instagram profile link for community engagement',
      'Honeypot anti-spam and IP-based rate limiting',
    ],

    performance: [
      'Semantic HTML with ARIA live regions and proper form labelling',
      'Responsive images with appropriate sizing',
      'Fast page loads via Vite code splitting and static asset optimisation',
      'Content-hash cache busting on PDF resources',
      'Clean URL structure with SPA fallback routing',
      'Mobile-optimised touch targets and typography',
      'Production safety guards blocking accidental localhost API calls',
    ],

    challenges: [
      'Migrating from a low-code platform (Base44/Supabase) to a production-ready standalone architecture',
      'Engineering a resource management system that lets non-technical users update PDFs without touching code',
      'Building a reliable serverless contact form with anti-spam, rate limiting, and proper email deliverability',
      'Coordinating content across five different churches with varying schedules',
      'Presenting theological content in a modern, readable format without losing gravity',
      'Balancing warmth and approachability with the seriousness of the mission',
    ],

    improvements: [
      'Add a headless CMS so the client can update prayer schedules and content independently',
      'Implement persistent rate limiting via Vercel KV or Upstash Redis',
      'Add privacy-respecting analytics to track page views and resource downloads',
      'Expand the resource library with categorised filtering',
    ],
  },

  'transform-hakea': {
    slug: 'transform-hakea',
    name: 'Transform Hakea',
    oneLiner: 'A polished, purpose-built website for a Christian prayer movement focused on the transformation of Hakea Prison, Perth.',
    client: 'Transform Hakea',
    location: 'Perth, WA',
    timeline: '',
    budget: '',
    role: 'Solo (design, development, deployment)',
    liveUrl: 'https://transformhakea.com',
    year: '',
    category: 'web_design',
    tags: ['Website', 'Community', 'Non-Profit'],
    featured: false,
    budgetOrder: 1,

    cover: '/covers/transform-hakea.png',
    brandColor: '#7a1a1a',
    thumbnail: '/captures/transformhakea-com/desktop/01-hero.png',

    overview: 'Transform Hakea is a single-page website built for a community of Christians who gather weekly to pray for the transformation of Hakea Prison in Western Australia. The site communicates the movement\'s vision, provides practical details about the weekly prayer gathering, and offers multiple ways to connect — all wrapped in a clean, branded design built for fast performance and search-engine readiness from day one.',

    screenshots: [
      { url: '/captures/transformhakea-com/desktop/01-hero.png', caption: 'Hero — slideshow with prison backdrop and dual call-to-action' },
      { url: '/captures/transformhakea-com/desktop/02-faq.png', caption: 'FAQ — practical questions for first-time visitors' },
      { url: '/captures/transformhakea-com/desktop/03-section.png', caption: 'Weekly Prayer Gathering — come and pray with us' },
      { url: '/captures/transformhakea-com/desktop/04-section.png', caption: 'Call to Action — Will You Pray With Us?' },
      { url: '/captures/transformhakea-com/desktop/05-section.png', caption: 'Partnership — Prison Fellowship Australia' },
    ],

    desktopScreenshots: [
      { url: '/captures/transformhakea-com/desktop/01-hero.png', caption: 'Hero — slideshow with prison backdrop and dual call-to-action' },
      { url: '/captures/transformhakea-com/desktop/02-faq.png', caption: 'FAQ — practical questions for first-time visitors' },
      { url: '/captures/transformhakea-com/desktop/03-section.png', caption: 'Weekly Prayer Gathering — come and pray with us' },
      { url: '/captures/transformhakea-com/desktop/04-section.png', caption: 'Call to Action — Will You Pray With Us?' },
      { url: '/captures/transformhakea-com/desktop/05-section.png', caption: 'Partnership — Prison Fellowship Australia' },
    ],

    mobileScreenshots: [
      { url: '/captures/transformhakea-com/mobile/01-hero.png', caption: 'Mobile — hero with slideshow' },
      { url: '/captures/transformhakea-com/mobile/02-faq.png', caption: 'Mobile — FAQ accordion' },
      { url: '/captures/transformhakea-com/mobile/03-section.png', caption: 'Mobile — Will You Pray With Us?' },
      { url: '/captures/transformhakea-com/mobile/04-section.png', caption: 'Mobile — come and pray with us' },
      { url: '/captures/transformhakea-com/mobile/05-section.png', caption: 'Mobile — Prison Fellowship Australia' },
    ],

    delivered: [
      'Logo design — crimson and copper emblem with cross motif, optimised for web and social use',
      'Full website — design, development, and deployment from scratch',
      'Custom brand colour system (crimson, maroon, copper palette)',
      'Responsive layout for mobile, tablet, and desktop',
      'Hero section with automatic image slideshow and cross-fade transitions',
      'Animated FAQ accordion with smooth expand/collapse',
      'Sticky navigation with scroll-aware active-section highlighting',
      'SEO configuration — meta tags, Open Graph, Twitter cards, structured data, sitemap, robots.txt',
      'Static export deployment pipeline for Cloudflare Pages',
      'Calendar .ics file download for recurring prayer gathering',
      'Google Maps integration for venue directions',
      'Custom 404 error page',
      'Iterative content updates across multiple client revision rounds',
    ],

    features: [
      'Hero image slideshow with cross-fade transitions, dot indicators, and reduced-motion support',
      'Sticky frosted-glass header with IntersectionObserver-driven section highlighting',
      'Animated FAQ accordion with chevron rotation and CSS grid expand/collapse',
      'One-click .ics calendar download for a recurring weekly event',
      'JSON-LD structured data for SEO (Organisation and FAQPage schemas)',
      'Dynamic sitemap and robots.txt generated via Next.js metadata routes',
      'Open Graph and Twitter Card metadata for full social sharing support',
      'Partnership section with Prison Fellowship Australia branding',
      'Cross-promotion with Transform Fremantle sister movement',
      'Custom branded 404 page',
    ],

    stack: [
      'Next.js 15 (App Router, static export)',
      'TypeScript (strict mode)',
      'Tailwind CSS 3 with custom design tokens',
      'Lucide React',
      'Cloudflare Pages (hosting)',
      'ESLint + Prettier',
    ],

    integrations: [
      'Google Maps — external directions link to Hakea Prison Visitor\'s Centre',
      'Calendar — client-side .ics file generation and download',
      'External links to Transform Fremantle and Prison Fellowship Australia',
      'Email (mailto) and phone (tel) contact links',
    ],

    performance: [
      'Fully static export with no server-side rendering dependency',
      'TypeScript strict mode with ESLint and Prettier enforcement',
      'Skip-to-content link, ARIA attributes, and focus-visible ring styles',
      'Prefers-reduced-motion handling for all animations',
      'Priority loading for above-fold hero images, lazy loading for the rest',
      'JSON-LD structured data, Open Graph, and Twitter Card metadata',
      'All images served locally — no external CDN dependency',
    ],

    challenges: [
      'Static-only deployment with no server-side capabilities — all interactivity built client-side',
      'Multiple rounds of client content revisions requiring clean Git workflow and rapid turnaround',
      'SEO groundwork for a brand-new domain with no existing authority',
      'Balancing a premium feel with a simple, accessible experience for a non-technical audience',
      'Cross-referencing the Transform Fremantle sister movement without creating confusion',
    ],

    improvements: [
      'Add a headless CMS so the client can update content without code commits',
      'Implement scroll-triggered entrance animations for section reveals',
      'Add privacy-respecting analytics to track visitor engagement',
    ],
  },

  'jurassic-pt': {
    slug: 'jurassic-pt',
    name: 'Jurassic PT',
    oneLiner: 'A conversion-focused service website for a Cannington fitness studio — covering memberships, classes, timetable, personal training, remedial massage, and direct booking.',
    client: 'Jurassic PT',
    location: 'Cannington, WA',
    timeline: '',
    budget: '',
    role: 'Solo (design, development, deployment)',
    liveUrl: 'https://www.jurassicpt.com/',
    year: '2026',
    category: 'web_design',
    tags: ['Website', 'Fitness', 'Local Business'],
    featured: true,
    budgetOrder: 3,

    cover: '/covers/jurassic-pt.png',
    brandColor: '#1a1f14',
    thumbnail: '/captures/jurassic-pt-vercel-app/desktop/01-hero.png',

    overview: 'Jurassic PT is a service website for a small group personal training studio in Cannington, WA offering coached classes, personal training, and remedial massage. The site is structured around practical customer actions — comparing memberships, checking the weekly timetable, booking sessions through PT Mate, or sending service-specific enquiries. Each service line has its own dedicated route with pricing, policies, and contextual calls-to-action that route into either direct booking flows or prefilled contact enquiries depending on availability. The implementation pairs a dark lime-accent visual system with reusable booking components, responsive layouts, and a lightweight trust layer built from real client testimonials.',

    screenshots: [
      { url: '/captures/jurassic-pt-vercel-app/desktop/01-hero.png', caption: 'Hero — headline, credentials, and dual CTA above the fold' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/02-section.png', caption: 'Why Jurassic PT — four value propositions in card layout' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/03-team.png', caption: 'Testimonials — community stories grid with expandable cards' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/04-memberships.png', caption: 'Memberships — dedicated pricing page with tiered plans and feature breakdown' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/05-memberships-plans.png', caption: 'Memberships — plan comparison cards with booking CTAs' },
    ],

    desktopScreenshots: [
      { url: '/captures/jurassic-pt-vercel-app/desktop/01-hero.png', caption: 'Hero — headline, credentials, and dual CTA above the fold' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/02-section.png', caption: 'Why Jurassic PT — four value propositions in card layout' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/03-team.png', caption: 'Testimonials — community stories grid with expandable cards' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/04-memberships.png', caption: 'Memberships — dedicated pricing page with tiered plans and feature breakdown' },
      { url: '/captures/jurassic-pt-vercel-app/desktop/05-memberships-plans.png', caption: 'Memberships — plan comparison cards with booking CTAs' },
    ],

    mobileScreenshots: [
      { url: '/captures/jurassic-pt-vercel-app/mobile/01-hero.png', caption: 'Mobile — hero with headline and booking CTAs' },
      { url: '/captures/jurassic-pt-vercel-app/mobile/02-hero-about.png', caption: 'Mobile — about section and value propositions' },
      { url: '/captures/jurassic-pt-vercel-app/mobile/03-memberships.png', caption: 'Mobile — memberships page hero and pricing overview' },
      { url: '/captures/jurassic-pt-vercel-app/mobile/04-memberships-plans.png', caption: 'Mobile — membership plan comparison cards' },
      { url: '/captures/jurassic-pt-vercel-app/mobile/05-classes.png', caption: 'Mobile — coached class descriptions and booking' },
    ],

    delivered: [
      'Logo design — badge-style brand mark with dinosaur claw motif, gold trim, and dark background treatment',
      'Multi-route marketing site with dedicated pages for classes, timetable, memberships, personal training, remedial massage, and contact',
      'PT Mate booking integration for memberships, intro offers, casual classes, and selected remedial massage services',
      'Fallback enquiry routing for services without direct booking links',
      'Contact form with client-side validation, loading states, and service-specific prefills via query parameters',
      'Membership comparison page with tiered plans, casual option, 10-class pack, FAQ, and policy detail',
      'Responsive timetable with both image-based schedule and structured weekly summary',
      'Custom testimonial system with scrolling ticker, expandable grid cards, and modal detail view',
      'Responsive navigation with desktop dropdown, mobile slide-in menu, and persistent membership CTA',
      'Route-level page titles and meta descriptions within the SPA shell',
      'Vercel deployment with SPA routing, CSP headers, HSTS, and cache configuration',
    ],

    features: [
      'Seven-route SPA with service-specific pages, CTAs, and booking flows',
      'PT Mate integration with centralised booking URL management and contextual fallback to contact enquiry',
      'Contact form with FormSubmit delivery, validation, consent capture, and query-parameter prefills from service pages',
      'Membership comparison with tiered pricing cards, highlighted plan, FAQ, and transparent cancellation policy',
      'Dual timetable display — image schedule and structured weekly summary with responsive card layout on mobile',
      'Testimonial ticker with continuous scroll, reduced-motion fallback, and expanded modal view',
      'IntersectionObserver-driven reveal animations with prefers-reduced-motion handling',
      'Centralised business configuration for booking URLs, contact details, and enquiry routing logic',
      'Sticky frosted-glass navigation with scroll-aware state and mobile hamburger menu',
      'Custom 404 page and scroll-to-top behaviour on route changes',
    ],

    stack: [
      'React 18 (Vite SPA)',
      'JavaScript (JSX)',
      'React Router DOM',
      'Tailwind CSS with custom design tokens',
      'Lucide React',
      'FormSubmit (contact form)',
      'PT Mate (booking integration)',
      'Vercel (hosting)',
    ],

    integrations: [
      'PT Mate — direct purchase links for memberships, intro offers, casual passes, and massage sessions',
      'FormSubmit — AJAX form submission for contact enquiries with success and error handling',
      'Google Maps — external directions link to the studio location',
      'Instagram and Facebook — social profile links for community engagement',
    ],

    performance: [
      'Lightweight production bundle via Vite with no heavy animation dependencies',
      'Lazy-loaded timetable image asset',
      'Skip-to-content link, ARIA labels, expanded states, and focus-visible styles',
      'Reduced-motion handling on all scroll-triggered animations',
      'Route-specific title and description updates for search engines',
      'Security headers including CSP, HSTS, and frame-ancestor restrictions',
      'Robots and sitemap configuration for deployment',
    ],

    challenges: [
      'Designing a clean booking architecture around mixed booking rules — some services route to PT Mate, others intentionally fall back to direct enquiry',
      'Building a content-heavy service site without a CMS while keeping pricing, policies, links, and contact pathways consistent across multiple pages',
      'Making the timetable useful on both desktop and mobile with a graceful switch from image schedule to structured card layout',
      'Adding social proof and motion without making the site feel noisy — including a continuously scrolling testimonial ticker with reduced-motion handling',
      'Creating clear route-by-route service discovery with page-specific CTAs and prefilled enquiry flows from each service page',
    ],

    improvements: [
      'Add a headless CMS so the client can update schedules, pricing, and testimonials independently',
      'Replace the image-based timetable with a fully data-driven schedule component',
      'Implement persistent rate limiting on form submissions',
      'Add privacy-respecting analytics to track page views and booking conversions',
    ],
  },

  'people-power': {
    slug: 'people-power',
    name: 'People Power',
    oneLiner: 'A C4 Studios Original — a full-stack social platform for creating, discovering, and coordinating community movements, built from the ground up with real-time messaging, moderation infrastructure, and governance tooling.',
    client: 'C4 Studios (Internal)',
    location: 'Perth, WA',
    timeline: '',
    budget: '',
    role: 'Solo (concept, design, logo, full-stack development, deployment)',
    liveUrl: 'https://peoplepower.app/',
    year: '2026',
    category: 'web_app',
    tags: ['Web App', 'Social Platform', 'C4 Original'],
    featured: true,
    budgetOrder: 5,

    cover: '/covers/people-power.png',
    brandColor: '#1a1d4d',
    thumbnail: '/captures/peoplepower-app/desktop/01-intro.png',

    overview: 'People Power is a full-stack social platform conceived, designed, and engineered entirely in-house at C4 Studios. It is not a client project — it is an original product built to enable communities to create, discover, and coordinate real social movements. The platform goes far beyond a typical feed: users can launch movement pages with evidence and claims, collaborate through tasks and discussions, organise events, run petitions, and engage with real-time messaging secured by end-to-end encryption scaffolding. Behind the public surface sits a complete operational layer — admin moderation workflows with second-approval governance, community health analytics, incident logging, feature flag administration, and safety-first reporting flows for both harmful content and product bugs. The backend is a production Fastify server backed by Postgres, with WebSocket support, rate limiting, CORS enforcement, and a Cloudflare Worker migration path already underway. This is not a marketing site or a prototype — it is a working social product with authentication, real-time state, and the kind of moderation infrastructure that most platforms only add after they have a problem.',

    screenshots: [
      { url: '/captures/peoplepower-app/desktop/01-intro.png', caption: 'Intro — cinematic brand overlay with mission statement and lightning-bolt mark' },
      { url: '/captures/peoplepower-app/desktop/02-feed.png', caption: 'Feed — movement discovery with sort modes and action panel' },
      { url: '/captures/peoplepower-app/desktop/03-feed-scroll.png', caption: 'Movement cards — tags, momentum indicators, and participation stats' },
      { url: '/captures/peoplepower-app/desktop/04-feed-impact.png', caption: 'Impact sort — movements ranked by community reach and engagement' },
      { url: '/captures/peoplepower-app/desktop/05-feed-impact-scroll.png', caption: 'Impact feed — movement cards with progress indicators and collaboration cues' },
    ],

    desktopScreenshots: [
      { url: '/captures/peoplepower-app/desktop/01-intro.png', caption: 'Intro — cinematic brand overlay with mission statement and lightning-bolt mark' },
      { url: '/captures/peoplepower-app/desktop/02-feed.png', caption: 'Feed — movement discovery with sort modes and action panel' },
      { url: '/captures/peoplepower-app/desktop/03-feed-scroll.png', caption: 'Movement cards — tags, momentum indicators, and participation stats' },
      { url: '/captures/peoplepower-app/desktop/04-feed-impact.png', caption: 'Impact sort — movements ranked by community reach and engagement' },
      { url: '/captures/peoplepower-app/desktop/05-feed-impact-scroll.png', caption: 'Impact feed — movement cards with progress indicators and collaboration cues' },
    ],

    mobileScreenshots: [
      { url: '/captures/peoplepower-app/mobile/01-intro.png', caption: 'Mobile — intro overlay with bold typography and gradient lighting' },
      { url: '/captures/peoplepower-app/mobile/02-feed.png', caption: 'Mobile — movement feed with sort tabs and stacked movement cards' },
      { url: '/captures/peoplepower-app/mobile/03-feed-scroll.png', caption: 'Mobile — feed scroll with movement cards and participation stats' },
      { url: '/captures/peoplepower-app/mobile/04-feed-impact.png', caption: 'Mobile — impact sort showing community-ranked movements' },
      { url: '/captures/peoplepower-app/mobile/05-feed-impact-scroll.png', caption: 'Mobile — impact feed with movement detail cards' },
    ],

    delivered: [
      'Logo design — lightning-bolt emblem with gradient treatment, sized for web, social, and favicon use',
      'Complete social platform — concept, UX, visual identity, front-end, back-end, and deployment',
      'Movement feed with momentum, newest, impact, and local discovery sort modes',
      'Full movement creation flow with categories, location, media upload, evidence fields, live preview, and anti-brigading checks',
      'Rich movement detail pages combining comments, collaboration tools, evidence, impact updates, resources, events, petitions, and polls',
      'Real-time messaging architecture with WebSocket support and end-to-end encryption key handling',
      'Search with movement and user discovery, city and country filtering, and profile-based location defaults',
      'Profile system with editable details, banner and avatar imagery, follower and following lists, trust markers, and movement history',
      'Full authentication flow — sign-in, sign-up, email verification, resend verification, password reset, and token refresh',
      'Reporting centre for abuse reports and technical bug reports with evidence upload and category-specific guidance',
      'Admin moderation workflow with reports queue, incident log, second-approval for permanent actions, and notification handling',
      'Community health dashboard with platform-level safety and moderation metrics over time',
      'Feature flag and research mode administration for controlled rollouts',
      'Safety and onboarding layers including intro gating, safety acceptance, age verification, and privacy-aware location handling',
      'Fastify backend with CORS, rate limiting, multipart uploads, health endpoints, WebSocket upgrades, and Postgres persistence',
      'Cloudflare Worker migration scaffold with Durable Objects entity CRUD',
    ],

    features: [
      'Movement feed with four discovery modes — momentum, newest, impact, and local — surfacing movement cards with tags, participation stats, and map previews',
      'Multi-step movement creation with media upload validation, profanity filtering, leadership-cap governance, platform acknowledgment gating, and rate-limiting hooks',
      'Movement detail pages that aggregate comments, collaborators, tasks, discussions, polls, events, petitions, resources, and impact updates in a single navigable surface',
      'Real-time messaging infrastructure with WebSocket transport, local fallback logic, and TweetNaCl-based end-to-end encryption key generation and shared-secret handling',
      'Reporting and moderation system with abuse and bug report modes, evidence upload, admin queue, second-approval governance for permanent actions, and incident logging',
      'Community health analytics dashboard with time-series moderation metrics and platform safety indicators',
      'Privacy-aware location system with approximate city-level map previews, sanitised public profile data, and geocoding only when explicitly needed',
      'Profile system with banner and avatar imagery, follower and following relationships, trust markers, and movement participation history',
      'Feature flag administration for staged rollouts and experimental features',
      'Cinematic intro overlay with animated gradient lighting, brand mark presentation, and mission-driven onboarding copy',
      'Graceful degradation across auth and backend availability states — offline labels, degraded sync banners, and stub fallbacks',
      'Lazy-loaded route-level code splitting with Vite manual chunk configuration for vendor groups',
    ],

    stack: [
      'React 18 (Vite 6 SPA)',
      'JavaScript (JSX)',
      'React Router 7',
      'Tailwind CSS + Radix UI + shadcn-style components',
      'TanStack React Query',
      'Framer Motion',
      'React Hook Form + Zod',
      'Leaflet + React Leaflet',
      'Recharts',
      'i18next',
      'Lucide React',
      'Fastify 5 (Node.js backend)',
      'Postgres (REAL mode persistence)',
      'Supabase Auth',
      'WebSockets (real-time messaging)',
      'TweetNaCl (E2E encryption)',
      'Cloudflare Pages + Workers (migration scaffold)',
      'Render (backend hosting)',
    ],

    integrations: [
      'Supabase Auth — email/password authentication with verification, session restoration, token refresh, and route-level protection',
      'Postgres — canonical data persistence in REAL mode with in-memory DEMO fallback for development',
      'WebSockets — real-time messaging transport with upgrade handling on the Fastify server',
      'TweetNaCl — end-to-end encryption keypair generation and shared-secret message encryption',
      'Resend / SMTP — non-blocking transactional email for verification and notifications',
      'Leaflet — privacy-aware map previews with approximate city-level coordinates',
      'Recharts — time-series analytics and community health metric visualisation',
      'Cloudflare Workers + Durable Objects — emerging migration layer for edge-deployed entity CRUD',
    ],

    performance: [
      'Route-level lazy loading with React.lazy and Suspense for code-split page bundles',
      'Vite manual chunk splitting separating React, Supabase, React Query, motion, forms, map, charting, and UI dependency groups',
      'TanStack React Query for server-state caching, background refetching, and optimistic updates',
      'Reduced-motion support implemented globally in CSS',
      'Graceful degradation with offline and degraded-state feedback across all authenticated surfaces',
      'Rate limiting on backend endpoints for submission and upload flows',
      'CORS enforcement, request body limits, and health status endpoints on the API server',
    ],

    challenges: [
      'Designing a movement coordination platform that handles activism-style organisation without becoming an unmoderated social feed — requiring substantial work around safety, reporting, appeal paths, and governance constraints',
      'Building a broad feature surface anchored on a single movement entity — combining comments, collaborators, tasks, evidence, events, petitions, resources, and impact updates in one coherent detail experience',
      'Implementing real-time messaging infrastructure with WebSocket transport and encryption key handling while keeping the platform functional when the backend is unavailable',
      'Balancing user empowerment with anti-abuse guardrails — leadership caps, anti-brigading checks, content controls, age verification, and second-approval governance for permanent moderation actions',
      'Managing authentication, profile persistence, and protected routing across frontend and backend concerns with email verification, password reset, and token-based API access',
      'Handling privacy-sensitive location features in a socially coordinated app — sanitising public profile data and using approximate city-level map presentation',
      'Supporting graceful degradation during an active backend migration across Node/Fastify, Render, and an emerging Cloudflare Worker layer',
      'Maintaining a consistent design language across public, authenticated, and admin surfaces without switching to unrelated visual systems',
    ],

    improvements: [
      'Complete the Cloudflare Worker migration for edge-deployed API endpoints',
      'Ship the full messaging UI with conversation threads and real-time delivery indicators',
      'Add server-side rendering or static generation for SEO on public movement pages',
      'Implement persistent rate limiting via Upstash Redis or Cloudflare KV',
      'Add privacy-respecting analytics to track platform engagement and movement growth',
    ],
  },
  'gocc': {
    slug: 'gocc',
    name: 'GoCC',
    oneLiner: 'Performance consultancy for a coaching and counselling practice — accelerating load times, smoothing interactions, and expanding reach through technical optimisation and SEO strategy.',
    client: 'GoCC — Coaching & Counselling',
    location: 'Success, WA',
    timeline: '2 weeks',
    budget: '$1k – $2.5k',
    role: 'Consultant (performance audit, optimisation, SEO strategy)',
    liveUrl: 'https://gocc.com.au/',
    year: '2026',
    category: 'brand_platform',
    tags: ['Consultancy', 'Optimisation', 'SEO'],
    featured: true,
    budgetOrder: 2,

    cover: null,
    brandColor: '#2a6e5a',
    thumbnail: '/captures/gocc-com-au/desktop/01-hero.png',

    overview: 'GoCC is a coaching and counselling practice based in Success, Western Australia, helping individuals and couples navigate relationships, career challenges, and personal growth. The existing website had solid content and a clear message — "Don\'t Just Survive, Thrive!" — but was underperforming technically: slow page loads, unoptimised assets, missing SEO fundamentals, and scroll-triggered animations that weren\'t debounced properly. C4 Studios was brought in to consult the developer directly — auditing the codebase, identifying bottlenecks, and guiding a series of targeted improvements that made the site faster, smoother, and more discoverable without a full rebuild.',

    screenshots: [
      { url: '/captures/gocc-com-au/desktop/01-hero.png', caption: 'Hero — full-width background with mission statement and booking CTA' },
      { url: '/captures/gocc-com-au/desktop/02-section.png', caption: 'Journey section — empathetic copy with lifestyle imagery and scroll reveal' },
      { url: '/captures/gocc-com-au/desktop/03-section.png', caption: 'Call to action — "Take the Chance to Change" with booking prompt' },
    ],

    desktopScreenshots: [
      { url: '/captures/gocc-com-au/desktop/01-hero.png', caption: 'Hero — full-width background with mission statement and booking CTA' },
      { url: '/captures/gocc-com-au/desktop/02-section.png', caption: 'Journey section — empathetic copy with lifestyle imagery and scroll reveal' },
      { url: '/captures/gocc-com-au/desktop/03-section.png', caption: 'Call to action — "Take the Chance to Change" with booking prompt' },
    ],

    mobileScreenshots: [
      { url: '/captures/gocc-com-au/mobile/01-hero.png', caption: 'Mobile — hero with condensed headline and booking button' },
      { url: '/captures/gocc-com-au/mobile/02-section.png', caption: 'Mobile — journey section with stacked layout' },
      { url: '/captures/gocc-com-au/mobile/03-section.png', caption: 'Mobile — call to action and booking prompt' },
    ],

    delivered: [
      'Comprehensive performance audit — Lighthouse profiling, asset analysis, render-blocking resource identification, and load waterfall review',
      'Image optimisation strategy — conversion to WebP, responsive srcset implementation, and lazy loading for below-fold assets',
      'Scroll animation refactor — debounced Intersection Observer callbacks replacing inefficient scroll listeners, with reduced-motion fallbacks',
      'CSS delivery optimisation — critical CSS extraction, deferred non-essential stylesheets, and removal of unused rules',
      'JavaScript bundle review — identified and eliminated render-blocking scripts, deferred third-party widget loading',
      'SEO foundation audit — meta tags, Open Graph markup, structured data (LocalBusiness schema), semantic heading hierarchy, and alt text review',
      'Local SEO recommendations — Google Business Profile optimisation guidance, NAP consistency check, and local keyword targeting',
      'Core Web Vitals improvements — LCP, FID, and CLS optimisation resulting in measurable score increases',
      'Caching strategy — recommended browser cache headers and CDN configuration for static assets',
      'Accessibility quick wins — colour contrast adjustments, focus-visible styles, and ARIA label additions on interactive elements',
    ],

    features: [
      'Full-page performance audit with before/after Lighthouse scoring',
      'Image pipeline overhaul — WebP conversion, responsive sizing, and lazy loading',
      'Scroll animation performance refactor with Intersection Observer and reduced-motion support',
      'SEO audit covering meta tags, structured data, heading hierarchy, and Open Graph',
      'Local SEO strategy including Google Business Profile and NAP consistency',
      'Core Web Vitals optimisation targeting LCP, FID, and CLS benchmarks',
      'Asset delivery improvements — critical CSS, deferred scripts, and cache headers',
      'Accessibility review with contrast, focus, and ARIA improvements',
    ],

    stack: [
      'HTML / CSS / JavaScript',
      'Intersection Observer API',
      'WebP image format',
      'Google Lighthouse',
      'Google Search Console',
      'Acuity Scheduling (booking)',
    ],

    integrations: [
      'Acuity Scheduling — embedded booking widget for session appointments',
      'Google Business Profile — local SEO presence and review management',
      'Google Search Console — indexing status and search performance monitoring',
    ],

    performance: [
      'Lighthouse performance score improved from mid-60s to 90+ on mobile',
      'Largest Contentful Paint reduced by optimising hero background image delivery',
      'Cumulative Layout Shift eliminated through explicit image dimensions and font-display swap',
      'First Input Delay improved by deferring non-critical JavaScript and debouncing scroll handlers',
      'Total page weight reduced through image compression, unused CSS removal, and script consolidation',
      'Time to Interactive improved with render-blocking resource elimination',
    ],

    challenges: [
      'Consulting an external developer rather than having direct codebase access — all changes were guided through recommendations and code review',
      'Improving performance without altering the site\'s visual design or content structure',
      'Balancing aggressive optimisation with the developer\'s existing architecture and deployment constraints',
      'Addressing SEO fundamentals on a site that had no prior technical SEO work',
      'Communicating technical improvements in terms the business owner could understand and approve',
    ],

    improvements: [
      'Implement server-side rendering or static generation for faster initial paint',
      'Add structured data for FAQ and service pages',
      'Set up automated Lighthouse CI checks for ongoing performance monitoring',
      'Expand content strategy with blog posts targeting local counselling search queries',
    ],
  },

  'groverz-tax': {
    slug: 'groverz-tax',
    name: 'Groverz Tax & Accounting Solutions',
    oneLiner: 'A conversion-focused tax practice website with an interactive refund estimator and physics-driven hero animations.',
    client: 'Ankit Grover',
    location: 'East Cannington, Perth, WA, Australia',
    timeline: '2–3 weeks',
    budget: '$2.5k – $5k',
    role: 'Solo (design, development, deployment)',
    liveUrl: 'https://groverztax.com.au',
    year: '2026',
    category: 'web_design',
    tags: ['Website', 'Tax & Accounting', 'Small Business', 'Local Service'],
    featured: true,
    budgetOrder: 4,

    cover: '/covers/groverz-tax.png',
    brandColor: '#1e1b4b',
    thumbnail: '/captures/groverztax-com-au/desktop/01-hero.png',

    overview: 'Ankit Grover needed a professional web presence that matched the quality of his independent tax practice in East Cannington, Perth. C4 Studios designed and built a four-page React SPA with a clear conversion funnel — from an interactive tax refund estimator using live ATO tax brackets, through a seven-service accordion catalogue with category filtering, to a backend-powered contact form with rate limiting, honeypot spam protection, and Resend email delivery. Hero sections feature a custom canvas-based physics simulation of drifting tax symbols, and the navigation uses a liquid-glass hover effect built with Framer Motion. The result is a polished, mobile-first site that positions Groverz as the approachable, no-nonsense alternative to big-box accounting firms.',

    screenshots: [
      { url: '/captures/groverztax-com-au/desktop/01-hero.png', caption: 'Hero — floating math symbol physics simulation with social proof and wave divider' },
      { url: '/captures/groverztax-com-au/desktop/02-benefits.png', caption: 'Trust markers — Registered Tax Agent, fixed fees, fast turnaround, and document checklist' },
      { url: '/captures/groverztax-com-au/desktop/03-testimonials.png', caption: 'Client testimonials with star ratings, avatar initials, and attribution' },
      { url: '/captures/groverztax-com-au/desktop/04-calculator.png', caption: 'Interactive tax refund estimator using 2025-26 ATO resident rates' },
      { url: '/captures/groverztax-com-au/desktop/05-services.png', caption: 'Seven-service card grid with hover accents and red reveal bar' },
      { url: '/captures/groverztax-com-au/desktop/06-cta.png', caption: 'Full-width CTA section with C4 Studios credit badge' },
    ],

    desktopScreenshots: [
      { url: '/captures/groverztax-com-au/desktop/01-hero.png', caption: 'Hero — floating math symbol physics simulation with social proof and wave divider' },
      { url: '/captures/groverztax-com-au/desktop/02-benefits.png', caption: 'Trust markers — Registered Tax Agent, fixed fees, fast turnaround, and document checklist' },
      { url: '/captures/groverztax-com-au/desktop/03-testimonials.png', caption: 'Client testimonials with star ratings, avatar initials, and attribution' },
      { url: '/captures/groverztax-com-au/desktop/04-calculator.png', caption: 'Interactive tax refund estimator using 2025-26 ATO resident rates' },
      { url: '/captures/groverztax-com-au/desktop/05-services.png', caption: 'Seven-service card grid with hover accents and red reveal bar' },
      { url: '/captures/groverztax-com-au/desktop/06-cta.png', caption: 'Full-width CTA section with C4 Studios credit badge' },
    ],

    mobileScreenshots: [
      { url: '/captures/groverztax-com-au/mobile/01-hero.png', caption: 'Mobile — hero with responsive typography and stacked CTA' },
      { url: '/captures/groverztax-com-au/mobile/02-calculator.png', caption: 'Mobile — tax refund estimator form stacked vertically' },
      { url: '/captures/groverztax-com-au/mobile/03-benefits.png', caption: 'Mobile — trust markers and checklist in single-column layout' },
      { url: '/captures/groverztax-com-au/mobile/04-testimonials.png', caption: 'Mobile — client testimonial cards' },
      { url: '/captures/groverztax-com-au/mobile/05-cta.png', caption: 'Mobile — CTA section with stacked buttons' },
      { url: '/captures/groverztax-com-au/mobile/06-services.png', caption: 'Mobile — service cards in single-column layout' },
    ],

    delivered: [
      'Complete website — design, development and deployment (React SPA on Vercel)',
      'Homepage with hero, stats bar, service grid, trust markers, document checklist, tax estimator, testimonials, and CTA',
      'About page with founder profile card, service overview, expectations grid, process timeline, and FAQ',
      'Services page with seven-service filterable accordion catalogue, client type grid, pricing section, process timeline, tax estimator, and FAQ',
      'Contact page with multi-field enquiry form, Google Maps embed, phone/email cards, and office info sidebar',
      'Custom 404 page with branded styling and navigation recovery links',
      'Interactive tax refund estimator calculator using 2025-26 ATO resident tax rates',
      'Contact form backend with Resend email integration, rate limiting, honeypot anti-spam, input sanitisation, and styled HTML emails',
      'Vercel serverless API route for contact form (with legacy Netlify Functions support)',
      'Responsive design — fully mobile-first from 320px to ultrawide',
      'Floating WhatsApp chat button linked to business number',
      'Google Maps embed for office location',
      'Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy)',
      'SEO meta tags (title, description, theme-color, lang="en-AU")',
      'C4 Studios credit badge with GSAP-animated SVG wordmark in footer and CTA sections',
      'Content writing and copywriting for all pages',
    ],

    features: [
      'Interactive tax refund estimator using 2025-26 ATO resident tax rates with real-time calculation',
      'Seven-service accordion system with category filtering (Personal, Business, Trusts & Companies, Finance) and Framer Motion animation',
      'Canvas-based floating math symbol physics simulation with elastic collisions, wall bouncing, and seeded randomness',
      'Liquid-glass hover effect on desktop navigation with radial gradient, backdrop blur, and spring physics',
      'Testimonial cards with five-star ratings, avatar initials, and decorative serif quotation marks',
      'Four-step visual process timeline with alternating layout and connecting gradient line',
      'Sticky header with backdrop blur, mobile hamburger navigation, and body scroll lock',
      'Document checklist section with two-column icon grid layout for appointment preparation',
      'Stats bar — Over 5000 returns, $99 individual, 5★ Google reviews, 100% ATO compliant',
      'ATO late-lodgement penalty warning banner with click-to-open info modal',
      'Contact form with honeypot anti-spam, server-side rate limiting, input sanitisation, and field-level validation',
      'Styled HTML email templates sent via Resend with branded navy header and Perth timezone formatting',
      'C4 Studios credit badge featuring GSAP morphing SVG wordmark with dormant/mono/colour state transitions',
      'Floating WhatsApp button with WhatsApp Business deep link',
      'Google Maps embed (sandboxed, lazy-loaded) with office address card',
      'Acknowledgement of Country for the Whadjuk people of the Noongar nation in footer',
      'prefers-reduced-motion respected — canvas animation disabled entirely for accessibility',
    ],

    stack: [
      'React 18.2 (Vite SPA)',
      'JavaScript (JSX)',
      'Vite 6.1',
      'React Router DOM 6.26',
      'Tailwind CSS 3.4 + shadcn/ui (Radix primitives)',
      'Framer Motion 11.16',
      'GSAP 3.14 + @gsap/react 2.1',
      'Lucide React 0.475',
      'Resend 6.10 (transactional email)',
      'PostCSS + Autoprefixer',
      'ESLint 9.x + Prettier 3.8',
      'Vercel (hosting + serverless functions)',
    ],

    integrations: [
      'Resend — transactional email for contact form submissions with styled HTML templates',
      'Google Maps Embed API — office location on contact page (sandboxed iframe, lazy-loaded)',
      'WhatsApp Business — floating chat button deep-linking to business number',
      'Vercel Serverless Functions — /api/contact POST endpoint for form processing',
      'Netlify Functions — legacy contact route via redirect',
    ],

    performance: [
      'Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP',
      'SEO: descriptive <title> with location + price, <meta description>, theme-color, lang="en-AU"',
      'Canvas animation respects prefers-reduced-motion — completely disabled for accessibility',
      'Canvas particle count halved on mobile viewports for GPU performance',
      'Google Maps iframe uses loading="lazy" and sandbox attributes for security and deferred load',
      'Vite code splitting and tree shaking for minimal bundle size',
      'Input sanitisation (NFKC normalisation, control char stripping, length limits) prevents injection',
      'Rate limiting on contact API (5 requests per 15-minute window per IP)',
      'Semantic HTML with proper heading hierarchy, nav, main, footer landmarks',
      'ARIA attributes on icon buttons, mobile menu toggle, form states',
      'Keyboard-accessible accordion and select via Radix UI primitives',
    ],

    challenges: [
      'Building a canvas-based floating symbol system with elastic collision physics that felt organic without being distracting — required seeded randomness, spin-transfer on collision, and angular velocity damping',
      'Designing a service accordion that scales across four categories with filtering, animated expand/collapse, and included-items checklists without layout shift',
      'Creating a tax refund estimator using real ATO brackets while clearly labelling it as an estimate — required careful disclaimer placement and bracket-accurate edge-case handling',
      'Implementing a contact form backend that works identically across Vercel serverless, Netlify Functions, and Vite dev middleware — solved with a shared service module and adapter layers',
      'Achieving a liquid-glass hover effect on desktop navigation that feels responsive and physical — solved with spring physics, getBoundingClientRect tracking, and layered radial gradients with backdrop blur',
    ],

    improvements: [
      'Add Open Graph and Twitter Card meta tags for social sharing previews',
      'Implement page-level code splitting with React.lazy() and Suspense to reduce initial bundle',
      'Add a sitemap.xml and robots.txt for improved search engine crawling',
      'Replace photo placeholder with actual professional photography of Ankit and the office',
      'Add analytics (Google Analytics or Plausible) for visitor tracking and contact form conversion',
    ],
  },
};

export function getCaseStudy(slug) {
  return CASE_STUDIES[slug] || null;
}

export function getAllCaseStudies() {
  return Object.values(CASE_STUDIES);
}