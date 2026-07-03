import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { liveSeoPages } from '@/content/seo/registry';
import { PRODUCTS } from '../software/productData';
import C4Logo from './C4Logo';

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
      { label: 'Brand & Growth', page: 'ServiceBrand' },
      { label: 'AI & Software', page: 'ServiceAI' },
      { label: 'C4 Lens', page: 'Lens' },
      { label: 'C4Sight', page: 'Foresight' },
      { label: 'Lead Engine', to: '/lead-engine' },
    ]
  },
  {
    title: 'Initiatives',
    links: [
      { label: 'Ventures', page: 'Ventures' },
      { label: 'Rebuild', page: 'Rebuild' },
    ]
  },
  {
    title: 'Connect',
    links: [
      { label: 'Start a Project', page: 'StartProject' },
      { label: 'Support', page: 'Support' },
      { label: 'Instagram', href: 'https://www.instagram.com/c4.studio/' },
    ]
  }
];

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

  // Columns = logo + each group. Literal classes so Tailwind JIT picks them up.
  const colCount = 1 + footerGroups.length;
  const gridCols = colCount >= 7 ? 'md:grid-cols-7' : colCount === 6 ? 'md:grid-cols-6' : 'md:grid-cols-5';

  return (
    <footer className="transition-colors duration-200" style={{ backgroundColor: 'var(--c4-footer-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className={`py-14 md:py-18 grid grid-cols-2 gap-10 md:gap-6 ${gridCols}`}>
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <C4Logo size={56} variant="full" context="footer" />
            <p className="mt-4 text-[12.5px] leading-[1.6] max-w-[220px]" style={{ color: 'var(--c4-footer-text-dim)' }}>
              Design and development studio building premium digital products.
            </p>
          </div>

          {footerGroups.map(g => (
            <div key={g.title}>
              <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--c4-footer-text-muted)' }}>{g.title}</h4>
              <ul className="space-y-2">
                {g.links.map(l => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-[12.5px] transition-colors duration-300 hover:brightness-150"
                        style={{ color: 'var(--c4-footer-text)' }}
                      >
                        {l.label}
                      </Link>
                    ) : l.href ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12.5px] transition-colors duration-300 hover:brightness-150"
                        style={{ color: 'var(--c4-footer-text)' }}
                      >
                        {l.label}
                        <ArrowUpRight size={11} strokeWidth={1.8} />
                      </a>
                    ) : (
                      <Link
                        to={createPageUrl(l.page)}
                        className="text-[12.5px] transition-colors duration-300 hover:brightness-150"
                        style={{ color: 'var(--c4-footer-text)' }}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="text-[10.5px]" style={{ color: 'var(--c4-footer-text-muted)' }}>© {new Date().getFullYear()} C4 Studios</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to={createPageUrl('PrivacyPolicy')} className="text-[10.5px] transition-colors duration-300 hover:brightness-150" style={{ color: 'var(--c4-footer-text-muted)' }}>
              Privacy Policy
            </Link>
            <Link to={createPageUrl('TermsOfService')} className="text-[10.5px] transition-colors duration-300 hover:brightness-150" style={{ color: 'var(--c4-footer-text-muted)' }}>
              Terms of Service
            </Link>
            <span className="text-[10.5px]" style={{ color: 'var(--c4-footer-text-muted)' }}>Available worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
