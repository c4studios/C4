import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { liveSeoPages } from '@/content/seo/registry';
import { PROFILES } from '@/lib/seo';
import { PRODUCTS } from '../software/productData';
import C4Logo from './C4Logo';
import C4iWordmark from './C4iWordmark';

const groups = [
  {
    title: 'Studio',
    links: [
      { label: 'About', page: 'About' },
      { label: 'Portfolio', page: 'Portfolio' },
      { label: 'C4 Originals', page: 'Software' },
    ]
  },
  {
    title: 'Services',
    links: [
      { label: 'Web & Applications', page: 'ServiceWeb' },
      { key: 'C4i', label: <C4iWordmark />, page: 'C4i' },
      { label: 'C4 Lens', page: 'Lens' },
      { label: 'C4Sight', page: 'Foresight' },
      // The orphaned Private AI offering now has a crawlable home here.
      { label: 'Private AI', to: '/private-ai' },
      { label: 'Lead Engine', to: '/lead-engine' },
    ]
  },
  {
    title: 'Connect',
    links: [
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
  // "Perth & WA" group: live SEO pillars + the cost guide. Suburb pages
  // interlink contextually on-page instead — three dozen footer links
  // would read as link spam. Hidden entirely until pages go live.
  const seoLinks = liveSeoPages()
    .filter((p) => p.type === 'pillar' || p.slug === 'how-much-does-a-website-cost-perth')
    .map((p) => ({ label: p.name, to: `/${p.slug}` }));

  // Dedicated product sites (each on its own domain/subdomain), sourced from productData.
  const productLinks = PRODUCTS.filter((p) => p.siteUrl).map((p) => ({ label: p.name, href: p.siteUrl }));
  const withProducts = productLinks.length
    ? [...groups, { title: 'Product sites', links: productLinks }]
    : groups;
  const footerGroups = seoLinks.length
    ? [...withProducts, { title: 'Perth & WA', links: seoLinks }]
    : withProducts;

  // Index columns adapt to the live group count. Literal classes so the
  // Tailwind JIT keeps them.
  const n = footerGroups.length;
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
    <footer className="transition-colors duration-200" style={{ backgroundColor: 'var(--c4-footer-bg)' }}>
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
        .c4-foot-link:focus-visible {
          outline: 2px solid var(--c4-ring);
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
            <span
              className="text-[10.5px] uppercase tracking-[0.24em]"
              style={{ color: 'var(--c4-footer-text-dim)' }}
            >
              Studio &amp; Software
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
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          style={{ borderTop: `1px solid ${HAIRLINE_FAINT}` }}
        >
          <span className="text-[10.5px] tabular-nums" style={{ color: 'var(--c4-footer-text-muted)' }}>
            © {new Date().getFullYear()} C4 Studios
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
