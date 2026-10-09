"""
The stand-in mark for /logo-design and the Logo Design door, drawn from the
site's own Archivo (public/fonts/archivo-latin-3.woff2, the upright variable
cut; Archivo is by Omnibus-Type under the SIL Open Font License 1.1).

The mark is a stand-in for the visitor's own logo, the way the SEO board's
listing is "Your Business": a roundel with a Y cut out of it, the wordmark
YOUR BUSINESS and the line PERTH WA. Nothing about it is a client's.

What this writes: src/components/logo-design/mark-data.js, holding every outline as
SVG path data in one coordinate space (y down, cap height of the wordmark =
100 units), split the way a vinyl cutter and a weeding hook see it:

  - each letter's outer contours (the vinyl that stays on the sheet),
  - each letter's counters (the islands picked out with the hook),
  - the roundel disc and the Y cut out of it (another island),
  - three versions of the lockup (full, compact, symbol),
  - the symbol rasterised at 16 x 16 px (coverage 0 to 255), so the page can
    show the browser-tab version pixel by pixel without drawing anything at
    run time,

and public/logo-art/as-an-image.jpg: the horizontal version as a logo often
arrives, a 200-pixel JPEG, with its origin in a JPEG comment. (Not under
public/logo-design/, which would share a folder with the prerendered page.)

Shaping and kerning come from HarfBuzz with the font's own GPOS, outlines from
the same instance, so the letters sit exactly as Archivo spaces them, plus a
little tracking set by eye.

Run: python scripts/logo-design-mark.py   (needs uharfbuzz, fontTools, Pillow)
"""
import base64
import io
import json
import os

import uharfbuzz as hb
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FONT = os.path.join(ROOT, 'public', 'fonts', 'archivo-latin-3.woff2')
OUT = os.path.join(ROOT, 'src', 'components', 'logo-design', 'mark-data.js')

# HarfBuzz can't read WOFF2 itself, so fontTools unpacks it to plain sfnt.
_tt = TTFont(FONT)
_tt.flavor = None
_raw = io.BytesIO()
_tt.save(_raw)
BLOB = hb.Blob(_raw.getvalue())
FACE = hb.Face(BLOB)
UPM = FACE.upem
CAP = 686  # OS/2 sCapHeight


def fnum(v):
    """A coordinate to one decimal, trailing zeros off: a tenth of a unit is
    a thousandth of the cap height, finer than any screen shows."""
    t = ('%.1f' % v).rstrip('0').rstrip('.')
    return '0' if t in ('-0', '') else t


def hb_font(wght, wdth):
    font = hb.Font(FACE)
    font.set_variations({'wght': wght, 'wdth': wdth})
    return font


