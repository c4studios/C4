import React from 'react';
import { resolveLiveSlugs } from '@/content/seo/registry';
import TemplateShell, { toLinks } from './TemplateShell';

/**
 * Industry pages — pains → what we build → proof → features → FAQ → CTA
 * (800–1,200 words). Link hub: parent pillar(s) plus the cost guide.
 */
export default function IndustryTemplate({ entry, content }) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: entry.name, path: `/${entry.slug}` },
  ];

  const linkHub = [
    { title: 'The services behind it', links: toLinks(resolveLiveSlugs(entry.links?.pillars)) },
    { title: 'Guides', links: toLinks(resolveLiveSlugs(entry.links?.comparisons)) },
  ];

  return <TemplateShell content={content} crumbs={crumbs} linkHub={linkHub} />;
}
