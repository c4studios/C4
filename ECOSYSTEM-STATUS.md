# C4 Studios — Ecosystem Status & Handoff

> **Last updated: 2026-06-29.** Maintained by the product apps/sites agent.
> If you're an AI agent working in **C4**, **c4-saas-suite**, or **quotr**, read this first to sync with cross-repo work done outside your repo. This is the shared source of truth for the C4 product ecosystem.

## Products — each is a standalone, independently-purchasable app + marketing site

| Product | Marketing site | App | App repo | Site repo | Brand accent |
|---|---|---|---|---|---|
| ReviewLoop | reviewloop.c4studios.com.au | app.reviewloop.c4studios.com.au | `reviewloop-app` | `reviewloop-site` | amber `#9e600a` |
| ReturnDesk | returndesk.c4studios.com.au | app.returndesk.c4studios.com.au | `returndesk-app` | `returndesk-site` | **orange `#ee460f`** (new inbox+arrow logo) |
| Complia | complia.c4studios.com.au | app.complia.c4studios.com.au | `complia-app` | `complia-site` | green `#2c7a55` |
| FirmFlow | firmflow.c4studios.com.au | app.firmflow.c4studios.com.au | `firmflow-app` | `firmflow-site` | violet `#5b46c9` |
| Quotr | quotr.us | (same app) | `quotr` | — | blue `#2563eb` |

All GitHub repos are under `calebscott1892-bot` (apps/sites are private).

## Architecture & hosting

- **4 product APPS:** Next 16 + `@opennextjs/cloudflare` → **Cloudflare Workers** (custom domains `app.<product>.c4studios.com.au`). Shared Supabase project **"C4 Software" `nqhlnqnqlxmecyovyvlf`**. Per-app Stripe webhook. Deploy: `cd <app> && npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy`. Each app root `/` redirects to `/login`.
- **4 marketing SITES:** Vite + React + Tailwind + framer-motion, **prerendered** (`vite build` + `vite --ssr` + `node scripts/prerender.mjs`). Hosted as **Cloudflare Workers static-assets** (`<product>-web` workers; custom domains `<product>.c4studios.com.au`). Deploy: `cd <site> && npm run build && npx wrangler deploy`. **Off Vercel.**
- **Quotr:** Next 14 on **Vercel** (quotr.us). Branch *previews* are blocked by a Vercel deployment-protection setting; production (main) deploys fine.
- **C4 main site** (`C4` repo): the hub; its software page links all products. Cloudflare Pages (project `c4`, auto-deploys on push to main).

## What's been done (2026-06)

- All 4 products **extracted from `c4-saas-suite`** into standalone apps + sites. The suite is **retired-in-place** — keep it live as a fallback, **do not delete yet**.
- **Interactive redesigns** on every site: a self-running product-demo hero + an animated how-it-works (framer-motion, reduced-motion safe, SSR/prerender safe).
- **Quotr:** interactive landing redesign + a full SEO layer built from zero (sitemap.ts, robots.ts, manifest.ts, opengraph-image, metadata/canonical/OG/Twitter, per-page titles, JSON-LD Organization/SoftwareApplication/FAQPage) + accessible mobile nav. Live.
- **ReturnDesk rebrand:** new **inbox + orange-arrow** logo and **orange** accent (was azure UI / red hero bars) across the site, app, and the C4 software-page logo.
- **SEO/a11y/perf pass on the 4 Vite sites:** accessible mobile hamburger nav, scroll-to-top, header condense-on-scroll, scroll-spy active nav, skip-link → main, anchor scroll-offset, enriched JSON-LD (WebSite node, Offer `priceValidUntil`, OG image dims/alt/locale), self-hosted Inter (removed render-blocking Google Fonts), web manifest, and **3 prerendered programmatic-SEO landing pages per site** (unique title/meta/canonical, FAQPage + BreadcrumbList JSON-LD, added to sitemap.xml, footer-linked).

## Per-repo notes for the agent who owns it

- **`C4`:** software-page logos + product CTAs updated (PRs #3 product links, #4 quotr logo, #6 returndesk logo — all merged). Product logo/link data lives in `src/components/software/productData.js` (logo fields → `/Software/*`, CTAs → live `*.c4studios.com.au` sites). Outstanding: add a **Privacy page** (only Terms exists) before enabling analytics.
- **`c4-saas-suite`:** safety PR #8 (subscriptions `organisation_id` unique constraint — onboarding depends on it) + config PR #9 merged. ⚠️ There is **repo↔live migration LEDGER drift** (different version numbers between repo files and the live DB history); reconciling needs a deliberate `supabase migration repair`, **don't auto-run**. The suite is the retiring fallback.
- **`quotr`:** redesign (PR #3) + SEO (PR #4) merged + live. Email sender fixed (PR #2): send-from is `@c4studios.com.au` (Resend allows one verified domain; it's c4studios.com.au). The prod `RESEND_FROM_EMAIL` env var is the source of truth on Vercel.

## Open items / needs a human (not code-fixable from here)

- **Cloudflare-managed robots.txt** (Scrape Shield) may block AI crawlers (GPTBot/ClaudeBot/PerplexityBot) on the Vite hosts — a dashboard toggle, decide whether to allow AI-answer crawlers.
- **Stripe:** rotate live keys. A full **paid checkout E2E** needs Stripe TEST keys (or a small real charge + refund) — webhook→access path is otherwise wired.
- **ReviewLoop `aggregateRating` JSON-LD:** only add once there's *real* review data (do not fabricate ratings).
- **Vercel:** the 4 sites' old Vercel projects are orphaned (domains point to Cloudflare now) — safe to delete.

## Conventions

- **Pricing/copy:** single source per site in `src/data/product.js` (mirror of C4 `productData.js`). **Never hardcode prices.**
- The 4 Vite sites *were* byte-identical for `Nav.jsx` / `lib/seo.js` / `App.jsx` / `scripts/prerender.mjs`. After the SEO + landing-page work they have **diverged per-site** (each has its own landing routes + prerender route list). Apply any future shared change **per-site** now.
- All animation honours `prefers-reduced-motion` and is SSR/prerender-safe (animated client islands render a sensible static state server-side).