class ContourPen:
    """Collects contours as SVG path strings plus a flattened polygon each."""

    def __init__(self, tx):
        self.tx = tx  # (x, y) in font units -> (x, y) in output units
        self.contours = []
        self._d = []
        self._poly = []
        self._last = None

    def _pt(self, p):
        return self.tx(p)

    def moveTo(self, p):
        x, y = self._pt(p)
        self._d = [f'M{fnum(x)} {fnum(y)}']
        self._poly = [(x, y)]
        self._last = (x, y)

    def lineTo(self, p):
        x, y = self._pt(p)
        self._d.append(f'L{fnum(x)} {fnum(y)}')
        self._poly.append((x, y))
        self._last = (x, y)

    def qCurveTo(self, *pts):
        # TrueType quadratic spline: implied on-curve points between offs
        pts = [self._pt(p) for p in pts]
        offs, on = pts[:-1], pts[-1]
        start = self._last
        segs = []
        for i, c in enumerate(offs):
            if i < len(offs) - 1:
                n = offs[i + 1]
                end = ((c[0] + n[0]) / 2, (c[1] + n[1]) / 2)
            else:
                end = on
            segs.append((c, end))
        for c, end in segs:
            self._d.append(f'Q{fnum(c[0])} {fnum(c[1])} {fnum(end[0])} {fnum(end[1])}')
            for k in range(1, 9):
                t = k / 8
                x = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * c[0] + t * t * end[0]
                y = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * c[1] + t * t * end[1]
                self._poly.append((x, y))
            start = end
        self._last = on

    def curveTo(self, *pts):
        pts = [self._pt(p) for p in pts]
        c1, c2, end = pts[-3], pts[-2], pts[-1]
        start = self._last
        self._d.append(f'C{fnum(c1[0])} {fnum(c1[1])} {fnum(c2[0])} {fnum(c2[1])} {fnum(end[0])} {fnum(end[1])}')
        for k in range(1, 13):
            t = k / 12
            mt = 1 - t
            x = mt ** 3 * start[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * end[0]
            y = mt ** 3 * start[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * end[1]
            self._poly.append((x, y))
        self._last = end

    def closePath(self):
        self._d.append('Z')
        self.contours.append({'d': ' '.join(self._d), 'poly': self._poly})
        self._d, self._poly = [], []

    endPath = closePath


def signed_area(poly):
    a = 0.0
    for i in range(len(poly)):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % len(poly)]
        a += x1 * y2 - x2 * y1
    return a / 2


def set_line(text, wght, wdth, cap_px, x0, baseline, track_em=0.0, kern_fix=None):
    """Shape a line and return its glyphs as outer/inner contour lists in
    output units. cap_px: output units per cap height."""
    font = hb_font(wght, wdth)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {'kern': True, 'liga': False})
    scale = cap_px / CAP
    x = 0.0
    glyphs = []
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        ch = text[info.cluster]
        gx = x + pos.x_offset
        if ch != ' ':
            def tx(p, gx=gx):
                return (x0 + (gx + p[0]) * scale, baseline - p[1] * scale)
            pen = ContourPen(tx)
            font.draw_glyph_with_pen(info.codepoint, pen)
            outers, inners = [], []
            # With y flipped to point down, an outer contour's shoelace area
            # comes out positive and a counter's negative (checked on Y, O, B,
            # R, P and A).
            for c in pen.contours:
                (outers if signed_area(c['poly']) > 0 else inners).append(c)
            glyphs.append({'ch': ch, 'outer': outers, 'inner': inners})
        adv = pos.x_advance + track_em * UPM
        if kern_fix and i + 1 < len(text):
            adv += kern_fix.get(text[i:i + 2], 0) * UPM
        x += adv
    width = (x - track_em * UPM) * scale
    return glyphs, width


def bbox(polys):
    xs = [p[0] for poly in polys for p in poly]
    ys = [p[1] for poly in polys for p in poly]
    return min(xs), min(ys), max(xs), max(ys)


def roundel(cx, cy, r, y_wght=900, y_wdth=104, y_cap=None):
    """A disc with a Y cut out of it, the Y optically centred."""
    y_cap = y_cap or r * 1.02
    glyphs, w = set_line('Y', y_wght, y_wdth, y_cap, 0, 0)
    g = glyphs[0]
    x1, y1, x2, y2 = bbox([c['poly'] for c in g['outer']])
    # centre the Y's box, then nudge it down a touch: the arms carry the
    # weight up top, so the true centre reads high
    dx = cx - (x1 + x2) / 2
    dy = cy - (y1 + y2) / 2 + r * 0.035
    out = []
    for c in g['outer']:
        poly = [(p[0] + dx, p[1] + dy) for p in c['poly']]
        out.append({'d': shift_d(c['d'], dx, dy), 'poly': poly})
    return {'cx': cx, 'cy': cy, 'r': r, 'y': out}


def shift_d(d, dx, dy):
    tokens = d.split(' ')
    res = []
    nums = []
    for tok in tokens:
        cmd = tok[0] if tok[0].isalpha() else None
        if cmd:
            if nums:
                res.append(nums)
            nums = [cmd, tok[1:]] if len(tok) > 1 else [cmd]
        else:
            nums.append(tok)
    if nums:
        res.append(nums)
    out = []
    for item in res:
        cmd, vals = item[0], [float(v) for v in item[1:] if v != '']
        for k in range(0, len(vals), 2):
            vals[k] += dx
            vals[k + 1] += dy
        out.append(cmd + ' '.join(fnum(v) for v in vals))
    return ' '.join(out)


WORD = dict(text='YOUR BUSINESS', wght=860, wdth=112, track_em=0.012, kern_fix={'YO': -0.012, 'SS': 0.004})
LINE = dict(text='PERTH WA', wght=640, wdth=112, track_em=0.36)


def word(cap, x0, baseline):
    return set_line(WORD['text'], WORD['wght'], WORD['wdth'], cap, x0, baseline,
                    track_em=WORD['track_em'], kern_fix=WORD['kern_fix'])


