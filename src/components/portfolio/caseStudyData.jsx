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
};

export function getCaseStudy(slug) {
  return CASE_STUDIES[slug] || null;
}

export function getAllCaseStudies() {
  return Object.values(CASE_STUDIES);
}