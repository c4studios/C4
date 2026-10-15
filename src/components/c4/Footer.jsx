import React from 'react';
import { Link } from '@/components/c4/SiteLink';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { liveSeoPages } from '@/content/seo/registry';
import { C4SITE, ORG_INFO, PROFILES, PHONE } from '@/lib/seo';
import { usePrerendered } from '@/lib/hydration';
import C4Logo from './C4Logo';

const groups = [
  {
    title: 'Studio',
    links: [
      { label: 'About', page: 'About' },
      { label: 'Portfolio', page: 'Portfolio' },
      // The pledge had ZERO inbound internal links after launch (routing audit,
      // 2026-08-01) — a published position statement nobody could click to.
      // The footer link puts it one click from every page.
      { label: 'How we use AI', to: '/how-we-use-ai' },
      { label: 'Articles', to: '/insights' },
    ]
  },
  {
    title: 'Services',
    links: [
      { label: 'Web & Applications', page: 'ServiceWeb' },
      { label: 'C4 Lens', page: 'Lens' },
      { label: 'SEO & Copywriting', page: 'SeoCopy' },
      // The fourth arm from 9 Oct 2026.
      { label: 'Logo Design', page: 'LogoDesign' },
      // C4i, Private AI and Lead Engine went to C4Site on 9 Oct 2026. The
      // "C4Site, by C4" link (D2) sat here until 15 Oct 2026; it's the
      // Sister business entry at the end of the index now, so this list is
      // only what C4 Studios sells.
    ]
  },
  {
    title: 'Connect',
    links: [
      { label: 'Contact', page: 'Contact' },
      { label: 'Start a Project', page: 'StartProject' },
      { label: 'Support', page: 'Support' },
      // Sourced from PROFILES so the visible links and the sameAs entity
      // anchors can never point at different accounts.
      { label: 'Instagram', href: PROFILES.instagram },
      { label: 'LinkedIn', href: PROFILES.linkedinCompany },
      { label: 'GitHub', href: PROFILES.github },
    ]
  }
];

const HAIRLINE = 'rgba(255, 255, 255, 0.08)';
const HAIRLINE_FAINT = 'rgba(255, 255, 255, 0.06)';

