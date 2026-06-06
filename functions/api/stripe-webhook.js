// CLOUDFLARE ENV VARS REQUIRED:
// STRIPE_WEBHOOK_SECRET - from Stripe Dashboard > Webhooks
// RESEND_API_KEY - for notification emails

export async function onRequestPost(context) {
  const body = await context.request.text();
  const sig = context.request.headers.get('stripe-signature');

  try {
    const event = JSON.parse(body);

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'payment_link.completed'
    ) {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      const productName = 'ReturnDesk Beta';

      if (customerEmail && context.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'C4 Studios Payments <caleb@c4studios.com.au>',
            to: 'caleb@c4studios.com.au',
            subject: `New ${productName} subscriber: ${customerEmail}`,
            html: `
              <p><strong>New payment received</strong></p>
              <p>Product: ${productName}</p>
              <p>Customer: ${customerName || 'Unknown'}</p>
              <p>Email: ${customerEmail}</p>
              <p>Event: ${event.type}</p>
            `,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Webhook error' }), { status: 400 });
  }
}
