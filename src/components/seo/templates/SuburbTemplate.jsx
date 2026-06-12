import React from 'react';
import { resolveLiveSlugs, seoPageBySlug } from '@/content/seo/registry';
import TemplateShell, { toLinks } from './TemplateShell';

/**
 * Suburb pages — [Service] in [Suburb] (500–800 words). Link hub: up to its
 * pillar, sideways to neighbouring suburbs (same service), across to one or
 * two industry pages that fit the area's business character.
 */
export default function SuburbTemplate({ entry, content }) {
  const pillar = seoPageBySlug(entry.pillar);
  const pillarLive = pillar && pillar.status === 'live';

  const crumbs = [
    { name: 'Home', path: '/' },
    ...(pillarLive ? [{ name: pillar.name, path: `/${pillar.slug}` }] : []),
    { name: entry.name, path: `/${entry.slug}` },
  ];

  const linkHub = [
    { title: 'The full service', links: pillarLive ? toLinks([pillar]) : [] },
    { title: `${entry.serviceLabel} nearby`, links: toLinks(resolveLiveSlugs(entry.links?.neighbours), { short: true }) },
    { title: 'Industries we build for', links: toLinks(resolveLiveSlugs(entry.links?.industries)) },
  ];

  return <TemplateShell content={content} crumbs={crumbs} linkHub={linkHub} />;
}
