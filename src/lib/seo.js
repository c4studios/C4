/**
 * SEO constants and helpers.
 *
 * SITE_URL is the canonical origin used across <link rel="canonical">,
 * og:url, sitemap.xml, and structured data. Update here, propagates everywhere.
 */

export const SITE_URL = 'https://c4studios.com.au';
export const SITE_NAME = 'C4 Studios';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ORG_INFO = {
  name: 'C4 Studios',
  legalName: 'C4 Studios',
  url: SITE_URL,
  logo: `${SITE_URL}/c4-logo.png`,
  description:
    'Founder-led Perth studio building custom high-performance websites, AI ' +
    'automations and agents, and brand photography, videography and motion ' +
    'graphics for ambitious founders and businesses.',
  founder: 'Caleb Scott',
  foundingDate: '2022',
  email: 'caleb@c4studios.com.au',
  // Already public: it is on the email signature and the /welcome booking sheet.
  telephone: '+61479000404',
  region: 'Perth, Western Australia',
  country: 'AU',
  areaServed: ['Perth', 'Fremantle', 'Western Australia', 'Australia'],
  // Entity anchors for Google's Knowledge Graph and AI-search resolution. Every
  // URL here must be a real, live, C4-owned profile — this is how a search/AI
  // engine confirms "C4 Studios" is one consistent entity across the web.
  // Add LinkedIn, YouTube, Facebook, TikTok, etc. as those profiles are confirmed.
  sameAs: [
    'https://www.instagram.com/c4.studio/',
    'https://www.linkedin.com/in/caleb-scott-525a7a3b9/',
  ],
};

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// 180 keeps this a safety net against runaway strings while allowing
// deliberately written descriptions a little past Google's ~160 display
// cutoff (search engines index the full tag either way).
export function clampDescription(text, max = 180) {
  if (!text) return '';
  const single = String(text).replace(/\s+/g, ' ').trim();
  if (single.length <= max) return single;
  const truncated = single.slice(0, max - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 80 ? lastSpace : truncated.length)}…`;
}
