#!/usr/bin/env node
/**
 * Curated portfolio capture for DS Racing Karts.
 *
 * Navigates to each page of https://www.dsracingkarts.com.au/ and captures
 * specific sections chosen for portfolio storytelling quality.
 *
 * This is the centrepiece project — 30 desktop + 9 mobile screenshots.
 *
 * NOTE: Some screenshots require specific app state that can't be automated:
 *   - 04-game-racing: Game mid-race (requires playing the game)
 *   - 13-cart: Cart with items (requires adding products)
 *   - 14-checkout: Checkout with form filled (requires cart items)
 *   - 15-confirmation: Order confirmation (requires completed order)
 *   - 25-search: Search autocomplete open (requires typing a query)
 *   - 27/28/29-admin-*: Admin pages (requires auth)
 *
 *   These are captured as best as possible from their initial/empty states.
 *   For portfolio-perfect versions, take manual screenshots and replace.
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const SITE = 'https://www.dsracingkarts.com.au';
const SLUG = 'dsracingkarts-com-au';
const OUT_ROOT = path.resolve('public', 'captures', SLUG);

// ── Target definitions ──────────────────────────────────────────────

const TARGETS = [
  // ── HOMEPAGE SECTIONS ──
  {
    id: '01-hero',
    label: 'hero',
    page: '/',
    caption: 'Homepage hero — "BUILT FOR SPEED. ENGINEERED TO WIN." with autoplay video and cycling background images',
    selector: null, // Above the fold
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
      mobile:  { x: 0, y: 0, w: 430, h: 932 },
    },
  },
  {
    id: '02-trust-banner',
    label: 'trust-banner',
    page: '/',
    caption: 'Trust banner — Race-Ready Parts, Expert Service, Australia-Wide shipping',
    scrollTo: 900,
    autoDetect: { selector: '[class*="trust"], [class*="banner"], [class*="value-prop"]', fallbackScroll: 900 },
    crop: {
      desktop: { x: 0, y: 880, w: 1440, h: 200 },
    },
    desktopOnly: true,
  },
  {
    id: '03-game-teaser',
    label: 'game-teaser',
    page: '/',
    caption: 'DSR Grand Prix mini-game teaser with "PRESS START" CTA',
    scrollTo: 1200,
    crop: {
      desktop: { x: 0, y: 1050, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '04-game-racing',
    label: 'game-racing',
    page: '/',
    caption: 'DSR Grand Prix in action — two karts racing head-to-head on The Circuit',
    // NOTE: This needs manual capture — game must be actively playing
    scrollTo: 1200,
    crop: {
      desktop: { x: 0, y: 1050, w: 1440, h: 900 },
    },
    desktopOnly: true,
    manualNote: 'Capture while game is actively running mid-race',
  },
  {
    id: '05-categories',
    label: 'categories',
    page: '/',
    caption: 'Shop by Category grid with custom hand-drawn SVG icons',
    scrollTo: 2200,
    crop: {
      desktop: { x: 0, y: 2100, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '06-history',
    label: 'history',
    page: '/',
    caption: 'History timeline — scroll-driven trunk growth with alternating cards and lightbox images',
    scrollTo: 3200,
    crop: {
      desktop: { x: 0, y: 3100, w: 1440, h: 1000 },
    },
    desktopOnly: true,
  },
  {
    id: '07-speedometer',
    label: 'speedometer',
    page: '/',
    caption: 'RPM tachometer stats counter — 500+ Parts, 40 Years, 1000+ Karts with redline bounce',
    scrollTo: 4400,
    crop: {
      desktop: { x: 0, y: 4300, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '08-race-animation',
    label: 'race-animation',
    page: '/',
    caption: 'Scroll-pinned SVG race animation — two detailed top-down karts with exhaust glow',
    scrollTo: 5500,
    crop: {
      desktop: { x: 0, y: 5400, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '09-latest-products',
    label: 'latest-products',
    page: '/',
    caption: 'Latest Products carousel with live pricing from Supabase',
    scrollTo: 6800,
    crop: {
      desktop: { x: 0, y: 6700, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '10-newsletter',
    label: 'newsletter',
    page: '/',
    caption: '"Stay in the Fast Lane" newsletter signup with chequered background',
    scrollTo: 7800,
    crop: {
      desktop: { x: 0, y: 7700, w: 1440, h: 600 },
    },
    desktopOnly: true,
  },

  // ── SHOP ──
  {
    id: '11-shop',
    label: 'shop',
    page: '/shop',
    caption: 'Shop page — 499+ products with category sidebar, sort, pagination, and search',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1100 },
      mobile:  { x: 0, y: 0, w: 430, h: 1200 },
    },
  },

  // ── PRODUCT ──
  {
    id: '12-product',
    label: 'product',
    page: '/shop', // Will navigate to first product dynamically
    caption: 'Product detail page with image gallery, SKU, pricing, stock status, and add-to-cart',
    findProduct: true,
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1000 },
      mobile:  { x: 0, y: 0, w: 430, h: 1000 },
    },
  },

  // ── CART ──
  {
    id: '13-cart',
    label: 'cart',
    page: '/cart',
    caption: 'Shopping cart with quantity controls, GST calculation, and checkout CTA',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
      mobile:  { x: 0, y: 0, w: 430, h: 932 },
    },
    manualNote: 'Best with items in cart — may show empty state',
  },

  // ── CHECKOUT ──
  {
    id: '14-checkout',
    label: 'checkout',
    page: '/checkout',
    caption: 'Checkout — customer details, shipping address, Square Web Payments card form',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1000 },
    },
    desktopOnly: true,
    manualNote: 'Best with items in cart and form partially filled',
  },

  // ── CONFIRMATION ──
  {
    id: '15-confirmation',
    label: 'confirmation',
    page: '/checkout/confirmation',
    caption: 'Order confirmation — DSR-XXXXX number with 3-step "What happens next" guide',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
    },
    desktopOnly: true,
    manualNote: 'Requires completed order — will likely redirect without orderId',
  },

  // ── SERVICES ──
  {
    id: '16-services',
    label: 'services',
    page: '/services',
    caption: 'Services page — 7 expandable service cards with included-items checklists',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1100 },
      mobile:  { x: 0, y: 0, w: 430, h: 1200 },
    },
  },
  {
    id: '17-workshop',
    label: 'workshop',
    page: '/services',
    caption: '"Built for Performance" workshop showcase with cut-corner image',
    scrollTo: 1200,
    crop: {
      desktop: { x: 0, y: 1100, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '18-racewear',
    label: 'racewear',
    page: '/services',
    caption: 'Custom racewear gallery — 12 product photos in responsive grid',
    scrollTo: 2200,
    crop: {
      desktop: { x: 0, y: 2100, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },

  // ── ABOUT ──
  {
    id: '19-about-founder',
    label: 'about-founder',
    page: '/about',
    caption: 'Dion Scott founder profile with photo, blockquote bio, and career highlights',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1000 },
    },
    desktopOnly: true,
  },
  {
    id: '20-teams',
    label: 'teams',
    page: '/about',
    caption: 'Racing teams carousel — 9 team profiles with numbers, logos, and accent colours',
    scrollTo: 1200,
    crop: {
      desktop: { x: 0, y: 1100, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '21-results',
    label: 'results',
    page: '/about',
    caption: 'Results timeline — 2024 ERC Podiums, 2023 Endurance Victories, 2021 SEK Wins',
    scrollTo: 2200,
    crop: {
      desktop: { x: 0, y: 2100, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
  {
    id: '22-chassis',
    label: 'chassis',
    page: '/about',
    caption: '"Know Your Chassis" — Sprint, Endurance, and DSR Predator technical breakdowns',
    scrollTo: 3200,
    crop: {
      desktop: { x: 0, y: 3100, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },

  // ── SPONSORS ──
  {
    id: '23-sponsors',
    label: 'sponsors',
    page: '/sponsors',
    caption: 'Sponsor carousel — 19+ logos in infinite CSS scroll with gradient fade edges',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },

  // ── CONTACT ──
  {
    id: '24-contact',
    label: 'contact',
    page: '/contact',
    caption: 'Contact page with DSR-branded form, location info, and appointment-only notice',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1000 },
      mobile:  { x: 0, y: 0, w: 430, h: 1200 },
    },
  },

  // ── SEARCH ──
  {
    id: '25-search',
    label: 'search',
    page: '/shop',
    caption: 'Search autocomplete with Ctrl+K hotkey, rich results with images and categories',
    triggerSearch: true,
    crop: {
      desktop: { x: 200, y: 0, w: 1040, h: 700 },
    },
    desktopOnly: true,
  },

  // ── SCROLL VIDEO ──
  {
    id: '26-scroll-video',
    label: 'scroll-video',
    page: '/',
    caption: '3D perspective video container with scroll-driven rotation and red radial glow',
    scrollTo: 500,
    crop: {
      desktop: { x: 0, y: 400, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },

  // ── ADMIN (requires auth — will capture login or whatever is publicly visible) ──
  {
    id: '27-admin-dashboard',
    label: 'admin-dashboard',
    page: '/admin',
    caption: 'Admin dashboard — product/order/customer counts, recent orders, low stock alerts',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1000 },
    },
    desktopOnly: true,
    manualNote: 'Requires admin auth — will capture login redirect or whatever is visible',
  },
  {
    id: '28-admin-products',
    label: 'admin-products',
    page: '/admin/products',
    caption: 'Admin product management — search, status filter, stock colour coding, pagination',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1000 },
    },
    desktopOnly: true,
    manualNote: 'Requires admin auth',
  },
  {
    id: '29-admin-editor',
    label: 'admin-editor',
    page: '/admin/products',
    caption: 'Admin product editor — images, variations, inventory, categories, SEO fields',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 1000 },
    },
    desktopOnly: true,
    manualNote: 'Requires admin auth + specific product open',
  },

  // ── 404 ──
  {
    id: '30-404',
    label: '404',
    page: '/this-page-does-not-exist',
    caption: 'Custom 404 page — giant "404" with racing-themed CTAs',
    crop: {
      desktop: { x: 0, y: 0, w: 1440, h: 900 },
    },
    desktopOnly: true,
  },
];

// ── Mobile-only targets ─────────────────────────────────────────────

const MOBILE_TARGETS = [
  {
    id: '01-hero',
    label: 'hero',
    page: '/',
    caption: 'Mobile homepage hero',
    crop: { mobile: { x: 0, y: 0, w: 430, h: 932 } },
  },
  {
    id: '02-game',
    label: 'game',
    page: '/',
    caption: 'Mobile game with touch controls',
    scrollTo: 1000,
    crop: { mobile: { x: 0, y: 900, w: 430, h: 932 } },
  },
  {
    id: '03-shop',
    label: 'shop',
    page: '/shop',
    caption: 'Mobile shop with product grid',
    crop: { mobile: { x: 0, y: 0, w: 430, h: 1200 } },
  },
  {
    id: '04-product',
    label: 'product',
    page: '/shop',
    caption: 'Mobile product detail',
    findProduct: true,
    crop: { mobile: { x: 0, y: 0, w: 430, h: 1000 } },
  },
  {
    id: '05-cart',
    label: 'cart',
    page: '/cart',
    caption: 'Mobile cart',
    crop: { mobile: { x: 0, y: 0, w: 430, h: 932 } },
  },
  {
    id: '06-checkout',
    label: 'checkout',
    page: '/checkout',
    caption: 'Mobile checkout',
    crop: { mobile: { x: 0, y: 0, w: 430, h: 932 } },
  },
  {
    id: '07-nav',
    label: 'nav',
    page: '/',
    caption: 'Mobile navigation with cart badge',
    triggerMobileNav: true,
    crop: { mobile: { x: 0, y: 0, w: 430, h: 932 } },
  },
  {
    id: '08-services',
    label: 'services',
    page: '/services',
    caption: 'Mobile services page',
    crop: { mobile: { x: 0, y: 0, w: 430, h: 1200 } },
  },
  {
    id: '09-contact',
    label: 'contact',
    page: '/contact',
    caption: 'Mobile contact form',
    crop: { mobile: { x: 0, y: 0, w: 430, h: 1200 } },
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function validatePng(filePath) {
  const buf = await fs.readFile(filePath);
  if (buf.length < 24 || buf[0] !== 0x89 || buf[1] !== 0x50) {
    throw new Error(`Invalid PNG: ${filePath}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { size: buf.length, width, height };
}

// ── Cookie / overlay dismissal ───────────────────────────────────────

/**
 * Pre-consent: inject a MutationObserver that continuously removes cookie
 * banners by detecting text content and fixed positioning.
 */
