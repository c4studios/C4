import React from 'react';
import { resolveLiveSlugs, suburbChildrenOf } from '@/content/seo/registry';
import TemplateShell, { toLinks } from './TemplateShell';

/**
 * Pillar pages — the six head-term service pages (1,200–1,800 words).
 * Link hub: every live suburb child, related industries, related guides,
 * sibling services.
 */
export default function PillarTemplate({ entry, content }) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: entry.name, path: `/${entry.slug}` },
  ];

  const suburbs = suburbChildrenOf(entry.slug).filter((p) => p.status === 'live');
  const linkHub = [
    { title: 'Areas we serve', links: toLinks(suburbs, { short: true }) },
    { title: 'Industries we build for', links: toLinks(resolveLiveSlugs(entry.links?.industries)) },
    { title: 'Guides', links: toLinks(resolveLiveSlugs(entry.links?.comparisons)) },
    { title: 'Related services', links: toLinks(resolveLiveSlugs(entry.links?.pillars)) },
  ];

  return <TemplateShell content={content} crumbs={crumbs} linkHub={linkHub} />;
}
