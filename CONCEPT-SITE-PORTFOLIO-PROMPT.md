# Concept Site — C4 Badge Setup + Portfolio Data Extraction Prompt (reusable)

> **What this is:** A single, reusable prompt to run inside **each** of your concept-site repos (the showcase builds not yet purchased by a client). Paste everything below the line into that repo's AI assistant. It does two jobs:
> 1. **PART 0** — installs / verifies the animated "Designed by C4 Studios" badge in the bottom navigation / footer, front and centre.
> 2. **PART 1** — audits the codebase and returns a **Concept** portfolio entry for `caseStudyData.jsx` (with `concept: true`).
>
> **Run it once per concept site** — the assistant reads each repo and fills in that site's specifics. You don't need to edit this prompt between sites, but if you want, fill the two optional hints in §1.1.
>
> **Before pasting:** copy the C4 Studios `c4-footer-credit/` folder (`C4FooterCredit.jsx`, `c4WordmarkData.js`, `README.md`) into the concept repo, or attach those three files to the conversation. The component is portable and is NOT in the concept repo by default — see §0.0.
>
> **IMPORTANT — OUTPUT LENGTH:** This produces a long response. If it cuts off mid-sentence, say "continue from where you left off" and resume from the exact cut-off point — do not restart.

---

## PROMPT

You are working inside a **C4 Studios concept website** — a showcase build that demonstrates C4's design and engineering, not (yet) a paid client project. Two tasks: (A) install the official C4 credit badge correctly, and (B) produce an exhaustive **concept** portfolio dataset. Read the actual code; do not guess.

---

## PART 0 — INSTALL THE "DESIGNED BY C4" BADGE (do this first)

Every C4 Studios site — including concepts — carries an animated **"Designed by C4 Studios"** credit linking to `https://c4studios.com.au`, placed in the **bottom navigation / footer, horizontally centred and clearly visible — front and centre, not buried in fine print.** Do **not** hand-roll a new one.

### 0.0 — PREREQUISITE: the component files must be in this repo (read first)

The official badge is a **portable 3-file folder** that is **not** part of this repo by default — it lives in the C4 Studios internal repo. Before wiring it in, these must exist here (suggested location `src/components/c4-footer-credit/`):

```
c4-footer-credit/
  C4FooterCredit.jsx      ← the component
  c4WordmarkData.js       ← SVG path data for the "Studios" wordmark morph
  README.md               ← usage reference
```

**If these files are not present, STOP and ask me for them — do not invent your own version.** I (the C4 operator) will paste the `c4-footer-credit/` folder into this repo or attach the three files. Only continue to 0.1 once they're present. (If I explicitly tell you to reproduce the badge from scratch instead, use the static fallback in §0.3 — never a hand-rolled animation.)

### 0.1 — Detect what already exists

Grep for `c4studios`, `C4FooterCredit`, `c4-footer-credit`, `Designed by C4`, `c4Wordmark`. Report findings. If a credit already exists, make sure it is (a) the official animated component, (b) placed bottom-centre, and (c) linking to `https://c4studios.com.au` in a new tab. Fix anything short of that.

### 0.2 — The official component (React / JSX projects)

`C4FooterCredit` is self-contained: depends only on `gsap` and `@gsap/react` (`npm install gsap @gsap/react`); no Tailwind/router/theme/icon library; React ≥ 18. It renders a real `<a>` (keyboard + screen-reader accessible) with a 3-stage hover animation, and respects `prefers-reduced-motion`.

**Props:** `href` (default `'https://c4studios.com.au'` — keep it), `label` (default `'Designed by C4 Studios'`), `size` (number or `'small'|'default'|'large'|'xl'`, default `36`), `showText` (default `true`), `openInNewTab` (default `true`), `colorScheme` (`'dark'|'light'|'auto'`, default `'auto'` — samples the background so text stays legible), `className`.

**Install:**
1. Copy `c4-footer-credit/` into the project (e.g. `src/components/c4-footer-credit/`).
2. `npm install gsap @gsap/react` if needed.
3. Render it centred at the bottom of the site-wide layout so it appears on every page:

```jsx
import C4FooterCredit from './components/c4-footer-credit/C4FooterCredit';

<div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
  <C4FooterCredit size={40} colorScheme="auto" />
</div>
```

If the site has a sticky bottom tab bar, put the badge in the footer band directly above/below it — centred — not crammed into the tab icons.

### 0.3 — Non-React projects (static HTML / other framework) — fallback

If the JSX component can't be dropped in, reproduce the badge as a centred `<a href="https://c4studios.com.au" target="_blank" rel="noopener noreferrer" aria-label="Designed by C4 Studios">` that shows the C4 mark (use the SVG paths from `c4WordmarkData.js` / the C4 logo asset) **and** the text "Designed by C4 Studios", sits centred in the footer/bottom nav on every page, and respects `prefers-reduced-motion`. Ask me for the C4 logo asset if it isn't in the repo.

