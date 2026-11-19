/*
 * The four logo jobs on the ring in "Four logos we've handed over"
 * (Work.jsx), 19 Nov 2026. Only finished, paid work, and only what the
 * records say. Named logoJobs.js, not work.js: on Windows work.js and
 * Work.jsx in one folder resolve as the same module.
 *
 * Where each fact comes from (this repo is public, so the job records stay
 * in the brain; read 19 Nov 2026):
 *  - What was made, and the versions: each job's own records. "Versions"
 *    counts layouts times colourways, not files:
 *      Genesis    3 layouts x 4 colourways = 12 (its case study: "three
 *                 layouts in four colourways")
 *      Refine     full logo 7 + icon 7 + simplified 6 = 20
 *      TDazzzle   logo and monogram x rose gold, blush, nude, black, white and
 *                 one colour = 12
 *      Next Gen   full, compact and embroidery x charcoal, black and white = 9
 *  - Months: the month each job's final files were handed over.
 *  - Colour codes: each pack's own read-me.
 *  - Logos: copies of the delivered SVG masters in public/logo-work/. Next
 *    Gen's is its compact wordmark, with width and height added to its <svg>
 *    so a canvas draws it at its own proportions.
 *
 * Each line says what was handed over and nothing more: it doesn't say what
 * an owner's original logo was made with (Genesis's Canva file is the one
 * exception, and its public case study already says so), and it claims no
 * concept work.
 */

/* 6 x 7 mesh, read row by row from the top left (the component's grid), built
   from the brand's own colours: a dark ground, darker at the edges, with soft
   blooms of the brand's lighter colours kept clear of the logo's box. */
