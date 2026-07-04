/**
 * BoundaryDiagram — the whole argument, animated.
 *
 * A rounded boundary labelled YOUR OFFICE. Three nodes inside it, drawn
 * and connected on scroll. Small ink dots run along the connectors on a
 * loop; two dots periodically drift toward the boundary and visibly stop
 * at the wall. Nothing ever crosses the outline.
 *
 * Reduced motion / prerender: static diagram, dots omitted, caption kept.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Node {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

interface Geo {
  vb: string;
  boundary: { x: number; y: number; w: number; h: number; rx: number };
  label: { rx: number; ry: number; rw: number; rh: number; tx: number; ty: number; size: number };
  nodes: Node[];
  connectors: { x1: number; y1: number; x2: number; y2: number }[];
  vertical: boolean;
  /** Dots that test the wall: from a node edge toward the boundary, and back. */
  escapes: { fromX: number; fromY: number; toX: number; toY: number }[];
  caption: { x: number; y: number; size: number };
  fontSize: number;
}

const DESKTOP: Geo = {
  vb: '0 0 920 400',
  boundary: { x: 16, y: 36, w: 888, h: 328, rx: 18 },
  label: { rx: 30, ry: 28, rw: 114, rh: 16, tx: 38, ty: 40, size: 11 },
  nodes: [
    { x: 70, y: 150, w: 190, h: 64, label: 'YOUR DOCUMENTS' },
    { x: 365, y: 150, w: 190, h: 64, label: 'INDEXED LOCALLY' },
    { x: 660, y: 150, w: 190, h: 64, label: 'ANSWERED LOCALLY' },
  ],
  connectors: [
    { x1: 260, y1: 182, x2: 365, y2: 182 },
    { x1: 555, y1: 182, x2: 660, y2: 182 },
  ],
  vertical: false,
  escapes: [
    { fromX: 850, fromY: 182, toX: 898, toY: 182 },
    { fromX: 460, fromY: 214, toX: 460, toY: 357 },
  ],
  caption: { x: 888, y: 350, size: 10 },
  fontSize: 11.5,
};

const MOBILE: Geo = {
  vb: '0 0 360 560',
  boundary: { x: 10, y: 30, w: 340, h: 500, rx: 16 },
  label: { rx: 22, ry: 22, rw: 102, rh: 16, tx: 28, ty: 34, size: 10 },
  nodes: [
    { x: 80, y: 80, w: 200, h: 56, label: 'YOUR DOCUMENTS' },
    { x: 80, y: 230, w: 200, h: 56, label: 'INDEXED LOCALLY' },
    { x: 80, y: 380, w: 200, h: 56, label: 'ANSWERED LOCALLY' },
  ],
  connectors: [
    { x1: 180, y1: 136, x2: 180, y2: 230 },
    { x1: 180, y1: 286, x2: 180, y2: 380 },
  ],
  vertical: true,
  escapes: [
    { fromX: 280, fromY: 258, toX: 344, toY: 258 },
    { fromX: 180, fromY: 436, toX: 180, toY: 524 },
  ],
  caption: { x: 338, y: 514, size: 9 },
  fontSize: 10.5,
};

