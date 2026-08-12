import React from 'react';
import useDocumentHead from '@/hooks/useDocumentHead';

/* The generic unsubscribe form.
 *
 * Engine-drafted email carries a per-recipient one-click link. A static Outlook
 * signature cannot: one snippet pasted into many drafts would hand every
 * recipient the same person's token. So the signature points here instead and
 * the person types the address they want removed.
 *
 * Both routes write the same permanent record, which the write-time triggers on
 * outreach_emails and schools_outreach read before any draft is allowed.
 *
 * Plain form POST, no JS required, so it works from any mail client's browser.
 * noindex and out of the sitemap.
 *
 * Lives at /opt-out, NOT /unsubscribe: the `/unsubscribe/*` redirect rule that
 * carries the tokenised links also matches the bare `/unsubscribe` path with an
 * empty splat, and redirect rules run before static assets — so a page there is
 * unreachable. Moving the page was the cheaper fix than reissuing the links
 * already sitting in drafts. */

const FN = 'https://hauwhplevypinplfbbgh.supabase.co/functions/v1/unsubscribe';

export default function OptOut() {
  useDocumentHead({
    title: 'Unsubscribe — C4 Studios',
    description: 'Remove your address from C4 Studios email.',
    path: '/opt-out',
    noIndex: true,
  });

  return (
    <div style={{ backgroundColor: 'var(--c4-bg)', color: 'var(--c4-text)' }}>
      <section className="pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-[620px]">
            <h1
              className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold tracking-[-0.03em] leading-[1.1]"
              style={{ color: 'var(--c4-text)' }}
            >
              Unsubscribe.
            </h1>
            <p
              className="mt-5 text-[15.5px] leading-[1.8] max-w-[52ch]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              Use the address the email arrived at, and it comes off for good.
              No account, no confirmation email, no follow-up asking why.
            </p>
            {/* The one failure mode a form-based opt-out has that a tokenised
                link does not: they type a different address to the one being
                mailed, so the one still receiving mail is never suppressed.
                Naming it here is the only fix available. */}
            <p
              className="mt-3 text-[13.5px] leading-[1.75] max-w-[52ch]"
              style={{ color: 'var(--c4-text-subtle)' }}
            >
              If it reached a shared inbox, that&rsquo;s the one to enter, not
              your personal address.
            </p>

            <form method="POST" action={FN} className="mt-9">
              <label
                htmlFor="unsub-email"
                className="block font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: 'var(--c4-text-subtle)' }}
              >
                Email address
              </label>
              <input
                id="unsub-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@yourschool.wa.edu.au"
                className="mt-3 w-full max-w-[420px] border-0 border-b-2 bg-transparent pb-2 text-[16px] outline-none focus:border-current"
                style={{ borderColor: 'var(--c4-border)', color: 'var(--c4-text)' }}
              />
              <div className="mt-8">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.14em] font-semibold transition-opacity duration-200 hover:opacity-75"
                  style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
                >
                  Take me off the list
                </button>
              </div>
            </form>

            <p
              className="mt-10 pt-7 border-t text-[13.5px] leading-[1.75] max-w-[52ch]"
              style={{ borderColor: 'var(--c4-border)', color: 'var(--c4-text-muted)' }}
            >
              Replying to any email from us with the word STOP does the same
              thing. Either way it is permanent, and it applies across everything
              we send rather than one campaign.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
