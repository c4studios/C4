/*
 * The motion assets a case study has, from src/data/portfolioMotion.json:
 * the laptop and phone scroll strips, the grid tile's clip, whether the live
 * site lets itself be framed, and an archived earlier site where one
 * genuinely exists. scripts/capture-motion.mjs writes the file from the live
 * sites; a slug with no entry simply shows none of it.
 *
 * Loaded through a glob so a missing file means "no motion yet" rather than
 * a failed build.
 */
const files = import.meta.glob('../../data/portfolioMotion.json', { eager: true, import: 'default' });
const MOTION = Object.values(files)[0] || {};

export function getMotion(slug) {
  return (slug && MOTION[slug]) || null;
}

/* "2026-10-02" → "2 Oct 2026", without a timezone shift. */
export function shortDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!m) return iso || '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

export function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}
