/**
 * A realistic "messy Downloads folder" for the Sweep demo. Built relative to
 * `now` so the ages stay fresh. Feeds the real grouping engine — the cards you
 * see in the demo are computed, not hand-authored.
 */
const DAY = 86_400_000;
const GB = 1e9, MB = 1e6, KB = 1e3;

export function buildSampleScan(now) {
  const at = (days) => now - days * DAY;
  const burstCreated = at(90); // five items that arrived in the same hour

  /* name, isDir, bytes, kind, ageDays, [createdMs override], [looksLikeProject] */
  const raw = [
    // copy family — a folder and its duplicate (the biggest single win, leads the deck)
    ['Brand-Photoshoot', true, 520 * MB, 'folder', 12, null, true],
    ['Brand-Photoshoot - Copy', true, 520 * MB, 'folder', 40, null, true],
    // version family — collapses to one card, keeps v2
    ['Proposal-v1.pdf', false, 3 * MB, 'document', 60],
    ['Proposal-v2.pdf', false, 3.2 * MB, 'document', 21],
    ['Proposal-FINAL.pdf', false, 3.1 * MB, 'document', 18],
    // variant family — shared prefix, different tails
    ['Marketing_Site_Export_HOME', true, 14 * MB, 'folder', 50],
    ['Marketing_Site_Export_BLOG', true, 12 * MB, 'folder', 52],
    ['Marketing_Site_Export_CONTACT', true, 9 * MB, 'folder', 55],
    // installers — kind pile, mostly stale
    ['SetupApp.exe', false, 280 * MB, 'installer', 95],
    ['node-v20-installer.exe', false, 60 * MB, 'installer', 120],
    ['ChromeSetup.exe', false, 95 * MB, 'installer', 80],
    ['VLC-setup.exe', false, 40 * MB, 'installer', 200],
    // a batch that arrived together months ago — a stale burst
    ['old-client-logos.zip', false, 80 * MB, 'archive', 88, burstCreated],
    ['project-brief.docx', false, 2 * MB, 'document', 88, burstCreated],
    ['moodboard.png', false, 15 * MB, 'image', 88, burstCreated],
    ['signed-contract.pdf', false, 1 * MB, 'document', 88, burstCreated],
    ['handoff-assets.zip', false, 60 * MB, 'archive', 88, burstCreated],
    // saved web pages — HTML + _files bundles
    ['Lemon Tart Recipe – Cooking_files', true, 12 * MB, 'folder', 30],
    ['Lemon Tart Recipe – Cooking.html', false, 200 * KB, 'document', 30],
    ['Vintage Camera Review – Blog_files', true, 8 * MB, 'folder', 45],
    ['Vintage Camera Review – Blog.html', false, 180 * KB, 'document', 45],
    // big real data — correctly left as "loose", not clutter
    ['Holiday-Videos', true, 8.4 * GB, 'folder', 70],
    ['Phone-Backup-2025', true, 6.1 * GB, 'folder', 15],
    ['tax-return-2025.pdf', false, 900 * KB, 'document', 5],
  ];

  const items = raw.map(([name, isDir, bytes, kind, ageDays, createdMs, looksLikeProject]) => ({
    name, path: name, isDir, bytes, kind,
    lastTouchedMs: at(ageDays),
    createdMs: createdMs ?? at(ageDays),
    looksLikeProject: !!looksLikeProject,
    placeholder: false,
  }));

  return { scannedAt: now, zone: 'Downloads', items, totalBytes: items.reduce((a, b) => a + b.bytes, 0) };
}