export default function Footer() {
  // The year the page was prerendered while it hydrates, then today's.
  const year = usePrerendered('year', new Date().getFullYear());

  // "Perth & WA" group: live SEO pillars + the cost guide. Suburb pages
  // interlink contextually on-page instead — three dozen footer links
  // would read as link spam. Hidden entirely until pages go live.
  const seoLinks = liveSeoPages()
    .filter((p) => p.type === 'pillar' || p.slug === 'how-much-does-a-website-cost-perth')
    .map((p) => ({ label: p.name, to: `/${p.slug}` }));

  const footerGroups = seoLinks.length
    ? [...groups, { title: 'Perth & WA', links: seoLinks }]
    : groups;

  // Index columns adapt to the live group count, plus one for the Sister
  // business entry. Literal classes so the Tailwind JIT keeps them.
  const n = footerGroups.length + 1;
  const lgCols = n >= 5 ? 'lg:grid-cols-5' : n === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  const renderLink = (l) => {
    if (l.to) {
      return (
        <Link to={l.to} className="c4-foot-link" style={{ color: 'var(--c4-footer-text)' }}>
          {l.label}
        </Link>
      );
    }
    if (l.href) {
      return (
        <a
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="c4-foot-link inline-flex items-center gap-1.5"
          style={{ color: 'var(--c4-footer-text)' }}
        >
          {l.label}
          <ArrowUpRight size={11} strokeWidth={1.8} />
        </a>
      );
    }
    return (
      <Link to={createPageUrl(l.page)} className="c4-foot-link" style={{ color: 'var(--c4-footer-text)' }}>
        {l.label}
      </Link>
    );
  };

  return (
    <footer className="c4-site-foot transition-colors duration-200" style={{ backgroundColor: 'var(--c4-footer-bg)' }}>
      <style>{`
        .c4-foot-link {
          font-size: 12.5px;
          line-height: 1.5;
          transition: color 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .c4-foot-link:hover { color: var(--c4-footer-text-hover, #ECE7DE) !important; }
        @media (hover: hover) {
          .c4-foot-link:hover { transform: translateX(2px); }
        }
        /* The footer is dark in both themes, so the ring is light here.
           It was --c4-ring, which in the light theme is ink at 40% and
           didn't show on #1A1A1A at all (found 9 Oct 2026). */
        .c4-site-foot a:focus-visible {
          outline: 2px solid #ECE7DE;
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Masthead — the studio imprint */}
        <div
          className="pt-14 md:pt-20 pb-9 md:pb-11 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div className="max-w-[300px]">
            <C4Logo size={56} variant="full" context="footer" />
            <p className="mt-5 text-[12.5px] leading-[1.65]" style={{ color: 'var(--c4-footer-text-dim)' }}>
              Design and development studio building premium digital products.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1.5">
            <span
              className="text-[10.5px] uppercase tracking-[0.24em] tabular-nums"
              style={{ color: 'var(--c4-footer-text)' }}
            >
              Perth · Western Australia
            </span>
            <a
              href={`tel:${PHONE.e164}`}
              className="text-[13px] tabular-nums tracking-[0.02em] py-1 hover:underline underline-offset-4"
              style={{ color: 'var(--c4-footer-text)' }}
            >
              {PHONE.display}
            </a>
            {/* Logos joined on 9 Oct 2026, and the line no longer fits a
                tablet or a phone, so below lg it breaks after Photography
                rather than leaving a dot at the end of a line. */}
            <span
              className="text-[10.5px] uppercase tracking-[0.24em] leading-[1.7] md:text-right"
              style={{ color: 'var(--c4-footer-text-dim)' }}
            >
              Web · Software · Photography<span className="hidden lg:inline"> · </span><br className="lg:hidden" />SEO · Logos
            </span>
          </div>
        </div>

        {/* Index — the back matter, ruled like a colophon */}
        <div className={`py-12 md:py-14 grid grid-cols-2 sm:grid-cols-3 ${lgCols} gap-x-6 gap-y-11`}>
          {footerGroups.map(g => (
            <div key={g.title} className="pt-4" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
              <h4
                className="text-[10.5px] uppercase tracking-[0.22em] font-medium mb-4"
                style={{ color: 'var(--c4-footer-text-muted)' }}
              >
                {g.title}
              </h4>
              <ul className="space-y-2.5">
                {g.links.map(l => (
                  <li key={l.key || l.page || l.to || l.href || l.label}>
                    {renderLink(l)}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* The sister business, last in the index (15 Oct 2026, Caleb: the
              site can point to C4Site's work and link to it). The link keeps
              its D2 wording. The sentence is C4Site's own, from C4SITE in
              src/lib/seo.js, and nothing else is said about it. It takes
              the full width on a phone so the sentence doesn't run down a
              half column. */}
          <div className="col-span-2 sm:col-span-1 pt-4" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            <h4
              className="text-[10.5px] uppercase tracking-[0.22em] font-medium mb-4"
              style={{ color: 'var(--c4-footer-text-muted)' }}
            >
              Sister business
            </h4>
            {renderLink({ label: 'C4Site, by C4', href: C4SITE.url })}
            <p className="mt-3 max-w-[46ch] text-[12px] leading-[1.6]" style={{ color: 'var(--c4-footer-text-dim)' }}>
              {C4SITE.description}
            </p>
          </div>
        </div>

        {/* Bottom bar. Its foot keeps clear of the fixed Support pill
            (18px from the corner, 44px tall), which used to sit over
            "Available worldwide" at the end of every page on any window
            under about 1430px wide. */}
        <div
          className="pt-5 pb-[76px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          style={{ borderTop: `1px solid ${HAIRLINE_FAINT}` }}
        >
          {/* The ABN went public on 15 Oct 2026, at Caleb's say-so. */}
          <span className="text-[10.5px] tabular-nums" style={{ color: 'var(--c4-footer-text-muted)' }}>
            © {year} C4 Studios{' '}<span aria-hidden="true">·</span>{' '}
            <span className="whitespace-nowrap">ABN {ORG_INFO.abn}</span>
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to={createPageUrl('PrivacyPolicy')} className="text-[10.5px] transition-colors duration-300 hover:brightness-150" style={{ color: 'var(--c4-footer-text)' }}>
              Privacy Policy
            </Link>
            <Link to={createPageUrl('TermsOfService')} className="text-[10.5px] transition-colors duration-300 hover:brightness-150" style={{ color: 'var(--c4-footer-text)' }}>
              Terms of Service
            </Link>
            <span className="text-[10.5px]" style={{ color: 'var(--c4-footer-text-muted)' }}>Available worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