async function preConsent(context) {
  await context.addInitScript(() => {
    // Pre-set every possible consent localStorage key
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookie_consent', 'true');
    localStorage.setItem('cookies-accepted', 'true');
    localStorage.setItem('ga-consent', 'true');
    localStorage.setItem('analytics-consent', 'true');

    // Nuke function: find and remove cookie banners by text + position
    const nukeCookieBanners = () => {
      // Find fixed/sticky elements containing cookie-related text
      const allEls = document.querySelectorAll('*');
      allEls.forEach(el => {
        try {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky') {
            const text = el.textContent.toLowerCase();
            if (text.includes('cookie') || text.includes('privacy policy')) {
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.style.height = '0';
              el.style.overflow = 'hidden';
              el.style.pointerEvents = 'none';
            }
          }
        } catch (_) {}
      });
    };

    // Run on DOM changes
    const startObserving = () => {
      const observer = new MutationObserver(() => {
        nukeCookieBanners();
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      nukeCookieBanners();
    };

    if (document.body) {
      startObserving();
    } else {
      document.addEventListener('DOMContentLoaded', startObserving);
    }
  });
}

async function dismissOverlays(page) {
  // Click ACCEPT to let React update its state (DOM removal doesn't work - React re-renders)
  try {
    const acceptBtn = page.locator('button', { hasText: 'ACCEPT' }).first();
    if (await acceptBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await acceptBtn.click();
      await page.waitForTimeout(800);
    }
  } catch (_) {}

  // Fallback: force-hide any remaining fixed overlays containing cookie text
  await page.evaluate(() => {
    const allEls = document.querySelectorAll('*');
    allEls.forEach(el => {
      try {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') {
          const text = el.textContent.toLowerCase();
          if (text.includes('cookie') || text.includes('privacy policy')) {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            el.style.setProperty('opacity', '0', 'important');
          }
        }
      } catch (_) {}
    });
  });
}

