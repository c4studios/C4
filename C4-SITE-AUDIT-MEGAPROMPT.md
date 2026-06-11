# C4 Studios — Full Site Audit & Improvement Megaprompt

> **Target:** Claude Code (or equivalent agent)  
> **Project root:** `C4-main/C4-main/` (nested repo structure)  
> **Stack:** React 18 + Vite 6 SPA, Tailwind CSS 4 + shadcn/ui, Framer Motion, GSAP, Cloudflare Pages + Functions, Resend email, R2 uploads  
> **Live URL:** https://c4studios.com

---

## CONTEXT

This is the C4 Studios portfolio/agency website — a React SPA deployed on Cloudflare Pages with serverless functions. It has 22 pages, 80+ npm dependencies, a custom design system with light/dark mode, animated intro sequence, GSAP/Framer Motion animations, Cloudflare Turnstile anti-bot, R2 file uploads, and Resend email integration. The audit below identifies every issue found across security, performance, SEO, accessibility, design, functionality, interactivity, and professionalism. Implement ALL fixes below.

---

## 1. SECURITY FIXES (Critical)

### 1A. Add Content-Security-Policy header
**File:** `public/_headers`  
**Issue:** The `_headers` file has good security headers but is **missing a Content-Security-Policy (CSP)** — the single most important security header. Without CSP, the site is vulnerable to XSS via injected scripts.  
**Fix:** Add a CSP header that allows your own origin, Cloudflare Turnstile, and nothing else:
```
  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://pub-c3594a76834045cfa969981bd9da57db.r2.dev data:; connect-src 'self' https://challenges.cloudflare.com https://api.resend.com; frame-src https://challenges.cloudflare.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'
```
Also add `preload` to the HSTS header:
```
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 1B. CORS origin validation is too permissive in dev
**Files:** `functions/api/inquiries.js`, `functions/api/ventures.js`, `functions/api/support.js`, `functions/api/upload.js`, `functions/api/contact.js`  
**Issue:** All functions fall back to `https://c4studios.com` when `ALLOWED_ORIGIN` is unset, which is fine for production. However, the CORS implementation only supports a single origin string — if you ever need to support `www.c4studios.com` as well, it will fail. Also, the `contact.js` legacy endpoint has the same CORS pattern but no Turnstile/honeypot/rate-limit protections.  
**Fix:**
- Delete or gut `functions/api/contact.js` — it's a legacy endpoint with no spam protection. If it must stay, add honeypot + Turnstile + rate limit to match the other endpoints.
- Validate the `Origin` header against an allowlist instead of blindly reflecting `ALLOWED_ORIGIN`:
```javascript
function corsHeaders(env, request) {
  const allowed = (env?.ALLOWED_ORIGIN || 'https://c4studios.com').split(',').map(s => s.trim());
  const origin = request?.headers?.get('Origin') || '';
  const matched = allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': matched,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
```

### 1C. Rate limiter is ineffective (Cache API limitations)
**Files:** `functions/api/inquiries.js`, `functions/api/ventures.js`, `functions/api/support.js`  
**Issue:** The `checkRateLimit` function uses `caches.default` — the Cloudflare Cache API. This works but has weaknesses: (1) cache entries can be evicted at any time, (2) it fails open (`catch { return true }`), meaning any cache error = unlimited submissions. Consider that a determined attacker just needs the cache to miss once per window.  
**Fix:** Keep the current approach as a soft limit but add Cloudflare's built-in rate limiting via `wrangler.toml` or consider using Cloudflare KV for more durable counters. At minimum, log when rate limiting fails open so you can monitor it.

### 1D. Upload endpoint lacks authentication
**File:** `functions/api/upload.js`  
**Issue:** The upload endpoint has excellent file validation (magic bytes, type checking, size limits) but has NO Turnstile verification, NO honeypot check, and NO rate limiting. Anyone can upload 10MB files to your R2 bucket repeatedly.  
**Fix:** Add Turnstile token verification (pass it via a hidden form field or header), add rate limiting (3 uploads per 10 min per IP), and consider requiring the upload to be associated with a valid form session.

