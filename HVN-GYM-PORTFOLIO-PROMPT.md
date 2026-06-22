# HVN Gym — C4 Badge Setup + Portfolio Data Extraction Prompt

> **How to use this:** Paste everything below the line into the **HVN Gym repo's AI assistant**. It does two jobs in one pass:
> 1. **PART 0** — installs / verifies the official animated "Designed by C4 Studios" credit badge in the bottom navigation / footer, front and centre.
> 2. **PART 1** — performs a full codebase audit and returns a structured dataset so C4 Studios can publish a thorough portfolio case study.
>
> **Before pasting:** copy the C4 Studios `c4-footer-credit/` folder (from the C4 internal repo: `c4-footer-credit/C4FooterCredit.jsx`, `c4WordmarkData.js`, `README.md`) into the HVN Gym repo, or attach those files to the conversation, so the assistant can wire in the real component rather than re-creating it.
>
> **IMPORTANT — OUTPUT LENGTH:** This will produce a long response. If your output is cut off mid-sentence, I will say "continue from where you left off" and you should resume from the exact cut-off point — do NOT restart or summarise.

---

## PROMPT

You are working inside the **HVN Gym** website repository. This site was designed and built by **C4 Studios**. You have two tasks: (A) install the official C4 credit badge correctly, and (B) produce an exhaustive portfolio dataset. Do both. Be thorough and do not guess — read the actual code.

---

## PART 0 — INSTALL THE "DESIGNED BY C4" BADGE (do this first)

Every C4 Studios client site carries an animated **"Designed by C4 Studios"** credit that links back to `https://c4studios.com.au`. There is an official, portable component for this — **do not hand-roll a new one**. Your job is to drop it in (or verify an existing one) and place it in the **bottom navigation / footer, horizontally centred and clearly visible — front and centre, not buried in fine print.**

### 0.0 — PREREQUISITE: the component files must be in this repo (read first)

The official component is a **portable 3-file folder** that is **not** part of this repo by default — it lives in the C4 Studios internal repo. Before you can wire it in, these three files must exist here (suggested location `src/components/c4-footer-credit/`):

```
c4-footer-credit/
  C4FooterCredit.jsx      ← the component
  c4WordmarkData.js       ← SVG path data for the "Studios" wordmark morph
  README.md               ← usage reference
```

**If these files are not present, STOP and ask me for them — do not invent your own version.** I (the C4 operator) will paste the `c4-footer-credit/` folder into this repo, or attach the three files to this conversation. Only once they are present should you continue to 0.1. (If I have explicitly told you to reproduce the badge from scratch instead, use the static fallback in **0.3**, not a hand-rolled animation.)

### 0.1 — Detect what already exists

Search the repo for any existing C4 credit: grep for `c4studios`, `C4FooterCredit`, `c4-footer-credit`, `Designed by C4`, `c4Wordmark`. Report what you find. If a credit already exists, your task is to make sure it is (a) the official animated component, (b) placed bottom-centre, and (c) linking to `https://c4studios.com.au` in a new tab — fix anything that falls short.

### 0.2 — The official component (React/JSX projects)

The canonical component is **`C4FooterCredit`** (folder `c4-footer-credit/`). It is self-contained:

- **Files:** `C4FooterCredit.jsx` (component) + `c4WordmarkData.js` (SVG path data) + `README.md`.
- **Dependencies:** only `gsap` and `@gsap/react` (`npm install gsap @gsap/react`). No Tailwind, router, theme provider, or icon library required. Peer: React ≥ 18.
- **Behaviour:** a 3-stage progressive hover animation (dormant grey C4 mark → mono "Studios" wordmark fades in → colour iris-bloom + spring letter morph). Reduced-motion users get the static dormant mark; the link always works. Renders as a real `<a>` (keyboard + screen-reader accessible).

