/**
 * POST /api/scan
 *
 * Records ONE event when a networking card is scanned/tapped and the
 * /welcome landing mounts. Attribution (`ref`, e.g. "meetup-june") is kept
 * server-side only — it is never written into the vCard or booking links.
 *
 * Storage is pluggable so the page ships today regardless of infra:
 *   - If SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set → insert a row into
 *     the `scans` table ({ ref, ts, user_agent, country }).
 *   - Otherwise → emit a structured console line (visible via `wrangler tail`
 *     / the Cloudflare dashboard), so nothing breaks before Supabase exists.
 *
 * Optional env vars:
 *   SUPABASE_URL               – e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  – service-role key (server-side only)
 *   ALLOWED_ORIGIN             – CORS origin (defaults to https://c4studios.com.au)
 *
 * Supabase table (run once in the SQL editor):
 *   create table if not exists public.scans (
 *     id bigint generated always as identity primary key,
 *     ref text,
 *     user_agent text,
 *     country text,
 *     ts timestamptz not null default now()
 *   );
 *   -- service-role inserts bypass RLS; no anon policy needed.
 */

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

    const ref = sanitise(body.ref, 80);
    const userAgent = sanitise(body.user_agent || request.headers.get('User-Agent') || '', 400);
    const country = request.headers.get('CF-IPCountry') || null;
    const ts = new Date().toISOString();

    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      await insertScan(env, { ref, user_agent: userAgent, country, ts });
    } else {
      console.log(
        JSON.stringify({ event: 'card_scan', ref: ref || null, country, ts, user_agent: userAgent }),
      );
    }
  } catch (err) {
    console.error('scan handler error:', err);
  }

  return ok();
}

async function insertScan(env, row) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/scans`, {
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
