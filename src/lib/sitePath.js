/*
 * The final address of an internal page.
 *
 * Cloudflare serves every prerendered page from a directory, so /About
 * answers with a 308 to /About/. Links that point at the un-slashed form cost
 * every visitor and every crawler a redirect, and on 15 Sep 2026 Search
 * Console counted 177 URLs as "Page with redirect", almost all of them from
 * internal links. sitePath() returns the form the server actually serves.
 *
 * Only paths known to be prerendered get the slash. An SPA-only route such as
 * /welcome has no directory behind it, so its slashed form would 404; it is
 * left alone, as are the root, asset paths, external URLs and anything that
 * already ends in a slash. A query string or hash stays after the slash
 * (/start/?service=lens).
 */
import { STATIC_ROUTES } from './prerenderRoutes.js';
import { liveSeoPages } from '../content/seo/registry.js';

let known = null;
function knownPaths() {
  if (!known) {
    known = new Set(STATIC_ROUTES.map((r) => r.path));
    for (const entry of liveSeoPages()) known.add(`/${entry.slug}`);
  }
  return known;
}

export function sitePath(to) {
  if (typeof to !== 'string' || !to.startsWith('/') || to.startsWith('//')) return to;
  const m = to.match(/^([^?#]*)(.*)$/);
  const path = m[1];
  const rest = m[2];
  if (path === '/' || path.endsWith('/')) return to;
  if (knownPaths().has(path) || /^\/CaseStudy\/[A-Za-z0-9-]+$/.test(path)) return `${path}/${rest}`;
  return to;
}

/* For react-router `to` values: a string, or a { pathname, search, hash } object. */
export function siteTo(to) {
  if (to && typeof to === 'object' && typeof to.pathname === 'string') return { ...to, pathname: sitePath(to.pathname) };
  return sitePath(to);
}
