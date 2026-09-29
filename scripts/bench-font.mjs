/* The Bible page's book face for /About: Crimson Pro (SIL Open Font License,
   no Reserved Font Name), cut down to the characters that page sets and
   renamed "Crimson Pro Bench" as the OFL asks of a modified font. Output is
   WOFF (zlib), so every platform draws the same letters instead of whatever
   serif it has installed.
   Run: OPENTYPE=<path to opentype.js> CRIMSON=<folder holding CrimsonPro-*.ttf>
        node scripts/bench-font.mjs
   (opentype.js is not a dependency of this site; point OPENTYPE at any copy.)
   Output: public/fonts/crimson-pro-bench-400.woff, -700.woff, and
   CrimsonPro-OFL.txt beside them. */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { DANIEL_3, DANIEL_4 } from '../src/components/about/daniel.js';

const require = createRequire(import.meta.url);
const opentype = require(process.env.OPENTYPE || 'opentype.js');
const SRC = process.env.CRIMSON;
if (!SRC) throw new Error('set CRIMSON to the folder holding CrimsonPro-Regular.ttf and CrimsonPro-Bold.ttf');
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'fonts');

/* Every character the page can draw: the scripture, the running heads and
   chapter headings in either case, figures, and the punctuation and hyphens
   a browser adds when it breaks a line. */
const text = [...DANIEL_3, ...DANIEL_4, 'Daniel DANIEL Chapter CHAPTER'].join(' ');
const chars = new Set(text);
for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCharCode(c));
' ­‐‑–—‘’“”…'.split('').forEach((c) => chars.add(c));

function subset(file, style) {
  const buf = fs.readFileSync(file);
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const keep = [font.glyphs.get(0)];
  const seen = new Set([0]);
  for (const ch of chars) {
    const g = font.charToGlyph(ch);
    if (!g || g.index === 0 || seen.has(g.index)) continue;
    seen.add(g.index);
    keep.push(g);
  }
  const out = new opentype.Font({
    familyName: 'Crimson Pro Bench',
    styleName: style,
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    copyright: 'Copyright 2018 The Crimson Pro Project Authors (https://github.com/Fonthausen/CrimsonPro). Subset for c4studios.com.au.',
    license: 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
    licenseURL: 'https://openfontlicense.org',
    glyphs: keep.map((g, i) => new opentype.Glyph({
      name: i === 0 ? '.notdef' : (g.name || `g${i}`),
      unicode: g.unicode,
      unicodes: g.unicodes,
      advanceWidth: g.advanceWidth,
      path: g.path,
    })),
  });
  return { sfnt: Buffer.from(out.toArrayBuffer()), glyphs: keep.length };
}

/* WOFF 1.0: the sfnt's tables, each deflated when that helps. */
function toWoff(sfnt) {
  const flavor = sfnt.readUInt32BE(0);
  const numTables = sfnt.readUInt16BE(4);
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    const tag = sfnt.readUInt32BE(o);
    const checksum = sfnt.readUInt32BE(o + 4);
    const offset = sfnt.readUInt32BE(o + 8);
    const length = sfnt.readUInt32BE(o + 12);
    const data = sfnt.subarray(offset, offset + length);
    const z = zlib.deflateSync(data, { level: 9 });
    tables.push({ tag, checksum, origLength: length, data: z.length < length ? z : data });
  }
  const pad4 = (n) => (n + 3) & ~3;
  const totalSfntSize = 12 + 16 * numTables + tables.reduce((s, t) => s + pad4(t.origLength), 0);
  let offset = 44 + 20 * numTables;
  const dir = Buffer.alloc(20 * numTables);
  tables.forEach((t, i) => {
    dir.writeUInt32BE(t.tag, i * 20);
    dir.writeUInt32BE(offset, i * 20 + 4);
    dir.writeUInt32BE(t.data.length, i * 20 + 8);
    dir.writeUInt32BE(t.origLength, i * 20 + 12);
    dir.writeUInt32BE(t.checksum, i * 20 + 16);
    t.offset = offset;
    offset = pad4(offset + t.data.length);
  });
  const woff = Buffer.alloc(offset);
  woff.writeUInt32BE(0x774f4646, 0);
  woff.writeUInt32BE(flavor, 4);
  woff.writeUInt32BE(offset, 8);
  woff.writeUInt16BE(numTables, 12);
  woff.writeUInt32BE(totalSfntSize, 16);
  woff.writeUInt16BE(1, 20);
  dir.copy(woff, 44);
  tables.forEach((t) => t.data.copy(woff, t.offset));
  return woff;
}

for (const [file, style, weight] of [['CrimsonPro-Regular.ttf', 'Regular', 400], ['CrimsonPro-Bold.ttf', 'Bold', 700]]) {
  const { sfnt, glyphs } = subset(path.join(SRC, file), style);
  const woff = toWoff(sfnt);
  const dest = path.join(OUT, `crimson-pro-bench-${weight}.woff`);
  fs.writeFileSync(dest, woff);
  console.log(path.basename(dest), `${glyphs} glyphs`, `${Math.round(woff.length / 1024)} KB`);
}
fs.copyFileSync(path.join(SRC, 'CrimsonPro-OFL.txt'), path.join(OUT, 'CrimsonPro-OFL.txt'));
