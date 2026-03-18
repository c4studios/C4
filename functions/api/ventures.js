/**
 * POST /api/ventures
 *
 * Handles Venture Idea submissions from the Ventures page.
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

    // --- Honeypot ---
    if (body._gotcha) {
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
    const allowed = await checkRateLimit(request, 'venture');
    if (!allowed) {
      return json({ success: false, errors: ['Too many requests. Please try again later.'] }, 429);
    }

    // --- Timestamp check ---
    if (body._loaded) {
      const elapsed = Date.now() - Number(body._loaded);
      if (elapsed < 2000) {
        return json({ success: true });
      }
    }

    // --- Validate required fields ---
    const errors = [];
    const required = {
      name: 'Name',
      email: 'Email',
      idea_title: 'Idea name',
      idea_type: 'Category',
      problem: 'Problem statement',
      target_audience: 'Target user',
      solution: 'Proposed solution',
    };

    for (const [field, label] of Object.entries(required)) {
      const val = body[field];
      if (!val || typeof val !== 'string' || val.trim().length < 1) {
        errors.push(`${label} is required.`);
      }
    }

    if (body.email && !isValidEmail(body.email)) {
      errors.push('A valid email is required.');
    }

    if (errors.length > 0) {
      return json({ success: false, errors }, 400);
    }

    // --- Sanitise ---
    const clean = {
      name: sanitise(body.name, 200),
      email: body.email.trim().toLowerCase(),
      idea_title: sanitise(body.idea_title, 200),
      idea_type: sanitise(body.idea_type, 50),
      problem: sanitise(body.problem),
      solution: sanitise(body.solution),
      target_audience: sanitise(body.target_audience, 500),
      features: sanitise(body.features || ''),
      comparables: sanitise(body.comparables || ''),
      why_now: sanitise(body.why_now || ''),
      monetisation: sanitise(body.monetisation || '', 500),
      links: sanitise(body.links || '', 1000),
      nda: Boolean(body.nda),
      attachments: Array.isArray(body.attachments)
        ? body.attachments.filter(u => typeof u === 'string' && u.startsWith('https://')).slice(0, 5)
        : [],
    };

    // --- Build email ---
    const subject = `New Venture Idea: ${clean.idea_title}`;
    const html = buildVentureEmail(clean);

    // --- Send via Resend ---
    await sendEmail(env, {
      to: env.CONTACT_EMAIL || 'hello@c4studios.com',
      subject,
      html,
      replyTo: clean.email,
    });

    return json({ success: true });
  } catch (err) {
    console.error('Venture handler error:', err);
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

function buildVentureEmail(data) {
  const e = escapeHtml;
  const detailRows = [
    ['Problem', data.problem],
    ['Solution', data.solution],
    ['Target User', data.target_audience],
    data.features && ['Key Features', data.features],
    data.comparables && ['Comparables', data.comparables],
    data.why_now && ['Why Now', data.why_now],
    data.monetisation && ['Monetisation', data.monetisation],
    data.links && ['Links', data.links],
  ].filter(Boolean);

  const attachmentList = data.attachments.length
    ? `<tr><td style="padding:8px 12px;color:#666;font-size:13px;vertical-align:top;">Attachments</td><td style="padding:8px 12px;font-size:13px;">${data.attachments.map((u) => `<a href="${e(u)}" style="color:#333;">${e(u)}</a>`).join('<br>')}</td></tr>`
    : '';

  const ndaBadge = data.nda
    ? `<p style="display:inline-block;margin:16px 0 0;padding:4px 10px;background:#fff3cd;color:#856404;font-size:11px;border-radius:3px;">🔒 NDA discussion requested</p>`
    : '';

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 4px;color:#111;">Venture Idea: ${e(data.idea_title)}</h2>
      <p style="margin:0 0 20px;font-size:13px;color:#666;">From ${e(data.name)} &lt;${e(data.email)}&gt; · Category: ${e(data.idea_type)}</p>
      ${ndaBadge}
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${detailRows.map(([label, value]) => `<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 12px;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#111;font-size:13px;white-space:pre-wrap;">${e(value)}</td></tr>`).join('')}
        ${attachmentList}
      </table>
      <p style="margin-top:24px;font-size:11px;color:#aaa;">Sent from c4studios.com venture form</p>
    </div>
  `;
}
