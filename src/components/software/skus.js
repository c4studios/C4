/**
 * skus.js — presentational catalogue metadata for the C4 Works Register.
 *
 * IMPORTANT: everything here is DISPLAY-ONLY. Model designations
 * (C4-QTR-01) and barcode patterns are derived, decorative strings — a
 * line-sheet conceit layered on top of the real product data. They are
 * NEVER written into productData.js, never injected into jsonLd, and carry
 * no semantic weight for crawlers (barcodes render aria-hidden). This keeps
 * the read-only data source and structured data untouched while giving the
 * register its "manufactured unit" voice.
 */

// Curated three-letter unit codes + stable two-digit index, keyed by the
// product slug from productData.js. Numbers follow catalogue order; the
// internal studio system takes 00.
const SKU_MAP = {
  quotr: { code: 'QTR', no: '01' },
  returndesk: { code: 'RTD', no: '02' },
  reviewloop: { code: 'RVL', no: '03' },
  complia: { code: 'CMP', no: '04' },
  rebook: { code: 'RBK', no: '05' },
  crewcheck: { code: 'CRW', no: '06' },
  safedraft: { code: 'SWD', no: '07' },
  nudge: { code: 'NDG', no: '08' },
  firmflow: { code: 'FMF', no: '09' },
  sweep: { code: 'SWP', no: '10' },
  handover: { code: 'HND', no: '11' },
  pulse: { code: 'PLS', no: '12' },
  'c4-command': { code: 'CMD', no: '00' },
};

// Fallback derivation for any slug not in the curated map, so a future
// product never renders a broken designation.
function deriveCode(slug) {
  const letters = String(slug || '')
    .replace(/[^a-z]/gi, '')
    .toUpperCase();
  return (letters.slice(0, 3) || 'C4X').padEnd(3, 'X');
}

export function skuFor(slug) {
  return SKU_MAP[slug] || { code: deriveCode(slug), no: '—' };
}

/** Full model designation, e.g. "C4-QTR-01". Presentational only. */
export function modelFor(slug) {
  const { code, no } = skuFor(slug);
  return `C4-${code}-${no}`;
}

// Deterministic string hash → seed for the barcode PRNG, so a given slug
// always renders the same bars (no hydration drift between prerender and
// client).
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic bar layout for a decorative barcode. Returns an array of
 * { x, w } bar rectangles laid across a `width`-unit track (dark bars only;
 * gaps are the paper between them). Encodes nothing — purely a texture that
 * reads as a product barcode.
 */
export function barcodeBars(slug, width = 132) {
  const rand = mulberry32(hashSeed(String(slug || 'c4')));
  const bars = [];
  let x = 0;
  // Fixed quiet zones at each end keep it reading as a real barcode.
  x += 4;
  while (x < width - 4) {
    const bar = 1 + Math.floor(rand() * 3); // 1–3 unit bar
    const gap = 1 + Math.floor(rand() * 3); // 1–3 unit gap
    if (x + bar > width - 4) break;
    bars.push({ x, w: bar });
    x += bar + gap;
  }
  return bars;
}
