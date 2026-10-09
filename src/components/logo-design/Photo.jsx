/*
 * A photograph from photos.js as AVIF with a WebP fallback, at every width
 * scripts/logo-photos.mjs cut. Lazy unless told otherwise; the width and
 * height are the crop's, so the box is reserved before it loads.
 */
import { photo } from './photos';

const FILES = import.meta.glob('./assets/photos/*.{avif,webp}', { eager: true, query: '?url', import: 'default' });
const url = (key, w, ext) => FILES[`./assets/photos/${key}-${w}.${ext}`];
const set = (p, ext) => p.widths.map((w) => `${url(p.key, w, ext)} ${w}w`).join(', ');

export default function Photo({ k, alt, sizes, className, eager = false }) {
  const p = photo(k);
  if (!p) return null;
  const mid = p.widths[Math.min(1, p.widths.length - 1)];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set(p, 'avif')} sizes={sizes} />
      <img
        src={url(p.key, mid, 'webp')}
        srcSet={set(p, 'webp')}
        sizes={sizes}
        alt={alt}
        width={p.size[0]}
        height={p.size[1]}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}

/* "Photo: Amo Journey on Unsplash", linked to the photo's own page */
export function Credit({ k }) {
  const p = photo(k);
  if (!p) return null;
  return (
    <>
      Photo: <a href={p.page} target="_blank" rel="noopener noreferrer">{p.photographer} on Unsplash</a>
    </>
  );
}
