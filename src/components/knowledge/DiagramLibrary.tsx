import React from 'react';

// ── Shared SVG helpers ────────────────────────────────────────────────────────
const NAVY = '#1B4332';
const BLUE = '#2563EB';
const GOLD = '#D4A843';
const GRAY = '#6B7280';
const RED  = '#DC2626';
const GREEN = '#16A34A';

// ── Individual diagrams ───────────────────────────────────────────────────────

const ParallelPlate: React.FC = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-xs mx-auto" aria-label="Parallel plate capacitor diagram">
    <defs>
      <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={BLUE} />
      </marker>
      <marker id="dim-arr-l" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
        <polygon points="6 0, 0 3, 6 6" fill={GRAY} />
      </marker>
      <marker id="dim-arr-r" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
        <polygon points="0 0, 6 3, 0 6" fill={GRAY} />
      </marker>
    </defs>

    {/* Left plate (+) */}
    <rect x="80" y="25" width="12" height="155" fill={NAVY} rx="3" />
    {[45, 75, 105, 135, 160].map((y, i) => (
      <text key={i} x="65" y={y} fill={RED} fontSize="16" fontWeight="bold">+</text>
    ))}

    {/* Right plate (−) */}
    <rect x="248" y="25" width="12" height="155" fill={NAVY} rx="3" />
    {[45, 75, 105, 135, 160].map((y, i) => (
      <text key={i} x="265" y={y} fill={BLUE} fontSize="16" fontWeight="bold">−</text>
    ))}

    {/* Electric field lines */}
    {[55, 90, 125, 160].map((y, i) => (
      <line key={i} x1="96" y1={y} x2="244" y2={y}
        stroke={BLUE} strokeWidth="1.5" markerEnd="url(#arr)" />
    ))}

    {/* E label */}
    <text x="165" y="110" textAnchor="middle" fill={BLUE} fontSize="14" fontStyle="italic" fontWeight="600">E</text>

    {/* d dimension line */}
    <line x1="96" y1="195" x2="248" y2="195" stroke={GRAY} strokeWidth="1"
      markerStart="url(#dim-arr-l)" markerEnd="url(#dim-arr-r)" />
    <text x="172" y="208" textAnchor="middle" fill={GRAY} fontSize="12" fontStyle="italic">d</text>

    {/* A label (area of plate) */}
    <text x="30" y="105" fill={NAVY} fontSize="12" fontStyle="italic">A</text>
    <line x1="45" y1="25" x2="45" y2="180" stroke={NAVY} strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

    {/* Caption */}
    <text x="170" y="22" textAnchor="middle" fill={GRAY} fontSize="11">Parallel Plate Capacitor</text>
  </svg>
);

