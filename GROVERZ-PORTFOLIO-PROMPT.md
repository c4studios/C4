# Groverz Tax — Portfolio Data Extraction Prompt

> **Purpose:** Paste this prompt into the Groverz Tax repo's AI assistant to extract every detail needed for a C4 Studios portfolio case study entry. The output must follow the exact schema below — no fields skipped, no guessing.

---

## PROMPT

I need you to perform a comprehensive audit of this entire codebase and produce a structured portfolio case study dataset for the C4 Studios portfolio. This site was designed and built by C4 Studios for the client. Be **exhaustive** — I need every detail you can extract.

### 1. PROJECT METADATA

Extract or confirm the following:

| Field | What I need |
|---|---|
| **Project name** | Full official name (e.g. "Groverz Tax & Accounting Solutions") |
| **Client name** | The person or entity who owns the project |
| **Location** | Client's physical location (city, state, country) |
| **Live URL** | The production URL |
| **Year** | Year the site was built/launched |
| **Timeline** | How long the project took from kickoff to launch (check git history — first commit to production deploy) |
| **Budget range** | Estimate based on scope. Use ranges: "$500 – $1k", "$1k – $2.5k", "$2.5k – $5k", "$5k – $10k", "$10k+" |
| **Role** | C4's role (e.g. "Solo (design, development, deployment)", "Design & development", etc.) |
| **Category** | One of: `web_design`, `web_app`, `brand_platform`, `automation`, `rebuild`, `lens` |
| **Tags** | 3–5 service tags (e.g. `['Website', 'Tax & Accounting', 'Small Business', 'Local Service']`) |
| **Featured** | Should this be a featured project? (true/false) — consider scope, polish, and visual impact |
| **Brand colour** | Primary brand hex colour from the design system / tailwind config / CSS variables |

### 2. COPY & CONTENT

| Field | What I need |
|---|---|
| **One-liner** | A single compelling sentence summarising the project for a portfolio card (max ~120 chars). Write it from C4's perspective as the builder. |
| **Overview** | A 3–5 sentence paragraph describing what was built, why, and the outcome. Cover: the client's problem, C4's approach, what was delivered, and the result. Written for a portfolio audience (prospective clients of C4). |

### 3. PAGES & STRUCTURE

List every page/route in the application:
- Route path
- Page title / purpose
- Key sections on that page (hero, services grid, testimonials carousel, contact form, etc.)
- Notable UI patterns (accordions, carousels, tabs, modals, calculators, sticky elements, etc.)

### 4. DELIVERABLES

List **everything** that was delivered as part of this project. Be specific. Examples:
- Logo design / brand identity
- Complete website (design + development + deployment)
- Individual pages (list each with brief description)
- Contact/enquiry form with backend processing
- Tax refund estimator calculator
- Responsive design (mobile + desktop)
- SEO setup
- Domain configuration
- Content writing / copywriting
- Social media assets
- Google Maps integration
- WhatsApp integration
- Email integration

### 5. FEATURES

List every notable feature implemented. Be technical but readable. Examples:
- "Interactive tax refund estimator using 2024-25 ATO resident tax rates"
- "Seven-service accordion system with category filtering (Personal, Business, Trusts & Companies, Finance)"
- "Testimonial carousel with avatar initials, star ratings, and client attribution"
- "Four-step visual process timeline (Reach out → Send docs → We do the work → Stay in touch)"
- "Sticky header with blur backdrop and mobile hamburger navigation"
- "Document checklist section with icon grid layout"
- "Stats bar (5000+ returns, $99 individual, 5★ reviews, 100% ATO compliant)"
- "ATO penalty warning banner with animated entrance"
- "Acknowledgement of Country in footer"
- "C4 Studios credit badge in footer"

### 6. TECH STACK

List every technology, framework, library, and tool used. Check `package.json`, import statements, config files, and deployment config. Format as an array of strings. Be specific with versions where available. Examples:
- "React 18 (Vite SPA)" or "Next.js 14 (App Router)"
- "TypeScript" or "JavaScript (JSX)"
- "Tailwind CSS 4.x" or "Tailwind CSS 3.x + shadcn/ui"
- Routing library and version
- Animation library (Framer Motion, GSAP, etc.)
- Icon library
- Form handling approach
- Any UI component library
- Hosting platform
- DNS/domain provider (if visible in config)
- Build tool + bundler

