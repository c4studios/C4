import React, { useEffect, useMemo, useState } from 'react';
import { seoPageBySlug } from '@/content/seo/registry';
import useDocumentHead from '@/hooks/useDocumentHead';
import { localBusinessSchema, serviceSchema, faqSchema, breadcrumbSchema, articleSchema, personSchema } from '@/lib/schema';
import PageNotFound from '@/lib/PageNotFound';
import PillarTemplate from '@/components/seo/templates/PillarTemplate';
import SuburbTemplate from '@/components/seo/templates/SuburbTemplate';
import IndustryTemplate from '@/components/seo/templates/IndustryTemplate';
import ComparisonTemplate from '@/components/seo/templates/ComparisonTemplate';
import ArticleTemplate from '@/components/seo/templates/ArticleTemplate';

// Lazy map of every content module, code-split per page so the 58-page
// rollout adds nothing to the main bundle. Underscore files (the authoring
// template) are excluded.
const contentModules = import.meta.glob(['../content/seo/pages/*.js', '!**/_*']);

/* Content modules already loaded, by slug. main.jsx preloads the module for
   the page being opened before the app's first render, so a prerendered
   article goes straight from its HTML to the same article. Before 12 Oct 2026
   it rendered a blank 60vh box first while the module arrived, and the footer
   jumped to the top and back (CLS 0.64 on an article at 390 wide). */
const loaded = new Map();

export function preloadSeoContent(slug) {
  const loader = contentModules[`../content/seo/pages/${slug}.js`];
  if (!loader || loaded.has(slug)) return Promise.resolve();
  return loader().then((mod) => { loaded.set(slug, mod.default); });
}

const TEMPLATES = {
  pillar: PillarTemplate,
  suburb: SuburbTemplate,
  industry: IndustryTemplate,
  comparison: ComparisonTemplate,
  article: ArticleTemplate,
};

/**
 * Single resolver behind every programmatic SEO route. App.jsx mounts one
 * explicit route per LIVE registry entry pointing here; this component
 * loads the page's content module and renders the template for its type.
 */
export default function SeoPage({ slug }) {
  const entry = seoPageBySlug(slug);
  const loader = contentModules[`../content/seo/pages/${slug}.js`];
  const isLive = Boolean(entry && entry.status === 'live' && loader);

  // Held with its slug, so a route change never renders the last page's content.
  const [held, setHeld] = useState(() => ({ slug, content: loaded.get(slug) ?? null }));
  const content = held.slug === slug ? held.content : (loaded.get(slug) ?? null);

  useEffect(() => {
    let cancelled = false;
    if (!isLive) return undefined;
    const ready = loaded.get(slug);
    if (ready) {
      setHeld((h) => (h.slug === slug && h.content === ready ? h : { slug, content: ready }));
      return undefined;
    }
    loader().then((mod) => {
      loaded.set(slug, mod.default);
      if (!cancelled) setHeld({ slug, content: mod.default });
    });
    return () => { cancelled = true; };
  }, [slug, isLive, loader]);

  const jsonLd = useMemo(() => {
    if (!isLive) return null;

    const crumbs = [{ name: 'Home', path: '/' }];
    if (entry.type === 'suburb') {
      const pillar = seoPageBySlug(entry.pillar);
      if (pillar && pillar.status === 'live') crumbs.push({ name: pillar.name, path: `/${pillar.slug}` });
    }
    crumbs.push({ name: entry.name, path: `/${entry.slug}` });

    const blocks = [localBusinessSchema(), breadcrumbSchema(crumbs)];
    if (entry.type === 'article') {
      // personSchema() has to ship alongside it — articleSchema references the
      // founder by @id, and a dangling @id means Google drops the author.
      blocks.push(personSchema(), articleSchema(entry));
    }
    if (entry.type === 'pillar' || entry.type === 'suburb') {
      blocks.push(serviceSchema({
        name: entry.name,
        description: entry.description,
        url: `/${entry.slug}`,
        serviceType: entry.serviceType,
        areaServed: entry.type === 'suburb'
          ? [entry.shortName, 'Perth', 'Western Australia']
          : undefined,
      }));
    }
    if (content && content.faqs && content.faqs.length) {
      blocks.push(faqSchema(content.faqs));
    }
    return blocks;
  }, [entry, isLive, content]);

  useDocumentHead({
    title: entry && isLive ? entry.title : undefined,
    description: entry && isLive ? entry.description : undefined,
    path: entry ? `/${entry.slug}` : undefined,
    // og:type 'article' is what makes a share render as a piece of writing
    // rather than a generic page, and it is the hook for article:* meta.
    type: entry && entry.type === 'article' ? 'article' : 'website',
    // Articles carry their own share image. Without this every article
    // shares the site-wide og-image.png, so a link posted to LinkedIn or
    // Facebook previews with a generic card unrelated to the piece.
    image: entry && entry.image ? entry.image : undefined,
    jsonLd,
  });

  // Draft entries never get a route, but guard direct renders anyway.
  if (!isLive) return <PageNotFound />;

  const Template = TEMPLATES[entry.type];
  if (!Template || !content) {
    // Content module resolves in a few ms; hold layout height meanwhile.
    return <div style={{ minHeight: '60vh', backgroundColor: 'var(--c4-bg)' }} />;
  }

  return <Template entry={entry} content={content} />;
}
