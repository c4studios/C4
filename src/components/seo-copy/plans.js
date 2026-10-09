/*
 * What the SEO plans say about themselves, read from pricing.js and nowhere
 * else. Every sentence on /seo-and-copywriting that names a plan goes
 * through here, so a feature line that changes or disappears takes the
 * sentence with it.
 */
import { seoPackages } from '@/data/pricing';

export const byKey = Object.fromEntries(seoPackages.map((p) => [p.key, p]));

export const isMonthly = (p) => /\/mo/.test(p.priceLabel || '') || /month/.test(p.priceSuffix || '');
export const MONTHLY = seoPackages.filter(isMonthly);
export const ONE_OFF = seoPackages.filter((p) => !isMonthly(p));

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
export const word = (n) => WORDS[n] || String(n);
export const list = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/* The first feature line of a package matching a pattern, or null. */
export const has = (key, re) => {
  for (const f of (byKey[key] && byKey[key].features) || []) {
    const m = re.exec(f);
    if (m) return m;
  }
  return null;
};

/* The plans that take in a package's work: "Everything in Foundation". */
export function heirsOf(key) {
  const out = [];
  let from = byKey[key];
  while (from) {
    const next = seoPackages.find((p) => (p.features || []).some((f) => f.toLowerCase() === `everything in ${from.name.toLowerCase()}`));
    if (!next) break;
    out.push(next.name);
    from = next;
  }
  return out;
}

/* The package a plan says it includes ("Everything in Growth"), or null. */
export function includes(p) {
  for (const f of p.features || []) {
    const m = /^everything in (.+)$/i.exec(f);
    if (m) return seoPackages.find((q) => q.name.toLowerCase() === m[1].toLowerCase()) || null;
  }
  return null;
}

/* Every plan that does a piece of work: the ones whose own list says it,
   and every plan that includes one of those. */
export function whoDoes(re) {
  const direct = seoPackages.filter((p) => has(p.key, re)).map((p) => p.key);
  return [...new Set(direct.flatMap((k) => [byKey[k].name, ...heirsOf(k)]))];
}

/* "1 new optimised blog post/month" → 1 */
export const postsPerMonth = (p) => {
  for (const f of p.features || []) {
    const m = /^(\d+)\b[^/]*\b(?:posts?|articles?)\b.*month/i.exec(f);
    if (m) return Number(m[1]);
  }
  return 0;
};

/* "min. 3 months" → 3 */
export const minMonths = (p) => {
  const m = /(\d+)\s*months?/i.exec(p.priceSuffix || '');
  return m ? Number(m[1]) : 0;
};

export const money = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
