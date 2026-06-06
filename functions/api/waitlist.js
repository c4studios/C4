// IMPORTANT: Set RESEND_API_KEY in Cloudflare Pages dashboard:
// Settings → Environment variables → Add variable → RESEND_API_KEY = re_xxxxxxxxxxxx
// This applies to both Production and Preview environments.

export async function onRequestPost(context) {
  const { name, email, product } = await context.request.json();

  if (!name || !email || !product) {
    return new Response(
      JSON.stringify({ error: 'Missing fields' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const RESEND_API_KEY = context.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Email service not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Send confirmation to the user
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Caleb at C4 Studios <caleb@c4studios.com.au>',
      to: email,
      subject: `You're on the waitlist for ${product}`,
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for joining the waitlist for <strong>${product}</strong>.</p>
        <p>We'll be in touch as soon as early access opens.
        In the meantime, if you have any questions just reply to this email.</p>
        <p>— Caleb<br>C4 Studios</p>
      `,
    }),
  });

  // Send notification to Caleb
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'C4 Studios Waitlist <caleb@c4studios.com.au>',
      to: 'caleb@c4studios.com.au',
      subject: `New waitlist signup: ${product}`,
      html: `
        <p><strong>New waitlist signup</strong></p>
        <p>Product: ${product}</p>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
      `,
    }),
  });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
