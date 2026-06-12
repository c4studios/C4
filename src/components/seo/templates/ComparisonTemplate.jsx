import React from 'react';
import { resolveLiveSlugs } from '@/content/seo/registry';
import TemplateShell, { toLinks } from './TemplateShell';

/**
 * Comparison / decision pages — direct answer first, honest comparison,
 * "which is right for you", FAQ, soft CTA. Link hub: related pillars.
 */
export default function ComparisonTemplate({ entry, content }) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: entry.name, path: `/${entry.slug}` },
  ];

  const linkHub = [
    { title: 'Related services', links: toLinks(resolveLiveSlugs(entry.links?.pillars)) },
  ];

  return (
    <TemplateShell
      content={content}
      crumbs={crumbs}
      linkHub={linkHub}
      linkHubLabel="Where to next"
    />
  );
}
