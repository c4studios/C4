/**
 * SEO constants and helpers.
 *
 * SITE_URL is the canonical origin used across <link rel="canonical">,
 * og:url, sitemap.xml, and structured data. Update here, propagates everywhere.
 */

export const SITE_URL = 'https://c4studios.com.au';
export const SITE_NAME = 'C4 Studios';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * The canonical, C4-owned public profiles. SINGLE SOURCE OF TRUTH: schema's
 * sameAs, the footer, and the portfolio hero all read from here.
 *
 * They used to be hardcoded in three places, which is exactly how the Instagram
 * handle silently drifted when the account was renamed to c4studiosperth: the
 * footer and the structured data ended up pointing at two different accounts,
 * which splits the entity signal that sameAs exists to consolidate. Add or
 * change a profile HERE and nowhere else.
 */
export const PROFILES = {
  instagram: 'https://www.instagram.com/c4studiosperth/',
  linkedinCompany: 'https://www.linkedin.com/company/c4studios',
  linkedinPersonal: 'https://www.linkedin.com/in/caleb-scott-525a7a3b9/',
  github: 'https://github.com/c4studios',
  // Google Business Profile, by CID. The stable form: share.google and
  // maps.app.goo.gl links are redirects that can change, which would poison
  // the entity signal. CID 13008624145149649483 = 0xb487eabcc436e24b.
  googleBusiness: 'https://maps.google.com/?cid=13008624145149649483',
  facebook: 'https://www.facebook.com/c4studiosperth',
};

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
  // Sourced from PROFILES so these can never drift from the visible links.
  // The two LinkedIn entries both stay: one anchors the founder, the other the
  // business, and Google resolves them as related rather than duplicate.
  sameAs: [
    PROFILES.instagram,
    PROFILES.linkedinPersonal,
    PROFILES.linkedinCompany,
    PROFILES.googleBusiness,
    PROFILES.facebook,
    PROFILES.github,
  ],
};

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL;
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${withTrailingSlash(clean)}`;
}

/**
 * Cloudflare Pages serves prerendered routes from a directory, so /Portfolio
 * 308-redirects to /Portfolio/. Canonicals, og:url and the sitemap were all
 * emitting the un-slashed form, which meant every URL we handed Google pointed
 * at a redirect rather than the 200. Google resolved it, and said so: the URL
 * inspection for /Portfolio reported "Page availability ... with redirect".
 *
 * Left alone it costs two requests per URL of crawl budget and puts a
 * self-referential canonical on a non-200 address. Anything carrying a file
 * extension or a query/hash is left untouched.
 */
export function withTrailingSlash(pathname) {
  if (!pathname || pathname === '/') return '/';
  if (/[?#]/.test(pathname)) return pathname;
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
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
