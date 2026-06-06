// CLOUDFLARE ENV VARS REQUIRED:
// STRIPE_SECRET_KEY - your Stripe secret key (never commit this)

export async function onRequestPost(context) {
  const { priceId } = await context.request.json();

  if (!priceId) {
    return new Response(JSON.stringify({ error: 'Missing priceId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = context.env.STRIPE_SECRET_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const origin = new URL(context.request.url).origin;

  const params = new URLSearchParams({
    'ui_mode': 'embedded',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'mode': 'subscription',
    'return_url': `${origin}/software?checkout=complete&session_id={CHECKOUT_SESSION_ID}`,
  });

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.json();
    return new Response(
      JSON.stringify({ error: err.error?.message || 'Stripe error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const session = await res.json();

  return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
