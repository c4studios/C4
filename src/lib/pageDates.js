/* global __PAGE_DATES__ */
/**
 * When each static page's content last changed, read from git at build time.
 *
 * vite.config.js runs `git log` over each route's `source` files (listed in
 * src/lib/prerenderRoutes.js) and bakes the result in as __PAGE_DATES__, a
 * map of route path to YYYY-MM-DD. It's the same reading scripts/prerender.mjs
 * gives the sitemap's <lastmod>, so a page's dateModified and its lastmod
 * agree. The prerendered HTML and the browser get the same constant, so it's
 * safe to render.
 *
 * A build with no git history leaves a route out. Read it with
 * PAGE_DATES[path] and let a missing date stay missing: an undefined field
 * drops out of the JSON-LD, which beats a made-up date.
 */
export const PAGE_DATES = typeof __PAGE_DATES__ === 'undefined' ? {} : __PAGE_DATES__;
