/*
 * Every static page the prerenderer writes real HTML for, with its sitemap
 * hints. Shared by scripts/prerender.mjs (what to render, what goes in the
 * sitemap) and src/lib/sitePath.js (which internal links get the trailing
 * slash the server serves). Case studies and the SEO registry pages are
 * added on top of this list in both places.
 */
export const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/About', priority: 0.7, changefreq: 'monthly' },
  { path: '/ServiceWeb', priority: 0.85, changefreq: 'monthly' },
  { path: '/c4i', priority: 0.85, changefreq: 'monthly' },
  { path: '/ServiceAI', priority: 0.8, changefreq: 'monthly' },
  { path: '/Lens', priority: 0.9, changefreq: 'monthly' },
  { path: '/Foresight', priority: 0.85, changefreq: 'monthly' },
  { path: '/ai-training-for-business', priority: 0.75, changefreq: 'monthly' },
  { path: '/ai-training-for-schools', priority: 0.75, changefreq: 'monthly' },
  { path: '/ai-training-for-law-firms', priority: 0.75, changefreq: 'monthly' },
  { path: '/ai-training-enquiry', priority: 0.5, changefreq: 'yearly' },
  { path: '/Portfolio', priority: 0.85, changefreq: 'weekly' },
  { path: '/start', priority: 0.7, changefreq: 'monthly' },
  { path: '/lead-engine', priority: 0.7, changefreq: 'monthly' },
  { path: '/private-ai', priority: 0.85, changefreq: 'monthly' },
  { path: '/c4sight-previews', priority: 0.7, changefreq: 'monthly' },
  { path: '/how-we-use-ai', priority: 0.75, changefreq: 'yearly' },
  { path: '/insights', priority: 0.75, changefreq: 'weekly' },
  // Prerendered so the URL resolves as a static file, but kept out of the
  // sitemap: it is the landing page for the unsubscribe link, not content.
  { path: '/unsubscribed', includeInSitemap: false },
  { path: '/opt-out', includeInSitemap: false },
  { path: '/Support', priority: 0.4, changefreq: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly' },
  // Contact is a real, indexable page again (see dist/_redirects note).
  { path: '/Contact', priority: 0.6, changefreq: 'yearly' },
];