### 1E. Sensitive env var exposure risk
**File:** `functions/api/config.js`  
**Issue:** The `/api/config` endpoint returns `{ uploadsEnabled: boolean }` which is fine, but it also uses GET which means it could be cached/crawled. Minor issue but worth noting.  
**Fix:** Add `Cache-Control: no-store` to the config response.

---

## 2. GOOGLE ANALYTICS INTEGRATION (Missing entirely)

### 2A. Add Google Analytics 4 (GA4)
**Issue:** There is ZERO analytics tracking anywhere in the codebase. No Google Analytics, no Plausible, no Fathom, nothing. You have no visibility into traffic, user behaviour, conversions, or page performance.  
**Fix:** Implement GA4 with the following:

1. **Create a GA4 analytics component** at `src/components/c4/Analytics.jsx`:
```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    window.gtag('config', GA_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
}

export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}
```

2. **Add the gtag script to `index.html`** (more reliable than injecting via React):
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
</script>
```

3. **Track SPA page views** — Since this is a React Router SPA, add a `usePageTracking()` hook call in `Layout.jsx` that fires `gtag('event', 'page_view')` on every route change.

4. **Track key conversion events:**
   - `form_submit_start_project` — when StartProject form is submitted
   - `form_submit_support` — when Support form is submitted
   - `form_submit_venture` — when Ventures form is submitted
   - `cta_click_start_project` — when "Start a Project" CTA buttons are clicked
   - `portfolio_case_study_view` — when a case study is opened
   - `pricing_package_select` — when a pricing package CTA is clicked
   - `file_upload` — when a file is uploaded
   - `theme_toggle` — when dark/light mode is toggled

5. **Update CSP** to allow `https://www.googletagmanager.com` and `https://www.google-analytics.com` in `script-src` and `connect-src`.

6. **Add env var** `VITE_GA_MEASUREMENT_ID` to `.env` and Cloudflare Pages environment variables.

---

## 3. LOADING SCREEN / INITIAL RENDER IMPROVEMENTS

### 3A. White flash before React hydrates
**Issue:** The `index.html` has a bare `<div id="root"></div>` with no loading state. Users see a blank white (or blank dark) page while the ~80 dependency JS bundle downloads and parses. On slower connections this can be 2-5 seconds of nothing.  
**Fix:** Add an inline loading skeleton directly in `index.html` that matches the site's design:

```html
<div id="root">
  <!-- Inline loading state — removed by React on mount -->
  <div id="c4-preloader" style="
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    background: #F7F5F2;
    transition: opacity 0.4s ease;
  ">
    <div style="text-align: center;">
      <!-- Inline SVG of C4 logo mark (simplified) -->
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Insert simplified C4 mark paths here -->
      </svg>
      <div style="
        margin-top: 12px;
        width: 32px; height: 2px;
        background: #DDDBD7;
        border-radius: 1px;
        margin-left: auto; margin-right: auto;
        overflow: hidden;
      ">
        <div style="
          width: 100%; height: 100%;
          background: #1A1A1A;
          animation: c4load 1.2s ease-in-out infinite;
          transform-origin: left;
        "></div>
      </div>
    </div>
  </div>
</div>
<style>
  @keyframes c4load { 0% { transform: scaleX(0) } 50% { transform: scaleX(1) } 100% { transform: scaleX(0); transform-origin: right } }
  @media (prefers-color-scheme: dark) {
    #c4-preloader { background: #0F1115 !important; }
    #c4-preloader div > div:last-child { background: #ECE7DE !important; }
    #c4-preloader div > div:last-child > div { background: #ECE7DE !important; }
  }
</style>
```