### 7. INTEGRATIONS

List all third-party services, APIs, and external integrations:
- Email service (Resend, SendGrid, etc.)
- Form backend (serverless functions, API routes, etc.)
- Analytics (Google Analytics, Plausible, etc.)
- Maps (Google Maps, Mapbox, etc.)
- Chat/messaging (WhatsApp, Intercom, etc.)
- CDN / image hosting
- Any external APIs called

### 8. PERFORMANCE & ACCESSIBILITY

Audit and report on:
- Lighthouse-relevant patterns (lazy loading, image optimization, font loading strategy)
- SEO patterns (meta tags, Open Graph, structured data, sitemap, robots.txt)
- Accessibility patterns (semantic HTML, ARIA labels, colour contrast, keyboard navigation, focus management)
- Core Web Vitals considerations (CLS prevention, LCP optimization, FID/INP considerations)
- Any `_headers`, `_redirects`, or security headers in public/

### 9. CHALLENGES

Identify 3–5 genuine technical or design challenges faced during the project. Look for:
- Complex UI components that required creative solutions
- Responsive design challenges
- Performance considerations
- Content strategy decisions
- Integration difficulties
- Accessibility requirements
- Client-specific constraints

### 10. POTENTIAL IMPROVEMENTS

Identify 3–5 honest, constructive future improvements. Look for:
- Features that could be added
- Performance optimizations available
- Accessibility improvements possible
- SEO enhancements
- Content or UX refinements

### 11. SCREENSHOTS GUIDE

For each page, describe the **ideal screenshot regions** that would best showcase the work in a portfolio:
- What section to capture
- Why it's portfolio-worthy (visual impact, feature demonstration, design quality)
- Desktop vs mobile priority
- Suggested caption for each

Prioritise: Hero sections, service grids, interactive tools (calculator), testimonials, contact forms, and any unique UI patterns.

### 12. DESIGN SYSTEM DETAILS

Extract from the codebase:
- Primary, secondary, and accent colours (hex values)
- Font families used (headings, body, accents)
- Border radius patterns
- Spacing system
- Any CSS custom properties or Tailwind theme extensions
- Dark mode support (yes/no)
- Animation/transition patterns used throughout

---

## OUTPUT FORMAT

Return the data as a **JavaScript object** that matches this exact structure, ready to paste into `caseStudyData.jsx`:

```javascript
'groverz-tax': {
  slug: 'groverz-tax',
  name: '...',
  oneLiner: '...',
  client: '...',
  location: '...',
  timeline: '...',
  budget: '...',
  role: '...',
  liveUrl: 'https://groverztax.com.au',
  year: '2026',
  category: '...',
  tags: [...],
  featured: true/false,
  budgetOrder: N,

  cover: '/covers/groverz-tax.png',
  brandColor: '#HEXVAL',
  thumbnail: '/captures/groverztax-com-au/desktop/01-hero.png',

  overview: '...',

  screenshots: [
    { url: '/captures/groverztax-com-au/desktop/01-hero.png', caption: '...' },
    // ... all captures
  ],

  desktopScreenshots: [
    { url: '/captures/groverztax-com-au/desktop/01-hero.png', caption: '...' },
    // ...
  ],

  mobileScreenshots: [
    { url: '/captures/groverztax-com-au/mobile/01-hero.png', caption: '...' },
    // ...
  ],

  delivered: [
    '...',
  ],

  features: [
    '...',
  ],

  stack: [
    '...',
  ],

  integrations: [
    '...',
  ],

  performance: [
    '...',
  ],

  challenges: [
    '...',
  ],

  improvements: [
    '...',
  ],
}
```

Also return **separately** (not inside the JS object):
- The full design system summary (Section 12)
- The screenshot guide (Section 11) — I need this to verify captured screenshots match the best regions
- The complete page/route map (Section 3)

Be thorough. Do not abbreviate or skip any section. Read every file in the project if needed.
