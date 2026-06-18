/**
 * Browser port of the Sweep grouping engine (from the c4-sweep CLI's group.mjs).
 * Pure JS, no Node, no filesystem — it operates on an in-memory list of items
 * so the website demo runs the real heuristics with zero backend.
 *
 * Each item: { name, isDir, bytes, kind, lastTouchedMs, createdMs,
 *              looksLikeProject?, placeholder? }
 */

const DAY = 86_400_000;

const COPY_MARKERS = [
  / - copy(?: \(\d+\))?$/i,
  /\s*\(\d+\)$/,
  /[-_ ]copy$/i,
  /[-_ ]backup(?:[-_]\d+)*$/i,
  /\.backup-[\d-]+$/i,
  /[-_ ]bak$/i,
  /[-_ ]v\d+$/i,
  /[-_ ]version[-_ ]?\d*$/i,
  /[-_ ](final|fixed|draft|old|new|latest|edited|revised|updated|copy)$/i,
  /[-_ .]\d{8}(?:[-_ t]\d{6})?$/i,
  /[-_ ]\d{4}[-_]\d{2}[-_]\d{2}$/,
  / \d{1,3}$/,
];

const COPY_ONLY_MARKERS = [
  / - copy(?: \(\d+\))?$/i, /\s*\(\d+\)$/, /[-_ ]copy$/i,
  /[-_ ]backup(?:[-_]\d+)*$/i, /\.backup-[\d-]+$/i, /[-_ ]bak$/i,
];

function stripExt(name, isDir) {
  if (isDir) return name;
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
}

function stem(name, isDir) {
  let s = stripExt(name, isDir);
  let changed = true;
  while (changed) {
    changed = false;
    for (const re of COPY_MARKERS) {
      const next = s.replace(re, '');
      if (next !== s && next.trim().length >= 2) { s = next.trim(); changed = true; }
    }
  }
  return s.trim();
}

function tokens(name, isDir) {
  return stripExt(name, isDir).toLowerCase().split(/[\s\-_.]+/).filter(Boolean);
}

function copyMarkerCount(name) {
  let n = 0;
  for (const re of COPY_ONLY_MARKERS) if (re.test(name)) n++;
  return n;
}

function versionNum(name) {
  const m = name.match(/[-_ ]v(\d+)(?:\.\w+)?$/i);
  return m ? Number(m[1]) : 0;
}

function keepCompare(a, b) {
  const va = versionNum(a.name), vb = versionNum(b.name);
  if (va !== vb) return vb - va;
  const ca = copyMarkerCount(a.name), cb = copyMarkerCount(b.name);
  if (ca !== cb) return ca - cb;
  if (b.lastTouchedMs !== a.lastTouchedMs) return b.lastTouchedMs - a.lastTouchedMs;
  return a.name.length - b.name.length;
}

export const human = (bytes) => {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
};

export function daysAgo(ms, now) { return Math.floor((now - ms) / DAY); }

function ageRange(members, now) {
  const ds = members.map((m) => daysAgo(m.lastTouchedMs, now));
  const min = Math.min(...ds), max = Math.max(...ds);
  if (max < 1) return 'today';
  if (min === max) return `${min}d ago`;
  return `${min}–${max}d ago`;
}

