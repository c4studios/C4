/**
 * RegisterUI — the shared "manufactured unit" primitives for the C4 Works
 * Register (Software list, product datasheet, home register).
 *
 * Everything here is presentational. Model designations and barcodes are
 * DECORATIVE strings derived in skus.js — never written to productData.js,
 * never injected into jsonLd. Barcodes are aria-hidden (they encode nothing);
 * the model designation is a visible catalogue label with no semantic weight.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { modelFor, barcodeBars } from './skus';

/**
 * One CTA, three link shapes, destinations preserved byte-exact:
 * - external signup / Stripe / product site → new tab
 * - internal route (starts with "/") → <Link>, no full-page reload
 * - mailto: → plain anchor
 */
export function CtaLink({ product, className = '', style, children }) {
  const { ctaHref, ctaExternal } = product;
  if (ctaExternal) {
    return (
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  if (ctaHref.startsWith('/')) {
    return (
      <Link to={ctaHref} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a href={ctaHref} className={className} style={style}>
      {children}
    </a>
  );
}

/**
 * Decorative product barcode. `width` is BOTH the SVG viewBox width and the
 * rendered CSS px width (the class sets the box size to the same number), so
 * the scanline can traverse exactly one box width. aria-hidden — encodes
 * nothing.
 */
export function Barcode({ slug, width = 132, height = 30, className = '', scan = false }) {
  const bars = barcodeBars(slug, width);
  return (
    <span className={`sw-barcode ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="presentation">
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y="0" width={b.w} height={height} />
        ))}
      </svg>
      {scan && <span className="sw-scan" style={{ '--sw-scan-w': `${width}px` }} />}
    </span>
  );
}

/** The red rubber-stamped status mark. Pre-stamped at rest; armed entrance is
 *  an ink-bleed opacity pass only (no scale, no rotation, no thump). */
export function StatusStamp({ status, className = '' }) {
  return (
    <span className={`sw-stamp ${className}`} data-reveal>
      {String(status || '').toUpperCase()}
    </span>
  );
}

/** Logo tile on the product's own brand background. */
export function LogoChip({ product, className = '' }) {
  return (
    <span className={`sw-chip ${className}`} style={{ backgroundColor: product.logoBg }}>
      <img src={product.logo} alt={`${product.name} logo`} loading="lazy" draggable="false" />
    </span>
  );
}

/** Model designation string, e.g. "C4-QTR-01" (presentational). */
export function Model({ slug, className = '' }) {
  return <span className={`sw-model ${className}`}>{modelFor(slug)}</span>;
}
