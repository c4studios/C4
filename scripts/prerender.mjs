#!/usr/bin/env node
/**
 * prerender.mjs — Static HTML prerendering for SEO and web crawlers.
 *
 * After `vite build` produces the SPA in dist/, this script spins up a
 * local server, visits every route with Playwright, and writes the
 * fully-rendered HTML back into dist/ so crawlers (ClaudeBot, Googlebot,
 * GPTBot, etc.) see real content instead of an empty <div id="root">.
 *
 * Usage:  node scripts/prerender.mjs
 * Called automatically by the "build" npm script.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { liveSeoPages, validateSeoEntry } from '../src/content/seo/registry.js';
import { STATIC_ROUTES } from '../src/lib/prerenderRoutes.js';
import { sitePath } from '../src/lib/sitePath.js';
import { generateOgImage } from './og-card.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const SEO_CONTENT_DIR = path.resolve(__dirname, '..', 'src', 'content', 'seo', 'pages');

const SITE_ORIGIN = 'https://c4studios.com.au';

// ── Routes to prerender ─────────────────────────────────────────────
// Each entry can carry sitemap hints (priority, changefreq).
// Static pages: the shared list in src/lib/prerenderRoutes.js.

// Case-study pages at their canonical path form (/CaseStudy/<slug>).
// Derived from the top-level entry keys in caseStudyData.jsx so this list can
// NEVER drift when entries are added or removed. Every entry in CASE_STUDIES
// is a real case study with a CaseStudy page.
const CASE_STUDY_SRC = await readFile(
  path.resolve(__dirname, '..', 'src', 'components', 'portfolio', 'caseStudyData.jsx'),
  'utf8',
);
/* An entry marked `hidden: true` is down for rework: no page, no sitemap line. */
const CASE_STUDY_SLUGS = CASE_STUDY_SRC.split(/^(?= {2}'[\w-]+':\s*\{)/m)
  .map((block) => ({
    slug: (block.match(/^ {2}'([\w-]+)':\s*\{/) || [])[1],
    hidden: /^ {4}hidden:\s*true/m.test(block),
  }))
  .filter((entry) => entry.slug && !entry.hidden)
  .map((entry) => entry.slug);
if (CASE_STUDY_SLUGS.length === 0) {
  throw new Error('prerender: failed to derive CASE_STUDY_SLUGS from caseStudyData.jsx');
}

// Programmatic SEO pages — sourced from the same registry App.jsx routes
// from, so prerender + sitemap coverage can never drift from the app.
// A live entry with broken metadata or a missing content module fails the
// build loudly rather than shipping a half-finished page.
function seoRoutes() {
  const problems = [];
  for (const entry of liveSeoPages()) {
    const issues = validateSeoEntry(entry);
    if (!existsSync(path.join(SEO_CONTENT_DIR, `${entry.slug}.js`))) {
      issues.push('missing content module');
    }
    if (issues.length) problems.push(`  /${entry.slug}: ${issues.join(', ')}`);
  }
  if (problems.length) {
    throw new Error(`Live SEO registry entries failed validation:\n${problems.join('\n')}`);
  }
  return liveSeoPages().map((entry) => ({
    path: `/${entry.slug}`,
    priority: entry.priority,
    changefreq: entry.changefreq,
  }));
}
const SEO_ROUTES = seoRoutes();


// ── Tiny static file server ─────────────────────────────────────────
function createStaticServer(dir) {
  const MIME = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.webp': 'image/webp',
  };

  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let filePath = path.join(dir, urlPath);

      // Serve index.html for SPA routes (no extension = not a static asset)
      if (!path.extname(filePath)) {
        filePath = path.join(dir, 'index.html');
      }

      try {
        const data = await readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      } catch {
        // Fallback to index.html for any missing file (SPA behaviour)
        try {
          const data = await readFile(path.join(dir, 'index.html'));
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end('Not found');
        }
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

// ── Prerender a single route ────────────────────────────────────────
async function prerenderRoute(page, baseUrl, routePath, outputPath) {
  const url = `${baseUrl}${routePath}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait a bit extra for animations/lazy content to settle
  await page.waitForTimeout(1500);

  let html = await page.content();

  // Inject a meta tag so we can identify prerendered pages
  html = html.replace(
    '</head>',
    '  <meta name="prerender-status" content="prerendered">\n  </head>'
  );

  const dir = path.dirname(outputPath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await writeFile(outputPath, html, 'utf-8');
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  if (!existsSync(DIST)) {
    console.error('❌ dist/ not found — run "vite build" first.');
    process.exit(1);
  }

  console.log('🔍 Starting prerender…');
  const { server, port } = await createStaticServer(DIST);
  const baseUrl = `http://127.0.0.1:${port}`;

  // Some CI builds (the Vercel preview) don't ship Playwright browser
  // binaries. The SPA still works without prerendered HTML, so they degrade
  // to sitemap-only instead of failing the whole build.
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    // Cloudflare Pages' own git build is the exception. Its shell went live
    // in production for a few minutes on every push until the GitHub Actions
    // deploy replaced it (site_issues 146). Failing here keeps the last good
    // deployment live; .github/workflows/deploy.yml deploys production.
    if (process.env.CF_PAGES === '1') {
      console.error('❌ No Playwright browser in the Cloudflare Pages build. Refusing to ship the unprerendered shell; the GitHub Actions workflow deploys production.');
      console.error(`    (${String(err).split('\n')[0]})`);
      server.close();
      process.exit(1);
    }
    console.warn('⚠️  No Playwright browser available — skipping HTML prerender + OG image.');
    console.warn(`    (${String(err).split('\n')[0]})`);
    console.log('  ⏳ sitemap.xml');
    await writeSitemap(path.join(DIST, 'sitemap.xml'));
    console.log('  ✅ sitemap.xml');
    server.close();
    console.log('\n🎉 Sitemap generated; prerender skipped (no browser).');
    return;
  }
  const context = await browser.newContext({
    userAgent: 'C4-Prerenderer/1.0',
    viewport: { width: 1280, height: 800 },
  });
  // The home intro plays once per visitor (localStorage-gated) and briefly
  // unmounts the page content while it runs — seed the flag so the capture
  // can never race the overlay and ship an H1-less home page.
  await context.addInitScript(() => {
    try { localStorage.setItem('c4_intro_seen', '1'); } catch { /* storage may be unavailable */ }
  });
  const page = await context.newPage();

  // Suppress console noise from the rendered app
  page.on('console', () => {});
  page.on('pageerror', () => {});

  let count = 0;

  // Prerender static routes
  for (const { path: routePath } of STATIC_ROUTES) {
    const outFile = routePath === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, routePath, 'index.html');

    console.log(`  ⏳ ${routePath}`);
    await prerenderRoute(page, baseUrl, routePath, outFile);
    count++;
    console.log(`  ✅ ${routePath}`);
  }

  // Prerender programmatic SEO pages
  for (const { path: routePath } of SEO_ROUTES) {
    const outFile = path.join(DIST, routePath, 'index.html');

    console.log(`  ⏳ ${routePath}`);
    await prerenderRoute(page, baseUrl, routePath, outFile);
    count++;
    console.log(`  ✅ ${routePath}`);
  }

  // Prerender case study pages
  for (const slug of CASE_STUDY_SLUGS) {
    const route = `/CaseStudy/${slug}`;
    const outFile = path.join(DIST, 'CaseStudy', slug, 'index.html');

    console.log(`  ⏳ ${route}`);
    await prerenderRoute(page, baseUrl, route, outFile);
    count++;
    console.log(`  ✅ ${route}`);
  }


  // 404.html — Cloudflare serves this with a real 404 status via _redirects.
  // Rendered from a deliberately non-existent path so the app's catch-all
  // route produces its PageNotFound state, then marked noindex so the error
  // page itself can never turn up in results.
  console.log('  ⏳ 404.html');
  {
    const outFile = path.join(DIST, '404.html');
    await prerenderRoute(page, baseUrl, '/__not-found__', outFile);
    let html = await readFile(outFile, 'utf-8');
    const robots = /<meta name="robots"[^>]*>/g;
    html = robots.test(html)
      ? html.replace(robots, '<meta name="robots" content="noindex, follow" />')
      : html.replace('</head>', '<meta name="robots" content="noindex, follow" /></head>');
    // Canonical/og:url would otherwise point at the fake path.
    html = html.replace(/<link rel="canonical"[^>]*>/, '');
    html = html.replace(/<meta property="og:url"[^>]*>/, '');
    await writeFile(outFile, html, 'utf-8');
  }
  console.log('  ✅ 404.html');

  // llms.txt: the hand-written file from public/, plus the registry's guides,
  // articles, industry and suburb pages, and every link in its served form
  // (the slash form; the un-slashed one is a 308).
  {
    const file = path.join(DIST, 'llms.txt');
    if (existsSync(file)) {
      let txt = await readFile(file, 'utf-8');
      const live = liveSeoPages();
      const section = (title, type) => {
        const items = live.filter((e) => e.type === type);
        if (!items.length) return '';
        return `## ${title}\n\n${items.map((e) => `- [${e.name}](${SITE_ORIGIN}/${e.slug}/): ${String(e.description || '').replace(/\s+/g, ' ').trim()}`).join('\n')}\n\n`;
      };
      const generated = section('Guides', 'comparison') + section('Articles', 'article') + section('Industries', 'industry') + section('Suburbs', 'suburb');
      txt = txt.replace(/<!-- The build inserts[^>]*-->\r?\n\r?\n/, generated);
      txt = txt.replace(/\((https:\/\/c4studios\.com\.au)(\/[^)\s]*)\)/g, (m, origin, p) => `(${origin}${sitePath(p)})`);
      await writeFile(file, txt, 'utf-8');
      console.log(`  ✅ llms.txt (${(txt.match(/^- \[/gm) || []).length} links)`);
    }
  }

  // The default share card (1200×630), drawn in Archivo from dist/fonts.
  console.log('  ⏳ og-image.png');
  {
    const card = await generateOgImage(browser, baseUrl, path.join(DIST, 'og-image.png'));
    if (!card.archivo) console.warn('  ⚠️  og-image.png: Archivo did not load, so the card used a fallback face.');
    if (!card.fits) console.warn('  ⚠️  og-image.png: the text overran the card even at its smallest sizes.');
    else if (card.h1Size !== 92 || card.subSize !== 22) console.warn(`  ⚠️  og-image.png: stepped the type down to fit (headline ${card.h1Size}px, paragraph ${card.subSize}px).`);
  }
  console.log('  ✅ og-image.png');

  // Generate sitemap.xml from STATIC_ROUTES + case studies
  console.log('  ⏳ sitemap.xml');
  await writeSitemap(path.join(DIST, 'sitemap.xml'));
  console.log('  ✅ sitemap.xml');

  await browser.close();
  server.close();

  console.log(`\n🎉 Prerendered ${count} pages into dist/`);
}

