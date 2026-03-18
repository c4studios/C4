# Architecture

## Overview

C4 Studios is a React single-page application (SPA) with serverless backend functions. The frontend is built with Vite and deployed as static files. The backend runs as Cloudflare Pages Functions — file-based serverless endpoints that handle form submissions and file uploads.

```
┌──────────────────────────────────────────────────────┐
│                  Cloudflare Pages                     │
│                                                      │
│  ┌─────────────────┐    ┌─────────────────────────┐  │
│  │  Static SPA     │    │  Pages Functions         │  │
│  │  (dist/)        │    │  (functions/)            │  │
│  │                 │    │                          │  │
│  │  React app      │───▶│  /api/inquiries          │  │
│  │  served as      │    │  /api/ventures           │  │
│  │  index.html     │    │  /api/upload ──▶ R2      │  │
│  └─────────────────┘    └──────────┬──────────────┘  │
│                                    │                  │
└────────────────────────────────────┼──────────────────┘
                                     │
                               ┌─────▼─────┐
                               │  Resend   │
                               │  (email)  │
                               └───────────┘
```

Resend is an external service — the Functions call its API over HTTPS to deliver emails.

---

## Frontend architecture

### Entry point
`index.html` → `src/main.jsx` → `src/App.jsx`

App.jsx creates a `BrowserRouter`, reads route definitions from `pages.config.js`, and renders each page inside `Layout.jsx`.

### Routing

Routes are defined in `src/pages.config.js`, which maps page names to lazy-imported components. All pages are wrapped in `Layout.jsx` (NavHeader + animated page transition + Footer). Unmatched routes render `PageNotFound`.

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home.jsx` | Landing page with portfolio preview, services, testimonials |
| `/About` | `About.jsx` | Studio story, team, values |
| `/Services` | `Services.jsx` | Service offerings with interactive checklist |
| `/Portfolio` | `Portfolio.jsx` | Filterable project gallery |
| `/CaseStudy?slug=<slug>` | `CaseStudy.jsx` | Individual project deep-dive (reads `slug` from query string via `window.location.search`) |
| `/Contact` | `Contact.jsx` | Contact inquiry form |
| `/StartProject` | `StartProject.jsx` | Detailed project inquiry form |
| `/Ventures` | `Ventures.jsx` | Venture program info + idea submission form |
| `/Rebuild` | `Rebuild.jsx` | Rebuild service page (informational, no form) |
| `/Terms` | `Terms.jsx` | Terms and conditions |

**Navigation:** The main nav (NavHeader) links to Home, Services, Portfolio, About, and Ventures. Other pages are reached via CTAs (Start a Project button), footer links (Contact, Terms, Rebuild), or internal links (CaseStudy from Portfolio cards).

### Component organisation

```
src/components/
├── c4/           # Site-wide shared components
│   ├── NavHeader.jsx       # Fixed header with hide-on-scroll
│   ├── Footer.jsx          # Site footer with nav links
│   ├── PageHero.jsx        # Reusable hero section
│   ├── PageTransition.jsx  # Route transition animation
│   ├── ThemeContext.jsx     # Theme state (light/dark/vivid)
│   ├── ThemeToggle.jsx     # Theme switcher button
│   ├── FileUpload.jsx      # Drag-and-drop file upload
│   ├── C4Logo.jsx          # Logo (renders public/logo.png)
│   ├── IntroSequence.jsx   # One-time branded loading animation
│   ├── AnimatedHeading.jsx # Character-by-character heading reveal
│   └── SectionLabel.jsx    # Uppercase label with tracking
├── home/         # Home page sections
├── about/        # About page sections
├── portfolio/    # Portfolio + case study components + data
├── services/     # Services page components (explorer, checklist, process)
├── testimonials/ # Testimonial slider, card, and data
├── ventures/     # Venture form + scoring UI
└── ui/           # shadcn/ui primitives (auto-generated, see note below)
```

### Styling

Three layers:
1. **Tailwind CSS** — utility classes for layout, spacing, typography
2. **CSS custom properties** (`--c4-*` tokens in `src/globals.css`) — design system colours, borders, card backgrounds
3. **shadcn/ui** — component primitives built on Tailwind + Radix UI

The theme system supports light, dark, and vivid variants. Theme state is managed by `ThemeContext.jsx`, which sets a `data-theme` attribute on the `:root` element and updates CSS custom properties accordingly.

### State management

- **React Query** (`@tanstack/react-query`) — configured in `src/lib/query-client.js`. Available for data fetching but currently only used for form submission infrastructure. Can be leveraged for future API integrations.
- **Local component state** (`useState`, `useRef`) — used for form data, UI toggles, submission status, theme, and scroll position.

---

## Backend architecture

### Cloudflare Pages Functions

The `functions/` directory uses [file-based routing](https://developers.cloudflare.com/pages/functions/routing/). Each file exports `onRequestPost` and `onRequestOptions` handlers.

```
functions/api/
├── inquiries.js   # Contact + StartProject form handler
├── ventures.js    # Venture idea form handler
└── upload.js      # File upload handler (multipart → R2)
```

### Request flow

```
Browser form submit
    │
    ▼
