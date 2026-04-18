# DS Racing Karts — Portfolio Data Extraction Prompt

> **Purpose:** Paste this prompt into the DS Racing Karts repo's AI assistant to extract every detail needed for a C4 Studios portfolio case study entry. This is the CENTREPIECE project — an e-commerce platform with 499+ products, Square payment integration, a custom-built video game (2,450 lines Canvas 2D), 3D scroll animations (GSAP ScrollTrigger), a 4-stage data migration pipeline (Square CSV → Supabase), admin dashboard, Sentry error tracking, Lenis smooth scrolling, security hardening, and more. The output must follow the exact schema below — no fields skipped, no guessing.
>
> **IMPORTANT — OUTPUT LENGTH:** This prompt will produce a VERY long response. If your output gets cut off mid-sentence, that's expected. When that happens, I will say "continue from where you left off" and you should resume from the exact cut-off point. Do NOT restart or summarise — just continue.

---

## PROMPT

I need you to perform a comprehensive audit of this entire codebase and produce a structured portfolio case study dataset for the C4 Studios portfolio. This site was designed and built by C4 Studios for the client (DS Racing Karts). Be **exhaustive** — I need every detail you can extract. This is the biggest project in the C4 portfolio and should be treated as such.

### 1. PROJECT METADATA

Extract or confirm the following:

| Field | What I need |
|---|---|
| **Project name** | Full official name (e.g. "DS Racing Karts") |
| **Client name** | The person or entity who owns the project (Dion Scott / DS Racing Karts) |
| **Location** | Client's physical location — Long Reef Crescent, Woodbine, NSW, Australia |
| **Live URL** | https://www.dsracingkarts.com.au/ |
| **Year** | Year the site was built/launched (2025/2026) |
| **Timeline** | How long the project took from kickoff to launch (check git history — first commit to production deploy) |
| **Budget range** | Estimate based on scope. Use ranges: "$500 – $1k", "$1k – $2.5k", "$2.5k – $5k", "$5k – $10k", "$10k+" — given the e-commerce + Square migration + custom game + 499 products + admin panel + Sentry + security hardening, this is likely $10k+ |
| **Role** | C4's role — "Solo — design, development, deployment, backend migration, analytics setup, copywriting, SEO, error tracking" |
| **Category** | This project should be `ecommerce` — note: if this category doesn't exist yet in the portfolio system, use `web_app` but flag that a new `ecommerce` category is needed |
| **Tags** | 5–7 service tags — must include: `['E-Commerce', 'Web Application', 'Square Integration', 'Go Karting', 'Motorsport', 'Product Catalogue', 'Game Design']` |
| **Featured** | `true` — this is the centrepiece project |
| **Brand colour** | Primary brand hex colour — confirmed `#e60012` (racing red) from the design system. Verify from tailwind config / CSS variables and report exact value. |

### 2. COPY & CONTENT

| Field | What I need |
|---|---|
| **One-liner** | A single compelling sentence summarising the project for a portfolio card (max ~120 chars). Write it from C4's perspective as the builder. Must convey the scale: e-commerce, 499+ products, custom game, Square backend. |
| **Overview** | A 4–6 sentence paragraph describing what was built, why, and the outcome. This is the flagship project — the overview needs to communicate SCALE. Cover: the client's situation (established kart business with decades of racing history, needed a digital storefront), C4's approach (full design + development + e-commerce architecture + Square migration + analytics), what was delivered (e-commerce platform with 499+ products, custom slot-car mini-game, 3D scroll animations, service pages, sponsor showcase, newsletter system, cookie consent, full legal pages), and the result. Written for a portfolio audience (prospective clients of C4). |

### 3. PAGES & STRUCTURE

List **every** page/route in the application. I know there are at minimum:

