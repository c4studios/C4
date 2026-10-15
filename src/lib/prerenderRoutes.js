/*
 * Every static page the prerenderer writes real HTML for, with its sitemap
 * hints. Shared by scripts/prerender.mjs (what to render, what goes in the
 * sitemap) and src/lib/sitePath.js (which internal links get the trailing
 * slash the server serves). Case studies and the SEO registry pages are
 * added on top of this list in both places.
 *
 * `source` is what the page is made of: its page file, plus the component
 * folder or data file that holds its content. The sitemap's <lastmod> is the
 * last commit to any of them, so it moves when the page does and not on every
 * build. Every route in the sitemap needs one, and the build fails on a path
 * that doesn't exist, so a renamed file can't quietly fall back to today.
 */
export const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly', source: ['src/pages/Home.jsx', 'src/components/home'] },
  { path: '/About', priority: 0.7, changefreq: 'monthly', source: ['src/pages/About.jsx', 'src/components/about'] },
  { path: '/ServiceWeb', priority: 0.85, changefreq: 'monthly', source: ['src/pages/ServiceWeb.jsx', 'src/components/web-arm'] },
  { path: '/Lens', priority: 0.9, changefreq: 'monthly', source: ['src/pages/Lens.jsx', 'src/components/lens'] },
  { path: '/seo-and-copywriting', priority: 0.85, changefreq: 'monthly', source: ['src/pages/SeoCopy.jsx', 'src/components/seo-copy'] },
  // Logo Design, the fourth arm from 9 Oct 2026.
  { path: '/logo-design', priority: 0.85, changefreq: 'monthly', source: ['src/pages/LogoDesign.jsx', 'src/components/logo-design'] },
  // The C4Site pages (/Foresight, the three /ai-training-for-* pages,
  // /ai-training-enquiry and /c4sight-previews) moved to c4site.com.au on
  // 9 Oct 2026. public/_redirects sends their old paths there, so they are
  // neither prerendered nor listed in the sitemap here.
  // C4i went the same way on 9 Oct 2026: /c4i, /ServiceAI, /private-ai and
  // /lead-engine redirect to c4site.com.au, as do the AI & automation pages
  // that the SEO registry used to generate.
  // The portfolio folder holds caseStudyData.jsx, which the grid is built from.
  { path: '/Portfolio', priority: 0.85, changefreq: 'weekly', source: ['src/pages/Portfolio.jsx', 'src/components/portfolio'] },
  { path: '/start', priority: 0.7, changefreq: 'monthly', source: ['src/pages/StartProject.jsx'] },
  { path: '/how-we-use-ai', priority: 0.75, changefreq: 'yearly', source: ['src/pages/HowWeUseAI.jsx'] },
  // The article list on /insights comes from the registry.
  { path: '/insights', priority: 0.75, changefreq: 'weekly', source: ['src/pages/Insights.jsx', 'src/components/seo/insights.css', 'src/content/seo/registry.js'] },
  // Prerendered so the URL resolves as a static file, but kept out of the
  // sitemap: it is the landing page for the unsubscribe link, not content.
  { path: '/unsubscribed', includeInSitemap: false },
  { path: '/opt-out', includeInSitemap: false },
  { path: '/Support', priority: 0.4, changefreq: 'yearly', source: ['src/pages/Support.jsx'] },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly', source: ['src/pages/PrivacyPolicy.jsx'] },
  { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly', source: ['src/pages/TermsOfService.jsx'] },
  // Contact is a real, indexable page again (see dist/_redirects note).
  { path: '/Contact', priority: 0.6, changefreq: 'yearly', source: ['src/pages/Contact.jsx'] },
];
