/* Procedural lens textures for /Lens, rendered once from SVG authored here and stored as WebP.
   No image model is involved: every line, grain and scratch is drawn in this file.
   Run: node scripts/lens-textures.mjs   (playwright and sharp are already devDependencies)
   Output: public/lens-tex/barrel.webp, glass.webp (transparent) and iris.webp. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp'; // present transitively today; add it to devDependencies if the import ever fails
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'lens-tex');
fs.mkdirSync(OUT, { recursive: true });

let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const R = (a, b) => a + rnd() * (b - a);
const pol = (r, deg) => [500 + Math.cos((deg * Math.PI) / 180) * r, 500 + Math.sin((deg * Math.PI) / 180) * r];
const f1 = (n) => n.toFixed(1);

/* ── Barrel: turned metal ring, knurl, engraving, sheen, scratches ── */
function barrelSvg() {
  const arcs = [];
  for (let i = 0; i < 900; i++) {
    const r = R(397, 497);
    const a0 = R(0, 360), len = R(4, 110);
    const light = rnd() < 0.5;
    const [x0, y0] = pol(r, a0), [x1, y1] = pol(r, a0 + len);
    arcs.push(`<path d="M${f1(x0)} ${f1(y0)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(x1)} ${f1(y1)}" stroke="${light ? 'rgba(255,255,255,' + R(0.03, 0.11).toFixed(3) + ')' : 'rgba(0,0,0,' + R(0.10, 0.34).toFixed(3) + ')'}" stroke-width="${R(0.25, 1.3).toFixed(2)}" fill="none"/>`);
  }
  const scratches = [];
  for (let i = 0; i < 90; i++) {
    const r = R(400, 495), a = R(0, 360), len = R(1.5, 10), tilt = R(-25, 25);
    const [x0, y0] = pol(r, a), [x1, y1] = pol(r + Math.sin((tilt * Math.PI) / 180) * len, a + (len / r) * 57.3 * Math.cos((tilt * Math.PI) / 180));
    scratches.push(`<line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(x1)}" y2="${f1(y1)}" stroke="rgba(255,255,255,${R(0.06, 0.2).toFixed(3)})" stroke-width="${R(0.3, 0.8).toFixed(2)}" stroke-linecap="round"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="2048" height="2048">
  <defs>
    <radialGradient id="metal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(10,10,12,0)"/><stop offset="79.4%" stop-color="rgba(10,10,12,0)"/>
      <stop offset="79.6%" stop-color="#08080a"/><stop offset="81%" stop-color="#141416"/><stop offset="83%" stop-color="#28282c"/>
      <stop offset="86%" stop-color="#505055"/><stop offset="88.5%" stop-color="#7c7c82"/><stop offset="90.5%" stop-color="#404045"/>
      <stop offset="93%" stop-color="#1c1c1f"/><stop offset="96.5%" stop-color="#0c0c0e"/><stop offset="100%" stop-color="#020202"/>
    </radialGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,.36)"/><stop offset="30%" stop-color="rgba(255,255,255,.04)"/>
      <stop offset="62%" stop-color="rgba(255,255,255,0)"/><stop offset="100%" stop-color="rgba(255,255,255,.12)"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/><stop offset="55%" stop-color="rgba(0,0,0,.14)"/><stop offset="100%" stop-color="rgba(0,0,0,.38)"/>
    </linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5a1616"/><stop offset="48%" stop-color="#c8363e"/><stop offset="100%" stop-color="#3a1010"/>
    </linearGradient>
    <pattern id="knurl" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
      <rect width="5" height="5" fill="#111114"/>
      <line x1="0" y1="0" x2="5" y2="5" stroke="#34343a" stroke-width=".9"/>
      <line x1="0" y1="0.6" x2="5" y2="5.6" stroke="#050507" stroke-width=".5"/>
      <line x1="5" y1="0" x2="0" y2="5" stroke="#0b0b0d" stroke-width=".35"/>
    </pattern>
    <filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="11" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.26 0"/>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
    <mask id="ring"><circle cx="500" cy="500" r="498" fill="#fff"/><circle cx="500" cy="500" r="396" fill="#000"/></mask>
  </defs>
  <circle cx="500" cy="500" r="498" fill="url(#metal)"/>
  <g mask="url(#ring)">
    ${arcs.join('\n    ')}
    <rect x="0" y="0" width="1000" height="1000" filter="url(#grain)" opacity=".9"/>
    <circle cx="500" cy="500" r="498" fill="url(#shade)"/>
  </g>
  <circle cx="500" cy="500" r="496" fill="none" stroke="#0c0c0f" stroke-width="0.6"/>
  <circle cx="500" cy="500" r="493" fill="none" stroke="#222225" stroke-width="1"/>
  <circle cx="500" cy="500" r="490" fill="none" stroke="#0a0a0c" stroke-width="0.6"/>
  <circle cx="500" cy="500" r="487" fill="none" stroke="#1e1e21" stroke-width="0.6"/>
  <circle cx="500" cy="500" r="484" fill="none" stroke="#0a0a0c" stroke-width="0.6"/>
  <circle cx="500" cy="500" r="466" fill="none" stroke="url(#knurl)" stroke-width="32"/>
  <circle cx="500" cy="500" r="482.2" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="0.8"/>
  <circle cx="500" cy="500" r="449.8" fill="none" stroke="rgba(0,0,0,.65)" stroke-width="1.2"/>
  <g mask="url(#ring)"><circle cx="500" cy="500" r="498" fill="url(#sheen)"/></g>
  <path d="M228 332A296 296 0 0 1 772 332" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="28" filter="url(#soft)"/>
  <path d="M250 296A286 286 0 0 1 750 296" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="10" filter="url(#soft)"/>
  <circle cx="500" cy="500" r="448" fill="none" stroke="#121215" stroke-width="1.6"/>
  <circle cx="500" cy="500" r="444" fill="none" stroke="#0a0a0d" stroke-width="0.6"/>
  <circle cx="500" cy="500" r="418" fill="none" stroke="url(#red)" stroke-width="2.6"/>
  <circle cx="500" cy="500" r="416" fill="none" stroke="#0c0c0f" stroke-width="1"/>
  <circle cx="500" cy="500" r="412" fill="none" stroke="#080810" stroke-width="0.6"/>
  <circle cx="500" cy="500" r="404" fill="none" stroke="#030305" stroke-width="8"/>
  <circle cx="500" cy="500" r="399.5" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="0.8"/>
  <circle cx="500" cy="500" r="398" fill="none" stroke="#111116" stroke-width="0.8"/>
  <circle cx="500" cy="500" r="396" fill="none" stroke="#0a0a0e" stroke-width="0.6"/>
  ${scratches.join('\n  ')}
  <g font-family="'Geist Mono', 'DejaVu Sans Mono', monospace" text-anchor="middle" font-weight="500">
    <text x="500" y="62.6" font-size="7" fill="rgba(255,255,255,.08)" letter-spacing="4">C4 LENS</text>
    <text x="500" y="62" font-size="7" fill="#404042" letter-spacing="4">C4 LENS</text>
    <text x="500" y="938.6" font-size="6.5" fill="rgba(255,255,255,.06)" letter-spacing="3">50mm  1:1.4  Ø72</text>
    <text x="500" y="938" font-size="6.5" fill="#303032" letter-spacing="3">50mm  1:1.4  Ø72</text>
  </g>
</svg>`;
}

/* ── Glass: the well, the coating, the softbox reflections, dust ── */
function glassSvg() {
  const dust = [];
  for (let i = 0; i < 160; i++) {
    const r = Math.sqrt(rnd()) * 388, a = R(0, 360);
    const [x, y] = pol(r, a);
    dust.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${R(0.4, 1.6).toFixed(2)}" fill="rgba(235,240,255,${R(0.04, 0.14).toFixed(3)})"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="2048" height="2048">
  <defs>
    <radialGradient id="well" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/><stop offset="50%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="72%" stop-color="rgba(0,0,0,.30)"/><stop offset="92%" stop-color="rgba(0,0,0,.72)"/><stop offset="100%" stop-color="rgba(0,0,0,.92)"/>
    </radialGradient>
    <radialGradient id="coat" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(20,30,60,0)"/><stop offset="66%" stop-color="rgba(20,40,90,0)"/>
      <stop offset="82%" stop-color="rgba(70,120,210,.13)"/><stop offset="91%" stop-color="rgba(160,70,180,.16)"/>
      <stop offset="97%" stop-color="rgba(70,200,150,.12)"/><stop offset="100%" stop-color="rgba(70,200,150,0)"/>
    </radialGradient>
    <radialGradient id="tint" cx="34%" cy="28%" r="34%">
      <stop offset="0%" stop-color="rgba(100,165,220,.09)"/><stop offset="30%" stop-color="rgba(70,195,155,.04)"/><stop offset="100%" stop-color="rgba(55,95,210,0)"/>
    </radialGradient>
    <radialGradient id="tintw" cx="72%" cy="76%" r="28%">
      <stop offset="0%" stop-color="rgba(232,166,88,.09)"/><stop offset="60%" stop-color="rgba(200,70,70,.03)"/><stop offset="100%" stop-color="rgba(200,70,70,0)"/>
    </radialGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,.42)"/><stop offset="50%" stop-color="rgba(255,255,255,.10)"/><stop offset="100%" stop-color="rgba(255,255,255,.30)"/>
    </linearGradient>
    <filter id="blur18" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <clipPath id="disc"><circle cx="500" cy="500" r="394"/></clipPath>
  </defs>
  <g clip-path="url(#disc)">
    <circle cx="500" cy="500" r="394" fill="url(#well)"/>
    <circle cx="500" cy="500" r="394" fill="url(#coat)"/>
    <circle cx="500" cy="500" r="394" fill="url(#tint)"/>
    <circle cx="500" cy="500" r="394" fill="url(#tintw)"/>
    <ellipse cx="380" cy="330" rx="150" ry="52" fill="rgba(255,255,255,.07)" transform="rotate(-30 380 330)" filter="url(#blur18)"/>
    <ellipse cx="396" cy="352" rx="80" ry="28" fill="rgba(255,255,255,.14)" transform="rotate(-28 396 352)" filter="url(#blur6)"/>
    <ellipse cx="358" cy="322" rx="32" ry="10" fill="rgba(255,255,255,.22)" transform="rotate(-30 358 322)"/>
    <ellipse cx="620" cy="640" rx="50" ry="18" fill="rgba(232,180,100,.06)" transform="rotate(25 620 640)" filter="url(#blur6)"/>
    <ellipse cx="590" cy="620" rx="22" ry="7" fill="rgba(255,220,160,.08)" transform="rotate(20 590 620)"/>
    <path d="M190 720 C 330 560, 560 330, 800 250" stroke="rgba(255,255,255,.05)" stroke-width="22" fill="none" stroke-linecap="round" filter="url(#blur18)"/>
    ${dust.join('\n    ')}
    <circle cx="500" cy="500" r="370" fill="none" stroke="rgba(180,200,240,.08)" stroke-width="0.9"/>
    <circle cx="500" cy="500" r="352" fill="none" stroke="rgba(190,210,255,.11)" stroke-width="1.1"/>
    <circle cx="500" cy="500" r="318" fill="none" stroke="rgba(160,180,210,.05)" stroke-width="0.7"/>
  </g>
  <circle cx="500" cy="500" r="393" fill="none" stroke="url(#edge)" stroke-width="2"/>
</svg>`;
}

/* ── Iris: fibres, crypts, blotches, furrows, collarette, limbal ring, grain ── */
function irisSvg() {
  const pol2 = (r, deg) => [200 + Math.cos((deg * Math.PI) / 180) * r, 200 + Math.sin((deg * Math.PI) / 180) * r];
  const fib = [];
  const pal = ['rgba(250,214,130,.62)', 'rgba(224,168,76,.5)', 'rgba(130,86,30,.6)', 'rgba(44,22,6,.7)', 'rgba(190,160,80,.4)', 'rgba(96,116,62,.36)', 'rgba(255,236,170,.34)'];
  for (let i = 0; i < 700; i++) {
    const a = R(0, 360);
    const inner = rnd() < 0.55;
    const r0 = inner ? R(48, 60) : R(80, 96);
    const r1 = inner ? R(74, 94) : R(120, 146);
    const [x0, y0] = pol2(r0, a), [x1, y1] = pol2(r1, a + R(-3, 3));
    const w = R(0.5, 2.4);
    fib.push(`<line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(x1)}" y2="${f1(y1)}" stroke="${pal[Math.floor(rnd() * pal.length)]}" stroke-width="${w.toFixed(2)}" stroke-linecap="round"/>`);
  }
  const blots = [];
  for (let i = 0; i < 26; i++) {
    const a = R(0, 360), r = R(60, 136);
    const [x, y] = pol2(r, a);
    const dark = rnd() < 0.5;
    blots.push(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${R(4, 11).toFixed(1)}" ry="${R(10, 26).toFixed(1)}" fill="${dark ? 'rgba(40,20,6,' + R(0.2, 0.4).toFixed(2) + ')' : 'rgba(255,220,140,' + R(0.12, 0.26).toFixed(2) + ')'}" transform="rotate(${(a + 90).toFixed(1)} ${f1(x)} ${f1(y)})" filter="url(#blur3)"/>`);
  }
  const crypts = [];
  for (let i = 0; i < 44; i++) {
    const a = R(0, 360), r = R(82, 132);
    const [x, y] = pol2(r, a);
    crypts.push(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${R(2, 5).toFixed(2)}" ry="${R(7, 18).toFixed(2)}" fill="rgba(24,10,2,${R(0.45, 0.75).toFixed(2)})" transform="rotate(${(a + 90).toFixed(1)} ${f1(x)} ${f1(y)})"/>`);
  }
  const furrows = [];
  for (let i = 0; i < 3; i++) {
    const r = 104 + i * 9;
    furrows.push(`<circle cx="200" cy="200" r="${r}" fill="none" stroke="rgba(40,20,6,.3)" stroke-width="${R(1.2, 2).toFixed(2)}" stroke-dasharray="${R(6, 14).toFixed(1)} ${R(5, 16).toFixed(1)} ${R(3, 9).toFixed(1)} ${R(8, 20).toFixed(1)}" transform="rotate(${R(0, 360).toFixed(1)} 200 200)"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="1024" height="1024">
  <defs>
    <radialGradient id="ground" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a1510"/><stop offset="70%" stop-color="#0d0b08"/><stop offset="100%" stop-color="#040302"/>
    </radialGradient>
    <radialGradient id="body" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0a0804"/><stop offset="13%" stop-color="#0a0804"/><stop offset="16%" stop-color="#3a2810"/>
      <stop offset="24%" stop-color="#8a6428"/><stop offset="34%" stop-color="#c49a48"/><stop offset="46%" stop-color="#d8ac52"/>
      <stop offset="58%" stop-color="#a87c34"/><stop offset="70%" stop-color="#8a6a30"/><stop offset="82%" stop-color="#5c4620"/>
      <stop offset="92%" stop-color="#32220e"/><stop offset="100%" stop-color="#140c04"/>
    </radialGradient>
    <radialGradient id="limbal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/><stop offset="86%" stop-color="rgba(6,3,0,0)"/><stop offset="100%" stop-color="rgba(6,3,0,.9)"/>
    </radialGradient>
    <radialGradient id="light" cx="38%" cy="32%" r="55%">
      <stop offset="0%" stop-color="rgba(255,232,190,.20)"/><stop offset="45%" stop-color="rgba(255,220,160,.05)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="9" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.5  0 0 0 0 0.3  0 0 0 0.22 0"/>
    </filter>
    <filter id="wobble" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="blur1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0.6"/></filter>
    <filter id="blur3" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.6"/></filter>
    <clipPath id="iris"><circle cx="200" cy="200" r="145"/></clipPath>
  </defs>
  <rect width="400" height="400" fill="url(#ground)"/>
  <g clip-path="url(#iris)">
    <circle cx="200" cy="200" r="145" fill="url(#body)"/>
    ${blots.join('\n    ')}
    <g filter="url(#wobble)">
    ${fib.join('\n    ')}
    </g>
    <g filter="url(#blur1)">${crypts.join('')}</g>
    ${furrows.join('\n    ')}
    <circle cx="200" cy="200" r="82" fill="none" stroke="rgba(240,200,110,.28)" stroke-width="2.4" stroke-dasharray="5 3 9 4 3 6"/>
    <circle cx="200" cy="200" r="76" fill="none" stroke="rgba(40,24,8,.45)" stroke-width="3.2"/>
    <rect x="55" y="55" width="290" height="290" filter="url(#grain)"/>
    <circle cx="200" cy="200" r="145" fill="url(#limbal)"/>
    <circle cx="200" cy="200" r="145" fill="url(#light)"/>
  </g>
  <circle cx="200" cy="200" r="145" fill="none" stroke="#1a0e04" stroke-width="4"/>
  <circle cx="200" cy="200" r="56" fill="#050302"/>
  <circle cx="200" cy="200" r="56" fill="none" stroke="rgba(120,90,40,.35)" stroke-width="1.2"/>
</svg>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2048, height: 2048 }, deviceScaleFactor: 1 });
async function render(name, svg, size, opaque) {
  const html = `<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block}</style></head><body>${svg}</body></html>`;
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html);
  await page.waitForTimeout(300);
  const png = await page.screenshot({ omitBackground: !opaque, clip: { x: 0, y: 0, width: size, height: size } });
  const webp = await sharp(png).webp({ quality: 84, alphaQuality: 90, effort: 5 }).toBuffer();
  fs.writeFileSync(`${OUT}/${name}.webp`, webp);
  console.log(name, 'webp', Math.round(webp.length / 1024), 'KB');
}
await render('barrel', barrelSvg(), 2048, false);
await render('glass', glassSvg(), 2048, false);
await render('iris', irisSvg(), 1024, true);
await browser.close();