const CapSeries: React.FC = () => (
  <svg viewBox="0 0 360 160" className="w-full max-w-sm mx-auto" aria-label="Capacitors in series">
    <defs>
      <marker id="arr2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={NAVY} />
      </marker>
    </defs>

    {/* Wire top */}
    <line x1="30" y1="60" x2="330" y2="60" stroke={NAVY} strokeWidth="2" />
    {/* Wire bottom */}
    <line x1="30" y1="110" x2="330" y2="110" stroke={NAVY} strokeWidth="2" />
    {/* Left vertical */}
    <line x1="30" y1="60" x2="30" y2="110" stroke={NAVY} strokeWidth="2" />
    {/* Right vertical */}
    <line x1="330" y1="60" x2="330" y2="110" stroke={NAVY} strokeWidth="2" />

    {/* Battery on left side */}
    <line x1="30" y1="75" x2="50" y2="75" stroke={NAVY} strokeWidth="2" />
    <line x1="50" y1="68" x2="50" y2="82" stroke={NAVY} strokeWidth="3" />
    <line x1="55" y1="72" x2="55" y2="78" stroke={NAVY} strokeWidth="1.5" />
    <line x1="55" y1="75" x2="75" y2="75" stroke={NAVY} strokeWidth="2" />
    <text x="35" y="67" fill={RED} fontSize="11" fontWeight="bold">+</text>
    <text x="60" y="68" fill={BLUE} fontSize="11" fontWeight="bold">−</text>
    <text x="52" y="95" textAnchor="middle" fill={GRAY} fontSize="10">V</text>

    {/* Capacitor C1 */}
    <line x1="130" y1="60" x2="130" y2="48" stroke={NAVY} strokeWidth="2" />
    <line x1="110" y1="48" x2="150" y2="48" stroke={NAVY} strokeWidth="3" />
    <line x1="110" y1="43" x2="150" y2="43" stroke={NAVY} strokeWidth="3" />
    <line x1="130" y1="43" x2="130" y2="32" stroke={NAVY} strokeWidth="2" />
    <text x="130" y="25" textAnchor="middle" fill={NAVY} fontSize="13" fontWeight="600">C₁</text>
    <text x="130" y="80" textAnchor="middle" fill={BLUE} fontSize="11" fontStyle="italic">V₁</text>

    {/* Capacitor C2 */}
    <line x1="230" y1="60" x2="230" y2="48" stroke={NAVY} strokeWidth="2" />
    <line x1="210" y1="48" x2="250" y2="48" stroke={NAVY} strokeWidth="3" />
    <line x1="210" y1="43" x2="250" y2="43" stroke={NAVY} strokeWidth="3" />
    <line x1="230" y1="43" x2="230" y2="32" stroke={NAVY} strokeWidth="2" />
    <text x="230" y="25" textAnchor="middle" fill={NAVY} fontSize="13" fontWeight="600">C₂</text>
    <text x="230" y="80" textAnchor="middle" fill={BLUE} fontSize="11" fontStyle="italic">V₂</text>

    {/* Current arrow */}
    <line x1="165" y1="56" x2="195" y2="56" stroke={GOLD} strokeWidth="1.5" markerEnd="url(#arr2)" opacity="0.7" />
    <text x="180" y="52" textAnchor="middle" fill={GOLD} fontSize="10" fontStyle="italic">Q</text>

    {/* Caption */}
    <text x="180" y="145" textAnchor="middle" fill={GRAY} fontSize="11">Same charge Q on each · Voltages add: V = V₁ + V₂</text>
  </svg>
);

const CapParallel: React.FC = () => (
  <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto" aria-label="Capacitors in parallel">
    {/* Left bus */}
    <line x1="60" y1="30" x2="60" y2="150" stroke={NAVY} strokeWidth="2" />
    {/* Right bus */}
    <line x1="280" y1="30" x2="280" y2="150" stroke={NAVY} strokeWidth="2" />
    {/* Top wire */}
    <line x1="60" y1="30" x2="280" y2="30" stroke={NAVY} strokeWidth="2" />
    {/* Bottom wire */}
    <line x1="60" y1="150" x2="280" y2="150" stroke={NAVY} strokeWidth="2" />

    {/* Battery */}
    <line x1="60" y1="80" x2="40" y2="80" stroke={NAVY} strokeWidth="2" />
    <line x1="40" y1="73" x2="40" y2="87" stroke={NAVY} strokeWidth="3" />
    <line x1="35" y1="77" x2="35" y2="83" stroke={NAVY} strokeWidth="1.5" />
    <line x1="35" y1="80" x2="15" y2="80" stroke={NAVY} strokeWidth="2" />
    <line x1="15" y1="80" x2="15" y2="120" stroke={NAVY} strokeWidth="2" />
    <line x1="15" y1="120" x2="60" y2="120" stroke={NAVY} strokeWidth="2" />
    <text x="30" y="72" fill={RED} fontSize="11" fontWeight="bold">+</text>
    <text x="20" y="68" fill={NAVY} fontSize="11">V</text>

    {/* C1 branch */}
    <line x1="130" y1="30" x2="130" y2="75" stroke={NAVY} strokeWidth="2" />
    <line x1="110" y1="75" x2="150" y2="75" stroke={NAVY} strokeWidth="3" />
    <line x1="110" y1="81" x2="150" y2="81" stroke={NAVY} strokeWidth="3" />
    <line x1="130" y1="81" x2="130" y2="150" stroke={NAVY} strokeWidth="2" />
    <text x="160" y="82" fill={NAVY} fontSize="13" fontWeight="600">C₁</text>

    {/* C2 branch */}
    <line x1="210" y1="30" x2="210" y2="75" stroke={NAVY} strokeWidth="2" />
    <line x1="190" y1="75" x2="230" y2="75" stroke={NAVY} strokeWidth="3" />
    <line x1="190" y1="81" x2="230" y2="81" stroke={NAVY} strokeWidth="3" />
    <line x1="210" y1="81" x2="210" y2="150" stroke={NAVY} strokeWidth="2" />
    <text x="240" y="82" fill={NAVY} fontSize="13" fontWeight="600">C₂</text>

    {/* V labels on each branch */}
    <text x="85" y="92" fill={BLUE} fontSize="11" fontStyle="italic">V</text>
    <text x="85" y="102" fill={BLUE} fontSize="9">(same)</text>

    {/* Caption */}
    <text x="170" y="172" textAnchor="middle" fill={GRAY} fontSize="11">Same voltage V · Charges add: Q = Q₁ + Q₂</text>
  </svg>
);

