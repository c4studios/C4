import React from 'react';
import { Link } from 'react-router-dom';
import SectionLabel from '@/components/c4/SectionLabel';

/**
 * Internal-link hub rendered near the foot of every SEO page.
 *
 * Receives groups of pre-resolved links: [{ title, links: [{ label, to }] }].
 * Callers build groups from the registry via resolveLiveSlugs(), so links
 * to pages that haven't shipped yet simply don't render — no dead ends
 * while the rollout is mid-flight.
 */
export default function SeoLinkHub({ groups = [], label = 'Keep exploring' }) {
  const visible = groups.filter((g) => g.links && g.links.length > 0);
  if (!visible.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="border-t pt-10" style={{ borderColor: 'var(--c4-border)' }}>
          <div className="mb-8">
            <SectionLabel text={label} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {visible.map((group) => (
              <div key={group.title}>
                <h3 className="text-[10.5px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--c4-text-subtle)' }}>
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-[13px] leading-[1.5] transition-colors duration-300 hover:brightness-125"
                        style={{ color: 'var(--c4-text-muted)' }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
