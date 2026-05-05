# DS Racing Karts — Portfolio UPDATE Extraction Prompt

> **Purpose:** Paste this prompt into the DS Racing Karts repo's AI assistant to extract the details of **new work completed since the original portfolio entry was written**. The C4 Studios portfolio already has a case study for DSR covering the e-commerce platform, Square payment integration, Canvas 2D mini-game, and original admin dashboard. This prompt focuses on the **major updates** that followed — specifically the expanded secure admin panel and Square-to-site syncing. The output should produce diff-ready additions to the existing portfolio entry, not a full rewrite.
>
> **IMPORTANT:** The existing portfolio entry is the most technically ambitious project in the C4 portfolio and was already comprehensive. We are **appending** new achievements, not replacing what's there. If a feature was already listed, do not re-describe it — only flag if it was significantly changed or enhanced.
>
> **OUTPUT FORMAT:** Produce additions to each relevant section as JavaScript array items ready to be appended into the existing `caseStudyData.jsx` entry for `ds-racing-karts`.

---

## PROMPT

I need you to audit the **new features and changes** that have been made to this codebase since the initial launch. The DS Racing Karts site already has a detailed portfolio entry — I need to identify what's been **added or upgraded** since then. Specifically focus on:

1. The **expanded secure admin panel** — the owners can now log in and make live changes to different facets of the site (beyond just product CRUD)
2. **Square-to-site syncing** — any real-time or scheduled sync mechanism between Square POS/Catalog and the website
3. **Migration measures** — any database migration tooling, schema upgrades, or data pipeline improvements
4. Any other significant new features, pages, or architectural changes

---

### 1. ADMIN PANEL — COMPREHENSIVE AUDIT

The original entry mentioned a basic admin dashboard covering products, orders, customers, categories, and a product editor. I need to know what's been **added or upgraded** since then.

For each admin section/page that was added or significantly enhanced, extract:

| Field | What I need |
|---|---|
| **Route** | `/admin/...` path |
| **Purpose** | What does this section control? |
| **Capabilities** | What can the admin do here? (create/read/update/delete/publish/reorder) |
| **Live editing** | Does this affect the live site immediately, or require a deploy? |
| **Auth gate** | What roles can access this? (admin, super_admin, owner) |
| **Notable UI** | Rich text editor? Image upload? Drag-to-reorder? Toggle switches? Inline save? Preview mode? |

I expect to find new admin sections covering some or all of:
- **Homepage content management** — hero text, CTA copy, featured sections
- **Services management** — edit service names, descriptions, pricing, included items
- **About/Team management** — edit founder bio, team profiles, career highlights
- **Racing teams management** — edit team numbers, names, colours, bios in the teams carousel
- **Sponsors management** — add/remove/reorder sponsor logos in the carousel
- **Results/achievements management** — add race results to the timeline
- **Site settings** — business info, contact details, social links, shipping info
- **Newsletter/subscriber management** — view subscribers, export list
- **Announcement/banner management** — create sitewide banners or notices
- Anything else the admin can now control

For each section found:
1. State the route
2. Describe what the owner can change
3. Note if changes are instant (no-deploy) or require a build
4. Describe the UI (especially any rich text, drag-to-reorder, image upload)
5. Note any role-based access differences

### 2. SQUARE SYNC — FULL TECHNICAL AUDIT

The original portfolio entry described a one-time 4-stage data migration pipeline (CSV → Supabase). I need to know what **ongoing sync mechanism** now exists.

Extract and describe:

**A. Product/Inventory Sync**
- Is there now a real-time or scheduled sync from Square Catalog to Supabase?
- How is it triggered? (webhook, cron job, manual button in admin, scheduled Edge Function)
- What data is synced? (prices, stock levels, new products, images, descriptions)
- What happens when a product is updated in Square POS — does it propagate to the website automatically?
- Is there a "sync status" or "last synced" indicator in the admin?
- How are conflicts handled? (Square data wins? Manual overrides preserved?)

**B. Order Sync**
- Are completed orders written back to Square? (order management in Square dashboard)
- Is there Square order fulfilment tracking?

**C. Inventory Webhooks**
- Are Square inventory webhooks now active? (`inventory.count.updated`, `catalog.version.updated`)
- How are webhook events processed?
- Is there a webhook event log in the admin?

**D. Sync UI**
- Is there a "Sync from Square" button in the admin?
- Are there sync logs or a recent sync history view?
- Can specific categories or products be excluded from sync?

### 3. MIGRATION MEASURES — FULL AUDIT

Extract any database migration tooling, schema versioning, or data pipeline changes that were built:

- Are there migration scripts in the codebase? (SQL files, migration runner, numbered migrations)
- Is there a schema version tracking mechanism?
- Were any breaking schema changes made post-launch that required a migration? What were they?
- Were any new Supabase tables, columns, indexes, or RLS policies added?
- Were any data transformation scripts built to update existing records?
- Is there a safe migration process documented (backup → migrate → verify)?

### 4. NEW PAGES & ROUTES

List any **new pages or routes** added since the original launch that weren't in the original entry:
- Route path
- Purpose
- Key sections/features

### 5. OTHER SIGNIFICANT UPDATES

List any other notable changes, improvements, or new features since launch:
- Performance improvements
- New integrations
- UI/UX overhauls to existing pages
- Security hardening additions
- New API endpoints
- Dependency upgrades with significant impact (e.g. Next.js upgrade, new major library)

### 6. UPDATED TIMELINE & SCOPE

Now that the project has grown significantly:
- What is the total time invested in this project from first commit to the current state?
- Does the budget range need updating? (It's listed as `$10k+` — does it still feel accurate given the expanded scope?)
- Should the role description be updated? (Currently: "Solo — design, development, deployment, backend migration, analytics setup, copywriting, SEO, error tracking")
- Is the current `oneLiner` still accurate? (Currently: "Full e-commerce platform with 499+ go kart parts, Square payment integration, and a custom-built Canvas 2D racing mini-game.")
- Should the `overview` paragraph be updated to mention the admin panel and Square sync?

---

## OUTPUT FORMAT

Produce **diff-ready additions** for the `ds-racing-karts` entry in `caseStudyData.jsx`. For each section, output only the **new items to append** — not the full existing arrays.

Format each section like this:

```js
// ── NEW DELIVERED items to append ──
'Expanded secure admin panel — owners can log in and make live changes to [X, Y, Z] without developer involvement',
'Square-to-site sync — [describe the mechanism]',
'[etc]'

// ── NEW FEATURES items to append ──
'[Feature description with technical detail]',
'[etc]'

// ── NEW CHALLENGES items to append ──
'[Challenge description]',
'[etc]'

// ── UPDATED overview (full replacement if changed) ──
'[New overview paragraph]'

// ── UPDATED oneLiner (replacement if changed) ──
'[New one-liner]'

// ── NEW/UPDATED SCREENSHOTS ──
{ url: '/captures/dsracingkarts-com-au/desktop/31-admin-[section].png', caption: '...' }
```

Also produce a list of **new screenshots to capture** for any new admin pages or features, using the existing naming convention (`/captures/dsracingkarts-com-au/desktop/31-...`, `32-...`, etc. — starting at 31 since 30 is the existing max).
