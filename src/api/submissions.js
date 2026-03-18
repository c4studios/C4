/**
 * Form submission API layer.
 *
 * All functions POST to Cloudflare Pages Functions endpoints.
 * In local dev, use `npm run dev:full` (wrangler pages dev) to serve
 * both the SPA and Functions from the same origin.
 */

const API_BASE = ''; // same-origin — Cloudflare Pages serves both SPA and Functions

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

  const json = await res.json();

  if (!res.ok || !json.success) {
    const message = json.errors?.join(' ') || 'Submission failed. Please try again.';
    throw new Error(message);
  }

  return json;
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

  const json = await res.json();

  if (!res.ok || !json.success) {
    const message = json.errors?.join(' ') || 'Submission failed. Please try again.';
    throw new Error(message);
  }

  return json;
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

  const json = await res.json();

  if (!res.ok || !json.success) {
    const message = json.errors?.join(' ') || 'Submission failed. Please try again.';
    throw new Error(message);
  }

  return json;
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