### 0.4 — Acceptance criteria (confirm each in your output)
- [ ] Badge on **every** page, in the footer / bottom navigation.
- [ ] **Horizontally centred** and prominent ("front and centre").
- [ ] Links to `https://c4studios.com.au`, new tab, `rel="noopener noreferrer"`.
- [ ] Accessible (real `<a>`, `aria-label`, keyboard focusable) and reduced-motion safe.
- [ ] Build passes, no console errors.

Report exactly what you changed (files + diffs) and confirm the checklist.

---

## PART 1 — CONCEPT PORTFOLIO ENTRY

Audit the **entire codebase** and return a structured **concept** case-study dataset. This is a showcase/spec build, so frame everything as a concept that demonstrates capability — not a delivered client engagement.

### 1.1 — Optional hints from the operator (leave blank to have the assistant infer)
- Concept name: `[CONCEPT NAME — or infer from the site branding]`
- Live demo URL: `[URL — or infer from deploy config]`

### 1.2 — Metadata

| Field | What I need |
|---|---|
| **Project name** | The concept's brand/site name (infer from the UI if not given) |
| **Concept flag** | `concept: true` — REQUIRED. |
| **"Client"** | There is no paying client. Set this to the **target business type** the concept is designed for, e.g. `"Concept — boutique fitness studio"`, `"Concept — specialty coffee roaster"`. Make clear it's a concept. |
| **Location** | If the concept targets a real locale, name it; otherwise leave `''`. |
| **Live URL** | The deployed demo URL. |
| **Year** | Build year (git history / copyright). |
| **Timeline** | Build duration if meaningful, else `''`. |
| **Budget** | Leave `''` (it's not sold). Do **not** invent a price. |
| **Role** | e.g. `"Solo (concept, design, development, deployment)"`. |
| **Category** | `web_design` unless it's clearly a web app (`web_app`) or e-commerce (`ecommerce`). |
| **Tags** | 4–6 tags; include a descriptor of the vertical (e.g. `['Website', 'Concept', 'Hospitality', ...]`). |
| **Featured** | `false` unless you have reason to spotlight it above client work. |
| **budgetOrder** | `0`. |
| **Brand colour** | Primary brand hex from the design system / CSS variables / Tailwind config. |

### 1.3 — Copy & content
- **One-liner** (~120 chars): frame as a concept, e.g. *"A concept storefront for a specialty coffee brand — built to show what C4 ships before a brief exists."*
- **Overview** (4–6 sentences): what the concept demonstrates, who it's aimed at, what was built, and the standout craft. Make clear it's a self-initiated concept available to license/commission.

### 1.4 — The build (be exhaustive, technical-but-readable)
For each, return an array of strings:
- **delivered** — everything built (design, pages, components, forms, animations, responsive, SEO, etc.).
- **features** — every notable feature.
- **stack** — frameworks, libraries, tools, hosting (check `package.json`, imports, config); versions where available.
- **integrations** — third-party services (email/form backend, analytics, maps, CDN, etc.).
- **performance** — image optimisation, lazy loading, accessibility (skip links, ARIA, focus, reduced motion), security headers.
- **challenges** — interesting technical/creative problems solved.
- **improvements** — natural next phases.

### 1.5 — Screenshots — capture list
List distinct screenshots to take. Format each as:
```
{ url: '/captures/<live-domain-with-dashes>/desktop/01-hero.png', caption: '...' }
```
Include desktop (section by section) + 6–8 mobile views + any interactive states. **Every entry must be a distinct screen — no two captions describing the same image, no placeholder/black frames.** Confirm the exact domain slug from the live URL.

### 1.6 — Cover & thumbnail
- **cover** → `/covers/<slug>.png` — the logo mark (transparent PNG, dark version preferred).
- **thumbnail** → the best hero screenshot path.
- If a brandColor is provided, the portfolio card draws the logo on that colour, so a transparent-background logo is ideal.

---

## OUTPUT FORMAT

Produce the PART 1 data as a copy-paste-ready object for `caseStudyData.jsx` — note the `concept: true` flag:

```js
'<slug>': {
  slug: '<slug>',
  name: '...',
  oneLiner: '...',
  client: 'Concept — ...',
  location: '...',
  timeline: '',
  budget: '',
  role: 'Solo (concept, design, development, deployment)',
  liveUrl: '...',
  year: '...',
  category: 'web_design',
  tags: ['Website', 'Concept', ...],
  featured: false,
  concept: true,            // ← marks it as a Concept in the portfolio (badge + filter)
  budgetOrder: 0,

  cover: '/covers/<slug>.png',
  brandColor: '#......',
  thumbnail: '/captures/<domain-with-dashes>/desktop/01-hero.png',

  overview: '...',

  screenshots: [...],         // distinct desktop shots only
  desktopScreenshots: [...],  // strongest 8–10
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

Then confirm the **PART 0** badge checklist and list the files you changed.

---

> **Note for the C4 operator:** Once an entry with `concept: true` is added to `caseStudyData.jsx`, a **Concept** badge appears on its portfolio card and a **"Concepts"** filter chip appears in the portfolio filter bar automatically — no other code changes needed.
