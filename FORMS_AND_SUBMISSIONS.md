# Forms & Submissions

## Overview

The site has three form submission flows and one file upload endpoint. All forms submit to Cloudflare Pages Functions, which validate the input and send an email notification via Resend.

---

## Form inventory

### 1. Contact (`/Contact`)

**Purpose:** Quick inquiry from the Contact page.

| Field | Type | Required | Max length |
|-------|------|----------|-----------|
| `name` | text | ✅ | 200 |
| `email` | email | ✅ | — |
| `company` | text | ❌ | 200 |
| `service` | pill select | ❌ | 50 |
| `description` | textarea | ✅ (min 5 chars) | 5,000 |

**Endpoint:** `POST /api/inquiries`
**File upload:** No
**Success state:** Replaces form with "Inquiry sent" confirmation
**Error state:** Destructive toast notification with the server's error message

---

### 2. Start Project (`/StartProject`)

**Purpose:** Detailed project inquiry with budget, timeline, and attachments.

| Field | Type | Required | Max length |
|-------|------|----------|-----------|
| `name` | text | ✅ | 200 |
| `email` | email | ✅ | — |
| `company` | text | ❌ | 200 |
| `service` | pill select | ❌ | 50 |
| `budget` | pill select | ❌ | 50 |
| `timeline` | pill select | ❌ | 100 |
| `description` | textarea | ✅ (min 5 chars) | 5,000 |
| `attachments` | file upload | ❌ | 5 files, 10 MB each |

**Endpoint:** `POST /api/inquiries` (same endpoint as Contact — same handler)
**File upload:** Yes, via `POST /api/upload` (files uploaded individually before form submit)
**Success state:** "Inquiry received" confirmation
**Error state:** Destructive toast

---

### 3. Venture Idea (`/Ventures#submit`)

**Purpose:** Detailed venture/startup idea submission with live scoring preview.

| Field | Type | Required | Max length |
|-------|------|----------|-----------|
| `name` | text | ✅ | 200 |
| `email` | email | ✅ | — |
| `idea_title` | text | ✅ | 200 |
| `idea_type` | select | ✅ | 50 |
| `problem` | textarea | ✅ | 5,000 |
| `target_audience` | text | ✅ | 500 |
| `solution` | textarea | ✅ | 5,000 |
| `features` | textarea | ❌ | 5,000 |
| `comparables` | textarea | ❌ | 5,000 |
| `why_now` | textarea | ❌ | 5,000 |
| `monetisation` | text | ❌ | 500 |
| `links` | text | ❌ | 1,000 |
| `nda` | checkbox | ❌ | — |
| `attachments` | file upload | ❌ | 5 files, 10 MB each |

**Endpoint:** `POST /api/ventures`
**File upload:** Yes, via `POST /api/upload`
**Success state:** "Submission received" with next-steps timeline
**Error state:** Destructive toast

---

### 4. Rebuild (`/Rebuild`)

**No form exists.** The Rebuild page is a hero section with descriptive copy only. A form can be added here in the future if needed.

---

## Backend endpoints

### `POST /api/inquiries`
**Source:** `functions/api/inquiries.js`
**Used by:** Contact page, Start Project page

Request flow:
1. Validate `Content-Type: application/json` (returns 415 otherwise)
2. Check `RESEND_API_KEY` is configured (returns 500 if missing)
3. Honeypot check — if `_gotcha` is filled, silently return `{ success: true }` without sending email
4. Timestamp check — if `_loaded` indicates < 2 seconds since page load, silently return `{ success: true }`
5. Validate required fields: `name`, `email` (format check), `description` (min 5 chars)
6. Sanitise all fields: trim whitespace, truncate to per-field length limits
7. Filter attachment URLs: only `https://` URLs are kept
8. Build HTML email with all user content escaped via `escapeHtml()`
9. Send via Resend API to `CONTACT_EMAIL`
10. Return `{ success: true }`

On validation failure: returns `{ success: false, errors: ["..."] }` with HTTP 400.

### `POST /api/ventures`
**Source:** `functions/api/ventures.js`
**Used by:** Venture form on Ventures page

Same flow as inquiries, but validates 7 required fields (`name`, `email`, `idea_title`, `idea_type`, `problem`, `target_audience`, `solution`) and builds a structured email with each venture field in its own section.

