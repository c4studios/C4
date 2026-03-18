# C4 Studios — Design & Development

Portfolio and client-facing website for C4 Studios. Built with React, Tailwind CSS, and deployed on Cloudflare Pages with serverless form handling.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create a .dev.vars file for local secrets (see ENVIRONMENT.md)
cp .dev.vars.example .dev.vars   # then fill in your Resend API key

# 3. Start with full backend (Cloudflare Functions emulation)
npm run dev:full
# → Open http://localhost:8788 (not :5173)

# Or: frontend only (forms won't work, but faster for UI changes)
npm run dev
# → Open http://localhost:5173
```

### Other commands

```bash
npm run build      # Production build → dist/
npm run preview    # Serve dist/ locally with Functions (http://localhost:8788)
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| UI components | shadcn/ui (New York style) |
| Routing | React Router DOM 6 (client-side) |
| Animation | Framer Motion 11 |
| Backend | Cloudflare Pages Functions (serverless, edge) |
| Email | Resend API |
| File storage | Cloudflare R2 (optional, for attachments) |

## Project structure

```
├── functions/              # Cloudflare Pages Functions (serverless API)
│   └── api/
│       ├── inquiries.js    # POST /api/inquiries — contact + project forms
│       ├── ventures.js     # POST /api/ventures  — venture idea form
│       └── upload.js       # POST /api/upload    — file attachments → R2
├── public/                 # Static assets (copied to dist/ on build)
│   ├── _headers            # Cloudflare security headers
│   ├── _redirects          # SPA routing catch-all
│   └── logo.png            # Site logo
├── src/
│   ├── api/                # Frontend fetch wrappers for API calls
│   ├── components/         # React components organised by domain
│   │   ├── c4/             # Site-wide (nav, footer, theme, logo)
│   │   ├── home/           # Home page sections
│   │   ├── about/          # About page sections
│   │   ├── portfolio/      # Portfolio + case study components
│   │   ├── services/       # Services page components
│   │   ├── testimonials/   # Testimonial slider + data
│   │   ├── ventures/       # Ventures page components
│   │   └── ui/             # shadcn/ui primitives (auto-generated)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities, query client, 404 page
│   ├── pages/              # Route-level page components
│   └── utils/              # Helper functions (createPageUrl, etc.)
├── wrangler.toml           # Local wrangler dev config
└── package.json
```

## Documentation

| Doc | Contents |
|-----|----------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Full Cloudflare Pages setup and deployment guide |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Environment variables reference (what to set, where, why) |
| [FORMS_AND_SUBMISSIONS.md](FORMS_AND_SUBMISSIONS.md) | Form fields, backend endpoints, anti-spam, email delivery |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Codebase architecture, component map, design decisions |

## Deployment

Deploy to Cloudflare Pages. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step guide covering:
- Connecting your repo to Cloudflare Pages
- Setting environment variables (Resend, CORS, R2)
- Custom domain configuration
- Local development with `npm run dev:full`

## Origin

This project was originally exported from Base44. All Base44 dependencies, APIs, authentication, and hosted assets have been fully removed. The codebase is now self-contained and independently deployable. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full migration record.
