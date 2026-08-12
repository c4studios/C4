import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import useDocumentHead from '@/hooks/useDocumentHead';

/* Where the unsubscribe link lands.
 *
 * The Supabase `unsubscribe` function does the actual opt-out, then redirects
 * here with ?s=<state>&u=<token>. This page only reports what happened and
 * offers the undo, because mail scanners prefetch links and can opt someone out
 * who never clicked.
 *
 * Deliberately noindex and kept out of the sitemap: it is a utility page, and a
 * search result for it would be worse than useless. It is still prerendered so
 * the URL resolves as a static file on Cloudflare Pages.
 *
 * The static snapshot renders the 'pending' state. A real visitor always
 * arrives with the query string, so the first client render is already correct. */

const FN = 'https://hauwhplevypinplfbbgh.supabase.co/functions/v1/unsubscribe';

function readState() {
  if (typeof window === 'undefined') return { s: 'pending', u: '' };
  const q = new URLSearchParams(window.location.search);
  return { s: q.get('s') || 'pending', u: q.get('u') || '' };
}

const COPY = {
  done: {
    title: 'Done. You’re off the list.',
    body: 'You won’t get any more emails from me about the C4Sight schools programme. Nothing else needed from you.',
  },
  undone: {
    title: 'You’re back on the list.',
    body: 'The unsubscribe has been reversed. If that wasn’t what you wanted, use the link in any email again.',
  },
  badlink: {
    title: 'That link didn’t work.',
    body: 'It may have expired or been cut in half by an email client. Reply to any email from me with the word STOP and I’ll take you off manually, same result.',
  },
  error: {
    title: 'Something went wrong at my end.',
    body: 'Reply to any email from me with the word STOP and I’ll take you off manually. That always works.',
  },
  pending: {
    title: 'One moment.',
    body: 'Checking that link.',
  },
};

export default function Unsubscribed() {
  const [{ s, u }] = React.useState(readState);
  const copy = COPY[s] || COPY.badlink;

  useDocumentHead({
    title: 'Unsubscribed — C4 Studios',
    description: 'Email preferences for C4 Studios outreach.',
    path: '/unsubscribed',
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
              {copy.title}
            </h1>
            <p
              className="mt-5 text-[15.5px] leading-[1.8] max-w-[52ch]"
              style={{ color: 'var(--c4-text-muted)' }}
            >
              {copy.body}
            </p>

            {s === 'done' && u && (
              <p className="mt-4 text-[14px] leading-[1.7]" style={{ color: 'var(--c4-text-muted)' }}>
                Didn’t mean to click that?{' '}
                <a
                  href={`${FN}?u=${encodeURIComponent(u)}&undo=1`}
                  className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--c4-accent)' }}
                >
                  Put me back on
                </a>
                .
              </p>
            )}

            {/* Two free things, no pitch attached. Anyone who unsubscribed has
                earned the right not to be sold to on the way out. */}
            <div
              className="mt-12 pt-8 border-t"
              style={{ borderColor: 'var(--c4-border)' }}
            >
              <p className="text-[14px] leading-[1.75]" style={{ color: 'var(--c4-text-muted)' }}>
                While you’re here, two things that stay free and need no email address.
              </p>
              <div className="mt-6 flex flex-col gap-4">
                <Link
                  to="/c4sight-previews"
                  className="group inline-flex items-baseline gap-2 text-[15px] font-semibold tracking-[-0.01em] transition-opacity hover:opacity-70"
                  style={{ color: 'var(--c4-text)' }}
                >
                  The classroom activity packs
                  <ArrowUpRight size={14} strokeWidth={2.4} style={{ color: 'var(--c4-accent)' }} />
                </Link>
                <p className="text-[13.5px] leading-[1.7] -mt-2" style={{ color: 'var(--c4-text-muted)' }}>
                  Run by your own teacher, no devices and no student data. Yours to keep.
                </p>

                <Link
                  to="/how-we-use-ai"
                  className="group mt-3 inline-flex items-baseline gap-2 text-[15px] font-semibold tracking-[-0.01em] transition-opacity hover:opacity-70"
                  style={{ color: 'var(--c4-text)' }}
                >
                  Where we stand on AI
                  <ArrowUpRight size={14} strokeWidth={2.4} style={{ color: 'var(--c4-accent)' }} />
                </Link>
                <p className="text-[13.5px] leading-[1.7] -mt-2" style={{ color: 'var(--c4-text-muted)' }}>
                  The full position, including the bit about AI detectors not working.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
