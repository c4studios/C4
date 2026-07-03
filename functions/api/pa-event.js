/**
 * POST /api/pa-event
 *
 * Records analytics events from the /private-ai landing page. Same
 * pattern as /api/scan (the /welcome landing): fire-and-forget from the
 * client, always 204 back, attribution kept server-side only.
 *
 * Events: pa_view ({ ref }), pa_tier_select ({ tier }),
 * pa_cta_click ({ location }), pa_scroll_pricing.
 *
 * Storage is pluggable so the page ships today regardless of infra:
 *   - If SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set → insert a row
 *     into the `pa_events` table.
 *   - Otherwise → emit a structured console line (visible via
 *     `wrangler tail` / the Cloudflare dashboard).
 *
 * Supabase table (run once in the SQL editor):
 *   create table if not exists public.pa_events (
 *     id bigint generated always as identity primary key,
 *     event text not null,
 *     ref text,
 *     tier text,
 *     location text,
 *     user_agent text,
 *     country text,
 *     ts timestamptz not null default now()
 *   );
 *   -- service-role inserts bypass RLS; no anon policy needed.
 */

const ALLOWED_EVENTS = ['pa_view', 'pa_tier_select', 'pa_cta_click', 'pa_scroll_pricing'];

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
  // Always 204 to the client — tracking failures must never surface.
  const ok = () => new Response(null, { status: 204, headers: cors });

  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const event = sanitise(body.event, 40);
    if (!ALLOWED_EVENTS.includes(event)) return ok();

    const row = {
      event,
      ref: sanitise(body.ref, 80) || null,
      tier: sanitise(body.tier, 40) || null,
      location: sanitise(body.location, 40) || null,
      user_agent: sanitise(body.user_agent || request.headers.get('User-Agent') || '', 400),
      country: request.headers.get('CF-IPCountry') || null,
      ts: new Date().toISOString(),
    };

    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      await insertEvent(env, row);
    } else {
      console.log(JSON.stringify({ source: 'pa-event', ...row }));
    }
  } catch (err) {
    console.error('pa-event handler error:', err);
  }

  return ok();
}

async function insertEvent(env, row) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/pa_events`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed ${res.status}: ${text}`);
  }
}

function sanitise(str, maxLen) {
  if (str == null) return '';
  return String(str).trim().slice(0, maxLen);
}
