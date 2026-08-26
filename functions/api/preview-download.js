/**
 * POST /api/preview-download
 *
 * Records a C4Sight preview-pack download (the inbound lead-magnet lane) and
 * notifies the studio. Mirrors functions/api/training.js: honeypot, optional
 * Turnstile, rate-limit, timestamp trap, then acts.
 *
 * The pack PDFs are public static files, so the browser delivers them itself —
 * this endpoint is pure capture. Both side effects are best-effort: the visitor
 * gets their packs regardless of whether recording or the email succeed.
 *
 *   1. records the download in the C4 Lead Engine (via the public
 *      intake-preview-download edge function — no Supabase key lives here), so
 *      the post-download follow-up sequence has a row to work from; and
 *   2. emails the studio a heads-up via Resend, so downloads are visible live.
 *
 * Required env vars (Cloudflare dashboard):
 *   RESEND_API_KEY  – resend.com key (email is skipped if unset)
 * Optional:
 *   CONTACT_EMAIL, FROM_EMAIL, ALLOWED_ORIGIN, TURNSTILE_SECRET_KEY
 *   ENGINE_INTAKE_URL – override the intake edge-function URL
 */

const DEFAULT_INTAKE_URL =
  'https://hauwhplevypinplfbbgh.supabase.co/functions/v1/intake-preview-download';

const SERIES = {
  S1: 'The Computer Puppy (PP–Y2)',
  S2: 'Who Taught the Machine? (Y3–6)',
  S3: 'Can You Trust It? (Y7–9)',
  S4: 'Your Move (Y10–12)',
  S5: 'Monday Morning AI (Staff PD)',
};

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || 'https://c4studios.com.au',
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
    const ct = request.headers.get('Content-Type') || '';
    if (!ct.includes('application/json')) {
      return json({ success: false, errors: ['Content-Type must be application/json.'] }, 415);
    }

    const body = await request.json();

    // Honeypot — silently accept bots.
    if (body._gotcha) return json({ success: true });

    // Turnstile (skipped when no secret configured).
    const turnstile = await verifyTurnstile(
      body.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request.headers.get('CF-Connecting-IP'),
    );
    if (!turnstile.ok) return json({ success: false, errors: [turnstile.error] }, 403);

    // Rate limit.
    if (!(await checkRateLimit(request, 'preview-download'))) {
      return json({ success: false, errors: ['Too many requests. Please try again later.'] }, 429);
    }

    // Timestamp trap — reject sub-2s submits.
    if (body._loaded) {
      const elapsed = Date.now() - Number(body._loaded);
      if (elapsed < 2000) return json({ success: true }); // silent reject
    }

    // Validate.
    const email = String(body.email || '').trim().toLowerCase();
    const series = Array.isArray(body.series)
      ? [...new Set(body.series.map((s) => String(s)).filter((s) => SERIES[s]))]
      : [];
    const errors = [];
    if (!isValidEmail(email)) errors.push('A valid email is required.');
    if (series.length === 0) errors.push('Choose at least one preview to download.');
    if (errors.length) return json({ success: false, errors }, 400);

    const clean = {
      first_name: sanitise(body.first_name || '', 120),
      email,
      school_name: sanitise(body.school_name || '', 200),
      series,
      source: ['website-organic', 'cold-touch', 'warm', 'event'].includes(body.source)
        ? body.source
        : 'website-organic',
      user_agent: sanitise(request.headers.get('User-Agent') || '', 400),
    };

    // Both side effects are best-effort — the visitor's download never depends
    // on them, so a Supabase or Resend hiccup can't cost a lead their packs.
    await Promise.allSettled([
      recordDownload(env, clean),
      sendStudioNotice(env, clean),
    ]);

    return json({ success: true });
  } catch (err) {
    console.error('preview-download handler error:', err);
    return json({ success: false, errors: ['Something went wrong. Please try again.'] }, 500);
  }
}

// ─── Side effects ─────────────────────────────────────────

async function recordDownload(env, clean) {
  const url = env.ENGINE_INTAKE_URL || DEFAULT_INTAKE_URL;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clean),
  });
  if (!res.ok) throw new Error(`intake ${res.status}`);
}

async function sendStudioNotice(env, clean) {
  if (!env.RESEND_API_KEY) return; // email optional
  const e = escapeHtml;
  const picked = clean.series.map((s) => SERIES[s] || s);
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 20px;color:#111;">New C4Sight preview download</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Name', e(clean.first_name) || '—'],
          ['Email', e(clean.email)],
          ['School', e(clean.school_name) || '—'],
          ['Packs', picked.map(e).join('<br>')],
          ['Source', e(clean.source)],
        ].map(([l, v]) => `<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 12px;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">${l}</td><td style="padding:8px 12px;color:#111;font-size:13px;">${v}</td></tr>`).join('')}
      </table>
      <p style="margin-top:20px;font-size:12px;line-height:1.6;color:#555;">Recorded in the Lead Engine (c4sight_downloads). The post-download follow-up stays parked behind the PL-insurance gate until you open it.</p>
      <p style="margin-top:16px;font-size:11px;color:#aaa;">Sent from the C4Sight previews page on c4studios.com.au</p>
    </div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.FROM_EMAIL || 'C4 Studios <noreply@c4studios.com.au>',
      to: [env.CONTACT_EMAIL || 'caleb@c4studios.com.au'],
      reply_to: clean.email,
      subject: `C4Sight preview download — ${clean.school_name || clean.email}`,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}

// ─── Helpers (mirrored from training.js) ──────────────────

async function verifyTurnstile(token, secretKey, remoteIp) {
  if (!secretKey) return { ok: true };
  if (!token) return { ok: false, error: 'Verification required. Please complete the challenge.' };
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: secretKey, response: token, remoteip: remoteIp || '' }),
  });
  const data = await res.json();
  return data.success ? { ok: true } : { ok: false, error: 'Verification failed. Please refresh and try again.' };
}

async function checkRateLimit(request, endpoint, maxRequests = 8, windowSec = 600) {
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
    return true;
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
