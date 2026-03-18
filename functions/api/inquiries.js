/**
 * POST /api/inquiries
 *
 * Handles Contact page + Start Project page submissions.
 * Validates input, checks honeypot, sends formatted email via Resend.
 *
 * Required env vars (set in Cloudflare dashboard):
 *   RESEND_API_KEY  – API key from resend.com
 *   CONTACT_EMAIL   – Studio inbox email (e.g. hello@c4studios.com)
 *
 * Optional env vars:
 *   ALLOWED_ORIGIN  – CORS origin (defaults to https://c4studios.com)
 *   FROM_EMAIL      – Verified sender address in Resend
 */

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || 'https://c4studios.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestOptions({ env }) {
  return new Response(null, { status: 204, headers: corsHeaders(env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const cors = corsHeaders(env);
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...cors },
    });

  try {
    // Require JSON content type
    const ct = request.headers.get('Content-Type') || '';
    if (!ct.includes('application/json')) {
      return json({ success: false, errors: ['Content-Type must be application/json.'] }, 415);
    }

    // Verify Resend API key is configured
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return json({ success: false, errors: ['Server configuration error.'] }, 500);
    }

    const body = await request.json();

    // --- Honeypot check ---
    if (body._gotcha) {
      // Bot filled the hidden field — silently accept to avoid tipping off
      return json({ success: true });
    }

    // --- Turnstile verification ---
    const turnstileResult = await verifyTurnstile(
      body.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request.headers.get('CF-Connecting-IP')
    );
    if (!turnstileResult.ok) {
      return json({ success: false, errors: [turnstileResult.error] }, 403);
    }

    // --- Rate limit ---
    const allowed = await checkRateLimit(request, 'inquiry');
    if (!allowed) {
      return json({ success: false, errors: ['Too many requests. Please try again later.'] }, 429);
    }

    // --- Timestamp check (reject if submitted < 2s after page load) ---
    if (body._loaded) {
      const elapsed = Date.now() - Number(body._loaded);
      if (elapsed < 2000) {
        return json({ success: true }); // Silent reject
      }
    }

    // --- Validate required fields ---
    const { name, email, description } = body;
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      errors.push('Name is required.');
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      errors.push('A valid email is required.');
    }
    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      errors.push('Project description is required (min 5 characters).');
    }
    if (errors.length > 0) {
      return json({ success: false, errors }, 400);
    }

    // --- Sanitise ---
    const clean = {
      name: sanitise(name, 200),
      email: email.trim().toLowerCase(),
      company: sanitise(body.company || '', 200),
      service_type: sanitise(body.service_type || 'other', 50),
      budget: sanitise(body.budget || '', 50),
      timeline: sanitise(body.timeline || '', 100),
      description: sanitise(description),
      attachments: Array.isArray(body.attachments)
        ? body.attachments.filter(u => typeof u === 'string' && u.startsWith('https://')).slice(0, 5)
        : [],
    };

    // --- Build email ---
    const subject = clean.company
      ? `New inquiry from ${clean.name} (${clean.company})`
      : `New inquiry from ${clean.name}`;

    const html = buildInquiryEmail(clean);

    // --- Send via Resend ---
    await sendEmail(env, {
      to: env.CONTACT_EMAIL || 'hello@c4studios.com',
      subject,
      html,
      replyTo: clean.email,
    });

    return json({ success: true });
  } catch (err) {
    console.error('Inquiry handler error:', err);
    return json({ success: false, errors: ['Something went wrong. Please try again.'] }, 500);
  }
}

// ─── Helpers ──────────────────────────────────────────────

async function verifyTurnstile(token, secretKey, remoteIp) {
  if (!secretKey) return { ok: true }; // skip if not configured (local dev)
  if (!token) return { ok: false, error: 'Verification required. Please complete the challenge.' };

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: secretKey, response: token, remoteip: remoteIp || '' }),
  });
  const data = await res.json();
  if (!data.success) {
    return { ok: false, error: 'Verification failed. Please refresh the page and try again.' };
  }
  return { ok: true };
}

async function checkRateLimit(request, endpoint, maxRequests = 5, windowSec = 600) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const cacheKey = new Request(`https://ratelimit.c4studios.internal/${ip}/${endpoint}`);
    const cache = caches.default;
    const existing = await cache.match(cacheKey);
    let count = 0;
    if (existing) count = parseInt(await existing.text(), 10) || 0;
    if (count >= maxRequests) return false;
    await cache.put(cacheKey, new Response(String(count + 1), {
      headers: { 'Cache-Control': `s-maxage=${windowSec}` },
    }));
    return true;
  } catch {
    return true; // fail open
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitise(str, maxLen = 5000) {
  return String(str).trim().slice(0, maxLen);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendEmail(env, { to, subject, html, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || 'C4 Studios <noreply@c4studios.com>',
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API error ${res.status}: ${text}`);
  }

  return res.json();
}

function buildInquiryEmail(data) {
  const e = escapeHtml;
  const rows = [
    ['Name', e(data.name)],
    ['Email', e(data.email)],
    data.company && ['Company', e(data.company)],
    ['Service', e(formatServiceType(data.service_type))],
    data.budget && ['Budget', e(formatBudget(data.budget))],
    data.timeline && ['Timeline', e(data.timeline)],
  ].filter(Boolean);

  const attachmentList = data.attachments.length
    ? `<tr><td style="padding:8px 12px;color:#666;font-size:13px;vertical-align:top;">Attachments</td><td style="padding:8px 12px;font-size:13px;">${data.attachments.map((u) => `<a href="${e(u)}" style="color:#333;">${e(u)}</a>`).join('<br>')}</td></tr>`
    : '';

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 20px;color:#111;">New Project Inquiry</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${rows.map(([label, value]) => `<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 12px;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#111;font-size:13px;">${value}</td></tr>`).join('')}
        ${attachmentList}
      </table>
      <div style="margin-top:20px;padding:16px;background:#f9f9f7;border-radius:4px;">
        <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Project Description</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#333;white-space:pre-wrap;">${e(data.description)}</p>
      </div>
      <p style="margin-top:24px;font-size:11px;color:#aaa;">Sent from c4studios.com contact form</p>
    </div>
  `;
}

function formatServiceType(key) {
  const map = {
    web_design: 'Website Design',
    web_app: 'Web Application',
    brand_platform: 'Brand Platform',
    rebuild: 'Software Rebuild',
    other: 'Other',
  };
  return map[key] || key;
}

function formatBudget(key) {
  const map = {
    under_1k: 'Under $1k',
    '1k_5k': '$1k – $5k',
    '5k_15k': '$5k – $15k',
    '15k_50k': '$15k – $50k',
    '50k_plus': '$50k +',
    not_sure: 'Not sure yet',
  };
  return map[key] || key;
}