function hexToRgb(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(c) {
  return `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
}
function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function mesh({ base, edge, blooms }) {
  const B = hexToRgb(base);
  const E = hexToRgb(edge);
  const out = [];
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < 6; i++) {
      const x = i / 5;
      const y = j / 6;
      const r = Math.hypot((x - 0.5) * 1.1, (y - 0.42) * 1.0);
      let c = mix(B, E, Math.min(1, Math.max(0, (r - 0.18) * 1.5)));
      for (const b of blooms) {
        const d = Math.hypot(x - b.x, y - b.y);
        const w = b.strength * Math.exp(-((d / b.radius) ** 2));
        c = mix(c, hexToRgb(b.color), Math.min(1, w));
      }
      out.push(rgbToHex(c));
    }
  }
  return out;
}

export const JOBS = [
  {
    slug: 'genesis-realty-group',
    name: 'Genesis Realty Group',
    title: 'Genesis Realty\nGroup',
    kicker: 'Logo Rebuild',
    what: 'Their Canva logo, redrawn as true vector so it prints sharp at any size.',
    footer: 'Canva logo redrawn as vector',
    versions: 12,
    month: 'Oct 2026',
    monthLong: 'October 2026',
    logo: '/logo-work/genesis-realty-group.svg',
    logoAlt: 'The Genesis Realty Group logo in white and light blue',
    logoBox: [40, 62, 176, 132],
    caseStudy: 'genesis-realty-group',
    ground: '#031F4F',
    swatches: [
      { hex: '#031F4F', name: 'Navy' },
      { hex: '#77C4ED', name: 'Light blue' },
    ],
    accent: '#77C4ED',
    glow: '#77C4ED',
    numeral: ['#FFFFFF', '#B9E2F7'],
    mesh: mesh({
      base: '#06275f',
      edge: '#020f2a',
      blooms: [
        { x: 1, y: 1, color: '#2f7fb8', strength: 0.75, radius: 0.42 },
        { x: 0, y: 0, color: '#0b3a85', strength: 0.6, radius: 0.36 },
      ],
    }),
  },
  {
    slug: 'refine-auto',
    name: 'Refine Auto',
    title: 'Refine\nAuto',
    kicker: 'Logo Rebuild',
    what: 'Their logo redrawn as vector, with a metallic finish and the RA icon. A simplified cut covers embroidery and small sizes.',
    footer: 'Redrawn, with a metallic finish',
    versions: 20,
    month: 'Nov 2026',
    monthLong: 'November 2026',
    logo: '/logo-work/refine-auto.svg',
    logoAlt: 'The Refine Auto logo in silver, light blue and white',
    logoBox: [26, 76, 204, 108],
    caseStudy: null,
    ground: '#1C1F21',
    swatches: [
      { hex: '#00469D', name: 'Blue' },
      { hex: '#5A5E60', name: 'Grey' },
      { hex: '#01A3F5', name: 'Light blue' },
    ],
    accent: '#01A3F5',
    glow: '#01A3F5',
    numeral: ['#FFFFFF', '#8fd3fb'],
    mesh: mesh({
      base: '#26292b',
      edge: '#111314',
      blooms: [
        { x: 1, y: 1, color: '#00469D', strength: 0.85, radius: 0.5 },
        { x: 0.1, y: 0.05, color: '#3d4244', strength: 0.5, radius: 0.35 },
      ],
    }),
  },
  {
    slug: 'tdazzzle-collective',
    name: 'TDazzzle Collective',
    title: 'TDazzzle\nCollective',
    kicker: 'Logo and monogram',
    what: 'The logo and TDC monogram as final vector artwork, drawn by hand from the owner’s sample, with foil, emboss and engrave plates and a 45 mm label.',
    footer: 'With foil, emboss and engrave plates',
    versions: 12,
    month: 'Nov 2026',
    monthLong: 'November 2026',
    logo: '/logo-work/tdazzzle-collective.svg',
    logoAlt: 'The TDazzzle Collective logo in rose gold',
    logoBox: [16, 82, 224, 96],
    caseStudy: null,
    ground: '#1B1918',
    swatches: [
      { hex: '#B87562', name: 'Rose gold' },
      { hex: '#E4B4A7', name: 'Blush' },
      { hex: '#BD876D', name: 'Nude' },
    ],
    accent: '#E4B4A7',
    glow: '#E4B4A7',
    numeral: ['#FFFFFF', '#E4B4A7'],
    mesh: mesh({
      base: '#221e1d',
      edge: '#0f0d0d',
      blooms: [
        { x: 0, y: 1, color: '#7a4a3d', strength: 0.8, radius: 0.45 },
        { x: 1, y: 0, color: '#4a3029', strength: 0.55, radius: 0.35 },
      ],
    }),
  },
  {
    slug: 'next-gen-water-systems',
    name: 'Next Gen Water Systems',
    title: 'Next Gen\nWater Systems',
    kicker: 'Logo redraw',
    what: 'Their logo redrawn as vector, with a compact version for small spaces and an embroidery version for shirts and caps.',
    footer: 'With compact and embroidery cuts',
    versions: 9,
    month: 'Oct 2026',
    monthLong: 'October 2026',
    logo: '/logo-work/next-gen-water-systems.svg',
    logoAlt: 'The Next Gen Water Systems logo in white',
    logoBox: [24, 92, 208, 64],
    caseStudy: null,
    ground: '#17191C',
    swatches: [
      { hex: '#17191C', name: 'Charcoal' },
      { hex: '#094A8A', name: 'Deep blue' },
    ],
    accent: '#7fb3e6',
    glow: '#5b93cf',
    numeral: ['#FFFFFF', '#9cc3ea'],
    mesh: mesh({
      base: '#1d2024',
      edge: '#0c0d0f',
      blooms: [
        { x: 0, y: 1, color: '#094A8A', strength: 0.9, radius: 0.5 },
        { x: 1, y: 0.1, color: '#14335a', strength: 0.5, radius: 0.32 },
      ],
    }),
  },
];

/* What the ring paints for each job. */
export const CARDS = JOBS.map((j) => ({
  title: j.title,
  kicker: j.kicker,
  logo: j.logo,
  logoBox: j.logoBox,
  swatches: j.swatches,
  value: String(j.versions),
  unit: 'versions',
  footer: j.footer,
  meta: j.month,
  accent: j.accent,
  glow: j.glow,
  numeral: j.numeral,
  mesh: j.mesh,
  label: `${j.name}. ${j.what} ${j.versions} versions, ${j.monthLong}.`,
}));
