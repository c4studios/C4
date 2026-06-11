/**
 * useDocumentHead — per-route <title>, meta, link, and JSON-LD management.
 *
 * Sets and reverts: <title>, <meta name="description">, <meta name="robots">,
 * <link rel="canonical">, OpenGraph (og:*), Twitter card tags, and any
 * JSON-LD structured-data blobs the page wants to publish.
 *
 * Designed for the Playwright prerenderer in scripts/prerender.mjs — by the
 * time the page is captured, every tag we set here is in the live <head>.
 */
import { useEffect } from 'react';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  clampDescription,
} from '@/lib/seo';

const MANAGED_ATTR = 'data-c4-managed';

function upsertMeta({ name, property, content, attr = name ? 'name' : 'property' }) {
  if (!content) return null;
  const key = name || property;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

function upsertLink({ rel, href }) {
  if (!href) return null;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return el;
}

function appendJsonLd(json, scripts) {
  if (!json) return;
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.setAttribute(MANAGED_ATTR, 'true');
  // Stringify minified — easier on prerendered HTML weight
  el.textContent = JSON.stringify(json);
  document.head.appendChild(el);
  scripts.push(el);
}

export function useDocumentHead({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
  jsonLd,
} = {}) {
  useEffect(() => {
    const previousTitle = document.title;

    const fullTitle = title
      ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
      : SITE_NAME;
    const desc = clampDescription(description);
    const url = path ? absoluteUrl(path) : SITE_URL;
    const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    // Core meta + canonical
    upsertMeta({ name: 'description', content: desc });
    upsertMeta({ name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' });
    upsertLink({ rel: 'canonical', href: url });

    // Open Graph
    upsertMeta({ property: 'og:type', content: type, attr: 'property' });
    upsertMeta({ property: 'og:site_name', content: SITE_NAME, attr: 'property' });
    upsertMeta({ property: 'og:title', content: fullTitle, attr: 'property' });
    upsertMeta({ property: 'og:description', content: desc, attr: 'property' });
    upsertMeta({ property: 'og:url', content: url, attr: 'property' });
    upsertMeta({ property: 'og:image', content: ogImage, attr: 'property' });
    upsertMeta({ property: 'og:locale', content: 'en_AU', attr: 'property' });

    // Twitter
    upsertMeta({ name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta({ name: 'twitter:title', content: fullTitle });
    upsertMeta({ name: 'twitter:description', content: desc });
    upsertMeta({ name: 'twitter:image', content: ogImage });

    // JSON-LD (clear any previously injected by this hook on remount)
    document.head
      .querySelectorAll(`script[type="application/ld+json"][${MANAGED_ATTR}="true"]`)
      .forEach((n) => n.remove());

    const injectedScripts = [];
    if (Array.isArray(jsonLd)) {
      jsonLd.filter(Boolean).forEach((item) => appendJsonLd(item, injectedScripts));
    } else if (jsonLd) {
      appendJsonLd(jsonLd, injectedScripts);
    }

    return () => {
      document.title = previousTitle;
      injectedScripts.forEach((n) => n.remove());
    };
  }, [
    title,
    description,
    path,
    image,
    type,
    noIndex,
    // jsonLd is referenced as an object; rely on caller stability
    JSON.stringify(jsonLd || null),
  ]);
}

export default useDocumentHead;
