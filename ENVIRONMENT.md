# Environment Variables Reference

All environment variables are **server-side only** — they run inside Cloudflare Pages Functions and are never bundled into client-side JavaScript (none use the `VITE_` prefix).

---

## Required variables

These must be set in Cloudflare Pages **Settings → Environment variables** before forms will work. Without them, form submissions return a 500 error.

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com). Starts with `re_`. | `re_abc123def456...` |
| `CONTACT_EMAIL` | Inbox address where form submissions are delivered. Can be any email. | `hello@c4studios.com` |
| `FROM_EMAIL` | Sender address shown on notification emails. **Must match a domain verified in Resend** — if your verified domain is `c4studios.com`, this must be `...@c4studios.com`. | `C4 Studios <noreply@c4studios.com>` |

---

## Optional variables

| Variable | Description | Default if omitted |
|----------|-------------|--------------------|
| `ALLOWED_ORIGIN` | The exact origin allowed by CORS headers (`scheme://domain`, no trailing slash). Must match the URL visitors use to access the site. | `https://c4studios.com` |
| `NODE_VERSION` | Node.js version for the Cloudflare Pages build step. | Cloudflare's platform default (may be older than 18) |

> **Why does `ALLOWED_ORIGIN` matter?** Every API endpoint returns this value as the `Access-Control-Allow-Origin` header. If it doesn't match the browser's origin, form submissions will be blocked by CORS. Common gotcha: preview deployments use a `*.pages.dev` URL that differs from production — set `ALLOWED_ORIGIN` separately in the Preview environment.

---

## R2 file upload variables

Only needed if file uploads are enabled. The Contact and Venture forms work without these — only the "Attach files" feature requires R2.

| Variable | Type | Description |
|----------|------|-------------|
| `UPLOADS_BUCKET` | **R2 binding** | Cloudflare R2 bucket binding. Configured in **Pages → Settings → Functions → R2 bucket bindings**, not in the text environment variables section. |
| `PUBLIC_BUCKET_URL` | Text env var | Public URL prefix for uploaded files, no trailing slash. Must point to a domain or R2.dev URL where the bucket contents are publicly accessible. | Example: `https://uploads.c4studios.com` |

---

## Local development

For local development with `npm run dev:full`, create a `.dev.vars` file in the project root:

```
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=hello@c4studios.com
FROM_EMAIL=C4 Studios <noreply@c4studios.com>
ALLOWED_ORIGIN=http://localhost:8788
```

Key points:
- This file is in `.gitignore` — it will never be committed
- `ALLOWED_ORIGIN` must be `http://localhost:8788` (the wrangler proxy port), not `http://localhost:5173` (the Vite dev server port)
- Without this file, `npm run dev:full` starts but every form submission returns a 500 error
- R2 bindings require uncommenting the `[[r2_buckets]]` section in `wrangler.toml` and having a real R2 bucket in your Cloudflare account. Without it, file uploads return 503 — this is expected and doesn't affect other forms

---

## Security notes

- **No `VITE_` prefix:** None of these variables use Vite's `VITE_` prefix, so they are never included in the client-side JS bundle. They exist only inside Cloudflare Functions at runtime.
- **Separate environments:** Cloudflare Pages lets you set different variables for Production and Preview. Always configure both.
- **Key rotation:** If `RESEND_API_KEY` is compromised, rotate it in the Cloudflare dashboard. The change takes effect on the next request — no redeployment needed.
- **Fallback values:** `CONTACT_EMAIL` and `FROM_EMAIL` have hardcoded fallbacks in the function code (`hello@c4studios.com`, `C4 Studios <noreply@c4studios.com>`). These are convenience defaults — always set the env vars explicitly in production.
