export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const business = String(body.business || body.company || "").trim();
    const website = String(body.website || "").trim();
    const budget = String(body.budget || "").trim();
    const timeline = String(body.timeline || "").trim();
    const service = String(body.service || body.helpType || "").trim();
    const message = String(
      body.message || body.projectDetails || body.details || ""
    ).trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Name, email, and message are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const subjectParts = ["New C4 Studios enquiry", name];
    if (business) subjectParts.push(business);
    const subject = subjectParts.join(" — ");

    const html = `
      <h2>New contact form enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Business:</strong> ${escapeHtml(business || "-")}</p>
      <p><strong>Website:</strong> ${escapeHtml(website || "-")}</p>
      <p><strong>Service:</strong> ${escapeHtml(service || "-")}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget || "-")}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(timeline || "-")}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${env.CONTACT_FROM_NAME} <${env.CONTACT_FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        html,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Email send failed.",
          details: resendData,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, data: resendData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Invalid request.",
        details: String(error),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}