export default function BoundaryDiagram({ staticMode }: { staticMode: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    setMobile(mq.matches);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const geo = mobile ? MOBILE : DESKTOP;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || staticMode) return undefined;

    const ctx = gsap.context(() => {
      const boundary = root.querySelector<SVGRectElement>('[data-pa-bound]');
      const labelG = root.querySelector('[data-pa-boundlabel]');
      const nodes = root.querySelectorAll('[data-pa-node]');
      const lines = root.querySelectorAll<SVGLineElement>('[data-pa-conn]');
      const caption = root.querySelector('[data-pa-caption]');
      const travellers = root.querySelectorAll<SVGCircleElement>('[data-pa-dot]');
      const escapes = root.querySelectorAll<SVGCircleElement>('[data-pa-escape]');
      if (!boundary) return;

      // Prepare stroke drawing.
      const bLen = boundary.getTotalLength();
      gsap.set(boundary, { strokeDasharray: bLen, strokeDashoffset: bLen });
      lines.forEach((line) => {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set([labelG, caption], { autoAlpha: 0 });
      gsap.set(nodes, { autoAlpha: 0, y: 8 });

      const startLoops = () => {
        // Six dots along the connectors, three per line, offset starts.
        travellers.forEach((dot, i) => {
          const conn = geo.connectors[i < 3 ? 0 : 1];
          const attrFrom = geo.vertical ? { cy: conn.y1 + 4 } : { cx: conn.x1 + 4 };
          const attrMid = geo.vertical ? { cy: conn.y2 - 10 } : { cx: conn.x2 - 10 };
          const attrEnd = geo.vertical ? { cy: conn.y2 - 4 } : { cx: conn.x2 - 4 };
          gsap
            .timeline({ repeat: -1, delay: (i % 3) * 1.1 + (i < 3 ? 0 : 0.55), repeatDelay: 0.9 })
            .fromTo(dot, { attr: attrFrom, autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.25, ease: 'none' })
            .to(dot, { attr: attrMid, duration: 1.6, ease: 'none' })
            .to(dot, { attr: attrEnd, autoAlpha: 0, duration: 0.25, ease: 'none' });
        });

        // Two dots drift toward the boundary and stop at the wall.
        escapes.forEach((dot, i) => {
          const esc = geo.escapes[i];
          const axis = esc.fromX === esc.toX ? 'cy' : 'cx';
          const from = axis === 'cx' ? esc.fromX : esc.fromY;
          const to = axis === 'cx' ? esc.toX : esc.toY;
          const dir = to > from ? 1 : -1;
          gsap
            .timeline({ repeat: -1, delay: 1.4 + i * 2.3, repeatDelay: 2.8 })
            .fromTo(
              dot,
              { attr: { cx: esc.fromX, cy: esc.fromY }, autoAlpha: 0 },
              { autoAlpha: 0.9, duration: 0.2 },
            )
            .to(dot, { attr: { [axis]: to }, duration: 0.9, ease: 'power2.out' })
            // The 4px bounce off the wall. It never crosses.
            .to(dot, { attr: { [axis]: to - 4 * dir }, duration: 0.12, ease: 'power1.out' })
            .to(dot, { attr: { [axis]: to }, duration: 0.16, ease: 'power1.inOut' })
            .to(dot, { attr: { [axis]: from }, duration: 0.7, ease: 'power2.inOut' }, '+=0.35')
            .to(dot, { autoAlpha: 0, duration: 0.2 });
        });
      };

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
          onComplete: startLoops,
        })
        .to(boundary, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
        .to(labelG, { autoAlpha: 1, duration: 0.4 }, '-=0.4')
        .to(nodes[0], { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.15')
        .to(lines[0], { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' })
        .to(nodes[1], { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.1')
        .to(lines[1], { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' })
        .to(nodes[2], { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.1')
        .to(caption, { autoAlpha: 1, duration: 0.5 }, '+=0.2');
    }, root);

    return () => ctx.revert();
  }, [geo, staticMode]);

  return (
    <div ref={rootRef} role="img" aria-label="Diagram: your documents are indexed and answered inside your office. Nothing crosses the boundary of your local network.">
      <svg viewBox={geo.vb} width="100%" style={{ display: 'block' }} aria-hidden="true">
        {/* Boundary */}
        <rect
          data-pa-bound
          x={geo.boundary.x}
          y={geo.boundary.y}
          width={geo.boundary.w}
          height={geo.boundary.h}
          rx={geo.boundary.rx}
          fill="none"
          stroke="var(--pa-hair)"
          strokeWidth="1.5"
        />
        <g data-pa-boundlabel>
          <rect
            x={geo.label.rx}
            y={geo.label.ry}
            width={geo.label.rw}
            height={geo.label.rh}
            fill="var(--pa-bg)"
          />
          <text
            x={geo.label.tx}
            y={geo.label.ty}
            fontFamily="var(--pa-mono)"
            fontSize={geo.label.size}
            letterSpacing="0.14em"
            fill="var(--pa-ink)"
          >
            YOUR OFFICE
          </text>
        </g>

        {/* Nodes */}
        {geo.nodes.map((n) => (
          <g data-pa-node key={n.label}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx="8"
              fill="var(--pa-white)"
              stroke="var(--pa-hair)"
              strokeWidth="1.5"
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + n.h / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--pa-mono)"
              fontSize={geo.fontSize}
              letterSpacing="0.1em"
              fill="var(--pa-ink)"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Connectors */}
        {geo.connectors.map((c, i) => (
          <line
            data-pa-conn
            key={i}
            x1={c.x1}
            y1={c.y1}
            x2={c.x2}
            y2={c.y2}
            stroke="var(--pa-ink)"
            strokeWidth="1.5"
          />
        ))}

        {/* Travelling dots (animated only; omitted under reduced motion) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <circle
            data-pa-dot
            key={i}
            cx={geo.connectors[i < 3 ? 0 : 1].x1}
            cy={geo.connectors[i < 3 ? 0 : 1].y1}
            r="3"
            fill="var(--pa-ink)"
            opacity="0"
          />
        ))}
        {geo.escapes.map((e, i) => (
          <circle
            data-pa-escape
            key={i}
            cx={e.fromX}
            cy={e.fromY}
            r="3.5"
            fill="var(--pa-ink)"
            opacity="0"
          />
        ))}

        {/* Caption */}
        <text
          data-pa-caption
          x={geo.caption.x}
          y={geo.caption.y}
          textAnchor="end"
          fontFamily="var(--pa-mono)"
          fontSize={geo.caption.size}
          letterSpacing="0.1em"
          fill="var(--pa-mute)"
        >
          nothing crosses this line
        </text>
      </svg>
    </div>
  );
}
