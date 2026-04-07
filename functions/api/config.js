function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || 'https://c4studios.com',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestOptions({ env }) {
  return new Response(null, { status: 204, headers: corsHeaders(env) });
}

export async function onRequestGet({ env }) {
  return new Response(
    JSON.stringify({
      uploadsEnabled: Boolean(env.UPLOADS_BUCKET),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
    }
  );
}