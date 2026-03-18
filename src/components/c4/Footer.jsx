import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import C4Logo from './C4Logo';

const groups = [
  {
    title: 'Studio',
    links: [
      { label: 'About', page: 'About' },
      { label: 'Services', page: 'Services' },
      { label: 'Portfolio', page: 'Portfolio' },
    ]
  },
  {
    title: 'Initiatives',
    links: [
      { label: 'Ventures', page: 'Ventures' },
      { label: 'Rebuild', page: 'Rebuild' },
      { label: 'C4 Lens', page: 'Lens' },
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
  return (
    <footer className="transition-colors duration-200" style={{ backgroundColor: 'var(--c4-footer-bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="py-14 md:py-18 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <C4Logo size={56} variant="full" context="footer" />
            <p className="mt-4 text-[12.5px] leading-[1.6] max-w-[220px]" style={{ color: 'var(--c4-footer-text-dim)' }}>
              Design and development studio building premium digital products.
            </p>
          </div>

          {groups.map(g => (
            <div key={g.title}>
              <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--c4-footer-text-muted)' }}>{g.title}</h4>
              <ul className="space-y-2">
                {g.links.map(l => (
                  <li key={l.label}>
                    {l.href ? (
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

        <div className="border-t py-5 flex justify-between items-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="text-[10.5px]" style={{ color: 'var(--c4-footer-text-muted)' }}>© {new Date().getFullYear()} C4 Studios</span>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Terms')} className="text-[10.5px] transition-colors duration-300 hover:brightness-150" style={{ color: 'var(--c4-footer-text-muted)' }}>
              Terms & Conditions
            </Link>
            <span className="text-[10.5px]" style={{ color: 'var(--c4-footer-text-muted)' }}>Available worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}