def line(cap, x0, baseline):
    return set_line(LINE['text'], LINE['wght'], LINE['wdth'], cap, x0, baseline, track_em=LINE['track_em'])


def lockup(kind):
    """The family a real logo comes as, from widest to smallest:
      horizontal  roundel beside YOUR BUSINESS over PERTH WA (signs, headers)
      stacked     roundel over YOUR BUSINESS over PERTH WA (a vinyl sheet,
                  a square space)
      compact     roundel beside YOUR BUSINESS (a shirt, a card)
      symbol      the roundel alone (a profile picture, an app icon)
      tiny        the roundel with a heavier Y, for a browser tab
    The wordmark's cap height is 100 units throughout."""
    CAPW = 100.0
    LCAP = CAPW * 0.3   # PERTH WA
    GAP = CAPW * 0.34   # between the two lines
    if kind == 'symbol':
        r = 100.0
        return {'w': 2 * r, 'h': 2 * r, 'roundel': roundel(r, r, r), 'letters': []}
    if kind == 'tiny':
        # the small-size cut: a bigger, blunter Y, so the cut-out still
        # reads when the whole roundel is 16 pixels across
        r = 100.0
        return {'w': 2 * r, 'h': 2 * r, 'roundel': roundel(r, r, r, y_wght=900, y_wdth=125, y_cap=r * 1.06), 'letters': []}
    if kind == 'stacked':
        _, ww = word(CAPW, 0, 0)
        r = CAPW * 1.55
        width = ww
        cx = width / 2
        rd = roundel(cx, r, r)
        baseline = 2 * r + CAPW * 0.62 + CAPW
        letters, _ = word(CAPW, 0, baseline)
        _, lw = line(LCAP, 0, 0)  # set_line's width leaves out the last letter's tracking
        tail, _ = line(LCAP, (width - lw) / 2, baseline + GAP + LCAP)
        return {'w': width, 'h': baseline + GAP + LCAP, 'roundel': rd, 'letters': letters + tail}
    if kind == 'horizontal':
        stack_h = CAPW + GAP + LCAP
        r = stack_h * 0.6
    else:  # compact
        stack_h = CAPW
        r = CAPW * 0.74
    pad = r * 0.42  # space between the roundel and the words
    x_text = 2 * r + pad
    top = r - stack_h / 2  # the words centred on the roundel
    baseline = top + CAPW
    letters, ww = word(CAPW, x_text, baseline)
    if kind == 'horizontal':
        tail, _ = line(LCAP, x_text + CAPW * 0.02, baseline + GAP + LCAP)
        letters += tail
    return {'w': x_text + ww, 'h': 2 * r, 'roundel': roundel(r, r, r), 'letters': letters}


def favicon16(sym):
    """The symbol at 16 x 16, 8x supersampled, as 256 coverage values."""
    S = 16 * 8
    k = S / sym['w']
    img = Image.new('L', (S, S), 0)
    dr = ImageDraw.Draw(img)
    rd = sym['roundel']
    dr.ellipse([(rd['cx'] - rd['r']) * k, (rd['cy'] - rd['r']) * k,
                (rd['cx'] + rd['r']) * k, (rd['cy'] + rd['r']) * k], fill=255)
    for c in rd['y']:
        dr.polygon([(p[0] * k, p[1] * k) for p in c['poly']], fill=0)
    small = img.resize((16, 16), Image.BOX)
    return [small.getpixel((x, y)) for y in range(16) for x in range(16)]


