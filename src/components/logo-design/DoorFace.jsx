/*
 * The Logo Design door's face, for the home page's four doors.
 *
 * Our own mark, drawn the way it sits in a logo designer's working file: the 4
 * of the C4 mark filled in its two greys, every corner carrying its anchor
 * point, and the C's lower terminal coming in as a bare outline with the
 * bezier handles that shape it. The 4 is all straight lines, so the handles
 * come from the C, the only curved path in the mark. The ground is the C's own
 * light grey, which is why the C shows only as its outline.
 *
 * The geometry is the site logo's, copied from MARK_SOURCE in
 * src/components/c4/C4Logo.jsx (that file doesn't export it), so nothing here
 * is invented. If the mark ever changes, change it there and here together.
 *
 * Tall faces crop the 4 big: its stem runs off the top and its arm off the
 * right, the way the C4Site banners crop their own 4, and the type keeps the
 * top left and the foot. Short, wide faces (the one-column phone layout) run
 * the same 4 off the top in the right half, with the arm's slanted end kept
 * whole. Decorative, so aria-hidden; the door's label and title are FourDoors'
 * own.
 */
import './door.css';

const BODY = [[554.78, 94.43], [554.76, 300.21], [485.93, 300.21], [485.93, 177.58], [395.65, 308.72], [485.93, 308.72], [453.55, 357.3], [304.78, 357.3], [304.78, 323.95], [470.27, 94.43]];
const ARM = [[639.36, 308.72], [606.98, 357.3], [554.78, 357.3], [554.78, 469.58], [503.71, 469.58], [503.71, 357.3], [472.55, 357.3], [504.93, 308.72]];
const C_PATH = 'M393.33,381.58l46.14.22c-37.51,42.67-88.07,71.58-143.72,82.18-89.37,18.53-180.59-21.95-227.2-100.84-38.21-64.03-30.59-145.6,18.81-201.36,33.03-37.88,79.33-61.47,129.25-65.83,54.95-7.69,110.91-3.19,163.94,13.2l-37.35,52.04c-31.06-6.51-62.95-8.01-94.47-4.41-43.91,2.38-84.08,25.62-108.21,62.59-14,27.78-16.89,59.9-8.08,89.75,13.18,47.07,49.8,83.83,96.63,97.01,55.92,11.27,114.01,2.59,164.26-24.56Z';
/* the C's on-curve points, and the handles of its lower terminal's outer curve */
const C_ANCHORS = [[393.33, 381.58], [439.47, 381.8], [295.75, 463.98], [68.55, 363.14], [87.36, 161.78], [216.61, 95.95], [380.55, 109.15], [343.2, 161.19], [248.73, 156.78], [140.52, 219.37], [132.44, 309.12], [229.07, 406.13]];
const HANDLES = [[[439.47, 381.8], [401.96, 424.47]], [[295.75, 463.98], [351.4, 453.38]], [[295.75, 463.98], [206.38, 482.51]]];

const points = (list) => list.map((p) => p.join(',')).join(' ');

function Construction({ x, y, w, h, sq, className, slice }) {
  const inView = ([px, py]) => px > x - sq && px < x + w + sq && py > y - sq && py < y + h + sq;
  const anchors = [...BODY, ...ARM, ...C_ANCHORS].filter(inView);
  const r = sq * 0.42;
  return (
    <svg className={className} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'} focusable="false">
      <path className="lg-door-c" d={C_PATH} />
      <polygon className="lg-door-body" points={points(BODY)} />
      <polygon className="lg-door-arm" points={points(ARM)} />
      {HANDLES.map(([a, b]) => (
        <g key={`${a}${b}`} className="lg-door-handle">
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          <circle cx={b[0]} cy={b[1]} r={r} />
        </g>
      ))}
      {anchors.map(([ax, ay]) => (
        <rect key={`${ax},${ay}`} className="lg-door-anchor" x={ax - sq / 2} y={ay - sq / 2} width={sq} height={sq} />
      ))}
    </svg>
  );
}

export default function LogoDoorFace() {
  return (
    <span className="lg-door" aria-hidden="true">
      <Construction className="lg-door-tall" x={262} y={170} w={300} h={400} sq={5.2} slice />
      <Construction className="lg-door-wide" x={298} y={165} w={345} h={330} sq={8.6} />
    </span>
  );
}