- `/` — Homepage (hero with parallax, value props, DSR Grand Prix game, shop by category grid, history section, RPM tachometer stats counter, latest products carousel, newsletter signup)
- `/about` — About page (founder profile for Dion Scott, racing teams showcase with team numbers, results timeline, "Know Your Chassis" educational content with sprint/endurance/Predator sections, stats bar)
- `/services` — Services page (7 service cards: Kart Servicing, Engine Tuning, Chassis Setup, 4 Stroke Endurance, Race Preparation, Driver Coaching, Custom Racewear — each with included items checklists, racewear photo gallery)
- `/shop` — Shop/catalogue page (499+ products, category filtering, stock filtering, pagination, search, sort, grid/list view)
- `/shop?category=X` — Category filtered views (Steering & Components, Stub Axles, Brakes, Miscellaneous, Racewear, Axles, Bearings, Chains, Car Racing, etc.)
- `/product/[slug]` — Individual product pages (image, SKU, price, stock status, add to cart, category breadcrumb, description)
- `/cart` — Shopping cart (line items, quantities, totals, checkout flow)
- `/contact` — Contact page (form with subject prefills from service pages, location info, appointment-only notice, DSR flag branding)
- `/sponsors` — Sponsors page (19+ sponsor logos in infinite scroll/carousel, partnership CTA)
- `/terms` — Terms & Conditions (10 sections covering products, orders, shipping, returns, workshop, IP, liability, governing law)
- `/privacy` — Privacy Policy (9 sections covering data collection, Square, Google Analytics, cookies, Australian Privacy Principles)
- `/checkout` — Checkout page (customer details form, shipping address with state dropdown, Square Web Payments SDK card element, pay button)
- `/checkout/confirmation` — Order confirmation page (green checkmark, order number DSR-XXXXX, "What happens next" 3-step process)
- `/not-found` — Custom 404 page (giant "404" with racing-themed CTAs — Home, Shop)
- `/error` — Error boundary page (AlertTriangle icon, "Try Again" / "Go Home" — triggers Sentry.captureException)
- `/global-error` — Global error boundary fallback
- `/admin/login` — Admin login (Supabase email/password auth)
- `/admin` — Admin dashboard (product/order/customer counts, recent orders table, low stock alerts with colour-coded thresholds — 5 parallel Supabase queries)
- `/admin/products` — Admin product management (25/page pagination, search, status filter, CRUD)
- `/admin/products/[id]` — Product editor (images upload/delete/set primary, variations, inventory, categories, SEO fields)
- `/admin/categories` — Category management (hierarchical table, parent bold, child indented with └, product counts)
- `/admin/customers` — Customer list (search across name/email, 25/page pagination)
- `/admin/orders` — Order management (status badges, customer join, pagination)
- `/sitemap.xml` — Dynamic sitemap generated from Supabase (all static pages + all 499+ product slugs + category URLs)
- `/robots.txt` — Standard with admin/API/checkout/auth disallow
- `/manifest.webmanifest` — PWA manifest (standalone display, #e60012 theme)
- `/opengraph-image` — Dynamic 1200×630 OG image (Edge runtime)
- `/icon` — Dynamic 32×32 favicon ("DSR" in red)
- `/apple-icon` — Dynamic 180×180 Apple icon
- `/twitter-image` — Dynamic Twitter card image
- API routes: `/api/checkout`, `/api/contact`, `/api/newsletter`, `/api/search`, `/api/webhooks/square`, `/api/admin/products/[id]`, `/api/admin/products/[id]/images`, `/api/categories`, `/api/products`

For each page, extract:
- Route path
- Page title / purpose
- Key sections on that page (hero, services grid, product grid, cart table, etc.)
- Notable UI patterns (scroll animations, carousels, modals, accordions, games, interactive elements, sticky elements, etc.)

### 4. DELIVERABLES

List **everything** that was delivered. This project is massive — be exhaustive. I know it includes at minimum:
- Complete e-commerce website (design + development + deployment)
- Square payment/checkout integration and backend migration
- Product catalogue system (499+ products synced from Square)
- Individual product pages with images, SKUs, pricing, stock status
- Shopping cart with add/remove/quantity management
- Category-based product filtering and navigation
- Stock availability filtering
- Product search functionality
- Product pagination (21+ pages of products)
- 7 detailed service pages with checklists and enquiry CTAs
- Custom "DSR Grand Prix" slot-car racing mini-game (W/S and ↑/↓ controls, head-to-head gameplay)
- 3D scroll animations throughout the site
- RPM tachometer-style animated statistics counter
- Founder profile with biographical content and photo
- Racing teams showcase with team numbers
- Results/achievements timeline
- "Know Your Chassis" educational content section (Sprint, Endurance, Predator)
- Sponsor showcase with 19+ brand logos
- Contact form with service-specific subject prefills
- Newsletter/email subscription system
- Cookie consent banner with accept/decline
- Google Analytics 4 integration
- Privacy Policy page (Australian Privacy Principles compliant)
- Terms & Conditions page (10 sections, e-commerce focused)
- Custom racewear photo gallery
- "Built for Performance" workshop showcase section
- Responsive design (mobile + tablet + desktop)
- SEO setup — per-page metadata, dynamic OG/Twitter/favicon generation (Edge runtime), sitemap.xml with all 499+ product slugs, robots.txt, LocalBusiness + Product structured data schemas
- C4 Studios credit badge in header and footer
- All page content writing / copywriting
- AI-generated product descriptions — Claude Haiku filled ~400 empty/minimal descriptions while preserving existing specifications
- Domain and hosting configuration
- Facebook integration
- Full admin dashboard with product/order/customer management, low stock alerts, image upload/delete
- Admin product editor — full CRUD for products, variations, inventory, images, categories, SEO fields
- Supabase Auth with role-based admin access (admin/super_admin profiles)
- 4-stage data migration pipeline — Square CSV import → category deduplication → image migration (Square Catalog API → Supabase Storage) → AI description generation
- 12 custom hand-drawn SVG category icons (steering wheel, chain, brake disc, axle, etc.)
- Scroll-pinned SVG race animation with two detailed top-down karts
- Sentry error tracking (client, server, and edge runtime) with replay capture on errors
- Security hardening — HSTS, CSP, X-Frame-Options DENY, rate limiting on all public API routes, HMAC-SHA256 webhook verification
- Square webhook handler for real-time order status updates
- Lenis smooth scrolling throughout the site
- Web app manifest for standalone/PWA capability
- Appointment-only modal popup system

### 5. FEATURES

List every notable feature. Be technical but readable. I know there are at minimum:
- "Full e-commerce platform with 499+ go kart parts, synced from Square's product catalogue via API"
- "Custom-built 'DSR Grand Prix' slot-car racing mini-game with keyboard controls (W/S + ↑/↓), head-to-head AI opponent, built directly into the homepage"
- "Square payment integration for secure checkout with major credit/debit cards"
- "3D scroll-triggered animations throughout the site (specify which library — GSAP, Framer Motion, Three.js, or CSS-based)"
- "Animated RPM tachometer stats counter with redline indicator (Parts in Stock, Years in Karting, Karts Serviced)"
- "Dynamic product catalogue with category filtering, stock filtering, pagination (21+ pages), and search"
- "Product detail pages with image zoom, SKU display, pricing, stock status indicators, breadcrumb navigation, and add-to-cart functionality"
- "Shopping cart with quantity adjustment, line item management, and order total calculation"
- "Seven-service showcase with expandable detail cards, included-items checklists, and contextual enquiry CTAs with pre-filled subjects"
- "Founder bio section with racing history narrative, professional photo, and career highlights"
- "Racing teams grid with team numbers (338, 43, 114, 5, 555, 272, 285, 22, 249) and visual showcase"
- "Results timeline — chronological achievement history (2024 ERC Podiums, 2023 Endurance Victories, 2021 SEK Wins, etc.)"
- "'Know Your Chassis' educational content — technical breakdowns of sprint, endurance, and Predator chassis types"
- "Custom racewear gallery with 10+ product photos in masonry/grid layout"
- "Sponsor showcase with 19+ partner logos in infinite-scroll carousel"
- "Newsletter subscription system ('Stay in the Fast Lane')"
- "Cookie consent banner with accept/decline options and privacy policy link"
- "Google Analytics 4 with cookie-consent-aware loading"
- "Contact form with dynamic subject prefills from service page CTAs"
- "Appointment-only notice system with workshop access instructions"
- "Category navigation grid on homepage ('Shop by Category')"
- "Latest products carousel on homepage with live pricing"
- "'History — What Racing Means to Us' parallax/scroll section"
- "Mobile-responsive navigation with cart icon and product count badge"
- "C4 Studios credit badge with link"
- "Facebook social integration"
- "Email link integration (info@dsracingkarts.com.au)"
- "Supabase Storage for product image hosting"
- "Admin dashboard with product count, order management, customer list, and low stock alerts — 5 parallel Supabase queries"
- "Admin product editor — full CRUD for products, variations, inventory, images (upload/delete/set primary), categories, and SEO fields via protected API routes"
- "Supabase Auth with role-based admin access (admin/super_admin profiles), middleware redirect for unauthenticated requests"
- "4-stage data migration pipeline — Square CSV export → Supabase import (2-pass category/product processing) → category deduplication → image migration (Square Catalog API with web-scraping fallback) → AI description generation (Claude Haiku for ~400 products)"
- "Sentry error tracking across client (10% traces, 100% error replays), server, and edge runtimes with global error boundary fallback"
- "Security hardening — HSTS with 2-year max-age, CSP, X-Frame-Options DENY, rate limiting (checkout 10/5min, contact 3/15min, newsletter 5/15min), HMAC-SHA256 webhook verification with timing-safe comparison"
- "Lenis smooth scrolling (duration 1.2s, exponential easing, touch multiplier 2×) wrapping entire application"
- "PWA-ready web app manifest with standalone display mode, #e60012 theme colour"
- "Scroll-pinned SVG race animation — two detailed top-down karts with rear wings, wheels, helmets, number circles, animated exhaust glow, racing across track with grass/kerbs/asphalt"
- "12 custom hand-drawn SVG category icons — steering wheel, chain links, brake disc, axle, stub axle, ball bearing, helmet, chequered grid, fuel can, wrench, tie rod, car silhouette"
- "Hero video section with autoplay detection, 12-second fallback timeout, crossfade to cycling background images (5s interval)"
- "3D perspective video container — IntersectionObserver play/pause, scroll-driven rotateX/Y/scale/translateY/opacity transforms with perspective: 1200px, red radial glow"
- "Square webhook handler for real-time order status updates (payment.updated → paid/cancelled) with fail-closed HMAC-SHA256 signature verification"

Look for MORE features I haven't listed. Check every component, every hook, every utility.

### 6. TECH STACK

List every technology, framework, library, and tool used. Check `package.json`, import statements, config files, deployment config, and any API integrations. **Confirmed from initial extraction:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5.7
- Tailwind CSS 3.4
- GSAP 3.14 + ScrollTrigger (powers ALL scroll animations and tachometer)
- @gsap/react 2.1
- Lenis 1.3 (smooth scrolling)
- Square SDK 38.0 (Payments API — server-side)
- Square Web Payments SDK (client-side card tokenisation)
- Supabase JS 2.47 + SSR 0.5 (Postgres, Auth, Storage)
- PostgreSQL via Supabase (with pg_trgm + uuid-ossp extensions)
- Resend 6.11 (transactional email for contact form + order confirmations)
- Sentry 10.49 (error tracking — client, server, edge)
- Google Analytics 4 (cookie-consent-gated via next/script afterInteractive)
- Mailchimp REST API (newsletter, optional sync with double opt-in)
- Canvas 2D API (custom game engine — NO external game libraries)
- Lucide React 0.460 (icon library)
- clsx 2.1 + tailwind-merge 2.6 (class utilities)
- sanitize-html 2.17 (HTML sanitisation for product descriptions)
- Anthropic Claude Haiku 4.5 (product description generation — build tool, not runtime)
- PostCSS 8.4 + Autoprefixer 10.4
- Node.js 22+

**Verify these versions are still current and look for anything I missed.** Format as an array of strings.

### 7. INTEGRATIONS

List ALL third-party services, APIs, and external integrations:
- **Square Payments API** — `paymentsApi.createPayment()` server-side in `/api/checkout` with card tokenisation, idempotency keys, AUD BigInt amounts
- **Square Web Payments SDK** — client-side card form element for PCI-compliant tokenisation (loads dynamically in checkout page)
- **Square Catalog API** — used in image migration script to fetch all ITEM/IMAGE objects for downloading product photos
- **Square Webhooks** — inbound `payment.updated` events with HMAC-SHA256 signature verification (timing-safe comparison) mapping to Supabase order status
- **Supabase Postgres** — 12 tables, 15 indexes (including GIN tsvector + trigram for search), 19 RLS policies, computed stock_status column, auto-incrementing DSR-XXXXX order numbers, `decrement_inventory()` SECURITY DEFINER function
- **Supabase Auth** — email/password for admin panel, role-based access (admin/super_admin), middleware session refresh
- **Supabase Storage** — product-images bucket, public URLs through Next.js Image optimisation
- **Resend** — transactional email for order confirmations (branded HTML) and contact form submissions. From: noreply@dsracingkarts.com.au, To: dsracing@bigpond.com
- **Google Analytics 4** — loaded via next/script afterInteractive only after cookie consent, measurement ID from env var
- **Mailchimp REST API** — optional newsletter sync with double opt-in (status: "pending"), graceful fallback if not configured
- **Anthropic Claude API** — Haiku 4.5 for build-time product description generation (~400 products, dry-run mode, cost tracking)
- **Sentry** — error tracking across client (10% traces, 100% error replays), server, and edge runtimes
- **Facebook** — social media link integration
- **Next.js Image CDN** — remote patterns for Supabase Storage and Square S3 CDN, AVIF/WebP, 30-day edge cache

For each integration, specify:
- What it does in this project
- How it's integrated (SDK, REST API, webhook, etc.)
- Any notable implementation details

### 8. SQUARE INTEGRATION DEEP-DIVE

This is a critical differentiator for the portfolio. Extract ALL details about the Square integration:
**Confirmed architecture — verify and expand:**
- **Payments API**: `paymentsApi.createPayment()` in `/api/checkout/route.ts` — card tokenisation via Square Web Payments SDK on client, server-side payment with idempotency UUID, AUD BigInt amounts, buyer email
- **Catalog API**: Used in `scripts/migrate-images.js` to fetch all ITEM + IMAGE objects for Supabase upload (NOT used at runtime)
- **Webhooks**: `payment.updated` → `/api/webhooks/square/route.ts` — HMAC-SHA256 signature verification with `crypto.timingSafeEqual`, maps COMPLETED/FAILED/CANCELLED to Supabase order status
- **Product sync is NOT live from Square**: Products imported via 4-stage pipeline:
  1. `scripts/import-square-csv.js` — 2-pass CSV import (Pass 1: categories with dedup, Pass 2: products/variations/inventory)
  2. `scripts/merge-categories.cjs` — Cleanup duplicate categories from Square's messy export format (escaped commas, `Parent > Child` notation)
  3. `scripts/migrate-images.js` — Square Catalog API → download → upload to Supabase Storage → insert product_images records (with web-scraping fallback for missing images)
  4. `scripts/generate-descriptions.cjs` — Claude Haiku fills ~400 empty descriptions (dry-run mode, backup JSON, cost tracking)
- **Stock**: Imported from Square CSV "Current Quantity" column, stored in `inventory` table with computed `stock_status` column (GENERATED ALWAYS AS), decremented atomically via `decrement_inventory()` SECURITY DEFINER function. **Intentionally does not block purchases** — client can source within a day.
- **Pricing**: All AUD, GST (10%) calculated client-side in cart/checkout, `base_price` = minimum of all variation prices (for "From $X" display)
- **Checkout**: Square Web Payments SDK loads dynamically, card.tokenize() → POST to `/api/checkout` → server validates prices against DB, creates payment, creates order in Supabase with DSR-XXXXX number → Resend confirmation email → redirect to `/checkout/confirmation`
- **Categories**: Square exports `"Name (SQUARE_ID)"` with `>` for nesting. Import script parses escaped commas, extracts IDs via regex, creates `parent_id` foreign keys, generates URL slugs with conflict resolution
- **Image pipeline**: Square Catalog API images → downloaded to temp → uploaded to Supabase Storage `product-images` bucket → served via Next.js Image with AVIF/WebP + 30-day edge cache

Verify all of the above against current code and report any changes or additional details.

### 9. THE GAME — DSR GRAND PRIX

This is a huge portfolio talking point. Extract EVERYTHING about the mini-game:
**Confirmed from initial extraction — verify and expand:**
- **Technology**: Pure Canvas 2D API — ZERO external game libraries. ~2,450 lines of hand-written code across: `DSRGrandPrix.tsx`, `GameCanvas.tsx`, `GameHUD.tsx`, `GameMenu.tsx`, `GameOver.tsx`, `TrackSelect.tsx`, `engine/constants.ts`, `engine/input.ts`, `engine/physics.ts`, `engine/renderer.ts` (~553 lines), `engine/state.ts`, `engine/track.ts`
- **Track generation**: Catmull-Rom spline interpolation from control points, curvature-based lane rendering
- **Physics**: Curvature-based speed model (acceleration/braking scale with turn tightness), not rigid-body physics
- **AI**: 4-tier difficulty (EASY/MEDIUM/HARD/INSANE) with curvature-scaled speed targets, overtake awareness, braking point prediction
- **Controls**: Keyboard W/S + ↑/↓ for 2-player, plus MOBILE TOUCH CONTROLS (GAS/BRAKE buttons)
- **F1-style countdown**: 5 lights with random delay, false start detection (warning → penalty → disqualification)
- **Visuals**: Pixel-art SVG karts, procedural scenery (trees, barriers), persistent skid marks (cap 300, batch purge 50), exhaust particles
- **Tracks**: 4 tracks — The Oval, The Chicane, The Circuit, **Campbelltown GP** (Easter egg — local reference)
- **Embedded via**: `next/dynamic` with `ssr: false` — zero SSR cost, code-split, lazy-loaded on demand. `GameTeaser` component on homepage triggers expansion
- **Performance**: Uses `useRef` for game state (avoids React re-renders in rAF loop), seeded random for cached scenery
- **Game over**: Animated SVG trophy with race stats and "Play Again" CTA
- **State machine**: MENU → TRACK_SELECT → COUNTDOWN → RACING → GAME_OVER with full lap tracking

Verify all of the above and look for anything I missed — sound effects, hidden features, additional tracks.

### 10. PERFORMANCE & ACCESSIBILITY

Audit and report on:
- Lighthouse-relevant patterns (lazy loading, image optimization, Next.js Image component usage, font loading)
- SEO patterns (meta tags, Open Graph, Twitter cards, structured data, sitemap.xml, robots.txt)
- E-commerce SEO (product schema, breadcrumbs, canonical URLs)
- Accessibility patterns (semantic HTML, ARIA labels, colour contrast, keyboard navigation, focus management)
- Core Web Vitals considerations (CLS prevention especially with product images, LCP optimization, INP for interactive elements)
- Cookie consent implementation and its effect on analytics loading
- Any `next.config.js` performance optimizations
- Any `_headers`, security headers, or middleware
- Image optimization pipeline (Supabase → Next.js Image → client)
- How 499+ products affect page load and pagination performance

### 11. 3D SCROLL ANIMATIONS

**Confirmed: GSAP 3.14 + ScrollTrigger powers ALL scroll animations.** Detail every one:

**Known animated sections:**
- **History timeline** (`HistorySection.tsx`) — 9 nodes with scroll-driven trunk growth (SVG path animation), GSAP-animated dot/branch/card reveal/hide per node, terminal circle lock with pulse animation, fullscreen image lightbox with Escape-key dismiss
- **RPM Tachometer** (`Speedometer.tsx`, ~336 lines) — realistic SVG tachometer face (0–16,000 RPM), scroll-driven needle with linear ramp to 14,500 RPM then sinusoidal rev-limiter bounce at redline, gold-to-red arc colour transition, SVG glow filters, 3 counting stat cards (500+ Parts, 40 Years, 1000+ Karts)
- **SVG Race Animation** (`RaceAnimation.tsx`) — scroll-pinned for 300vh, two detailed top-down karts with rear wings/wheels/helmets/numbers, animated exhaust glow, racing across asphalt with grass/kerbs, Kart 1 surge + drift at 75%/90% progress, finish-line flash
- **3D Video Container** (`ScrollVideo.tsx`) — IntersectionObserver play/pause, scroll-driven rotateX/Y/scale/translateY/opacity transforms with `perspective: 1200px`, red radial glow following sinusoidal curve, scanline overlay
- **Hero Video** (`HeroVideo.tsx`) — autoplay detection with 12-second fallback timeout, crossfade to cycling background images (5s interval), scroll indicator
- **Sponsor carousel** — CSS infinite scroll (35s linear, 3× duplication), gradient fade edges, hover image-swap (700ms fade)

List every additional animated section and verify the above. Also check for:
- Reduced-motion / `prefers-reduced-motion` support
- GPU acceleration patterns (transform3d, will-change)
- Performance impact of multiple ScrollTrigger instances on homepage

### 12. CHALLENGES

Identify 5–8 genuine technical or design challenges. This is a complex project — there should be plenty:
- **Square catalogue migration** — migrating 499+ products with categories, images, pricing, inventory from whatever system they were on before to Square, and building the frontend to consume it
- **E-commerce architecture** — building a full shop experience (browse, filter, search, cart, checkout) on top of Square's API without a traditional e-commerce platform
- **Mini-game development** — designing and building an interactive racing game that runs smoothly in a browser alongside a content-heavy e-commerce site
- **3D animations performance** — keeping scroll animations smooth on a page that also loads product images and runs a game
- **499+ product catalogue** — pagination, filtering, search, and category navigation at scale
- **Product image pipeline** — Square product images → Supabase storage → Next.js Image optimization → client
- **Cookie consent + Analytics** — implementing GA4 that respects user consent choice
- **Responsive e-commerce** — making a complex shop with filters, cart, and product details work beautifully on mobile
- Look for MORE. Check git history for difficult commits, complex components, refactors.

### 13. POTENTIAL IMPROVEMENTS

Identify 3–5 honest, constructive future improvements:
- Features that could be added (wishlist, product reviews, order tracking, related products, etc.)
- Performance optimizations
- SEO enhancements (product schema, rich snippets)
- Additional integrations (shipping calculator, inventory webhooks, etc.)
- UX refinements

### 14. SCREENSHOTS GUIDE

For each page, describe the **ideal screenshot regions** that would best showcase this as the portfolio centrepiece:
- What section to capture
- Why it's portfolio-worthy
- Desktop vs mobile priority
- Suggested caption

**Must-capture sections for this project:**
1. Homepage hero with "BUILT FOR SPEED. ENGINEERED TO WIN." headline
2. DSR Grand Prix mini-game in action (mid-race)
3. Shop by Category grid
4. RPM tachometer stats counter (mid-animation if possible)
5. Latest Products carousel with pricing
6. Shop page with product grid and filters
7. Individual product page with image, pricing, add-to-cart
8. Cart page with items
9. Services page with the 7-service card grid
10. Kart Servicing detail with included-items checklist
11. Custom Racewear photo gallery
12. About page — Dion Scott founder profile
13. Racing teams showcase with team numbers
14. Results timeline
15. "Know Your Chassis" educational section
16. Sponsors page with logo carousel
17. Contact page with form and location info
18. Mobile: Homepage hero
19. Mobile: Shop page with products
20. Mobile: Product detail page
21. Mobile: Cart
22. Mobile: Navigation with cart badge
23. Checkout page with Square card form
24. Order confirmation page with DSR-XXXXX number
25. Admin dashboard with stats and low stock alerts
26. Admin product editor with image management
27. Scroll-pinned SVG race animation (two karts)
28. 3D perspective video container with scroll rotation
29. Custom 404 page with racing-themed CTAs
30. Search autocomplete with Ctrl+K and rich results

### 15. DESIGN SYSTEM DETAILS

Extract from the codebase:
- Primary, secondary, and accent colours (hex values) — the site has a strong red/racing red + dark theme
- Font families used (headings, body, accents — I see what looks like a racing/motorsport inspired typography)
- Border radius patterns
- Spacing system
- Any CSS custom properties or Tailwind theme extensions
- Dark mode support (the site appears dark-themed by default — is there a light mode?)
- Animation/transition patterns used throughout
- The motorsport/racing design language decisions (tachometer UI, chequered flag patterns, speed-inspired motion, etc.)

### 16. NEWSLETTER & COOKIE SYSTEMS

Detail:
**Confirmed from initial extraction — verify and expand:**
- **Newsletter**: POST to `/api/newsletter` → Supabase `newsletter_subscribers` upsert (email + subscribed_at) → optional Mailchimp REST API sync with `status: "pending"` (double opt-in). Graceful fallback if Mailchimp keys not configured. Rate limited 5/15min.
- **Cookie consent**: Custom implementation (no external library). Accept/Decline buttons. Consent stored in `localStorage`. Banner shown on every page via layout component.
- **GA4 gating**: Google Analytics loaded via `next/script` with `strategy="afterInteractive"` — script tag is **conditionally rendered** only when consent = true. Zero Google scripts load until explicit Accept.
- **CTA copy**: "Stay in the Fast Lane" heading with email input and "Subscribe" button in newsletter section

Verify implementation details and look for:
- What localStorage key is used for consent
- Any other cookies set (Supabase auth cookies for admin?)
- Whether declining consent removes any existing cookies

### 17. E-COMMERCE DATA ARCHITECTURE

This is critical for demonstrating technical depth:
**Confirmed architecture — verify and expand:**
- **Data flow**: Square POS → CSV export → `import-square-csv.js` (2-pass) → Supabase Postgres. Frontend reads ONLY from Supabase (not Square) for all product browsing.
- **Database**: Supabase Postgres with 12 tables, 15 indexes (GIN tsvector + trigram for search), 19 RLS policies. Key tables: `products`, `product_variations`, `inventory`, `product_images`, `categories`, `orders`, `order_items`, `customers`, `newsletter_subscribers`, `admin_profiles`
- **Computed fields**: `stock_status` is `GENERATED ALWAYS AS` (in_stock if qty > 0, else out_of_stock). `base_price` = minimum variation price.
- **Categories**: Hierarchical with `parent_id` foreign key. URL slugs generated with conflict resolution. Display as sidebar tree with parent > child nesting.
- **Cart**: React Context (`useCart.tsx`) with localStorage persistence. Tracks items with product_id, variation_id, quantity, name, price, image. Max quantity caps.
- **Checkout**: Custom (NOT Square hosted). Square Web Payments SDK loads dynamically → `card.tokenize()` → POST to `/api/checkout` → server validates prices against DB → `paymentsApi.createPayment()` with idempotency → create order in Supabase with auto-increment DSR-XXXXX → `decrement_inventory()` atomic call → Resend confirmation email → redirect to `/checkout/confirmation?orderId=X`
- **Order numbers**: Auto-incrementing via PostgreSQL trigger: `DSR-00001`, `DSR-00002`, etc.
- **Pricing**: AUD, GST (10%) calculated client-side: subtotal × 0.1 for GST line, subtotal × 1.1 for total. Products stored as base price (ex-GST or inc-GST — verify which).
- **Search**: `/api/search` route with PostgreSQL trigram matching (`pg_trgm`), max 6 results, input sanitised to prevent PostgREST injection

Verify all details and produce a data flow diagram showing: Square POS → CSV → import scripts → Supabase Postgres → API routes → React Server Components → Client Components → Cart Context → Checkout → Square Payments API → Webhook → Order status update

---

## OUTPUT FORMAT

Return the data as a **JavaScript object** that matches this exact structure, ready to paste into `caseStudyData.jsx`:

```javascript
'ds-racing-karts': {
  slug: 'ds-racing-karts',
  name: '...',
  oneLiner: '...',
  client: '...',
  location: '...',
  timeline: '...',
  budget: '...',
  role: '...',
  liveUrl: 'https://www.dsracingkarts.com.au/',
  year: '...',
  category: 'ecommerce',  // or 'web_app' if ecommerce category doesn't exist yet
  tags: [...],
  featured: true,
  budgetOrder: N,  // should be highest or near-highest given the scope

  cover: '/covers/ds-racing-karts.png',
  brandColor: '#HEXVAL',
  thumbnail: '/captures/dsracingkarts-com-au/desktop/01-hero.png',

  overview: '...',

  screenshots: [
    { url: '/captures/dsracingkarts-com-au/desktop/01-hero.png', caption: '...' },
    // ... ALL captures — this project should have MORE screenshots than any other case study
  ],

  desktopScreenshots: [
    { url: '/captures/dsracingkarts-com-au/desktop/01-hero.png', caption: '...' },
    // ... at minimum 15+ desktop screenshots covering every major section
  ],

  mobileScreenshots: [
    { url: '/captures/dsracingkarts-com-au/mobile/01-hero.png', caption: '...' },
    // ... at minimum 8+ mobile screenshots
  ],

  delivered: [
    '...',
    // This should be the LONGEST delivered list in the portfolio — 20+ items
  ],

  features: [
    '...',
    // This should be the LONGEST features list — 25+ items
  ],

  stack: [
    '...',
    // Full tech stack with versions
  ],

  integrations: [
    '...',
    // Every integration detailed
  ],

  performance: [
    '...',
  ],

  challenges: [
    '...',
    // 6-8 challenges
  ],

  improvements: [
    '...',
  ],
}
```

Also return **separately** (not inside the JS object):

1. **The full design system summary** (Section 15)
2. **The screenshot guide** (Section 14) — I need this to plan and verify captured screenshots (30 must-capture sections listed)
3. **The complete page/route map** (Section 3) — every route, every section, every UI pattern (including all admin routes and API routes)
4. **Square integration architecture** (Section 8) — full technical breakdown of the 4-stage migration pipeline and runtime payment flow
5. **DSR Grand Prix game breakdown** (Section 9) — complete technical analysis of all ~2,450 lines
6. **3D scroll animation inventory** (Section 11) — every GSAP ScrollTrigger instance, every animated element
7. **E-commerce data architecture** (Section 17) — full data flow diagram from Square POS → Supabase → Frontend → Checkout → Payment
8. **Newsletter & cookie systems** (Section 16)
9. **Admin dashboard architecture** — all admin routes, API endpoints, CRUD operations, auth flow
10. **Security audit** — all security measures (HSTS, CSP, rate limiting, HMAC verification, input sanitisation, RLS policies)
11. **Supabase schema summary** — all 12 tables, their columns, indexes, RLS policies, triggers, and functions

---

## IMPORTANT NOTES

- **OUTPUT LENGTH WARNING**: This will be a VERY long response. If you get cut off, I will say "continue" and you must resume from the exact cut-off point. Do NOT restart or summarise.
- This is the **centrepiece** of the C4 Studios portfolio. Every other case study has 5–12 features and 8–13 deliverables. This one should have **35+ features** and **30+ deliverables** minimum.
- The e-commerce aspects (Square integration, product catalogue, cart, checkout) are critical differentiators — detail them thoroughly.
- The custom mini-game is a unique selling point — no other portfolio project has this. Detail it completely.
- The 3D scroll animations demonstrate advanced frontend capability — catalogue every animation.
- The backend migration from whatever the previous system was to Square is a major technical achievement — document it.
- Google Analytics implementation with cookie consent shows attention to compliance and data.
- Check git history for timeline, number of commits, and any interesting development milestones.
- Read EVERY file. Check EVERY component. Inspect EVERY API route. Examine EVERY config file. This audit must be exhaustive.

Be thorough. Do not abbreviate or skip any section. Read every file in the project if needed.

---

## CONTINUATION PROTOCOL

If your response gets cut off (which is likely given the expected length):
1. I will say **"continue from where you left off"**
2. You MUST resume from the **exact character** where you were cut off
3. Do NOT restart, summarise, or repeat any already-provided content
4. Do NOT add any preamble like "Continuing from..." — just output the next content directly
5. If you were mid-code-block, resume inside the code block
6. If you were mid-sentence, finish the sentence

Expected output order (for continuation tracking):
1. JavaScript object (Sections 1–13 fields)
2. Design system summary (Section 15)
3. Screenshot guide (Section 14)
4. Page/route map (Section 3)
5. Square integration architecture (Section 8)
6. Game breakdown (Section 9)
7. Animation inventory (Section 11)
8. E-commerce architecture (Section 17)
9. Newsletter & cookie systems (Section 16)
10. Admin dashboard architecture
11. Security audit
12. Supabase schema summary
