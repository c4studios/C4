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
 * Submit a venture idea (Ventures page).
 * @param {Object} data - { name, email, idea_title, idea_type, idea_description, target_audience, existing_solution, nda, attachments, _gotcha, _loaded }
 * @returns {Promise<{ success: boolean, errors?: string[] }>}
 */
export async function submitVentureIdea(data) {
  const res = await fetch(`${API_BASE}/api/ventures`, {
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

/**
 * Read non-secret runtime capabilities exposed by Pages Functions.
 * @returns {Promise<{ uploadsEnabled: boolean }>}
 */
export async function fetchRuntimeCapabilities() {
  const res = await fetch(`${API_BASE}/api/config`);

  if (!res.ok) {
    throw new Error('Could not read runtime capabilities.');
  }

  const json = await res.json();
  return {
    uploadsEnabled: Boolean(json.uploadsEnabled),
  };
}
