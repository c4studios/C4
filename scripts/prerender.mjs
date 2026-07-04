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
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { liveSeoPages, validateSeoEntry } from '../src/content/seo/registry.js';
import { PRODUCT_SLUGS } from '../src/components/software/productData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const SEO_CONTENT_DIR = path.resolve(__dirname, '..', 'src', 'content', 'seo', 'pages');

const SITE_ORIGIN = 'https://c4studios.com.au';

// ── Routes to prerender ─────────────────────────────────────────────
// Each entry can carry sitemap hints (priority, changefreq).
// Static pages (from pages.config.js)
const STATIC_ROUTES = [
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
  { path: '/software', priority: 0.7, changefreq: 'monthly' },
  { path: '/start', priority: 0.7, changefreq: 'monthly' },
  { path: '/lead-engine', priority: 0.7, changefreq: 'monthly' },
  { path: '/private-ai', priority: 0.85, changefreq: 'monthly' },
  { path: '/Support', priority: 0.4, changefreq: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly' },
  // Contact 301-redirects to Support, exclude from sitemap
  { path: '/Contact', priority: 0, changefreq: null, includeInSitemap: false },
];

// Case-study pages (query-param based: /CaseStudy?slug=xxx)
// Derived from the top-level entry keys in caseStudyData.jsx so this list can
// NEVER drift when entries are added or removed. Every entry in CASE_STUDIES
// is a real case study with a CaseStudy page (saas products like Quotr /
// ReturnDesk now render full case studies too).
const CASE_STUDY_SRC = await readFile(
  path.resolve(__dirname, '..', 'src', 'components', 'portfolio', 'caseStudyData.jsx'),
  'utf8',
);
const CASE_STUDY_SLUGS = [
  ...CASE_STUDY_SRC.matchAll(/^ {2}'([\w-]+)':\s*\{/gm),
].map((match) => match[1]);
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

// C4 Originals product pages (query-param based: /SoftwareProduct?slug=xxx)
// PRODUCT_SLUGS is imported from productData.js (the single source of truth
// the /software page renders from) so prerender + sitemap never drift.

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

  // CI environments (e.g. Cloudflare Pages builds) don't ship Playwright
  // browser binaries. The SPA still works without prerendered HTML, so
  // degrade to sitemap-only instead of failing the whole build.
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
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
    const route = `/CaseStudy?slug=${slug}`;
    const outFile = path.join(DIST, 'CaseStudy', slug, 'index.html');

    console.log(`  ⏳ ${route}`);
    await prerenderRoute(page, baseUrl, route, outFile);
    count++;
    console.log(`  ✅ ${route}`);
  }

  // Prerender C4 Originals product pages
  for (const slug of PRODUCT_SLUGS) {
    const route = `/SoftwareProduct?slug=${slug}`;
    const outFile = path.join(DIST, 'SoftwareProduct', slug, 'index.html');

    console.log(`  ⏳ ${route}`);
    await prerenderRoute(page, baseUrl, route, outFile);
    count++;
    console.log(`  ✅ ${route}`);
  }

  // Generate the OG image (1200×630)
  console.log('  ⏳ og-image.png');
  await generateOgImage(browser, path.join(DIST, 'og-image.png'));
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
async function writeSitemap(outputPath) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  for (const r of [...STATIC_ROUTES, ...SEO_ROUTES]) {
    if (r.includeInSitemap === false) continue;
    urls.push({
      loc: `${SITE_ORIGIN}${r.path === '/' ? '/' : r.path}`,
      lastmod: today,
      changefreq: r.changefreq,
      priority: r.priority,
    });
  }
  for (const slug of CASE_STUDY_SLUGS) {
    urls.push({
      loc: `${SITE_ORIGIN}/CaseStudy/${slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    });
  }
  for (const slug of PRODUCT_SLUGS) {
    urls.push({
      loc: `${SITE_ORIGIN}/SoftwareProduct/${slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
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

// ── og-image.png — 1200×630 social share card ───────────────────────
async function generateOgImage(browser, outputPath) {
  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: #0F1115;
    color: #ECE7DE;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }
  .grain { position: absolute; inset: 0; opacity: 0.06; pointer-events: none;
    background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px);
    background-size: 3px 3px; }
  .glow { position: absolute; bottom: -200px; left: 50%; transform: translateX(-50%);
    width: 900px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(179,58,58,0.18), transparent 60%);
    filter: blur(60px); }
  .frame { position: absolute; inset: 56px; border: 1px solid rgba(236,231,222,0.08); border-radius: 14px; }
  .label { position: absolute; top: 88px; left: 88px;
    font-size: 14px; letter-spacing: 0.32em; text-transform: uppercase;
    color: rgba(236,231,222,0.45); font-weight: 500; }
  .label::before { content: ""; display: inline-block; width: 36px; height: 1px;
    background: #B33A3A; margin-right: 14px; transform: translateY(-4px); }
  h1 { position: absolute; left: 88px; right: 88px; top: 200px;
    font-size: 92px; font-weight: 600; letter-spacing: -0.045em; line-height: 0.98;
    max-width: 980px; }
  .accent { color: #B33A3A; }
  .sub { position: absolute; left: 88px; right: 88px; bottom: 180px;
    font-size: 22px; line-height: 1.45; color: rgba(236,231,222,0.65);
    font-weight: 400; max-width: 820px; letter-spacing: -0.005em; }
  .footer { position: absolute; left: 88px; right: 88px; bottom: 88px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(236,231,222,0.5); font-weight: 500; }
  .brand { font-size: 22px; letter-spacing: -0.02em; text-transform: none; color: #ECE7DE; font-weight: 600; }
</style></head><body>
  <div class="glow"></div>
  <div class="grain"></div>
  <div class="frame"></div>
  <div class="label">C4 Studios — Perth</div>
  <h1>Websites, AI automations <span class="accent">&amp;</span> photography.</h1>
  <p class="sub">A Perth design and development studio building flagship websites, AI automations and brand-led photography for ambitious founders.</p>
  <div class="footer">
    <span class="brand">c4studios.com.au</span>
    <span>Founder-led · Est. 2022</span>
  </div>
</body></html>`;

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: outputPath, fullPage: false, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await page.close();
}

main().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
