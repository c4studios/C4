/*
 * The geometry of a vinyl peel, shared by the /logo-design stage and the
 * Logo Design door.
 *
 * A weeding box (x0, y0)–(x1, y1) is peeled from its top right corner
 * towards its bottom left. The fold is a straight line, perpendicular to that
 * diagonal, `s` units in from the corner. Everything on the corner's side of
 * the fold is lifted and lies reflected across it (the flap), so one number
 * describes the whole state of the peel.
 */
const BIG = 6000;
const fmt = (list) => list.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

export function makePeel({ x0, y0, x1, y1 }) {
  const TR = [x1, y0];
  const diag = [x0 - x1, y1 - y0];
  const L = Math.hypot(diag[0], diag[1]);
  const D = [diag[0] / L, diag[1] / L];
  const N = [-D[1], D[0]];
  const BOX = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

  const proj = (p) => (p[0] - TR[0]) * D[0] + (p[1] - TR[1]) * D[1];
  const along = (s, t = 0, u = 0) => [
    TR[0] + D[0] * (s + u) + N[0] * t,
    TR[1] + D[1] * (s + u) + N[1] * t,
  ];

  /* {p >= s}, the vinyl still down, or {p < s}, the part lifted. */
  const halfPlane = (s, lifted) => {
    const dir = lifted ? -BIG : BIG;
    return fmt([along(s, BIG), along(s, -BIG), along(s, -BIG, dir), along(s, BIG, dir)]);
  };

  /* The box cut down to its lifted side. */
  const liftedPart = (s) => {
    const out = [];
    for (let i = 0; i < BOX.length; i += 1) {
      const a = BOX[i];
      const b = BOX[(i + 1) % BOX.length];
      const pa = proj(a) - s;
      const pb = proj(b) - s;
      if (pa < 0) out.push(a);
      if ((pa < 0) !== (pb < 0)) {
        const t = pa / (pa - pb);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out;
  };

  const reflect = (p, s) => {
    const k = 2 * (proj(p) - s);
    return [p[0] - k * D[0], p[1] - k * D[1]];
  };

  /* x' = (I - 2dd^T) x + 2 (TR.d + s) d, as an SVG transform. */
  const mirror = (s) => {
    const c = 2 * (TR[0] * D[0] + TR[1] * D[1] + s);
    const m = [1 - 2 * D[0] * D[0], -2 * D[0] * D[1], -2 * D[0] * D[1], 1 - 2 * D[1] * D[1], c * D[0], c * D[1]];
    return `matrix(${m.map((v) => v.toFixed(5)).join(' ')})`;
  };

  /* Where the fold crosses the box, nudged `off` units onto the flap. */
  const foldPath = (s, off = 0) => {
    const hits = [];
    for (let i = 0; i < BOX.length; i += 1) {
      const a = BOX[i];
      const b = BOX[(i + 1) % BOX.length];
      const pa = proj(a) - s;
      const pb = proj(b) - s;
      if ((pa < 0) !== (pb < 0)) {
        const t = pa / (pa - pb);
        hits.push([a[0] + (b[0] - a[0]) * t + D[0] * off, a[1] + (b[1] - a[1]) * t + D[1] * off]);
      }
    }
    if (hits.length !== 2) return '';
    return `M${hits[0][0].toFixed(1)} ${hits[0][1].toFixed(1)} L${hits[1][0].toFixed(1)} ${hits[1][1].toFixed(1)}`;
  };

  /* The flap's outline, shifted for its cast shadow. */
  const shadow = (s, dx, dy) => {
    const part = liftedPart(s);
    return part.length > 2 ? fmt(part.map((p) => reflect(p, s)).map(([x, y]) => [x + dx, y + dy])) : '';
  };

  return { L, D, proj, halfPlane, mirror, foldPath, shadow, boxD: `M${x0} ${y0} H${x1} V${y1} H${x0} Z` };
}