### `POST /api/upload`
**Source:** `functions/api/upload.js`
**Used by:** FileUpload component (on Start Project and Ventures pages)
**Content-Type:** `multipart/form-data` (not JSON)

Request flow:
1. Content-Length pre-check — reject oversized requests before buffering
2. Parse multipart form data
3. Validate a `file` field exists
4. Validate MIME type: `application/pdf`, `image/png`, `image/jpeg`, `image/webp`
5. Validate file extension: `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`
6. Validate size: max 10 MB
7. Read file into memory and verify magic bytes match the declared MIME type (prevents disguised files)
8. Generate unique storage key: `uploads/{timestamp}-{uuid}.{ext}` (uses `crypto.randomUUID()`)
9. Sanitise the original filename (strip path separators, null bytes, HTML-risky chars, cap at 200 chars)
10. Upload to R2 bucket with `Content-Disposition: attachment` header and sanitised filename in metadata
11. Return `{ success: true, file_url: "https://..." }`

If R2 is not configured (no `UPLOADS_BUCKET` binding), returns HTTP 503.

---

## Anti-spam measures

### Honeypot field
Every form includes a hidden `_gotcha` input field, positioned off-screen with `position: absolute; left: -9999px` and `aria-hidden="true"`. Real users never see or fill it. If a bot fills it, the backend silently returns `{ success: true }` without sending any email — this avoids tipping off the bot that it was detected.

### Timestamp check
Every form records `Date.now()` when the component mounts (stored in a `useRef`). This timestamp is sent as `_loaded` with the submission. The backend rejects submissions where less than 2 seconds have elapsed since page load — faster than any human could fill the form. These are also silently accepted (same reason as honeypot).

### Why not Turnstile?
Cloudflare Turnstile (CAPTCHA alternative) is not currently implemented. For a business website with email-only submissions and moderate traffic:
- Honeypot + timestamp + server-side validation catches most automated bots
- Turnstile adds visual friction and a third-party dependency
- If spam becomes a problem, Turnstile can be added without changing the backend — add the frontend widget and a server-side token verification step

---

## Email delivery

Emails are sent via the [Resend](https://resend.com) API. Each form submission generates a formatted HTML email with:
- Structured field table (name, email, service, etc.)
- HTML-escaped user content (prevents injection)
- `Reply-To` set to the submitter's email address (so you can reply directly)
- Attachment URLs listed as clickable links

The sender address (`FROM_EMAIL`) must belong to a domain verified in Resend. The receiving address (`CONTACT_EMAIL`) can be any email address.

---

## Frontend API layer

All form submissions go through `src/api/submissions.js`, which provides three functions:

| Function | Endpoint | Content-Type |
|----------|----------|-------------|
| `submitProjectInquiry(data)` | `POST /api/inquiries` | `application/json` |
| `submitVentureIdea(data)` | `POST /api/ventures` | `application/json` |
| `uploadFile(file)` | `POST /api/upload` | `multipart/form-data` |

Each function throws an `Error` with the server's message on failure. The form components catch this and display a toast notification via shadcn's `useToast` hook.

---

## File upload flow (step by step)

1. User drags files onto the drop zone or clicks "Attach files" to browse
2. Client validates file type (MIME allowlist) and size (10 MB limit) — rejected files show inline error messages
3. File is uploaded **immediately** via `POST /api/upload` (`FormData`)
4. Server validates type, extension, and size again (defense in depth)
5. Server reads the file and verifies magic bytes match the declared MIME type (prevents disguised files)
6. Server generates a UUID-based storage key and stores file in R2 with `Content-Disposition: attachment`
7. URL is stored in the form's React state as an attachment
8. Form submit button is disabled while any file upload is in progress
9. When the user submits the form, attachment URLs are included in the JSON payload
10. Backend includes attachment URLs as clickable links in the notification email

Files are uploaded individually as they are selected, not batched with the form submission. This means the file is already in R2 before the form is submitted.

### Upload error handling

- **Wrong file type:** Inline error below the drop zone, file is not uploaded
- **File too large:** Inline error below the drop zone, file is not uploaded
- **Magic byte mismatch:** Server returns 400, inline error shown (e.g. a `.jpg` that is actually a renamed `.exe`)
- **Network / server error:** Inline error with the server's error message
- **R2 not configured:** Server returns 503, "File storage is not configured" error shown