Then in `src/main.jsx`, remove the preloader after React mounts:
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
// Remove preloader
const preloader = document.getElementById('c4-preloader');
if (preloader) {
  preloader.style.opacity = '0';
  setTimeout(() => preloader.remove(), 400);
}
```

### 3B. The IntroSequence blocks content for ~2.9 seconds
**File:** `src/components/c4/IntroSequence.jsx`, `src/pages/Home.jsx`  
**Issue:** First-time visitors see a 2.9-second logo animation with THREE sequential timeouts (900ms → 2200ms → 2900ms) before any page content appears. Combined with JS loading time, this means 4-7 seconds before seeing any content. The `introComplete` flag in Home.jsx means the entire page content tree isn't even mounted until the animation finishes — no content is available during intro.  
**Fix:**
- Reduce the total intro duration to ~1.5s (mark: 400ms, name: 1000ms, exit: 1500ms)
- Mount the page content immediately but behind the intro overlay (remove the `introComplete` gate):
```jsx
// Home.jsx — mount content immediately, overlay on top
return (
  <>
    <div style={{ backgroundColor: 'var(--c4-bg)' }}>
      <HeroSection />
      <ServicesPreview />
      {/* ... */}
    </div>
    <AnimatePresence>
      {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
    </AnimatePresence>
  </>
);
```
- Consider showing the intro only once per SESSION (sessionStorage) instead of once ever (localStorage), or add a "Skip" option

### 3C. No code splitting / lazy loading for routes
**File:** `src/App.jsx`, `src/pages.config.js`  
**Issue:** ALL 22 pages are eagerly imported via `pages.config.js` auto-imports. The entire Lens page (with GSAP, Lenis, Three.js, heavy canvas code), all pricing pages, the full case study data — everything is in the initial bundle. This massively inflates the JS payload.  
**Fix:** Implement route-level code splitting with `React.lazy`:
```jsx
// pages.config.js — use lazy imports
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
// ... etc

// App.jsx — wrap routes in Suspense
import { Suspense } from 'react';
// In the Route elements:
<Suspense fallback={<PageSkeleton />}>
  <Page />
</Suspense>
```
Create a minimal `PageSkeleton` component that shows a subtle loading state consistent with the site's design.

---

## 4. SEO FIXES (Critical for a portfolio site)

### 4A. No per-page meta tags / titles
**Issue:** The site has a single `<title>` and `<meta description>` in `index.html` that applies to ALL 22 pages. Every page shows "C4 Studios — Design & Development" in search results. No page has unique title/description/OG tags. This is catastrophic for SEO.  
**Fix:** Install `react-helmet-async` (or implement a lightweight `useDocumentMeta` hook) and add unique meta to every page:

```jsx
// src/hooks/useDocumentMeta.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useDocumentMeta({ title, description, ogImage }) {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const fullTitle = title ? `${title} — C4 Studios` : 'C4 Studios — Design & Development';
    document.title = fullTitle;
    
    const setMeta = (selector, attr, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [key, val] = Object.entries(Object.fromEntries([selector.match(/\[(.+?)="(.+?)"\]/).slice(1).map((v, i) => [i === 0 ? 'key' : 'val', v])]))[0]; // simplified
        document.head.appendChild(el);
      }
      el.setAttribute(attr, content);
    };
    
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', fullTitle);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://c4studios.com${pathname}`);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', fullTitle);
    if (ogImage) {
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImage);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', ogImage);
    }
  }, [title, description, ogImage, pathname]);
}
```

**Per-page titles to implement:**
- Home: "C4 Studios — Design & Development Studio"
- About: "About C4 Studios — Our Story & Process"
- Services: "Services — Web Design, Branding, SEO & More"
- Portfolio: "Portfolio — Selected Client Work"
- CaseStudy: "[Project Name] — C4 Studios Case Study"
- Lens: "C4 Lens — Professional Photography & Videography"
- Ventures: "C4 Ventures — We Co-Build Your Ideas"
- StartProject: "Start a Project — Get a Quote from C4 Studios"
- Support: "Support Centre — C4 Studios Help & FAQ"
- Rebuild: "Rebuild Program — Upgrade Your Existing Website"
- Terms: "Terms & Conditions — C4 Studios Ventures"
- Each pricing page: "[Service] Pricing — C4 Studios"

### 4B. No sitemap.xml
**Fix:** Create `public/sitemap.xml` with all 22 routes and their priorities:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://c4studios.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://c4studios.com/About</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://c4studios.com/Services</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://c4studios.com/Portfolio</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <!-- ... all pages -->
</urlset>
```