export function buildDeck(scan) {
  const now = scan.scannedAt;
  const claimed = new Set();
  const cards = [];
  const unclaimed = () => scan.items.filter((it) => !claimed.has(it.path));
  const claim = (members) => members.forEach((m) => claimed.add(m.path));

  // 1 — copy families
  {
    const groups = new Map();
    for (const it of scan.items) {
      const key = stem(it.name, it.isDir).toLowerCase();
      if (key.length < 3) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    }
    for (const [, members] of groups) {
      if (members.length < 2) continue;
      claim(members);
      const sorted = [...members].sort(keepCompare);
      const newest = sorted[0];
      const total = members.reduce((a, b) => a + b.bytes, 0);
      cards.push({
        heuristic: 'copy-family',
        title: `${members.length} versions of “${stem(newest.name, newest.isDir)}”`,
        members: sorted, bytes: total, reclaimable: total - newest.bytes,
        keepHint: newest, confidence: 'high',
        suggestion: `Keep “${newest.name}”, archive the other ${members.length - 1}.`,
        meta: { ageRange: ageRange(members, now) },
      });
    }
  }

  // 2 — variant families (shared 3-token prefix)
  {
    const groups = new Map();
    for (const it of unclaimed()) {
      const tks = tokens(it.name, it.isDir);
      if (tks.length < 3) continue;
      const key = tks.slice(0, 3).join(' ');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    }
    for (const [key, members] of groups) {
      if (members.length < 2) continue;
      claim(members);
      const sorted = [...members].sort(keepCompare);
      const total = members.reduce((a, b) => a + b.bytes, 0);
      cards.push({
        heuristic: 'variant-family',
        title: `${members.length} items starting “${key}…”`,
        members: sorted, bytes: total, reclaimable: total - sorted[0].bytes,
        keepHint: sorted[0], confidence: 'medium',
        suggestion: 'These look like variants of one thing. Likely keep newest, archive the rest.',
        meta: { ageRange: ageRange(members, now) },
      });
    }
  }

  // 3 — saved web-page bundles
  {
    const bundles = [];
    const dirsByBase = new Map();
    for (const it of unclaimed()) {
      if (it.isDir && /_files$/i.test(it.name)) dirsByBase.set(it.name.replace(/_files$/i, '').toLowerCase(), it);
    }
    for (const it of unclaimed()) {
      if (it.isDir || !/\.html?$/i.test(it.name)) continue;
      const base = it.name.replace(/\.html?$/i, '').toLowerCase();
      if (dirsByBase.has(base)) bundles.push([it, dirsByBase.get(base)]);
    }
    const flat = bundles.flat();
    if (flat.length >= 2) {
      claim(flat);
      const total = flat.reduce((a, b) => a + b.bytes, 0);
      cards.push({
        heuristic: 'web-bundle',
        title: `${bundles.length} saved web page${bundles.length > 1 ? 's' : ''} (HTML + _files)`,
        members: flat.sort((a, b) => b.bytes - a.bytes), bytes: total, reclaimable: total,
        confidence: 'high', suggestion: 'Saved web pages are rarely reopened. Archive all unless you need one.',
        meta: { ageRange: ageRange(flat, now) },
      });
    }
  }

  // 4 — stale bursts (>=4 items, same hour, median age >= 14d)
  {
    const groups = new Map();
    for (const it of unclaimed()) {
      const d = new Date(it.createdMs);
      const key = [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()].join('-');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    }
    for (const [, members] of groups) {
      if (members.length < 4) continue;
      const ages = members.map((m) => daysAgo(m.lastTouchedMs, now)).sort((a, b) => a - b);
      if (ages[Math.floor(ages.length / 2)] < 14) continue;
      claim(members);
      const total = members.reduce((a, b) => a + b.bytes, 0);
      const when = new Date(members[0].createdMs);
      cards.push({
        heuristic: 'burst',
        title: `${members.length} items that arrived together`,
        members: members.sort((a, b) => b.bytes - a.bytes), bytes: total, reclaimable: total,
        confidence: 'medium',
        suggestion: `Downloaded within the same hour (${when.toLocaleDateString()}). Usually one finished task.`,
        meta: { ageRange: ageRange(members, now) },
      });
    }
  }

  // 5 — kind piles (>=3 items)
  {
    const CLUTTER = {
      installer: 'Installers — usually dead weight once the app is installed.',
      archive: 'Archives — if you’ve already extracted these, the zip is redundant.',
      image: 'Loose images / screenshots — worth a quick keep-or-kill triage.',
      video: 'Video files — often the biggest space wins.',
    };
    const groups = new Map();
    for (const it of unclaimed()) {
      if (!CLUTTER[it.kind]) continue;
      if (!groups.has(it.kind)) groups.set(it.kind, []);
      groups.get(it.kind).push(it);
    }
    for (const [kind, members] of groups) {
      if (members.length < 3) continue;
      claim(members);
      const total = members.reduce((a, b) => a + b.bytes, 0);
      const stale = members.filter((m) => daysAgo(m.lastTouchedMs, now) > 60).length;
      cards.push({
        heuristic: `kind:${kind}`,
        title: `${members.length} ${kind}s${stale ? ` (${stale} untouched 60+ days)` : ''}`,
        members: members.sort((a, b) => b.bytes - a.bytes), bytes: total, reclaimable: total,
        confidence: kind === 'installer' ? 'high' : 'medium',
        suggestion: CLUTTER[kind], meta: { ageRange: ageRange(members, now) },
      });
    }
  }

  // 6 — loose remainder
  {
    const rest = unclaimed();
    if (rest.length) {
      const total = rest.reduce((a, b) => a + b.bytes, 0);
      claim(rest);
      cards.push({
        heuristic: 'loose',
        title: `${rest.length} loose item${rest.length > 1 ? 's' : ''} — no obvious group`,
        members: rest.sort((a, b) => b.bytes - a.bytes), bytes: total, reclaimable: 0,
        confidence: 'low', suggestion: 'These didn’t cluster with anything. Skim the big ones; leave the rest.',
        meta: { ageRange: ageRange(rest, now) },
      });
    }
  }

  const merged = mergeFamilies(cards, now);
  merged.sort((a, b) => {
    if (a.heuristic === 'loose') return 1;
    if (b.heuristic === 'loose') return -1;
    return b.reclaimable - a.reclaimable || b.members.length - a.members.length;
  });

  return {
    now, cardCount: merged.length, totalBytes: scan.totalBytes,
    reclaimableBytes: merged.reduce((a, c) => a + c.reclaimable, 0),
    cards: merged,
  };
}

function familyKeyOf(card) {
  const rep = card.keepHint ?? card.members[0];
  const tks = tokens(stem(rep.name, rep.isDir), rep.isDir);
  return tks.length >= 3 ? tks.slice(0, 3).join(' ') : null;
}

function mergeFamilies(cards, now) {
  const MERGEABLE = new Set(['copy-family', 'variant-family']);
  const buckets = new Map();
  const passthrough = [];
  for (const card of cards) {
    const key = MERGEABLE.has(card.heuristic) ? familyKeyOf(card) : null;
    if (!key) { passthrough.push(card); continue; }
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(card);
  }
  const out = [...passthrough];
  for (const [key, group] of buckets) {
    if (group.length === 1) { out.push(group[0]); continue; }
    const members = group.flatMap((g) => g.members).sort(keepCompare);
    const newest = members[0];
    const total = members.reduce((a, b) => a + b.bytes, 0);
    out.push({
      heuristic: 'variant-family',
      title: `${members.length} items in the “${key}…” family`,
      members, bytes: total, reclaimable: total - newest.bytes, keepHint: newest,
      confidence: 'medium',
      suggestion: `${members.length} related copies/versions. Likely keep the newest (“${newest.name}”), archive the rest.`,
      meta: { ageRange: ageRange(members, now) },
    });
  }
  return out;
}