**Props:**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `href` | string | `'https://c4studios.com.au'` | Link destination — keep the default. |
| `label` | string | `'Designed by C4 Studios'` | Credit text + `aria-label`. |
| `size` | number \| `'small'\|'default'\|'large'\|'xl'` | `36` | Logo height (28 / 36 / 48 / 72). |
| `showText` | boolean | `true` | Show the "Designed by C4 Studios" text under the mark. |
| `openInNewTab` | boolean | `true` | Opens with `rel="noopener noreferrer"`. |
| `colorScheme` | `'dark'\|'light'\|'auto'` | `'auto'` | `auto` samples the background so text stays legible on dark/light footers. |
| `className` | string | `''` | Extra classes on the root `<a>`. |

**Install steps:**
1. Copy `c4-footer-credit/` into the project (e.g. `src/components/c4-footer-credit/`).
2. `npm install gsap @gsap/react` if not already present.
3. Import and render it centred at the bottom of the layout:

```jsx
import C4FooterCredit from './components/c4-footer-credit/C4FooterCredit';

// In the footer / bottom nav, as its own centred row:
<div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
  <C4FooterCredit size={40} colorScheme="auto" />
</div>
```

Place it as the **last, centred element** of the site-wide footer / bottom navigation so it appears on every page. If HVN Gym has a sticky bottom nav/tab bar, put the badge in the footer band directly above or below it — centred — rather than crammed into the tab bar icons.

### 0.3 — Non-React projects (static HTML / other framework) — fallback

If the site is **not** React (plain HTML, Astro, Vue, etc.) and the JSX component cannot be dropped in, reproduce the badge as a centred anchor that links to C4 and shows the wordmark. It must:
- Be an `<a href="https://c4studios.com.au" target="_blank" rel="noopener noreferrer" aria-label="Designed by C4 Studios">`.
- Show the C4 mark (use the SVG paths from `c4WordmarkData.js` / the C4 logo asset) **and** the text "Designed by C4 Studios".
- Sit centred in the footer / bottom nav on every page.
- Respect `prefers-reduced-motion` (no animation when reduced motion is requested).

Ask me for the C4 logo SVG/asset if it is not already in the repo.

### 0.4 — Acceptance criteria (confirm each in your output)
- [ ] Badge appears on **every** page, in the footer / bottom navigation.
- [ ] It is **horizontally centred** and visually prominent ("front and centre").
- [ ] Links to `https://c4studios.com.au`, opens in a new tab, `rel="noopener noreferrer"`.
- [ ] Accessible: real `<a>`, `aria-label="Designed by C4 Studios"`, keyboard focusable.
- [ ] Reduced-motion safe.
- [ ] Build passes and no console errors.

Report exactly what you changed (files + diffs) and confirm the checklist.

---

## PART 1 — PORTFOLIO CASE STUDY DATA

Now perform a **comprehensive audit of the entire codebase** and return a structured portfolio case study dataset. Be **exhaustive** — extract every real detail. Do not invent features that don't exist; if something is unknown, say so.

### 1. PROJECT METADATA

| Field | What I need |
|---|---|
| **Project name** | "HVN Gym" (confirm exact branding/capitalisation used in the site) |
| **Client name** | Confirm the business / owner name |
| **Location** | City / suburb, state, country |
| **Live URL** | The production domain |
| **Year** | Build/launch year (check git history first commit → production deploy, or copyright) |
| **Timeline** | Kickoff → launch duration (from git history) |
| **Budget range** | Estimate from scope. Ranges: `"$500 – $1k"`, `"$1k – $2.5k"`, `"$2.5k – $5k"`, `"$5k – $10k"`, `"$10k+"` |
| **Role** | C4's role, e.g. "Solo (design, development, deployment)" — adjust to what was actually done (photography? branding? booking integration?) |
| **Category** | `web_design` unless it's clearly a web app (`web_app`) or e-commerce (`ecommerce`) |
| **Tags** | 4–6 service tags, e.g. `['Website', 'Fitness', 'Gym', 'Local Business', ...]` |
| **Brand colour** | Primary brand hex from the design system / CSS variables / Tailwind config |