### 4C. No robots.txt
**Fix:** Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://c4studios.com/sitemap.xml

User-agent: *
Disallow: /api/
```

### 4D. No structured data (JSON-LD)
**Fix:** Add Organization schema to `index.html` and LocalBusiness/Service schemas on relevant pages:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "C4 Studios",
  "url": "https://c4studios.com",
  "description": "Design & development studio building premium digital products.",
  "sameAs": ["https://www.instagram.com/c4.studio/"],
  "serviceType": ["Web Design", "Web Development", "Branding", "Photography", "SEO"]
}
</script>
```

### 4E. No canonical URL per page
**Issue:** The canonical tag in `index.html` is hardcoded to `https://c4studios.com` for all pages.  
**Fix:** Dynamically update the canonical URL in the `useDocumentMeta` hook based on `pathname`.

---

## 5. ACCESSIBILITY FIXES

### 5A. Missing skip-to-content link
**File:** `src/Layout.jsx`  
**Issue:** No skip navigation link for keyboard/screen reader users. They must tab through the entire nav on every page.  
**Fix:** Add a visually-hidden skip link as the first focusable element:
```jsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--c4-text)] focus:text-[var(--c4-bg)] focus:text-sm focus:rounded">
  Skip to content
</a>
// ... and add id="main-content" to the <main> element
```

### 5B. Form inputs missing proper label associations
**Files:** `src/pages/StartProject.jsx`, `src/pages/Support.jsx`  
**Issue:** Form labels use `<label className={labelClass}>` but are NOT associated with inputs via `htmlFor`/`id` attributes. Screen readers cannot connect labels to their inputs.  
**Fix:** Add matching `htmlFor` and `id` attributes to all label/input pairs in both forms:
```jsx
<label htmlFor="sp-name" className={labelClass}>Name *</label>
<input id="sp-name" className={fieldClass} ... />
```
Do this for EVERY form field across StartProject.jsx, Support.jsx, and Ventures.jsx.

### 5C. Focus management after form submission
**Files:** `src/pages/StartProject.jsx`, `src/pages/Support.jsx`  
**Issue:** After form submission, the page switches to the `SubmissionSuccess` component but focus is not moved to it. Screen reader users don't know the form was submitted.  
**Fix:** Use `useRef` + `useEffect` to focus the success container when `submitted` becomes true:
```jsx
const resultRef = useRef(null);
useEffect(() => {
  if (submitted || formError) resultRef.current?.focus();
}, [submitted, formError]);
// On the SubmissionSuccess wrapper: ref={resultRef} tabIndex={-1}
```