// ── sitemap.xml ─────────────────────────────────────────────────────
const REPO_ROOT = path.resolve(__dirname, '..');

// Real per-file lastmod from git (committer date, YYYY-MM-DD). Falls back to
// `fallback` when git history is unavailable (e.g. a shallow CI checkout — see
// fetch-depth: 0 in .github/workflows/deploy.yml — or a non-git build). Stamping
// the true content date instead of "today" on every build keeps <lastmod> a
// trustworthy crawl signal rather than fake daily freshness. `relPaths` is one
// path or several (the newest commit to any of them).
function gitLastmod(relPaths, fallback) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...[].concat(relPaths)], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : fallback;
  } catch {
    return fallback;
  }
}

/** Sitemap locs must match the URL that actually returns 200. Cloudflare Pages
 *  serves prerendered routes from a directory, so the un-slashed form
 *  308-redirects. See withTrailingSlash in src/lib/seo.js. */
function sitemapPath(p) {
  if (!p || p === '/') return '/';
  if (/[?#]/.test(p)) return p;
  if (/\.[a-zA-Z0-9]+$/.test(p)) return p;
  return p.endsWith('/') ? p : `${p}/`;
}

async function writeSitemap(outputPath) {
  const today = new Date().toISOString().slice(0, 10);
  // Case studies and products share one data module each, so they resolve to a
  // single accurate "last edited" date rather than a per-build timestamp.
  const caseStudyLastmod = gitLastmod('src/components/portfolio/caseStudyData.jsx', today);
  const urls = [];

  for (const r of [...STATIC_ROUTES, ...SEO_ROUTES]) {
    if (r.includeInSitemap === false) continue;
    // Programmatic SEO pages each have their own content module, and static
    // pages name their source files in prerenderRoutes.js, so every page gets
    // the date its content last changed. Until 15 Oct 2026 the static pages got
    // the build date on every deploy (SEO audit L9).
    const seoModule = `src/content/seo/pages${r.path}.js`;
    const sources = r.source || (existsSync(path.join(REPO_ROOT, seoModule)) ? [seoModule] : null);
    const missing = (sources || []).filter((p) => !existsSync(path.join(REPO_ROOT, p)));
    if (!sources || missing.length) {
      throw new Error(`sitemap: ${r.path} needs a source file for its lastmod${missing.length ? ` (not found: ${missing.join(', ')})` : ''}. See src/lib/prerenderRoutes.js.`);
    }
    const lastmod = gitLastmod(sources, today);
    urls.push({
      loc: `${SITE_ORIGIN}${r.path === '/' ? '/' : sitemapPath(r.path)}`,
      lastmod,
      changefreq: r.changefreq,
      priority: r.priority,
    });
  }
  for (const slug of CASE_STUDY_SLUGS) {
    urls.push({
      loc: `${SITE_ORIGIN}/CaseStudy/${slug}/`,
      lastmod: caseStudyLastmod,
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>` +
        (u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : '') +
        (typeof u.priority === 'number' ? `\n    <priority>${u.priority.toFixed(2)}</priority>` : '') +
        '\n  </url>'
    ),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(outputPath, xml, 'utf-8');
}

main().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