### 2. COPY & CONTENT
- **One-liner** — one compelling sentence (~120 chars) summarising the project for a portfolio card, written from C4's perspective as the builder.
- **Overview** — a 4–6 sentence paragraph: the client's situation, what C4 built and why, what was delivered, and the outcome.

### 3. PAGES & STRUCTURE
List **every** route/page. For each: route path, purpose, key sections (hero, classes, timetable, memberships, trainers, contact, etc.), and notable UI patterns (carousels, sticky nav, booking widgets, scroll animations, lightboxes, etc.).

### 4. DELIVERABLES
Everything delivered as part of the project — be specific (design, development, deployment, logo/branding, photography, copywriting, booking integration, SEO, forms, responsive design, etc.).

### 5. FEATURES
Every notable feature, technical but readable (hero, class/timetable system, membership/pricing, trainer profiles, booking/enquiry flow, social links, animations, mobile menu, SEO, accessibility, etc.). Be exhaustive.

### 6. TECH STACK
Every technology, framework, library, tool. Check `package.json`, imports, config, and deploy config. Note: is it static HTML or a framework SPA? Build tool? CSS approach? Animation lib? Hosting? CMS? Form backend? Format as an array of strings with versions where available.

### 7. INTEGRATIONS
All third-party services: email/form backend, analytics, maps, social, CDN/image hosting, video, booking/scheduling (Mindbody, PT Mate, Glofox, etc.), payments.

### 8. PERFORMANCE & ACCESSIBILITY
Image optimisation (WebP, lazy loading, responsive), video handling, accessibility (skip links, ARIA, focus styles, alt text, reduced motion), security headers, load-speed decisions.

### 9. CHALLENGES
The most interesting/difficult technical or creative challenges encountered.

### 10. IMPROVEMENTS (future roadmap)
What was scoped for the future or would make natural next phases (CMS, online booking, analytics, member portal, etc.).

### 11. SCREENSHOTS — CAPTURE LIST
A complete list of screenshots to take to document the project. Format each as:
```
{ url: '/captures/hvngym-com/desktop/01-hero.png', caption: '...' }
```
Include desktop (section by section) and mobile (6+ key views) and any interactive states (booking flow, timetable, menu open). Use the naming pattern `/captures/<live-domain-with-dashes>/desktop/NN-name.png` — confirm the exact domain slug from the live URL.

### 12. COVER & THUMBNAIL
Identify (a) the **cover** — the logo mark for the portfolio card (transparent PNG, dark version preferred) → `/covers/hvn-gym.png`; and (b) the **thumbnail** — the best hero screenshot for the card. Give the exact file path/URL for each.

---

## OUTPUT FORMAT

Produce the PART 1 data as a copy-paste-ready JavaScript object matching this schema for `caseStudyData.jsx`:

```js
'hvn-gym': {
  slug: 'hvn-gym',
  name: 'HVN Gym',
  oneLiner: '...',
  client: '...',
  location: '...',
  timeline: '...',
  budget: '...',
  role: '...',
  liveUrl: '...',
  year: '...',
  category: 'web_design',
  tags: [...],
  featured: true,
  budgetOrder: ...,        // 1–10 by budget tier

  cover: '/covers/hvn-gym.png',
  brandColor: '#......',
  thumbnail: '/captures/hvngym-com/desktop/01-hero.png',

  overview: '...',

  screenshots: [...],        // full desktop set, distinct shots only — no duplicates
  desktopScreenshots: [...],  // curated subset of the strongest 8–10
  mobileScreenshots: [...],   // 6–8 distinct mobile views

  delivered: [...],
  features: [...],
  stack: [...],
  integrations: [...],
  performance: [...],
  challenges: [...],
  improvements: [...],
},
```

**Rules for the screenshot arrays:** every entry must point to a real, distinct screen — no two captions describing the same image, no placeholder/black frames. If a section can't be captured cleanly, omit it rather than repeating another shot.

Then, separately, confirm the **PART 0** badge checklist and list the files you changed.
