/*
 * Integration card — adapted from the 21st.dev "integration-card" for this
 * codebase (Vite + React 18, JSX, framer-motion, lucide-react). The original
 * pulled in motion/react, @base-ui/react and class-variance-authority and
 * dressed itself as a rounded shadcn card with a dotted ground; here it is
 * drawn as a module on the C4i board (/ServiceAI's solder-mask world): tool
 * nodes on two rails, orthogonal copper traces into the C4i core, a pulse
 * travelling each net. Everything is data-driven: pass the tools you really
 * connect. Under `staticMode` nothing moves (prerender and reduced motion).
 */
import { motion } from 'framer-motion';
import { Link } from '@/components/c4/SiteLink';
import { ArrowRight } from 'lucide-react';

const W = 564, H = 410, CX = 282, CY = 205;
const CHIP = 44; // half-size of the core
const NODE = 22; // half-size of a tool node
const RAIL = { left: 108, right: W - 108 };
const ROWS = [58, 132, 206, 280, 354];

/* An orthogonal trace with two rounded bends: chip edge → bus → node. */
function trace(side, exitY, nodeY, nodeX) {
  const r = 8;
  const dir = side === 'left' ? -1 : 1;
  const x0 = CX + dir * CHIP;
  const xm = CX + dir * (CHIP + 42);
  const x1 = nodeX - dir * NODE;
  if (Math.abs(nodeY - exitY) < r * 2) return `M${x0} ${exitY} H${x1}`;
  const down = nodeY > exitY ? 1 : -1;
  return `M${x0} ${exitY} H${xm - dir * r} Q${xm} ${exitY} ${xm} ${exitY + down * r} V${nodeY - down * r} Q${xm} ${nodeY} ${xm + dir * r} ${nodeY} H${x1}`;
}

/* Lay the items out on the two rails: the first half on the left, the rest on the right. */
export function layoutNets(items) {
  const half = Math.ceil(items.length / 2);
  return items.map((item, i) => {
    const side = i < half ? 'left' : 'right';
    const row = side === 'left' ? i : i - half;
    const count = side === 'left' ? half : items.length - half;
    const rows = ROWS.slice(Math.floor((ROWS.length - count) / 2), Math.floor((ROWS.length - count) / 2) + count);
    const y = rows[row] ?? CY;
    const x = RAIL[side];
    const exitY = CY + (row - (count - 1) / 2) * 13;
    return { ...item, side, x, y, path: trace(side, exitY, y, x), delay: i * 0.33 };
  });
}

export function Integration({ items, staticMode = false, coreLabel = 'C4i', coreSub = 'CLOUD CORE' }) {
  const nets = layoutNets(items);
  return (
    <svg className="cw-integ-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cw-integ-pulse" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
          <stop offset="0" stopColor="var(--cw-copper)" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="var(--cw-gold)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--cw-copper)" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* traces */}
      <g className="cw-integ-traces">
        {nets.map((n) => (
          <path key={`t-${n.id}`} d={n.path} className="cw-integ-trace" />
        ))}
        {!staticMode && nets.map((n) => (
          <motion.path
            key={`p-${n.id}`}
            d={n.path}
            className="cw-integ-pulse"
            strokeDasharray="26 260"
            initial={{ strokeDashoffset: 286 }}
            animate={{ strokeDashoffset: -286 }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'linear', delay: n.delay }}
          />
        ))}
        {/* vias where each trace leaves the bus */}
        {nets.map((n) => {
          const dir = n.side === 'left' ? -1 : 1;
          return <circle key={`v-${n.id}`} cx={CX + dir * (CHIP + 42)} cy={n.y} r="2.2" className="cw-integ-via" />;
        })}
      </g>
      {/* the core */}
      <g className="cw-integ-core" transform={`translate(${CX} ${CY})`}>
        {Array.from({ length: 6 }).map((_, i) => {
          const y = -30 + i * 12;
          return (
            <g key={i}>
              <line x1={-CHIP - 8} y1={y} x2={-CHIP} y2={y} className="cw-integ-pin" />
              <line x1={CHIP} y1={y} x2={CHIP + 8} y2={y} className="cw-integ-pin" />
            </g>
          );
        })}
        <rect x={-CHIP} y={-CHIP} width={CHIP * 2} height={CHIP * 2} rx="9" className="cw-integ-chip" />
        <rect x={-CHIP + 6} y={-CHIP + 6} width={CHIP * 2 - 12} height={CHIP * 2 - 12} rx="6" className="cw-integ-chip-inner" />
        <text x="0" y="4" textAnchor="middle" className="cw-integ-chip-name">{coreLabel}</text>
        <text x="0" y="24" textAnchor="middle" className="cw-integ-chip-sub">{coreSub}</text>
        {staticMode ? (
          <circle cx={CHIP - 12} cy={-CHIP + 12} r="3" className="cw-integ-led" />
        ) : (
          <motion.circle cx={CHIP - 12} cy={-CHIP + 12} r="3" className="cw-integ-led" animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }} />
        )}
      </g>
      {/* the tools */}
      {nets.map((n, i) => {
        const Icon = n.icon;
        const node = (
          <g className="cw-integ-node" transform={`translate(${n.x} ${n.y})`}>
            <rect x={-NODE} y={-NODE} width={NODE * 2} height={NODE * 2} rx="7" className="cw-integ-node-box" />
            {Icon ? <Icon x={-9} y={-9} width={18} height={18} className="cw-integ-icon" strokeWidth={1.6} aria-hidden="true" /> : null}
            <text x="0" y={NODE + 13} textAnchor="middle" className="cw-integ-label">{n.label}</text>
          </g>
        );
        if (staticMode) return <g key={n.id}>{node}</g>;
        return (
          <motion.g key={n.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.5, delay: 0.08 * i }}>
            {node}
          </motion.g>
        );
      })}
    </svg>
  );
}

export function IntegrationCard({ visual, title, description, cta, toolNames = [] }) {
  return (
    <div className="cw-integ">
      <div className="cw-integ-visual" role="img" aria-label={toolNames.length ? `${title}. Connected tools: ${toolNames.join(', ')}.` : title}>
        <span className="cw-integ-corner cw-integ-corner--tl" aria-hidden="true" />
        <span className="cw-integ-corner cw-integ-corner--br" aria-hidden="true" />
        {visual}
      </div>
      <div className="cw-integ-body">
        <h3 className="cw-integ-title">{title}</h3>
        <p className="cw-integ-desc">{description}</p>
        {cta ? (
          <Link to={cta.to} className="cw-btn cw-btn--ghost cw-integ-cta">
            {cta.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default IntegrationCard;