const RcCircuit: React.FC = () => (
  <svg viewBox="0 0 360 200" className="w-full max-w-sm mx-auto" aria-label="RC charging circuit">
    <defs>
      <marker id="arr3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={GOLD} />
      </marker>
    </defs>

    {/* Outer rectangle wire */}
    <rect x="40" y="40" width="280" height="130" fill="none" stroke={NAVY} strokeWidth="2" rx="8" />

    {/* Battery (left side) */}
    <line x1="40" y1="85" x2="70" y2="85" stroke={NAVY} strokeWidth="2" />
    <line x1="70" y1="74" x2="70" y2="96" stroke={NAVY} strokeWidth="3.5" />
    <line x1="78" y1="79" x2="78" y2="91" stroke={NAVY} strokeWidth="2" />
    <line x1="78" y1="85" x2="110" y2="85" stroke={NAVY} strokeWidth="2" />
    <text x="57" y="70" fill={RED} fontSize="12" fontWeight="bold">+</text>
    <text x="82" y="70" fill={BLUE} fontSize="12" fontWeight="bold">−</text>
    <text x="75" y="120" textAnchor="middle" fill={NAVY} fontSize="12" fontWeight="600">V₀</text>

    {/* Resistor (top wire, middle) */}
    <line x1="130" y1="40" x2="150" y2="40" stroke={NAVY} strokeWidth="2" />
    {[0,1,2,3,4,5].map(i => (
      <line key={i}
        x1={150 + i * 16} y1={i % 2 === 0 ? 32 : 48}
        x2={150 + (i + 1) * 16} y2={i % 2 === 0 ? 48 : 32}
        stroke={NAVY} strokeWidth="2" />
    ))}
    <line x1="246" y1="40" x2="280" y2="40" stroke={NAVY} strokeWidth="2" />
    <text x="196" y="22" textAnchor="middle" fill={NAVY} fontSize="13" fontWeight="600">R</text>

    {/* Capacitor (right side) */}
    <line x1="320" y1="75" x2="320" y2="95" stroke={NAVY} strokeWidth="2" />
    <line x1="302" y1="95" x2="338" y2="95" stroke={NAVY} strokeWidth="3.5" />
    <line x1="302" y1="103" x2="338" y2="103" stroke={NAVY} strokeWidth="3.5" />
    <line x1="320" y1="103" x2="320" y2="130" stroke={NAVY} strokeWidth="2" />
    <text x="345" y="102" fill={NAVY} fontSize="13" fontWeight="600">C</text>
    <text x="345" y="118" fill={BLUE} fontSize="11" fontStyle="italic">V_C</text>

    {/* Current arrow (top) */}
    <line x1="175" y1="32" x2="215" y2="32" stroke={GOLD} strokeWidth="1.5" markerEnd="url(#arr3)" />
    <text x="193" y="28" textAnchor="middle" fill={GOLD} fontSize="11" fontStyle="italic">I(t)</text>

    {/* Labels: τ = RC */}
    <text x="180" y="185" textAnchor="middle" fill={GRAY} fontSize="11">Time constant  τ = RC</text>
  </svg>
);

