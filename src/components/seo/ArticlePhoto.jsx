/*
 * A photograph from src/content/seo/photos.js as AVIF with a WebP fallback,
 * at every width scripts/article-photos.mjs cut. Lazy unless told otherwise.
 * The width and height are the crop's, so the box is reserved before the file
 * arrives and nothing below it moves.
 */
import React from 'react';
import { photo } from '@/content/seo/photos';

const FILES = import.meta.glob('./assets/photos/*.{avif,webp}', { eager: true, query: '?url', import: 'default' });
const url = (key, w, ext) => FILES[`./assets/photos/${key}-${w}.${ext}`];
const set = (p, ext) => p.widths.map((w) => `${url(p.key, w, ext)} ${w}w`).join(', ');

export default function ArticlePhoto({ k, alt, sizes, className, eager = false, decorative = false }) {
  const p = photo(k);
  if (!p) return null;
  const fallback = p.widths[Math.min(2, p.widths.length - 1)];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set(p, 'avif')} sizes={sizes} />
      <img
        src={url(p.key, fallback, 'webp')}
        srcSet={set(p, 'webp')}
        sizes={sizes}
        alt={decorative ? '' : (alt ?? p.alt)}
        width={p.size[0]}
        height={p.size[1]}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'auto' : 'async'}
        {...(eager ? { fetchpriority: 'high' } : {})}
      />
    </picture>
  );
}

/* "Photo: Mark König on Unsplash", linked to the photo's own page. */
export function PhotoCredit({ k }) {
  const p = photo(k);
  if (!p) return null;
  return (
    <>
      Photo: <a href={p.page} target="_blank" rel="noopener noreferrer">{p.photographer} on {p.source}</a>
    </>
  );
}