POST /api/inquiries (JSON)
    │
    ├── Content-Type check (415 if not JSON)
    ├── API key guard (500 if RESEND_API_KEY missing)
    ├── Honeypot check (silent accept if bot detected)
    ├── Timestamp check (silent accept if < 2s)
    ├── Field validation (400 with error list)
    ├── Input sanitisation (trim + truncate)
    ├── HTML email construction (all values escaped)
    ├── Resend API call
    │
    └── Response: { success: true } or { success: false, errors: [...] }
```

### Security measures

| Protection | Implementation | Scope |
|-----------|---------------|-------|
| CORS | `ALLOWED_ORIGIN` env var (defaults to `https://c4studios.com`) | All endpoints |
| Content-Type | Validates `application/json` or `multipart/form-data` | All endpoints |
| API key guard | Rejects requests if `RESEND_API_KEY` is not configured | inquiries, ventures |
| Honeypot | Hidden `_gotcha` field — silent reject if filled | All forms |
| Timestamp | Rejects submissions < 2s after page load | All forms |
| Input validation | Required fields, email format, min lengths | All endpoints |
| Length limits | Per-field truncation (200–5,000 chars) | All endpoints |
| URL filtering | Attachment URLs must start with `https://` | inquiries, ventures |
| HTML escaping | All user input escaped in email templates | All endpoints |
| File validation | MIME type + extension + size checks | upload |
| Security headers | `X-Frame-Options`, `X-Content-Type-Options`, etc. | `public/_headers` |

---

## What was replaced from Base44

The original codebase was exported from Base44 and had deep coupling to Base44's platform:

| Base44 dependency | Replacement |
|------------------|-------------|
| `@base44/sdk` | Removed entirely |
| `@base44/vite-plugin` | Standard Vite config with `@` path alias |
| Base44 Auth (`AuthProvider`, `AuthenticatedApp`) | Removed — site is public, no auth needed |
| Base44 entity API (`ProjectInquiry.create()`, etc.) | Cloudflare Pages Functions + Resend |
| Base44 file upload (`storage.uploadFile()`) | Cloudflare R2 upload endpoint |
| Supabase-hosted logo | Local `public/logo.png` |
| Base44 deploy flow | Cloudflare Pages with Git integration |

---

## Dependency notes

### Production dependencies in use
- **Core:** `react`, `react-dom`, `react-router-dom`, `framer-motion`, `@tanstack/react-query`
- **UI:** `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`
- **shadcn:** Multiple `@radix-ui/*` packages (accordion, dialog, toast, tabs, tooltip, etc.)

### shadcn/ui component library
The `src/components/ui/` directory contains shadcn/ui primitives. Many were auto-generated during the Base44 export and are not currently imported by application code (e.g. `calendar`, `chart`, `command`, `drawer`, `resizable-panel`). These are harmless — they don't affect bundle size unless imported — and can be removed if desired.

### Dependencies backing unused UI components
`date-fns`, `zod`, `recharts`, `react-resizable-panels`, `react-day-picker`, `cmdk`, `input-otp`, `sonner`, `vaul`, `react-hook-form` — these packages are only imported by unused shadcn wrapper files in `src/components/ui/`. They are safe to remove if you want to trim `node_modules`, but removing them would break the corresponding `ui/` wrapper files. Leaving them is harmless (they are tree-shaken out of the production bundle).

---

## Future considerations

1. **Code splitting** — The JS bundle is ~535 KB. Adding `React.lazy()` for route-level page components would improve initial load time.
2. **Shared backend helpers** — `inquiries.js` and `ventures.js` duplicate helper functions (`sanitise`, `escapeHtml`, `sendEmail`). A shared module in `functions/lib/` would reduce duplication.
3. **Database** — Forms are currently email-only. Adding Cloudflare D1 (SQL) or KV storage would enable submission history and dashboards.
4. **Turnstile** — If spam becomes a problem, Cloudflare Turnstile can replace the honeypot with a more robust challenge.
5. **Image optimisation** — Portfolio images could use Cloudflare Image Resizing for responsive delivery and faster loads.
6. **SEO / pre-rendering** — As a client-rendered SPA, search engine indexing depends on JavaScript execution. If organic search traffic matters, consider pre-rendering key pages or migrating to a framework with SSR support.
