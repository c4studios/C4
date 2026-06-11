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
  founder: 'Caleb Walker',
  foundingDate: '2022',
  email: 'caleb@c4studios.com.au',
  region: 'Perth, Western Australia',
  country: 'AU',
  areaServed: ['Perth', 'Fremantle', 'Western Australia', 'Australia'],
  sameAs: [
    // Add social profiles here when available
  ],
};

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function clampDescription(text, max = 160) {
  if (!text) return '';
  const single = String(text).replace(/\s+/g, ' ').trim();
  if (single.length <= max) return single;
  const truncated = single.slice(0, max - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 80 ? lastSpace : truncated.length)}…`;
}