### 5D. Colour contrast issues in muted text
**Issue:** Several muted text colours may fail WCAG AA contrast:
- `--c4-text-faint` (#B0ADA8) on `--c4-bg` (#F7F5F2) = ~2.3:1 ratio (FAILS AA)
- `--c4-text-subtle` (#908E88) on `--c4-bg` (#F7F5F2) = ~3.2:1 ratio (FAILS AA for body text)
- `--c4-footer-text-muted` (#6B6963) on `--c4-footer-bg` (#1A1A1A) = ~3.8:1 (borderline)
**Fix:** Darken the light-mode faint/subtle tokens:
- `--c4-text-faint`: change to `#8A8780` (4.5:1+)
- `--c4-text-subtle`: change to `#706E69` (4.5:1+)
- `--c4-footer-text-muted`: change to `#807E78` (4.5:1+)

### 5E. Keyboard navigation for PillSelect
**File:** `src/pages/StartProject.jsx`  
**Issue:** The `PillSelect` component uses `<button>` elements (good) but has no keyboard instructions, no `role="radiogroup"`, and no `aria-checked` state.  
**Fix:** Wrap in `role="radiogroup"` with `aria-label`, add `role="radio"` and `aria-checked` to each pill button. Add arrow key navigation for a proper radio group pattern.

### 5F. Missing page landmarks
**Issue:** The `<main>` element in Layout.jsx has no `id` or `aria-label`. The footer has no `aria-label`. Navigation sections have inconsistent labelling.  
**Fix:**
```jsx
<main id="main-content" role="main">
<footer aria-label="Site footer">
<nav aria-label="Primary navigation"> // in NavHeader
```

### 5G. Mobile menu focus trap
**File:** `src/components/c4/NavHeader.jsx`  
**Issue:** When the mobile menu opens, focus is not trapped inside it. Users can tab to elements behind the overlay.  
**Fix:** Implement a focus trap (use `focus-trap-react` or manual implementation) that activates when `mobileOpen` is true and returns focus to the menu button on close.

---

## 6. PERFORMANCE OPTIMISATIONS

### 6A. Bundle size — 80+ dependencies loaded eagerly
**Issue:** package.json has massive dependencies including Three.js, GSAP, Lenis, Recharts, 28 Radix UI components, Framer Motion — all loaded on first page visit regardless of which page the user is on.  
**Fix:**
- Code-split routes (Section 3C above)
- Dynamic import Three.js and heavy Lens components only when visiting `/Lens`
- Dynamic import Recharts only when needed (CraftHeatmap)
- Audit which Radix components are actually used vs imported but unused

### 6B. No image optimisation strategy
**Issue:** Portfolio screenshots and case study images are served as-is from the `public/` directory and R2 with no:
- WebP/AVIF conversion
- Responsive `srcset` / `sizes`
- Width/height attributes (causes CLS)
- Progressive loading (blur-up or LQIP)
**Fix:**
- Add explicit `width` and `height` to all `<img>` tags to prevent CLS
- Use `loading="lazy"` on all below-fold images (already done on Lens page, not elsewhere)
- Consider Cloudflare Image Resizing or a build-time optimization step
- Add `fetchpriority="high"` to the LCP hero image if applicable

### 6C. Font loading — no strategy visible
**Issue:** No web font loading configuration visible. If using system fonts, this is fine. If loading custom fonts (check globals.css for @font-face), there's no `font-display: swap` or preload.  
**Fix:** If using any web fonts, add `<link rel="preload" as="font" type="font/woff2" href="..." crossorigin>` to `index.html` and ensure `font-display: swap`.

### 6D. Framer Motion bundle overhead
**Issue:** `framer-motion` is ~120KB minified and is used on virtually every component for basic opacity/y animations. This is the single largest dependency after React.  
**Fix:** Consider using `motion/react` (the newer tree-shakeable import) or CSS animations for simple fade/slide effects. At minimum, use `LazyMotion` + `domAnimation` feature bundle:
```jsx
import { LazyMotion, domAnimation } from 'framer-motion';
// Wrap app in <LazyMotion features={domAnimation}> to reduce bundle by ~50%
```

---

## 7. FUNCTIONALITY & UX FIXES

### 7A. No error boundary
**Issue:** There is no React Error Boundary anywhere. If any component throws during render, the entire app crashes to a white screen with no recovery.  
**Fix:** Create `src/components/c4/ErrorBoundary.jsx`:
```jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
    // Optionally report to analytics
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Something went wrong</h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>An unexpected error occurred. Please refresh the page.</p>
            <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1.5rem', background: '#1A1A1A', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```
Wrap `<App />` in `<ErrorBoundary>` in `main.jsx`.

### 7B. React StrictMode is not enabled
**File:** `src/main.jsx`  
**Issue:** The app renders without `<React.StrictMode>`. This means double-render bugs, effect cleanup issues, and deprecated API usage will not be caught during development.  
**Fix:** Wrap in StrictMode:
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 7C. Contact page redirect is abrupt
**File:** `src/pages/Contact.jsx`  
**Issue:** The Contact page immediately navigates to `/Support` on mount. If someone bookmarked `/Contact`, they get no feedback about the redirect.  
**Fix:** Either set up a proper redirect in `public/_redirects`:
```
/Contact /Support 301
```
Or show a brief "This page has moved" message with a link before redirecting.

### 7D. 404 page lacks personality
**File:** `src/lib/PageNotFound.jsx`  
**Issue:** The 404 page is minimal but should match the premium feel of the rest of the site.  
**Fix:** Enhance with the site's design language — accent line, proper typography tokens, animated entrance, search suggestion, and links to key pages (Home, Portfolio, Contact).

### 7E. No loading states for route transitions
**Issue:** When navigating between heavy pages (e.g., Home → Lens), there's a delay while the component tree mounts. The fade transition helps but there's no loading indicator.  
**Fix:** Add a subtle top-bar progress indicator (NProgress-style) that triggers on route changes. Can be built with Framer Motion:
```jsx
// A thin bar at the top of the viewport that animates during page transitions
```

### 7F. Theme toggle creates FOUC (Flash of Unstyled Content)
**File:** `src/components/c4/ThemeContext.jsx`  
**Issue:** Theme is loaded from localStorage in a `useState` initialiser, but CSS variables are applied in a `useEffect`. Between the initial render and the effect running, the user may see a flash of the wrong theme. Also, the `index.html` has no inline script to apply the theme class before React loads.  
**Fix:** Add an inline script in `index.html` `<head>` that applies the theme class immediately:
```html
<script>
  (function() {
    try {
      var pref = localStorage.getItem('c4-theme-pref') || 'system';
      var dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.add(dark ? 'dark-mode' : 'light-mode');
    } catch(e) {}
  })();
</script>
```
And in the preloader (Section 3A), use `var(--c4-bg)` instead of hardcoded colours so it inherits the theme.

---

## 8. DESIGN & PROFESSIONALISM POLISH

### 8A. Inconsistent border-radius patterns
**Issue:** The codebase mixes `rounded-sm`, `rounded-lg`, and raw pixel values. The tailwind config defines CSS variable-based radii for shadcn but many components use arbitrary values.  
**Fix:** Audit all border-radius usage and standardise. Use `rounded-sm` for form elements, `rounded-lg` for cards, `rounded-full` for pills. Remove magic-number border-radius values.

### 8B. Inline styles vs CSS variables vs Tailwind — inconsistent approach
**Issue:** Many components use verbose inline `style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}` instead of utility classes. This creates a maintenance burden and makes the JSX harder to read.  
**Fix:** Create Tailwind utilities for the most-used CSS variables:
```css
/* globals.css */
.bg-c4 { background-color: var(--c4-bg); }
.bg-c4-alt { background-color: var(--c4-bg-alt); }
.bg-c4-card { background-color: var(--c4-card-bg); }
.text-c4 { color: var(--c4-text); }
.text-c4-muted { color: var(--c4-text-muted); }
.text-c4-subtle { color: var(--c4-text-subtle); }
.text-c4-faint { color: var(--c4-text-faint); }
.text-c4-accent { color: var(--c4-accent); }
.border-c4 { border-color: var(--c4-border); }
.border-c4-light { border-color: var(--c4-border-light); }
```
Then progressively migrate components from inline styles to these utilities.

### 8C. Footer lacks social links / contact info
**File:** `src/components/c4/Footer.jsx`  
**Issue:** The footer only has one external link (Instagram). For a professional studio, this is sparse. No email, no phone, no additional social links, no address.  
**Fix:** Add at minimum:
- Email link: hello@c4studios.com
- More social platforms if applicable
- A brief "Available worldwide · Based in [location]" line
- Consider adding a mini-newsletter signup or "Stay in the loop" CTA

### 8D. No favicon for dark mode
**Issue:** Only `/favicon.png?v=2` is set. No SVG favicon with `prefers-color-scheme` media query for light/dark adaptive favicon.  
**Fix:** Create an SVG favicon that adapts to light/dark mode:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" href="/favicon.png" />
```

### 8E. The Lens page opts out of the site's design system
**File:** `src/pages/Lens.jsx`  
**Issue:** The Lens page creates its own colour system (dark-only `col` object) that's entirely separate from the ThemeContext CSS variables. If a user is in light mode, the Lens page is still dark. This is likely intentional for brand/mood purposes but should be documented and the transition into/out of it should be smooth.  
**Fix:** Ensure the transition from a light-mode page to the dark Lens page and back is smooth. Consider temporarily overriding the theme context when on the Lens page to ensure nav/footer consistency.

---

## 9. CODE QUALITY & MAINTENANCE

### 9A. Duplicate helper functions across serverless functions
**Files:** `functions/api/inquiries.js`, `functions/api/ventures.js`, `functions/api/support.js`  
**Issue:** `verifyTurnstile()`, `checkRateLimit()`, `isValidEmail()`, `sanitise()`, `escapeHtml()`, `sendEmail()` are copy-pasted identically in 3+ files.  
**Fix:** Extract shared helpers to `functions/api/_shared/helpers.js` and import them. (Note: Cloudflare Pages Functions support relative imports.)

### 9B. Legacy `contact.js` function endpoint
**File:** `functions/api/contact.js`  
**Issue:** This appears to be an older version of the inquiry handler with fewer security protections. It likely still works and could be discovered/exploited.  
**Fix:** Remove `functions/api/contact.js` entirely, or add a redirect in `_redirects`:
```
/api/contact /api/inquiries 301
```

### 9C. No TypeScript
**Issue:** The project uses `jsconfig.json` and has TypeScript 5.8 in devDependencies but all source files are `.jsx`. No type checking is being leveraged.  
**Fix:** This is a longer-term effort, but at minimum:
- Enable TypeScript checking in jsconfig.json: `"checkJs": true`
- Add JSDoc type annotations to critical files (API submissions, form data structures)
- Consider migrating the serverless functions to TypeScript first (they're the most security-sensitive)

### 9D. Console.error left in production code
**Files:** `src/pages/StartProject.jsx`, `src/pages/Support.jsx`, `functions/api/*.js`  
**Issue:** `console.error` calls in form submission handlers will leak to production browser console.  
**Fix:** Either strip console statements in production via Vite config or replace with a logging service. For the serverless functions, `console.error` is fine (goes to Cloudflare logs), but for client-side code, remove or gate behind `import.meta.env.DEV`.

---

## 10. ADDITIONAL IMPROVEMENTS

### 10A. Add a proper 404 redirect in _redirects
**File:** `public/_redirects`  
**Issue:** The SPA catch-all `/* /index.html 200` means every invalid URL returns a 200 status. Search engines will index 404 pages as real pages.  
**Fix:** The SPA architecture requires this, but ensure the React 404 page component sets a proper status indication. Consider adding specific redirects for known old paths before the catch-all.

### 10B. No Open Graph image per page
**Issue:** All pages share a single `/og-image.png`. Social shares of the Portfolio, Lens, or individual case study pages all show the same generic image.  
**Fix:** Generate per-page OG images or at minimum have distinct ones for: Home, Portfolio, Lens, Services, and each case study.

### 10C. No print stylesheet
**Issue:** If someone prints the Terms page, proposal pages, or pricing pages, the output will include animations, navigation, and dark backgrounds.  
**Fix:** Add basic print styles:
```css
@media print {
  nav, footer, .c4-support-rail { display: none !important; }
  * { color: #000 !important; background: #fff !important; }
}
```

### 10D. No service worker / offline support
**Issue:** For a portfolio site, having basic offline support (cached shell + offline page) would be a professional touch.  
**Fix:** Optional but recommended — add a minimal service worker via `vite-plugin-pwa` for asset caching.

### 10E. Missing `rel="noopener noreferrer"` audit
**File:** `src/components/c4/Footer.jsx`  
**Issue:** External links have `target="_blank" rel="noopener noreferrer"` in the Footer (good), but this pattern should be audited across ALL components. Any `target="_blank"` without `rel="noopener noreferrer"` is a security risk (reverse tabnapping).  
**Fix:** Grep all files for `target="_blank"` and ensure every instance has `rel="noopener noreferrer"`.

### 10F. Add `<noscript>` fallback
**File:** `index.html`  
**Issue:** If JavaScript is disabled, users see a blank page forever.  
**Fix:** Add a `<noscript>` tag:
```html
<noscript>
  <div style="padding: 2rem; text-align: center; font-family: system-ui;">
    <h1>C4 Studios</h1>
    <p>This site requires JavaScript to run. Please enable JavaScript in your browser settings.</p>
  </div>
</noscript>
```

---

## PRIORITY ORDER FOR IMPLEMENTATION

### P0 — Ship blockers (do these first)
1. Google Analytics integration (Section 2) — you're flying blind without it
2. Content-Security-Policy header (Section 1A)
3. Per-page meta titles & descriptions (Section 4A)
4. Loading screen / preloader in index.html (Section 3A)
5. Theme FOUC fix — inline script in head (Section 7F)
6. Error Boundary (Section 7A)

### P1 — High-impact improvements
7. Code splitting with React.lazy (Section 3C)
8. Sitemap.xml + robots.txt (Sections 4B, 4C)
9. Form label accessibility (Section 5B)
10. Skip-to-content link (Section 5A)
11. Upload endpoint security (Section 1D)
12. Remove legacy contact.js (Section 1B / 9B)
13. Intro sequence speed + content mounting fix (Section 3B)
14. Structured data JSON-LD (Section 4D)

### P2 — Professional polish
15. Colour contrast fixes (Section 5D)
16. Focus management after form submission (Section 5C)
17. Mobile menu focus trap (Section 5G)
18. Noscript fallback (Section 10F)
19. Extract shared serverless helpers (Section 9A)
20. Tailwind CSS variable utilities (Section 8B)
21. Footer enhancements (Section 8C)
22. 404 page improvement (Section 7D)
23. Print stylesheet (Section 10C)
24. GA conversion events (Section 2, item 4)

### P3 — Nice to have
25. React StrictMode (Section 7B)
26. Bundle optimization — LazyMotion (Section 6D)
27. Image optimization strategy (Section 6B)
28. PillSelect accessibility (Section 5E)
29. Contact redirect improvement (Section 7C)
30. Per-page OG images (Section 10B)
31. Dark mode favicon (Section 8D)
32. Service worker (Section 10D)

---

## EXECUTION NOTES

- **Project root** is `C4-main/C4-main/` — all relative paths above are from this root
- Run `npm run dev` for the Vite dev server, `npm run dev:full` for functions + dev
- Cloudflare Pages deploys from the `dist/` directory (output of `npm run build`)
- Environment variables: `VITE_GA_MEASUREMENT_ID`, `VITE_TURNSTILE_SITE_KEY` (client), and `RESEND_API_KEY`, `CONTACT_EMAIL`, `TURNSTILE_SECRET_KEY`, `ALLOWED_ORIGIN`, `FROM_EMAIL` (server)
- Test all form submissions locally with `npm run dev:full` (wrangler pages dev)
- After implementing CSP, test thoroughly — CSP violations will break the site if too strict
- Run Lighthouse audits after each batch of changes to measure impact