def favicon_png(cov):
    """The same 16 x 16 as a PNG data URI: ink #151515, alpha = coverage. The
    page shows it at 16 px and blown up with image-rendering: pixelated."""
    im = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    for i, a in enumerate(cov):
        im.putpixel((i % 16, i // 16), (21, 21, 21, a))
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode('ascii')


IMAGE_PAD = 40  # units of white round the mark, matched by the page's vector


def as_an_image(v, width=200):
    """The horizontal version as a logo often arrives: a small, soft image
    file, saved as a low-quality JPEG. The page blows it up beside the vector
    (drawn with the same IMAGE_PAD round it) to show why a signwriter can't
    cut it."""
    S = 6
    P = IMAGE_PAD
    full_w = v['w'] + 2 * P
    k = width * S / full_w
    h = round((v['h'] + 2 * P) * width / full_w)
    img = Image.new('L', (width * S, h * S), 255)
    dr = ImageDraw.Draw(img)
    at = lambda poly: [((p[0] + P) * k, (p[1] + P) * k) for p in poly]
    rd = v['roundel']
    dr.ellipse([(rd['cx'] - rd['r'] + P) * k, (rd['cy'] - rd['r'] + P) * k,
                (rd['cx'] + rd['r'] + P) * k, (rd['cy'] + rd['r'] + P) * k], fill=21)
    for c in rd['y']:
        dr.polygon(at(c['poly']), fill=255)
    for g in v['letters']:
        for c in g['outer']:
            dr.polygon(at(c['poly']), fill=21)
        for c in g['inner']:
            dr.polygon(at(c['poly']), fill=255)
    small = img.resize((width, h), Image.LANCZOS).convert('RGB')
    out = os.path.join(ROOT, 'public', 'logo-art', 'as-an-image.jpg')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    # The 'impeccable:prompt' + NUL prefix is the key the impeccable skill's
    # embed-prompt.mjs reads, so its provenance scan finds this origin note.
    small.save(out, 'JPEG', quality=34, comment=(
        'impeccable:prompt\0'
        'Origin: drawn by scripts/logo-design-mark.py from the /logo-design stand-in '
        'mark (Archivo outlines, no image model), rasterised at %d x %d and saved at '
        'JPEG quality 34 to show a logo that only exists as a small image file.' % (width, h)
    ).encode('ascii'))
    return out, width, h


def strip(versions):
    """Drop the flattened polygons; round to keep the module small."""
    def clean_letter(g):
        return {'ch': g['ch'], 'outer': [c['d'] for c in g['outer']], 'inner': [c['d'] for c in g['inner']]}
    out = {}
    for name, v in versions.items():
        rd = v['roundel']
        out[name] = {
            'w': round(v['w'], 2), 'h': round(v['h'], 2),
            'roundel': {'cx': round(rd['cx'], 2), 'cy': round(rd['cy'], 2), 'r': round(rd['r'], 2), 'y': [c['d'] for c in rd['y']]},
            'letters': [clean_letter(g) for g in v['letters']],
        }
    return out


def main():
    versions = {k: lockup(k) for k in ('horizontal', 'stacked', 'compact', 'symbol', 'tiny')}
    fav = favicon16(versions['tiny'])
    img_path, img_w, img_h = as_an_image(versions['horizontal'])
    print('wrote', img_path, f'({img_w} x {img_h})')
    data = strip(versions)
    header = (
        '/* GENERATED by scripts/logo-design-mark.py. Do not edit by hand; run\n'
        '   `python scripts/logo-design-mark.py` to redraw.\n\n'
        '   The stand-in mark for /logo-design and the Logo Design door: a roundel\n'
        '   with a Y cut out of it, YOUR BUSINESS and PERTH WA, set in the site\'s own\n'
        '   Archivo (public/fonts/archivo-latin-3.woff2; Omnibus-Type, SIL Open\n'
        '   Font License 1.1) and shaped with its own kerning. It stands in for the\n'
        '   visitor\'s logo and is not a client\'s.\n\n'
        '   Units: y down, the wordmark\'s cap height is 100. Each letter carries its\n'
        '   outer contours (vinyl that stays) and its counters (islands for the\n'
        '   weeding hook). The versions run widest to smallest: horizontal,\n'
        '   stacked, compact, symbol and tiny (the symbol with a heavier Y, for a\n'
        '   browser tab). FAVICON_16 is tiny at 16 x 16, coverage 0 to 255, row\n'
        '   by row, and FAVICON_PNG the same pixels as a PNG data URI. */\n'
    )
    body = (
        f'export const MARK = {json.dumps(data, separators=(",", ":"))};\n\n'
        f'export const FAVICON_16 = {json.dumps(fav, separators=(",", ":"))};\n\n'
        f'export const FAVICON_PNG = {json.dumps(favicon_png(fav))};\n'
    )
    with open(OUT, 'w', encoding='utf-8', newline='\r\n') as fh:
        fh.write(header + '\n' + body)
    print('wrote', OUT)
    for k, v in data.items():
        islands = sum(len(g['inner']) for g in v['letters'])
        print(f'  {k}: {v["w"]:.1f} x {v["h"]:.1f}, {len(v["letters"])} letters, {islands} counters')


if __name__ == '__main__':
    main()
