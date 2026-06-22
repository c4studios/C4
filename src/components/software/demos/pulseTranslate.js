/**
 * Browser port of the Pulse translator (from the c4-pulse CLI's translate.mjs).
 * Pure JS — turns a list of commit subjects into client-friendly, bucketed
 * highlights. Drives the website demo with no backend.
 */

const CLIENT_TYPES = { feat: 'new', fix: 'fixed', perf: 'improved', revert: 'fixed' };
const INTERNAL_TYPES = new Set(['chore', 'test', 'tests', 'style', 'ci', 'build', 'refactor', 'docs', 'doc', 'deps', 'release']);
const NOISE = /^(merge\b|bump\b|v?\d+\.\d+\.\d+\b|wip\b|initial commit|update readme|typo|lint\b|format\b|cleanup\b|rename\b)/i;

const JARGON = [
  [/\bauthentication\b/gi, 'login'], [/\bauth\b/gi, 'login'],
  [/\bresponsive(ness)?\b/gi, 'mobile layout'], [/\bCSS\b/g, 'styling'],
  [/\bUI\b/g, 'interface'], [/\bUX\b/g, 'experience'],
  [/\bSEO\b/g, 'search-engine visibility'], [/\bCTAs?\b/g, 'buttons'],
  [/\b40[0-9]\b/g, 'error'], [/\b50[0-9]\b/g, 'error'],
  [/\bfavicon\b/gi, 'site icon'], [/\brepo(sitory)?\b/gi, 'project'],
  [/\bdeploys?\b/gi, 'publish'], [/\bdeployment\b/gi, 'publishing'],
  [/\benvironment variables?\b/gi, 'settings'], [/\benv vars?\b/gi, 'settings'],
  [/\bperf\b/gi, 'speed'], [/\bperformance\b/gi, 'speed'],
  [/\ba11y\b/gi, 'accessibility'], [/\bplaceholders?\b/gi, 'placeholder content'],
  [/\bhandoff\b/gi, 'handover'], [/\bscaffold(ing)?\b/gi, 'set up'],
  [/\bspike\b/gi, 'first version'], [/\bwire(d| up)?\b/gi, 'connect'],
];

function clean(subject) {
  let s = subject;
  s = s.replace(/^[\w .]*?\b(M\d+|GUI|v\d+(?:\.\d+)*|phase\s*\d+)\b\s*[—:-]+\s*/i, '');
  s = s.replace(/\s*\(#\d+\)\s*$/, '').replace(/\s*\[[A-Z]+-\d+\]\s*$/, '');
  s = s.replace(/\s*\([^)]*\)\s*$/, '');
  s = s.replace(/`([^`]+)`/g, '$1');
  s = s.replace(/\s+/g, ' ').trim();
  for (const [re, to] of JARGON) s = s.replace(re, to);
  s = s.replace(/\.$/, '');
  if (s) s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

function parseSubject(raw) {
  const m = raw.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);
  if (m) return { type: m[1].toLowerCase(), scope: m[2] ?? null, breaking: !!m[3], subject: m[4].trim(), conventional: true };
  return { type: null, scope: null, breaking: false, subject: raw.trim(), conventional: false };
}

/** Parse a multi-line git log (one subject per line) into a collected object. */
export function parseCommits(text, { project = 'your project', branch = 'main' } = {}) {
  const lines = text.split('\n').map((l) => l.replace(/^[a-f0-9]{6,40}\s+/i, '').trim()).filter(Boolean);
  const commits = lines.map((l) => parseSubject(l));
  return { project, branch, count: commits.length, range: null, commits };
}

function bucketFor(c) {
  if (c.conventional) {
    if (CLIENT_TYPES[c.type]) return CLIENT_TYPES[c.type];
    if (INTERNAL_TYPES.has(c.type)) return 'internal';
    return 'updated';
  }
  if (NOISE.test(c.subject)) return 'internal';
  return 'updated';
}

export function translate(collected) {
  const buckets = { new: [], fixed: [], improved: [], updated: [], breaking: [] };
  let internalCount = 0;
  const seen = new Set();
  for (const c of collected.commits) {
    const b = bucketFor(c);
    if (b === 'internal') { internalCount++; continue; }
    const phrase = clean(c.subject);
    if (!phrase) { internalCount++; continue; }
    const key = `${b}:${phrase.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const item = { phrase };
    buckets[b].push(item);
    if (c.breaking) buckets.breaking.push(item);
  }
  const relevantCount = buckets.new.length + buckets.fixed.length + buckets.improved.length + buckets.updated.length;
  return { ...collected, buckets, internalCount, relevantCount, isQuiet: relevantCount === 0 };
}

export const SECTION_ORDER = [
  { key: 'new', title: 'New' },
  { key: 'fixed', title: 'Fixed' },
  { key: 'improved', title: 'Improved' },
  { key: 'updated', title: 'Updated' },
];