const RcCurve: React.FC = () => {
  // Generate exponential charging curve points
  const W = 300; const H = 130;
  const PAD_L = 40; const PAD_B = 30; const PAD_T = 15; const PAD_R = 20;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const points = Array.from({ length: 80 }, (_, i) => {
    const t = (i / 79) * 5.5;
    const v = 1 - Math.exp(-t);
    const x = PAD_L + (t / 5.5) * plotW;
    const y = PAD_T + plotH - v * plotH;
    return `${x},${y}`;
  }).join(' ');

  const ticks = [1, 2, 3, 4, 5]; // τ values

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" aria-label="RC charging curve">
      {/* Axes */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={NAVY} strokeWidth="1.5" />
      <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={NAVY} strokeWidth="1.5" />

      {/* V₀ dashed line */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L + plotW} y2={PAD_T}
        stroke={GRAY} strokeWidth="1" strokeDasharray="5 3" />
      <text x={PAD_L - 4} y={PAD_T + 4} textAnchor="end" fill={NAVY} fontSize="11" fontStyle="italic">V₀</text>

      {/* 63% dashed line (at τ) */}
      {(() => {
        const tx = PAD_L + (1 / 5.5) * plotW;
        const ty = PAD_T + plotH - 0.632 * plotH;
        return (
          <>
            <line x1={PAD_L} y1={ty} x2={tx} y2={ty} stroke={GOLD} strokeWidth="1" strokeDasharray="4 3" />
            <line x1={tx} y1={ty} x2={tx} y2={PAD_T + plotH} stroke={GOLD} strokeWidth="1" strokeDasharray="4 3" />
            <text x={PAD_L - 3} y={ty + 4} textAnchor="end" fill={GOLD} fontSize="10">0.63V₀</text>
          </>
        );
      })()}

      {/* Curve */}
      <polyline points={points} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* τ tick marks on x-axis */}
      {ticks.map(t => {
        const x = PAD_L + (t / 5.5) * plotW;
        return (
          <g key={t}>
            <line x1={x} y1={PAD_T + plotH} x2={x} y2={PAD_T + plotH + 4} stroke={NAVY} strokeWidth="1" />
            <text x={x} y={PAD_T + plotH + 13} textAnchor="middle" fill={GRAY} fontSize="10">{t}τ</text>
          </g>
        );
      })}

      {/* Axis labels */}
      <text x={PAD_L + plotW / 2} y={H - 2} textAnchor="middle" fill={GRAY} fontSize="11">Time (t)</text>
      <text x={10} y={PAD_T + plotH / 2} fill={GRAY} fontSize="11"
        transform={`rotate(-90, 10, ${PAD_T + plotH / 2})`} textAnchor="middle">V_C</text>
    </svg>
  );
};