// ── Page preparation ─────────────────────────────────────────────────

async function preparePage(page) {
  // Suppress CSS transitions only — keep animations for visual content
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'capture-freeze';
    style.textContent = `
      *, *::before, *::after {
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
    `;
    if (!document.getElementById('capture-freeze')) {
      document.head.appendChild(style);
    }
  });

  // Dismiss cookie consent and overlays
  await dismissOverlays(page);

  // Wait for fonts, images, and video to begin loading
  await page.waitForTimeout(4000);
}

// ── Lazy-load trigger: scroll through entire page ────────────────────

async function preScrollForLazyLoad(page) {
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const stepSize = Math.floor(viewportHeight * 0.6);

  for (let y = 0; y <= pageHeight; y += stepSize) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(250);
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

// ── Capture logic ────────────────────────────────────────────────────

async function captureTarget(page, target, kind, viewport) {
  const deviceDir = path.join(OUT_ROOT, kind);
  await ensureDir(deviceDir);
  const filePath = path.join(deviceDir, `${target.id}.png`);

  const predefined = target.crop[kind];
  if (!predefined) return null;

  // Handle special interactions
  if (target.findProduct) {
    try {
      const productLink = await page.$('a[href*="/product/"]');
      if (productLink) {
        await productLink.click();
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await dismissOverlays(page);
        await page.waitForTimeout(2500);
      }
    } catch (e) {
      console.warn(`  Could not navigate to product page: ${e.message}`);
    }
  }

  if (target.triggerSearch) {
    try {
      await page.keyboard.press('Control+k');
      await page.waitForTimeout(1000);
      await page.keyboard.type('steering', { delay: 80 });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.warn(`  Could not trigger search: ${e.message}`);
    }
  }

  if (target.triggerMobileNav) {
    try {
      const menuBtn = await page.$('button[aria-label*="menu" i], button[aria-label*="Menu"], [class*="hamburger"], [class*="mobile-nav"], button[class*="menu"]');
      if (menuBtn) {
        await menuBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.warn(`  Could not open mobile nav: ${e.message}`);
    }
  }

  // Ensure overlays are hidden before capture
  await dismissOverlays(page);

  const pageHeight = await page.evaluate(() => document.body.scrollHeight);

  // Scroll to target area to ensure compositor renders those tiles
  const scrollY = Math.max(0, predefined.y - 100);
  await page.evaluate(y => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(1500);

  // Determine capture approach
  const withinFirstViewport = predefined.y + predefined.h <= viewport.height + 50;

  try {
    if (withinFirstViewport) {
      // Target is within the first viewport — use clip with page coordinates
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);

      const clip = {
        x: predefined.x,
        y: predefined.y,
        width: predefined.w,
        height: Math.min(predefined.h, Math.max(1, pageHeight - predefined.y)),
      };

      await page.screenshot({ path: filePath, clip, type: 'png' });
    } else {
      // Target is below the fold — scroll to position and take viewport screenshot
      // Scroll so the target's Y is at the top of the viewport
      const targetScroll = Math.min(predefined.y, Math.max(0, pageHeight - viewport.height));
      await page.evaluate(y => window.scrollTo(0, y), targetScroll);
      await page.waitForTimeout(1500);

      // Re-dismiss overlays (they might reappear after scroll)
      await dismissOverlays(page);
      await page.waitForTimeout(300);

      await page.screenshot({ path: filePath, type: 'png' });
    }
  } catch (err) {
    console.error(`  Screenshot failed for ${target.id}: ${err.message}`);
    // Fallback: take viewport screenshot at current position
    try {
      await page.screenshot({ path: filePath, type: 'png' });
    } catch (fallbackErr) {
      console.error(`  Fallback also failed for ${target.id}: ${fallbackErr.message}`);
      return null;
    }
  }

  try {
    const validation = await validatePng(filePath);
    return {
      id: target.id,
      label: target.label,
      caption: target.caption,
      page: target.page,
      crop: predefined,
      bytes: validation.size,
      dimensions: { width: validation.width, height: validation.height },
      filePath: `${kind}/${target.id}.png`,
      manualNote: target.manualNote || null,
    };
  } catch (err) {
    console.error(`  Invalid PNG for ${target.id}: ${err.message}`);
    return null;
  }
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  DS Racing Karts — Curated Portfolio Capture    ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  console.log(`Site: ${SITE}`);
  console.log(`Output: ${OUT_ROOT}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--autoplay-policy=no-user-gesture-required',
      '--disable-background-timer-throttling',
    ],
  });
  const manifest = {
    version: 2,
    sourceUrl: SITE,
    slug: SLUG,
    timestamp: new Date().toISOString(),
    curated: true,
    devices: {},
  };

  // ── Desktop captures ──
  {
    const kind = 'desktop';
    const vp = { width: 1440, height: 900 };
    console.log(`=== DESKTOP (${vp.width}×${vp.height}) ===`);

    const context = await browser.newContext({
      viewport: vp,
      deviceScaleFactor: 1,
    });
    await preConsent(context);
    const page = await context.newPage();

    const captures = [];
    let lastPage = null;

    // Desktop targets from TARGETS (non-mobile-only)
    const desktopTargets = TARGETS.filter(t => t.crop.desktop);

    for (const target of desktopTargets) {
      const targetUrl = `${SITE}${target.page}`;

      // Navigate only when switching pages
      if (targetUrl !== lastPage) {
        console.log(`  Navigating to ${target.page}...`);
        try {
          await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 45000 });
        } catch (navErr) {
          // Retry with domcontentloaded
          console.warn(`  networkidle timeout, retrying with domcontentloaded...`);
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        }
        await preparePage(page);
        // Pre-scroll entire page to trigger lazy loading
        await preScrollForLazyLoad(page);
        // Re-dismiss overlays after pre-scroll
        await dismissOverlays(page);
        lastPage = targetUrl;
      }

      try {
        const result = await captureTarget(page, target, kind, vp);
        if (result) {
          captures.push(result);
          const kb = Math.round(result.bytes / 1024);
          const note = result.manualNote ? ` ⚠ ${result.manualNote}` : '';
          console.log(`  ✓ ${result.id} — ${result.dimensions.width}×${result.dimensions.height} (${kb}KB)${note}`);
        } else {
          console.warn(`  ⊘ ${target.id} — skipped (no desktop crop or failed)`);
        }
      } catch (err) {
        console.error(`  ✗ ${target.id} — ${err.message}`);
      }
    }

    manifest.devices[kind] = {
      viewport: vp,
      captureCount: captures.length,
      captures,
    };

    await context.close();
    console.log(`  Total: ${captures.length} desktop captures\n`);
  }

  // ── Mobile captures ──
  {
    const kind = 'mobile';
    const vp = { width: 430, height: 932 };
    console.log(`=== MOBILE (${vp.width}×${vp.height}) ===`);

    const context = await browser.newContext({
      viewport: vp,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await preConsent(context);
    const page = await context.newPage();

    const captures = [];
    let lastPage = null;

    for (const target of MOBILE_TARGETS) {
      const targetUrl = `${SITE}${target.page}`;

      if (targetUrl !== lastPage) {
        console.log(`  Navigating to ${target.page}...`);
        try {
          await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 45000 });
        } catch (navErr) {
          console.warn(`  networkidle timeout, retrying with domcontentloaded...`);
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        }
        await preparePage(page);
        // Pre-scroll entire page to trigger lazy loading
        await preScrollForLazyLoad(page);
        // Re-dismiss overlays after pre-scroll
        await dismissOverlays(page);
        lastPage = targetUrl;
      }

      try {
        const result = await captureTarget(page, target, kind, vp);
        if (result) {
          captures.push(result);
          const kb = Math.round(result.bytes / 1024);
          console.log(`  ✓ ${result.id} — ${result.dimensions.width}×${result.dimensions.height} (${kb}KB)`);
        } else {
          console.warn(`  ⊘ ${target.id} — skipped`);
        }
      } catch (err) {
        console.error(`  ✗ ${target.id} — ${err.message}`);
      }
    }

    manifest.devices[kind] = {
      viewport: vp,
      captureCount: captures.length,
      captures,
    };

    await context.close();
    console.log(`  Total: ${captures.length} mobile captures\n`);
  }

  // ── Write manifest ──
  const manifestPath = path.join(OUT_ROOT, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest: ${manifestPath}`);

  // ── Write contact sheet ──
  const sheetPath = path.join(OUT_ROOT, 'contact-sheet.html');
  const allCaptures = [
    ...(manifest.devices.desktop?.captures || []),
    ...(manifest.devices.mobile?.captures || []),
  ];
  const manualNeeded = allCaptures.filter(c => c.manualNote);

  const sheetHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>DS Racing Karts — Curated Captures</title>
<style>body{font-family:system-ui;background:#111;color:#eee;padding:2rem}
h1{font-size:1.5rem;margin-bottom:0.5rem;color:#e60012}
.subtitle{color:#888;margin-bottom:1.5rem;font-size:0.9rem}
.grid{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fill,minmax(400px,1fr))}
.card{background:#1a1a1a;border-radius:8px;overflow:hidden;border:1px solid #333}
.card img{width:100%;display:block;max-height:600px;object-fit:contain;background:#0a0a0a}
.card .info{padding:0.75rem 1rem;font-size:0.85rem}
.card .caption{color:#aaa;margin-top:0.25rem}
.card .dims{color:#666;font-size:0.75rem}
.card .manual{color:#e60012;font-size:0.75rem;margin-top:0.25rem}
h2{font-size:1.2rem;margin:2rem 0 1rem;border-bottom:1px solid #333;padding-bottom:0.5rem}
.warnings{background:#1a1200;border:1px solid #553300;border-radius:8px;padding:1rem;margin-bottom:1.5rem}
.warnings h3{color:#ffaa00;font-size:0.9rem;margin-bottom:0.5rem}
.warnings li{color:#cc8800;font-size:0.8rem;margin:0.25rem 0}
</style></head><body>
<h1>DS Racing Karts — Curated Portfolio Captures</h1>
<div class="subtitle">${new Date().toISOString()} · ${allCaptures.length} captures</div>
${manualNeeded.length > 0 ? `<div class="warnings"><h3>⚠ Manual screenshots recommended (${manualNeeded.length})</h3><ul>
${manualNeeded.map(c => `<li><strong>${c.id}</strong>: ${c.manualNote}</li>`).join('\n')}</ul></div>` : ''}
<h2>Desktop (${manifest.devices.desktop?.captureCount || 0})</h2>
<div class="grid">${(manifest.devices.desktop?.captures || []).map(c => `
<div class="card">
<img src="${c.filePath}" alt="${c.label}" loading="lazy">
<div class="info">
<strong>${c.id}</strong> (${c.label})
<div class="caption">${c.caption}</div>
<div class="dims">${c.dimensions.width}×${c.dimensions.height} · ${Math.round(c.bytes / 1024)}KB</div>
${c.manualNote ? `<div class="manual">⚠ ${c.manualNote}</div>` : ''}
</div></div>`).join('')}
</div>
<h2>Mobile (${manifest.devices.mobile?.captureCount || 0})</h2>
<div class="grid">${(manifest.devices.mobile?.captures || []).map(c => `
<div class="card">
<img src="${c.filePath}" alt="${c.label}" loading="lazy">
<div class="info">
<strong>${c.id}</strong> (${c.label})
<div class="caption">${c.caption}</div>
<div class="dims">${c.dimensions.width}×${c.dimensions.height} · ${Math.round(c.bytes / 1024)}KB</div>
</div></div>`).join('')}
</div>
</body></html>`;
  await fs.writeFile(sheetPath, sheetHtml);
  console.log(`Contact sheet: ${sheetPath}`);

  // ── Summary ──
  const totalDesktop = manifest.devices.desktop?.captureCount || 0;
  const totalMobile = manifest.devices.mobile?.captureCount || 0;
  console.log(`\n═══ Summary ═══`);
  console.log(`Desktop: ${totalDesktop} captures`);
  console.log(`Mobile:  ${totalMobile} captures`);
  console.log(`Total:   ${totalDesktop + totalMobile} captures`);
  if (manualNeeded.length > 0) {
    console.log(`\n⚠ ${manualNeeded.length} screenshot(s) need manual replacement for best results:`);
    manualNeeded.forEach(c => console.log(`  - ${c.id}: ${c.manualNote}`));
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
