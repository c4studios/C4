/**
 * POST /api/event
 *
 * Generic site-wide analytics events. Same contract as /api/pa-event (the
 * /private-ai pipeline this generalises): fire-and-forget from the client,
 * always 204 back, attribution kept server-side only. Cookie-less: the
 * `session` id is a per-tab sessionStorage UUID minted client-side.
 *
 * Events answer the hero-audit question "where do homepage visitors go next":
 *   page_view            ({ path, referrer })
 *   hero_cta_click       ({ path, target: start|portfolio|quotr })
 *   door_click           ({ path, target: web|c4i|lens|sight, detail: face|primary|secondary })
 *   nav_services_open    ({ path })
 *
 * IMPORTANT: the 204 is unconditional — a broken table, wrong key, or missing
 * env var is invisible from the response. Verify changes with a SQL read of
 * public.site_events, never with the status code (learned the hard way when
 * this pipeline's sibling recorded nothing for a month of 204s).
 *
 * Supabase table: public.site_events (created 2026-08-01; see repo history).
 * Service-role inserts bypass RLS; no anon policy needed.
 */

const ALLOWED_EVENTS = ['page_view', 'hero_cta_click', 'door_click', 'nav_services_open'];

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || 'https://c4studios.com.au',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function sanitise(str, maxLen) {
  if (str == null) return '';
  return String(str).trim().slice(0, maxLen);
}

export async function onRequestOptions({ env }) {
  return new Response(null, { status: 204, headers: corsHeaders(env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const cors = corsHeaders(env);
  const ok = () => new Response(null, { status: 204, headers: cors });

  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const event = body.event;
    if (!ALLOWED_EVENTS.includes(event)) return ok();

    const row = {
      event,
      session: sanitise(body.session, 64) || null,
      path: sanitise(body.path, 200) || null,
      target: sanitise(body.target, 60) || null,
      detail: sanitise(body.detail, 60) || null,
      referrer: sanitise(body.referrer, 200) || null,
      user_agent: sanitise(body.user_agent || request.headers.get('User-Agent') || '', 400),
      country: request.headers.get('CF-IPCountry') || null,
      ts: new Date().toISOString(),
    };

    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      await insertEvent(env, row);
    } else {
      console.log(JSON.stringify({ source: 'site-event', ...row }));
    }
  } catch (err) {
    console.error('event handler error:', err);
  }

  return ok();
}

async function insertEvent(env, row) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/site_events`, {
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
