/**
 * Form submission API layer.
 *
 * All functions POST to Cloudflare Pages Functions endpoints.
 * In local dev, use `npm run dev:full` (wrangler pages dev) to serve
 * both the SPA and Functions from the same origin.
 */

const API_BASE = ''; // same-origin — Cloudflare Pages serves both SPA and Functions

/**
 * Typed submission error — carries status code for UI classification.
 *   400 → validation   |   403 → spam/security   |   429 → rate limit   |   5xx → server
 */
export class SubmissionError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'SubmissionError';
    this.status = status;
  }
}

function classifyError(status, fallbackMessage) {
  if (status === 400) return fallbackMessage || 'Please check the form and try again.';
  if (status === 403) return fallbackMessage || 'Your submission could not be verified. Please refresh and try again.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  return fallbackMessage || 'Something went wrong while sending your enquiry. Please try again.';
}

async function handleResponse(res) {
  let json;
  try { json = await res.json(); } catch { json = {}; }
  if (!res.ok || !json.success) {
    const msg = json.errors?.join(' ') || classifyError(res.status);
    throw new SubmissionError(msg, res.status);
  }
  return json;
}

/**
 * Submit a contact / project inquiry (Contact page + Start Project page).
 * @param {Object} data - { name, email, company, service_type, budget, description, timeline, attachments, _gotcha, _loaded }
 * @returns {Promise<{ success: boolean, errors?: string[] }>}
 */
export async function submitProjectInquiry(data) {
  const res = await fetch(`${API_BASE}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Submit a C4Sight workshop enquiry (training enquiry form).
 * @param {Object} data - { name, email, organisation, sector, format, group_size, message, _gotcha, _loaded, turnstileToken }
 * @returns {Promise<{ success: boolean, errors?: string[] }>}
 */
export async function submitTrainingEnquiry(data) {
  const res = await fetch(`${API_BASE}/api/training`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Record a C4Sight preview-pack download (the tracked previews page).
 * The pack PDFs are public static files delivered client-side; this only
 * captures the downloader for the follow-up lane and notifies the studio.
 * @param {Object} data - { first_name, school_name, email, series: string[], source, _gotcha, _loaded }
 * @returns {Promise<{ success: boolean, errors?: string[] }>}
 */
export async function submitPreviewDownload(data) {
  const res = await fetch(`${API_BASE}/api/preview-download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Submit a support request (Support page).
 * @param {Object} data - { name, email, category, priority, order_number, subject, message, _gotcha, _loaded }
 * @returns {Promise<{ success: boolean, errors?: string[] }>}
 */
export async function submitSupportRequest(data) {
  const res = await fetch(`${API_BASE}/api/support`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Record a single QR/NFC card scan (the /welcome landing).
 *
 * Fire-and-forget: tracking must never block or break the page, so this
 * swallows every error. The `ref` attribution stays server-side — it is sent
 * here but deliberately never propagated into the vCard or booking links.
 *
 * @param {Object} data - { ref, user_agent }
 * @returns {Promise<void>}
 */
export async function recordScan(data) {
  try {
    await fetch(`${API_BASE}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch {
    /* tracking is best-effort — never surface to the user */
  }
}

/**
 * Record a /private-ai page analytics event (the /welcome scan pattern).
 *
 * Fire-and-forget: tracking must never block or break the page, so this
 * swallows every error. Events: pa_view (with ref attribution),
 * pa_tier_select ({ tier }), pa_cta_click ({ location }), pa_scroll_pricing.
 *
 * @param {string} event
 * @param {Object} [data] - { ref?, tier?, location? }
 * @returns {Promise<void>}
 */
export async function recordPrivateAiEvent(event, data = {}) {
  try {
    await fetch(`${API_BASE}/api/pa-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...data, user_agent: navigator.userAgent }),
      keepalive: true,
    });
  } catch {
    /* tracking is best-effort — never surface to the user */
  }
}

/**
 * Upload a file attachment to Cloudflare R2.
 * @param {File} file
 * @returns {Promise<{ file_url: string }>}
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    const message = json.errors?.join(' ') || 'Upload failed. Please try again.';
    throw new Error(message);
  }

  return { file_url: json.file_url };
}