const DielectricPolarisation: React.FC = () => (
  <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto" aria-label="Dielectric polarisation">
    <defs>
      <marker id="arr4" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={BLUE} />
      </marker>
    </defs>

    {/* Plates */}
    <rect x="20" y="20" width="10" height="140" fill={NAVY} rx="2" />
    <rect x="310" y="20" width="10" height="140" fill={NAVY} rx="2" />
    {[40, 70, 100, 130, 155].map((y, i) => (
      <text key={i} x="8" y={y} fill={RED} fontSize="14" fontWeight="bold">+</text>
    ))}
    {[40, 70, 100, 130, 155].map((y, i) => (
      <text key={i} x="322" y={y} fill={BLUE} fontSize="14" fontWeight="bold">−</text>
    ))}

    {/* Dielectric block */}
    <rect x="35" y="20" width="270" height="140" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" rx="4" />
    <text x="170" y="14" textAnchor="middle" fill={NAVY} fontSize="11">Dielectric material</text>

    {/* Dipole molecules (ovals with + on right, - on left, shifted right) */}
    {[
      [75, 55], [145, 55], [215, 55], [275, 55],
      [75, 100], [145, 100], [215, 100], [275, 100],
      [75, 145], [145, 145], [215, 145], [275, 145],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx="22" ry="12" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <text x={cx - 10} y={cy + 4} fill={BLUE} fontSize="11" fontWeight="bold">−</text>
        <text x={cx + 5} y={cy + 4} fill={RED} fontSize="11" fontWeight="bold">+</text>
      </g>
    ))}

    {/* E field arrow */}
    <line x1="35" y1="170" x2="305" y2="170" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#arr4)" />
    <text x="170" y="182" textAnchor="middle" fill={BLUE} fontSize="11" fontStyle="italic">E (applied field)</text>
  </svg>
);

const EnergyInCapacitor: React.FC = () => (
  <svg viewBox="0 0 300 160" className="w-full max-w-xs mx-auto" aria-label="Energy stored in capacitor">
    {/* Shaded area representing energy */}
    <defs>
      <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={BLUE} stopOpacity="0.25" />
        <stop offset="100%" stopColor={BLUE} stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* Axes */}
    <line x1="45" y1="15" x2="45" y2="130" stroke={NAVY} strokeWidth="1.5" />
    <line x1="45" y1="130" x2="265" y2="130" stroke={NAVY} strokeWidth="1.5" />

    {/* Diagonal line V = Q/C */}
    <line x1="45" y1="130" x2="245" y2="20" stroke={NAVY} strokeWidth="2" />

    {/* Shaded triangle (energy = ½QV) */}
    <polygon points="45,130 245,130 245,20" fill="url(#energyGrad)" stroke={BLUE} strokeWidth="1" strokeDasharray="4 3" />

    {/* Labels */}
    <text x="38" y="20" textAnchor="end" fill={NAVY} fontSize="12" fontStyle="italic">V</text>
    <text x="265" y="134" fill={NAVY} fontSize="12" fontStyle="italic">Q</text>

    {/* Q_max and V_max tick */}
    <line x1="245" y1="130" x2="245" y2="135" stroke={NAVY} strokeWidth="1" />
    <text x="245" y="145" textAnchor="middle" fill={GRAY} fontSize="10">Q</text>
    <line x1="40" y1="20" x2="45" y2="20" stroke={NAVY} strokeWidth="1" />
    <text x="38" y="24" textAnchor="end" fill={GRAY} fontSize="10">V</text>

    {/* Energy label inside triangle */}
    <text x="180" y="105" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">U = ½QV</text>
    <text x="180" y="120" textAnchor="middle" fill={BLUE} fontSize="11">= ½CV²</text>

    {/* Caption */}
    <text x="150" y="155" textAnchor="middle" fill={GRAY} fontSize="11">Shaded area = energy stored</text>
  </svg>
);

// ── Diagram registry ──────────────────────────────────────────────────────────
const DIAGRAMS: Record<string, React.FC> = {
  'parallel-plate':        ParallelPlate,
  'cap-series':            CapSeries,
  'cap-parallel':          CapParallel,
  'rc-circuit':            RcCircuit,
  'rc-curve':              RcCurve,
  'dielectric-polarisation': DielectricPolarisation,
  'energy-in-capacitor':   EnergyInCapacitor,
};

// ── Public component ──────────────────────────────────────────────────────────
interface DiagramProps { name: string }

const Diagram: React.FC<DiagramProps> = ({ name }) => {
  const Component = DIAGRAMS[name];
  if (!Component) return null;
  return (
    <div className="my-4 bg-premium-neutral-50 border border-premium-neutral-200 rounded-2xl p-4 flex justify-center items-center">
      <Component />
    </div>
  );
};

export default Diagram;
