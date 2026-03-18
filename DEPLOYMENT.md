# Deployment Guide — Cloudflare Pages

## Overview

C4 Studios deploys as a **Cloudflare Pages** project with **Pages Functions** for serverless API endpoints. The frontend is a static SPA (Vite build), and the backend is three API functions that handle form submissions and file uploads.

---

## Prerequisites

1. A **Cloudflare account** with Pages enabled (free tier is fine)
2. A **Resend account** ([resend.com](https://resend.com)) with a verified sending domain
3. Your code pushed to a **Git repository** (GitHub, GitLab, or Bitbucket — Cloudflare Pages connects directly to one of these)
4. **Node.js 18+** installed locally (for builds and local dev)
5. (Optional) A Cloudflare R2 bucket for file upload storage

---

## First-time setup

### 1. Configure Resend (do this first)

You need a working Resend API key before forms can send email.

1. Sign up at [resend.com](https://resend.com)
2. Go to **Domains → Add Domain** and verify your sending domain (e.g. `c4studios.com`). Resend will give you DNS records (SPF, DKIM) to add — this proves domain ownership and authorises sending.
3. Go to **API Keys → Create API Key**. Copy the key (it starts with `re_`).

### 2. Connect repository to Cloudflare Pages

1. Push your code to GitHub (or GitLab/Bitbucket)
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages**
3. Select **Connect to Git** and authorise access to your repository
4. Configure the build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave default)
5. Before clicking **Save and Deploy**, add the environment variables in the next step

### 3. Configure environment variables

In the Pages project, go to **Settings → Environment variables** and add:

| Variable | Required | Value |
|----------|----------|-------|
| `RESEND_API_KEY` | ✅ Yes | Your Resend API key (`re_...`) |
| `CONTACT_EMAIL` | ✅ Yes | Email address that receives form submissions (e.g. `hello@c4studios.com`) |
| `FROM_EMAIL` | ✅ Yes | Verified sender address in Resend (e.g. `C4 Studios <noreply@c4studios.com>`) — must match a verified domain |
| `ALLOWED_ORIGIN` | ✅ For production | Your site's exact origin including scheme (e.g. `https://c4studios.com`). No trailing slash. If omitted, defaults to `https://c4studios.com`. |
| `NODE_VERSION` | Recommended | `18` — Cloudflare's default Node version may be older; this ensures compatibility |

> **Important:** Cloudflare Pages has separate env var slots for **Production** and **Preview**. Set variables in both. For Preview, set `ALLOWED_ORIGIN` to your `*.pages.dev` URL so forms work on preview deployments.

### 4. Configure custom domain (optional)

1. Go to **Custom domains** in your Pages project settings
2. Add your domain (e.g. `c4studios.com`)
3. Cloudflare will show DNS instructions — add the required CNAME record
4. Ensure `ALLOWED_ORIGIN` in Production env vars matches the custom domain exactly (e.g. `https://c4studios.com`)

### 5. Set up R2 for file uploads (optional)

File uploads (attachments on the Start Project and Ventures forms) require Cloudflare R2. If you skip this, those forms still work — only the "Attach files" feature will return an error.

1. **Create an R2 bucket:**
   - Go to **Cloudflare Dashboard → R2 → Create bucket**
   - Name it (e.g. `c4-uploads`)

2. **Bind the bucket to your Pages project:**
   - Go to **Pages project → Settings → Functions → R2 bucket bindings**
   - Add a binding: Variable name = `UPLOADS_BUCKET`, R2 bucket = the bucket you just created
   - ⚠️ This is a **binding**, not a text environment variable — it appears in a different section of the dashboard than the env vars above

3. **Enable public access** so uploaded files are downloadable via URL:
   - In R2 bucket settings, connect a **custom domain** (e.g. `uploads.c4studios.com`)
   - Or enable the **R2.dev subdomain** for testing (not recommended for production)

4. **Set the public URL prefix** as a text environment variable:
   - `PUBLIC_BUCKET_URL` = `https://uploads.c4studios.com` (no trailing slash)

---

## Deployment workflow

### Automatic deploys (recommended)
Every push to your production branch triggers a new deployment. Pull requests get preview deployments with unique URLs. No manual steps needed after initial setup.

### Manual deploy
If you need to deploy without pushing to Git:
```bash
npx wrangler login          # first time only
npm run build
npx wrangler pages deploy dist --project-name <your-pages-project-name>
```
Replace `<your-pages-project-name>` with the name shown in your Cloudflare Pages dashboard (e.g. `c4-studio`).

---

## How it works

### SPA routing

The `public/_redirects` file contains a catch-all rule that Cloudflare Pages processes:
```
/*  /index.html  200
```
This ensures client-side routes (e.g. `/Contact`, `/Portfolio`) serve the SPA entry point instead of returning 404. The file is automatically copied to `dist/` during build.

### Security headers

The `public/_headers` file adds security headers to all responses:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (disables camera, microphone, geolocation)

### Functions (serverless API)

Cloudflare Pages automatically discovers the `functions/` directory and deploys each file as a serverless endpoint:

| File | Endpoint | Method |
|------|----------|--------|
| `functions/api/inquiries.js` | `/api/inquiries` | POST |
| `functions/api/ventures.js` | `/api/ventures` | POST |
| `functions/api/upload.js` | `/api/upload` | POST |

No additional configuration is needed — Pages handles routing automatically.

### CORS

All API endpoints return an `Access-Control-Allow-Origin` header set to the `ALLOWED_ORIGIN` environment variable (defaulting to `https://c4studios.com`). This means:
- Forms work on your production domain automatically
- **Preview deployments need their own `ALLOWED_ORIGIN`** set in the Preview environment, or forms will fail with CORS errors
- Local dev uses `http://localhost:8788` (set via `.dev.vars`)

---

## Local development

### Frontend only (fast, no backend)
```bash
npm run dev
```
Opens a Vite dev server at `http://localhost:5173`. Hot module replacement works. Forms will fail with network errors — this mode is for UI work only.

### Full stack (frontend + Functions)
```bash
npm run dev:full
```
This runs `wrangler pages dev` which:
1. Starts Vite's dev server internally
2. Proxies it through wrangler at `http://localhost:8788`
3. Serves Pages Functions from the same origin (no CORS issues)

wrangler is installed as a devDependency — `npm install` handles this.

Create a `.dev.vars` file in the project root for local secrets:
```
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=hello@c4studios.com
FROM_EMAIL=C4 Studios <noreply@c4studios.com>
ALLOWED_ORIGIN=http://localhost:8788
```
This file is in `.gitignore` and will never be committed. Without it, form submissions will fail with a 500 error (missing API key).

> **Open `http://localhost:8788`** (the wrangler proxy), not `http://localhost:5173` (the raw Vite server). Forms only work through the proxy.

### Preview production build locally
```bash
npm run build
npm run preview
```
Builds the site and serves `dist/` through wrangler at `http://localhost:8788`, including Functions — useful for testing the exact output that will be deployed.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Forms return **500** | `RESEND_API_KEY` not set, or `FROM_EMAIL` domain not verified in Resend | Check env vars in Cloudflare dashboard; verify sender domain in Resend |
| Forms return **CORS error** | `ALLOWED_ORIGIN` doesn't match the site's actual origin | Set `ALLOWED_ORIGIN` to the exact origin (`https://yourdomain.com`, no trailing slash) |
| File uploads return **503** | R2 bucket not bound to the Pages project | Add the `UPLOADS_BUCKET` R2 binding in Pages → Settings → Functions |
| Routes return **404** after deploy | `_redirects` file missing from build output | Run `ls dist/_redirects` — it should be copied from `public/` during build |
| Preview deploy forms fail | CORS blocks the `*.pages.dev` origin | Set `ALLOWED_ORIGIN` in the Preview environment to your Pages dev URL |
| Email not received | Resend domain not verified, or email landed in spam | Check Resend dashboard for delivery logs; check spam/junk folder |
| `npm run dev:full` fails | wrangler not installed | Run `npm install` to install devDependencies |
| Local forms return 500 | Missing `.dev.vars` file | Create `.dev.vars` in project root with the variables shown above |
