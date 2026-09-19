import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import IMAGE_MANIFEST from '@/data/imageManifest.json';

/* WebP copies sit beside the PNG screenshots (scripts/make-webp.mjs). A PNG
   listed in the manifest is served as a <picture>: an 800 px WebP for tiles
   and phones, the full-size WebP for wide screens and the lightbox, the PNG
   as the fallback. Width and height come from the manifest so the page does
   not shift as images arrive. */
const webpSet = (src) => {
  const entry = IMAGE_MANIFEST[src];
  if (!entry) return null;
  const base = src.replace(/\.png$/i, '');
  const set = entry.small ? `${base}-800.webp 800w, ${base}.webp ${entry.w}w` : `${base}.webp ${entry.w}w`;
  return { set, w: entry.w, h: entry.h };
};

/* A plain <img> with the same WebP treatment, for covers and preview strips
   that do not need PortfolioMedia's placeholder. Lazy unless `priority`. */
export function WebpImg({ src, sizes = '(min-width: 1024px) 33vw, 100vw', priority = false, ...rest }) {
  const webp = typeof src === 'string' ? webpSet(src) : null;
  const img = (
    <img
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(webp ? { width: webp.w, height: webp.h } : {})}
      {...rest}
      src={src}
    />
  );
  if (!webp) return img;
  return (
    <picture className="contents">
      <source type="image/webp" srcSet={webp.set} sizes={sizes} />
      {img}
    </picture>
  );
}

export default function PortfolioMedia({
  src,
  alt,
  title,
  message,
  meta = [],
  className = '',
  imageClassName = '',
  placeholderClassName = '',
  compact = false,
  children,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  ...imgProps
}) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`.trim()}>
      {!failed ? (
        (() => {
          const webp = typeof src === 'string' ? webpSet(src) : null;
          const img = (
            <img
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              {...(webp ? { width: webp.w, height: webp.h } : {})}
              {...imgProps}
              src={src}
              alt={alt}
              className={`h-full w-full object-cover ${imageClassName}`.trim()}
              onError={() => setFailed(true)}
            />
          );
          if (!webp) return img;
          return (
            <picture className="contents">
              <source type="image/webp" srcSet={webp.set} sizes={sizes} />
              {img}
            </picture>
          );
        })()
      ) : (
        <div
          className={`h-full w-full ${compact ? 'px-4 py-4' : 'px-5 py-5 md:px-7 md:py-7'} ${placeholderClassName}`.trim()}
          style={{ backgroundColor: 'var(--c4-bg-alt)' }}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {meta.map((item) => (
                <span
                  key={item}
                  className={`rounded-[2px] px-2.5 py-[3px] ${compact ? 'text-[8.5px]' : 'text-[9px]'} uppercase tracking-[0.14em] font-medium`}
                  style={{
                    color: 'var(--c4-text-subtle)',
                    backgroundColor: 'var(--c4-card-bg)',
                    border: '1px solid var(--c4-border-light)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div
                className={`mb-4 flex items-center justify-center rounded-full ${compact ? 'h-11 w-11' : 'h-12 w-12'}`}
                style={{
                  backgroundColor: 'var(--c4-card-bg)',
                  border: '1px solid var(--c4-border)',
                }}
              >
                <ImageIcon
                  size={compact ? 18 : 22}
                  strokeWidth={1.25}
                  style={{ color: 'var(--c4-text-subtle)' }}
                />
              </div>

              {title && (
                <span
                  className={`${compact ? 'text-[10px]' : 'text-[11px]'} uppercase tracking-[0.18em] font-medium`}
                  style={{ color: 'var(--c4-text)' }}
                >
                  {title}
                </span>
              )}

              {message && (
                <span
                  className={`mt-2 ${compact ? 'text-[10px]' : 'text-[11px]'} leading-[1.5]`}
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  {message}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
