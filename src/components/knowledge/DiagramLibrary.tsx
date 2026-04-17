import React from 'react';

// ── Colour palette (matches app theme) ───────────────────────────────────────
const NAVY  = '#212754';
const BLUE  = '#2563EB';
const GOLD  = '#bbd7eb';
const GRAY  = '#6B7280';
const RED   = '#DC2626';
const GREEN = '#16A34A';
const PURPLE= '#7C3AED';
const TEAL  = '#0D9488';
const AMBER = '#D97706';

// ── Reusable arrow marker factory ─────────────────────────────────────────────
const ArrowDefs: React.FC<{ id?: string; color?: string }> = ({ id = 'arr', color = NAVY }) => (
  <defs>
    <marker id={id} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill={color} />
    </marker>
  </defs>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICS
// ═══════════════════════════════════════════════════════════════════════════════

const ParallelPlate: React.FC = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-xs mx-auto" aria-label="Parallel plate capacitor">
    <defs>
      <marker id="pp-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0,8 3,0 6" fill={BLUE} />
      </marker>
      <marker id="pp-dl" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
        <polygon points="6 0,0 3,6 6" fill={GRAY} />
      </marker>
      <marker id="pp-dr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
        <polygon points="0 0,6 3,0 6" fill={GRAY} />
      </marker>
    </defs>
    <rect x="80" y="25" width="12" height="155" fill={NAVY} rx="3"/>
    {[45,75,105,135,160].map((y,i)=><text key={i} x="65" y={y} fill={RED} fontSize="16" fontWeight="bold">+</text>)}
    <rect x="248" y="25" width="12" height="155" fill={NAVY} rx="3"/>
    {[45,75,105,135,160].map((y,i)=><text key={i} x="265" y={y} fill={BLUE} fontSize="16" fontWeight="bold">−</text>)}
    {[55,90,125,160].map((y,i)=>(
      <line key={i} x1="96" y1={y} x2="244" y2={y} stroke={BLUE} strokeWidth="1.5" markerEnd="url(#pp-arr)"/>
    ))}
    <text x="165" y="110" textAnchor="middle" fill={BLUE} fontSize="14" fontStyle="italic" fontWeight="600">E</text>
    <line x1="96" y1="195" x2="248" y2="195" stroke={GRAY} strokeWidth="1" markerStart="url(#pp-dl)" markerEnd="url(#pp-dr)"/>
    <text x="172" y="208" textAnchor="middle" fill={GRAY} fontSize="12" fontStyle="italic">d</text>
    <text x="170" y="18" textAnchor="middle" fill={GRAY} fontSize="11">Parallel Plate Capacitor  C = ε₀A/d</text>
  </svg>
);

const CapSeries: React.FC = () => (
  <svg viewBox="0 0 360 160" className="w-full max-w-sm mx-auto" aria-label="Capacitors in series">
    <ArrowDefs id="cs-arr" color={GOLD}/>
    <line x1="30" y1="60" x2="330" y2="60" stroke={NAVY} strokeWidth="2"/>
    <line x1="30" y1="110" x2="330" y2="110" stroke={NAVY} strokeWidth="2"/>
    <line x1="30" y1="60" x2="30" y2="110" stroke={NAVY} strokeWidth="2"/>
    <line x1="330" y1="60" x2="330" y2="110" stroke={NAVY} strokeWidth="2"/>
    <line x1="30" y1="85" x2="50" y2="85" stroke={NAVY} strokeWidth="2"/>
    <line x1="50" y1="74" x2="50" y2="96" stroke={NAVY} strokeWidth="3"/>
    <line x1="56" y1="79" x2="56" y2="91" stroke={NAVY} strokeWidth="1.5"/>
    <line x1="56" y1="85" x2="75" y2="85" stroke={NAVY} strokeWidth="2"/>
    <text x="35" y="70" fill={RED} fontSize="11" fontWeight="bold">+</text>
    <text x="60" y="70" fill={BLUE} fontSize="11" fontWeight="bold">−</text>
    <text x="52" y="100" textAnchor="middle" fill={NAVY} fontSize="11" fontWeight="600">V</text>
    {[130,230].map((x,i)=>(
      <g key={i}>
        <line x1={x} y1="60" x2={x} y2="48" stroke={NAVY} strokeWidth="2"/>
        <line x1={x-20} y1="48" x2={x+20} y2="48" stroke={NAVY} strokeWidth="3"/>
        <line x1={x-20} y1="43" x2={x+20} y2="43" stroke={NAVY} strokeWidth="3"/>
        <line x1={x} y1="43" x2={x} y2="32" stroke={NAVY} strokeWidth="2"/>
        <text x={x} y="25" textAnchor="middle" fill={NAVY} fontSize="13" fontWeight="600">C{i+1}</text>
        <text x={x} y="80" textAnchor="middle" fill={BLUE} fontSize="11" fontStyle="italic">V{i+1}</text>
      </g>
    ))}
    <line x1="165" y1="56" x2="195" y2="56" stroke={GOLD} strokeWidth="1.5" markerEnd="url(#cs-arr)" opacity="0.8"/>
    <text x="180" y="52" textAnchor="middle" fill={GOLD} fontSize="10" fontStyle="italic">Q</text>
    <text x="180" y="145" textAnchor="middle" fill={GRAY} fontSize="11">Same Q · 1/C_total = 1/C₁ + 1/C₂</text>
  </svg>
);

const CapParallel: React.FC = () => (
  <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto" aria-label="Capacitors in parallel">
    <line x1="60" y1="30" x2="60" y2="150" stroke={NAVY} strokeWidth="2"/>
    <line x1="280" y1="30" x2="280" y2="150" stroke={NAVY} strokeWidth="2"/>
    <line x1="60" y1="30" x2="280" y2="30" stroke={NAVY} strokeWidth="2"/>
    <line x1="60" y1="150" x2="280" y2="150" stroke={NAVY} strokeWidth="2"/>
    <line x1="60" y1="80" x2="40" y2="80" stroke={NAVY} strokeWidth="2"/>
    <line x1="40" y1="73" x2="40" y2="87" stroke={NAVY} strokeWidth="3"/>
    <line x1="35" y1="77" x2="35" y2="83" stroke={NAVY} strokeWidth="1.5"/>
    <line x1="35" y1="80" x2="15" y2="80" stroke={NAVY} strokeWidth="2"/>
    <line x1="15" y1="80" x2="15" y2="120" stroke={NAVY} strokeWidth="2"/>
    <line x1="15" y1="120" x2="60" y2="120" stroke={NAVY} strokeWidth="2"/>
    <text x="20" y="66" fill={NAVY} fontSize="11" fontWeight="600">V</text>
    {[130,210].map((x,i)=>(
      <g key={i}>
        <line x1={x} y1="30" x2={x} y2="75" stroke={NAVY} strokeWidth="2"/>
        <line x1={x-20} y1="75" x2={x+20} y2="75" stroke={NAVY} strokeWidth="3"/>
        <line x1={x-20} y1="81" x2={x+20} y2="81" stroke={NAVY} strokeWidth="3"/>
        <line x1={x} y1="81" x2={x} y2="150" stroke={NAVY} strokeWidth="2"/>
        <text x={x+30} y="82" fill={NAVY} fontSize="13" fontWeight="600">C{i+1}</text>
      </g>
    ))}
    <text x="170" y="172" textAnchor="middle" fill={GRAY} fontSize="11">Same V · C_total = C₁ + C₂</text>
  </svg>
);

const RcCircuit: React.FC = () => (
  <svg viewBox="0 0 360 200" className="w-full max-w-sm mx-auto" aria-label="RC charging circuit">
    <ArrowDefs id="rc-arr" color={GOLD}/>
    <rect x="40" y="40" width="280" height="130" fill="none" stroke={NAVY} strokeWidth="2" rx="8"/>
    <line x1="40" y1="85" x2="70" y2="85" stroke={NAVY} strokeWidth="2"/>
    <line x1="70" y1="74" x2="70" y2="96" stroke={NAVY} strokeWidth="3.5"/>
    <line x1="78" y1="79" x2="78" y2="91" stroke={NAVY} strokeWidth="2"/>
    <line x1="78" y1="85" x2="110" y2="85" stroke={NAVY} strokeWidth="2"/>
    <text x="57" y="70" fill={RED} fontSize="12" fontWeight="bold">+</text>
    <text x="82" y="70" fill={BLUE} fontSize="12" fontWeight="bold">−</text>
    <text x="75" y="118" textAnchor="middle" fill={NAVY} fontSize="12" fontWeight="600">V₀</text>
    <line x1="130" y1="40" x2="150" y2="40" stroke={NAVY} strokeWidth="2"/>
    {[0,1,2,3,4,5].map(i=>(
      <line key={i} x1={150+i*16} y1={i%2===0?32:48} x2={150+(i+1)*16} y2={i%2===0?48:32} stroke={NAVY} strokeWidth="2"/>
    ))}
    <line x1="246" y1="40" x2="280" y2="40" stroke={NAVY} strokeWidth="2"/>
    <text x="196" y="22" textAnchor="middle" fill={NAVY} fontSize="13" fontWeight="600">R</text>
    <line x1="320" y1="75" x2="320" y2="95" stroke={NAVY} strokeWidth="2"/>
    <line x1="302" y1="95" x2="338" y2="95" stroke={NAVY} strokeWidth="3.5"/>
    <line x1="302" y1="103" x2="338" y2="103" stroke={NAVY} strokeWidth="3.5"/>
    <line x1="320" y1="103" x2="320" y2="130" stroke={NAVY} strokeWidth="2"/>
    <text x="345" y="102" fill={NAVY} fontSize="13" fontWeight="600">C</text>
    <line x1="175" y1="32" x2="215" y2="32" stroke={GOLD} strokeWidth="1.5" markerEnd="url(#rc-arr)"/>
    <text x="193" y="27" textAnchor="middle" fill={GOLD} fontSize="11" fontStyle="italic">I(t)</text>
    <text x="180" y="185" textAnchor="middle" fill={GRAY} fontSize="11">τ = RC</text>
  </svg>
);

const RcCurve: React.FC = () => {
  const W=300,H=130,PL=40,PB=30,PT=15,PR=20,plotW=W-PL-PR,plotH=H-PT-PB;
  const pts=Array.from({length:80},(_,i)=>{const t=(i/79)*5.5,v=1-Math.exp(-t);return`${PL+(t/5.5)*plotW},${PT+plotH-v*plotH}`;}).join(' ');
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" aria-label="RC charging curve">
      <line x1={PL} y1={PT} x2={PL} y2={PT+plotH} stroke={NAVY} strokeWidth="1.5"/>
      <line x1={PL} y1={PT+plotH} x2={PL+plotW} y2={PT+plotH} stroke={NAVY} strokeWidth="1.5"/>
      <line x1={PL} y1={PT} x2={PL+plotW} y2={PT} stroke={GRAY} strokeWidth="1" strokeDasharray="5 3"/>
      <text x={PL-4} y={PT+4} textAnchor="end" fill={NAVY} fontSize="11" fontStyle="italic">V₀</text>
      {(()=>{const tx=PL+(1/5.5)*plotW,ty=PT+plotH-0.632*plotH;return(<>
        <line x1={PL} y1={ty} x2={tx} y2={ty} stroke={GOLD} strokeWidth="1" strokeDasharray="4 3"/>
        <line x1={tx} y1={ty} x2={tx} y2={PT+plotH} stroke={GOLD} strokeWidth="1" strokeDasharray="4 3"/>
        <text x={PL-3} y={ty+4} textAnchor="end" fill={GOLD} fontSize="10">0.63V₀</text>
      </>);})()}
      <polyline points={pts} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {[1,2,3,4,5].map(t=>{const x=PL+(t/5.5)*plotW;return(<g key={t}><line x1={x} y1={PT+plotH} x2={x} y2={PT+plotH+4} stroke={NAVY} strokeWidth="1"/><text x={x} y={PT+plotH+13} textAnchor="middle" fill={GRAY} fontSize="10">{t}τ</text></g>);})}
      <text x={PL+plotW/2} y={H-2} textAnchor="middle" fill={GRAY} fontSize="11">Time</text>
      <text x={8} y={PT+plotH/2} fill={GRAY} fontSize="11" transform={`rotate(-90,8,${PT+plotH/2})`} textAnchor="middle">V_C</text>
    </svg>
  );
};

const DielectricPolarisation: React.FC = () => (
  <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto" aria-label="Dielectric polarisation">
    <ArrowDefs id="dp-arr" color={BLUE}/>
    <rect x="20" y="20" width="10" height="140" fill={NAVY} rx="2"/>
    <rect x="310" y="20" width="10" height="140" fill={NAVY} rx="2"/>
    {[40,70,100,130,155].map((y,i)=><text key={i} x="8" y={y} fill={RED} fontSize="14" fontWeight="bold">+</text>)}
    {[40,70,100,130,155].map((y,i)=><text key={i} x="322" y={y} fill={BLUE} fontSize="14" fontWeight="bold">−</text>)}
    <rect x="35" y="20" width="270" height="140" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" rx="4"/>
    <text x="170" y="14" textAnchor="middle" fill={NAVY} fontSize="11">Dielectric material</text>
    {[[75,55],[145,55],[215,55],[275,55],[75,100],[145,100],[215,100],[275,100],[75,145],[145,145],[215,145],[275,145]].map(([cx,cy],i)=>(
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx="22" ry="12" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"/>
        <text x={cx-10} y={cy+4} fill={BLUE} fontSize="11" fontWeight="bold">−</text>
        <text x={cx+5} y={cy+4} fill={RED} fontSize="11" fontWeight="bold">+</text>
      </g>
    ))}
    <line x1="35" y1="170" x2="305" y2="170" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#dp-arr)"/>
    <text x="170" y="182" textAnchor="middle" fill={BLUE} fontSize="11" fontStyle="italic">E (applied field)</text>
  </svg>
);

const EnergyInCapacitor: React.FC = () => (
  <svg viewBox="0 0 300 160" className="w-full max-w-xs mx-auto" aria-label="Energy stored in capacitor">
    <defs>
      <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={BLUE} stopOpacity="0.25"/>
        <stop offset="100%" stopColor={BLUE} stopOpacity="0.05"/>
      </linearGradient>
    </defs>
    <line x1="45" y1="15" x2="45" y2="130" stroke={NAVY} strokeWidth="1.5"/>
    <line x1="45" y1="130" x2="265" y2="130" stroke={NAVY} strokeWidth="1.5"/>
    <line x1="45" y1="130" x2="245" y2="20" stroke={NAVY} strokeWidth="2"/>
    <polygon points="45,130 245,130 245,20" fill="url(#eg)" stroke={BLUE} strokeWidth="1" strokeDasharray="4 3"/>
    <text x="38" y="20" textAnchor="end" fill={NAVY} fontSize="12" fontStyle="italic">V</text>
    <text x="265" y="134" fill={NAVY} fontSize="12" fontStyle="italic">Q</text>
    <text x="180" y="105" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">U = ½QV</text>
    <text x="180" y="120" textAnchor="middle" fill={BLUE} fontSize="11">= ½CV²</text>
    <text x="150" y="155" textAnchor="middle" fill={GRAY} fontSize="11">Shaded area = energy stored</text>
  </svg>
);

const WaveDiagram: React.FC = () => {
  const W=320,H=120,PL=20,PR=20,PT=15,PB=25;
  const plotW=W-PL-PR, cx=plotW/2;
  const pts=Array.from({length:120},(_,i)=>{
    const x=PL+(i/119)*plotW;
    const y=PT+(H-PT-PB)/2*(1-0.8*Math.sin((i/119)*4*Math.PI));
    return`${x},${y}`;
  }).join(' ');
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" aria-label="Wave diagram">
      <ArrowDefs id="wv-a" color={GRAY}/>
      <line x1={PL} y1={PT+(H-PT-PB)/2} x2={W-PR} y2={PT+(H-PT-PB)/2} stroke={GRAY} strokeWidth="1" strokeDasharray="4 3"/>
      <polyline points={pts} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Wavelength arrow */}
      <line x1={PL} y1={H-PB+8} x2={PL+plotW/2} y2={H-PB+8} stroke={NAVY} strokeWidth="1" markerEnd="url(#wv-a)"/>
      <text x={PL+plotW/4} y={H-PB+20} textAnchor="middle" fill={NAVY} fontSize="10">λ (wavelength)</text>
      {/* Amplitude arrow */}
      <line x1={PL+plotW/4} y1={PT} x2={PL+plotW/4} y2={PT+(H-PT-PB)/2} stroke={GOLD} strokeWidth="1" strokeDasharray="3 2"/>
      <text x={PL+plotW/4-4} y={PT+(H-PT-PB)/4+4} textAnchor="end" fill={GOLD} fontSize="10">A</text>
    </svg>
  );
};

const ForceDiagram: React.FC = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto" aria-label="Free body force diagram">
    <ArrowDefs id="fd-a" color={RED}/>
    <defs>
      <marker id="fd-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={GREEN}/></marker>
      <marker id="fd-c" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={BLUE}/></marker>
      <marker id="fd-d" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={AMBER}/></marker>
    </defs>
    {/* Box (object) */}
    <rect x="100" y="90" width="60" height="50" fill="#E0E7FF" stroke={NAVY} strokeWidth="2" rx="4"/>
    <text x="130" y="120" textAnchor="middle" fill={NAVY} fontSize="12" fontWeight="600">m</text>
    {/* Weight down */}
    <line x1="130" y1="140" x2="130" y2="185" stroke={RED} strokeWidth="2" markerEnd="url(#fd-a)"/>
    <text x="145" y="170" fill={RED} fontSize="11">W=mg</text>
    {/* Normal up */}
    <line x1="130" y1="90" x2="130" y2="45" stroke={GREEN} strokeWidth="2" markerEnd="url(#fd-b)"/>
    <text x="145" y="65" fill={GREEN} fontSize="11">N</text>
    {/* Applied force right */}
    <line x1="160" y1="115" x2="215" y2="115" stroke={BLUE} strokeWidth="2" markerEnd="url(#fd-c)"/>
    <text x="218" y="119" fill={BLUE} fontSize="11">F</text>
    {/* Friction left */}
    <line x1="100" y1="115" x2="48" y2="115" stroke={AMBER} strokeWidth="2" markerEnd="url(#fd-d)"/>
    <text x="18" y="119" fill={AMBER} fontSize="11">f</text>
    {/* Ground */}
    <line x1="60" y1="140" x2="200" y2="140" stroke={GRAY} strokeWidth="2"/>
    {[0,1,2,3,4,5,6,7].map(i=><line key={i} x1={65+i*19} y1="140" x2={60+i*19} y2="150" stroke={GRAY} strokeWidth="1"/>)}
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════════

const CoordinatePlane: React.FC = () => (
  <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto" aria-label="Coordinate plane">
    <ArrowDefs id="cp-a" color={NAVY}/>
    <defs>
      <marker id="cp-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={NAVY}/></marker>
    </defs>
    {/* Grid */}
    {[-3,-2,-1,1,2,3].map(n=>(
      <g key={n}>
        <line x1={140+n*30} y1="20" x2={140+n*30} y2="220" stroke="#E5E7EB" strokeWidth="1"/>
        <line x1="20" y1={120+n*30} x2="260" y2={120+n*30} stroke="#E5E7EB" strokeWidth="1"/>
        <text x={140+n*30} y="132" textAnchor="middle" fill={GRAY} fontSize="10">{n}</text>
        <text x="133" y={120-n*30+4} textAnchor="end" fill={GRAY} fontSize="10">{n}</text>
      </g>
    ))}
    {/* Axes */}
    <line x1="20" y1="120" x2="255" y2="120" stroke={NAVY} strokeWidth="2" markerEnd="url(#cp-a)"/>
    <line x1="140" y1="220" x2="140" y2="25" stroke={NAVY} strokeWidth="2" markerEnd="url(#cp-b)"/>
    <text x="262" y="124" fill={NAVY} fontSize="13" fontStyle="italic">x</text>
    <text x="144" y="20" fill={NAVY} fontSize="13" fontStyle="italic">y</text>
    <text x="137" y="132" fill={NAVY} fontSize="11">0</text>
    {/* Sample linear function y=x */}
    <line x1="50" y1="210" x2="230" y2="30" stroke={BLUE} strokeWidth="2" opacity="0.8"/>
    <text x="235" y="35" fill={BLUE} fontSize="11">y=x</text>
    {/* Sample point */}
    <circle cx="200" cy="60" r="4" fill={RED}/>
    <text x="208" y="58" fill={RED} fontSize="10">(2,2)</text>
  </svg>
);

const TriangleLabels: React.FC = () => (
  <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto" aria-label="Triangle with labels">
    <polygon points="140,20 40,190 240,190" fill="#EFF6FF" stroke={NAVY} strokeWidth="2"/>
    {/* Sides */}
    <text x="75" y="115" fill={RED} fontSize="13" fontWeight="600" transform="rotate(-55,75,115)">a</text>
    <text x="195" y="115" fill={BLUE} fontSize="13" fontWeight="600" transform="rotate(55,195,115)">b</text>
    <text x="140" y="205" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="600">c</text>
    {/* Angles */}
    <text x="125" y="42" fill={NAVY} fontSize="12">A</text>
    <text x="42" y="182" fill={NAVY} fontSize="12">B</text>
    <text x="232" y="182" fill={NAVY} fontSize="12">C</text>
    {/* Right angle mark at B (optional) */}
    {/* Pythagoras label */}
    <text x="140" y="215" textAnchor="middle" fill={GRAY} fontSize="10">a²+b²=c² (right triangle)</text>
    {/* Sine rule hint */}
    <text x="140" y="15" textAnchor="middle" fill={GRAY} fontSize="10">a/sinA = b/sinB = c/sinC</text>
  </svg>
);

const NumberLine: React.FC = () => (
  <svg viewBox="0 0 300 80" className="w-full max-w-xs mx-auto" aria-label="Number line">
    <ArrowDefs id="nl-a" color={NAVY}/>
    <defs>
      <marker id="nl-b" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><polygon points="8 0,0 3,8 6" fill={NAVY}/></marker>
    </defs>
    <line x1="20" y1="40" x2="275" y2="40" stroke={NAVY} strokeWidth="2" markerStart="url(#nl-b)" markerEnd="url(#nl-a)"/>
    {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(n=>{
      const x=148+n*22;
      return(<g key={n}>
        <line x1={x} y1="35" x2={x} y2="45" stroke={NAVY} strokeWidth="1.5"/>
        <text x={x} y="57" textAnchor="middle" fill={n===0?RED:NAVY} fontSize="11" fontWeight={n===0?"700":"400"}>{n}</text>
      </g>);
    })}
    {/* Sample point */}
    <circle cx={148+3*22} cy="40" r="5" fill={BLUE}/>
    <text x={148+3*22} y="26" textAnchor="middle" fill={BLUE} fontSize="11">+3</text>
    <text x="148" y="72" textAnchor="middle" fill={GRAY} fontSize="10">Integers extend infinitely in both directions</text>
  </svg>
);

const CircleParts: React.FC = () => (
  <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto" aria-label="Circle parts">
    <circle cx="130" cy="110" r="80" fill="#EFF6FF" stroke={NAVY} strokeWidth="2"/>
    {/* Centre */}
    <circle cx="130" cy="110" r="3" fill={NAVY}/>
    <text x="136" y="107" fill={NAVY} fontSize="10">O</text>
    {/* Radius */}
    <line x1="130" y1="110" x2="210" y2="110" stroke={RED} strokeWidth="2"/>
    <text x="175" y="104" fill={RED} fontSize="11">r</text>
    {/* Diameter */}
    <line x1="50" y1="110" x2="210" y2="110" stroke={BLUE} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6"/>
    <text x="130" y="130" textAnchor="middle" fill={BLUE} fontSize="10">d = 2r</text>
    {/* Arc */}
    <path d="M 210 110 A 80 80 0 0 0 130 30" fill="none" stroke={GREEN} strokeWidth="3"/>
    <text x="195" y="60" fill={GREEN} fontSize="11">arc</text>
    {/* Chord */}
    <line x1="50" y1="110" x2="130" y2="30" stroke={GOLD} strokeWidth="2"/>
    <text x="72" y="70" fill={GOLD} fontSize="10">chord</text>
    {/* Circumference formula */}
    <text x="130" y="210" textAnchor="middle" fill={GRAY} fontSize="11">C = 2πr    A = πr²</text>
  </svg>
);

const NormalCurve: React.FC = () => {
  const W=300,H=140,PL=30,PB=30,PT=15,PR=20,plotW=W-PL-PR,plotH=H-PT-PB;
  const gauss=(x:number)=>Math.exp(-0.5*x*x);
  const xRange=3.5;
  const pts=Array.from({length:120},(_,i)=>{
    const xv=-xRange+(i/119)*2*xRange;
    const y=gauss(xv);
    const px=PL+(xv+xRange)/(2*xRange)*plotW;
    const py=PT+plotH-y*plotH*0.9;
    return`${px},${py}`;
  }).join(' ');
  const xToP=(xv:number)=>PL+(xv+xRange)/(2*xRange)*plotW;
  const yToP=(y:number)=>PT+plotH-y*plotH*0.9;
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" aria-label="Normal distribution curve">
      <line x1={PL} y1={PT+plotH} x2={W-PR} y2={PT+plotH} stroke={NAVY} strokeWidth="1.5"/>
      <polyline points={pts} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"/>
      {/* μ line */}
      <line x1={xToP(0)} y1={PT} x2={xToP(0)} y2={PT+plotH} stroke={RED} strokeWidth="1.5" strokeDasharray="4 3"/>
      <text x={xToP(0)} y={PT+plotH+14} textAnchor="middle" fill={RED} fontSize="11">μ</text>
      {/* σ markers */}
      {[-1,1].map(s=>(
        <g key={s}>
          <line x1={xToP(s)} y1={yToP(gauss(s))} x2={xToP(s)} y2={PT+plotH} stroke={GOLD} strokeWidth="1" strokeDasharray="3 3"/>
          <text x={xToP(s)} y={PT+plotH+14} textAnchor="middle" fill={GOLD} fontSize="10">{s>0?'+':''}{s}σ</text>
        </g>
      ))}
      <text x={xToP(-2)} y={PT+plotH+14} textAnchor="middle" fill={GRAY} fontSize="10">−2σ</text>
      <text x={xToP(2)} y={PT+plotH+14} textAnchor="middle" fill={GRAY} fontSize="10">+2σ</text>
      {/* 68% label */}
      <text x={xToP(0)} y={yToP(0.4)} textAnchor="middle" fill={BLUE} fontSize="10">68%</text>
    </svg>
  );
};

const Histogram: React.FC = () => {
  const bars=[{h:40,l:'60–70'},{h:70,l:'70–80'},{h:100,l:'80–90'},{h:60,l:'90–100'},{h:30,l:'100–110'}];
  const W=280,H=150,PL=30,PB=35,PT=10,PR=10,plotW=W-PL-PR,plotH=H-PT-PB;
  const bW=plotW/bars.length;
  const maxH=Math.max(...bars.map(b=>b.h));
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" aria-label="Histogram">
      <line x1={PL} y1={PT} x2={PL} y2={PT+plotH} stroke={NAVY} strokeWidth="1.5"/>
      <line x1={PL} y1={PT+plotH} x2={W-PR} y2={PT+plotH} stroke={NAVY} strokeWidth="1.5"/>
      {bars.map((b,i)=>{
        const bH=b.h/maxH*plotH;
        const x=PL+i*bW, y=PT+plotH-bH;
        return(<g key={i}>
          <rect x={x+2} y={y} width={bW-4} height={bH} fill={BLUE} opacity="0.75" stroke={NAVY} strokeWidth="1"/>
          <text x={x+bW/2} y={PT+plotH+12} textAnchor="middle" fill={GRAY} fontSize="9">{b.l}</text>
          <text x={x+bW/2} y={y-3} textAnchor="middle" fill={NAVY} fontSize="10">{b.h}</text>
        </g>);
      })}
      <text x={W/2} y={H-2} textAnchor="middle" fill={GRAY} fontSize="10">Score range</text>
    </svg>
  );
};

const BoxPlot: React.FC = () => {
  const W=300,H=110,PL=40,PR=20,cy=55,bH=30;
  // Q1=30, Q2=50, Q3=70, min=10, max=90
  const scale=(v:number)=>PL+(v/100)*(W-PL-PR);
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" aria-label="Box plot">
      {/* Whiskers */}
      <line x1={scale(10)} y1={cy} x2={scale(30)} y2={cy} stroke={NAVY} strokeWidth="2"/>
      <line x1={scale(70)} y1={cy} x2={scale(90)} y2={cy} stroke={NAVY} strokeWidth="2"/>
      <line x1={scale(10)} y1={cy-10} x2={scale(10)} y2={cy+10} stroke={NAVY} strokeWidth="2"/>
      <line x1={scale(90)} y1={cy-10} x2={scale(90)} y2={cy+10} stroke={NAVY} strokeWidth="2"/>
      {/* Box */}
      <rect x={scale(30)} y={cy-bH/2} width={scale(70)-scale(30)} height={bH} fill="#DBEAFE" stroke={NAVY} strokeWidth="2"/>
      {/* Median */}
      <line x1={scale(50)} y1={cy-bH/2} x2={scale(50)} y2={cy+bH/2} stroke={RED} strokeWidth="2.5"/>
      {/* Labels */}
      {[10,30,50,70,90].map(v=>(
        <g key={v}>
          <text x={scale(v)} y={cy+bH/2+14} textAnchor="middle" fill={GRAY} fontSize="10">{v}</text>
        </g>
      ))}
      <text x={scale(10)-2} y={cy-bH/2-4} textAnchor="middle" fill={GRAY} fontSize="9">Min</text>
      <text x={scale(30)} y={cy-bH/2-4} textAnchor="middle" fill={BLUE} fontSize="9">Q1</text>
      <text x={scale(50)} y={cy-bH/2-4} textAnchor="middle" fill={RED} fontSize="9">Q2</text>
      <text x={scale(70)} y={cy-bH/2-4} textAnchor="middle" fill={BLUE} fontSize="9">Q3</text>
      <text x={scale(90)} y={cy-bH/2-4} textAnchor="middle" fill={GRAY} fontSize="9">Max</text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHEMISTRY
// ═══════════════════════════════════════════════════════════════════════════════

const BohrAtom: React.FC = () => (
  <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto" aria-label="Bohr atom model">
    {/* Nucleus */}
    <circle cx="120" cy="120" r="18" fill={RED} opacity="0.85"/>
    <text x="120" y="116" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">p⁺</text>
    <text x="120" y="128" textAnchor="middle" fill="white" fontSize="9">n⁰</text>
    {/* Electron shells */}
    {[38,65,92].map((r,i)=>(
      <g key={i}>
        <circle cx="120" cy="120" r={r} fill="none" stroke={BLUE} strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
        <text x="120" y={120-r-4} textAnchor="middle" fill={GRAY} fontSize="9">n={i+1}</text>
      </g>
    ))}
    {/* Electrons */}
    <circle cx="158" cy="120" r="5" fill={BLUE}/>
    <text x="168" y="118" fill={BLUE} fontSize="9">e⁻</text>
    <circle cx="120" cy="55" r="5" fill={BLUE}/>
    <circle cx="55" cy="120" r="5" fill={BLUE}/>
    <circle cx="84" cy="56" r="5" fill={BLUE}/>
    <circle cx="212" cy="120" r="5" fill={BLUE}/>
    <text x="120" y="235" textAnchor="middle" fill={GRAY} fontSize="11">Bohr Model of Atom</text>
  </svg>
);

const PeriodicTable: React.FC = () => {
  const elements=[
    {sym:'H',num:1,name:'Hydrogen',col:BLUE},
    {sym:'He',num:2,name:'Helium',col:GOLD},
    {sym:'Li',num:3,name:'Lithium',col:RED},
    {sym:'O',num:8,name:'Oxygen',col:GREEN},
    {sym:'Na',num:11,name:'Sodium',col:RED},
    {sym:'Cl',num:17,name:'Chlorine',col:GREEN},
  ];
  return(
    <svg viewBox="0 0 300 160" className="w-full max-w-sm mx-auto" aria-label="Periodic table elements">
      <text x="150" y="14" textAnchor="middle" fill={NAVY} fontSize="12" fontWeight="600">Key Elements</text>
      {elements.map((el,i)=>{
        const col=i%3, row=Math.floor(i/3);
        const x=10+col*98, y=20+row*65;
        return(
          <g key={el.sym}>
            <rect x={x} y={y} width="88" height="56" rx="6" fill="#F8FAFF" stroke={el.col} strokeWidth="1.5"/>
            <text x={x+8} y={y+14} fill={GRAY} fontSize="10">{el.num}</text>
            <text x={x+44} y={y+36} textAnchor="middle" fill={el.col} fontSize="22" fontWeight="700">{el.sym}</text>
            <text x={x+44} y={y+50} textAnchor="middle" fill={GRAY} fontSize="9">{el.name}</text>
          </g>
        );
      })}
    </svg>
  );
};

const PhScale: React.FC = () => {
  const W=300,H=90,PL=20,PR=20,barH=28,barY=30;
  const bW=W-PL-PR;
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto" aria-label="pH scale">
      <defs>
        <linearGradient id="phg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DC2626"/>
          <stop offset="40%" stopColor="#F59E0B"/>
          <stop offset="50%" stopColor="#16A34A"/>
          <stop offset="70%" stopColor="#2563EB"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>
      <rect x={PL} y={barY} width={bW} height={barH} rx="6" fill="url(#phg)"/>
      {Array.from({length:15},(_,i)=>{
        const x=PL+i*(bW/14);
        return(<g key={i}>
          <line x1={x} y1={barY+barH} x2={x} y2={barY+barH+5} stroke="white" strokeWidth="1"/>
          <text x={x} y={barY+barH+15} textAnchor="middle" fill={NAVY} fontSize="9">{i}</text>
        </g>);
      })}
      <text x={PL+bW*0.1} y={barY-5} textAnchor="middle" fill={RED} fontSize="10">Acid</text>
      <text x={PL+bW*0.5} y={barY-5} textAnchor="middle" fill={GREEN} fontSize="10">Neutral</text>
      <text x={PL+bW*0.88} y={barY-5} textAnchor="middle" fill={PURPLE} fontSize="10">Base</text>
      <text x={W/2} y={H-2} textAnchor="middle" fill={GRAY} fontSize="10">pH 7 = neutral  |  &lt;7 acid  |  &gt;7 alkaline</text>
    </svg>
  );
};

const MoleculeH2O: React.FC = () => (
  <svg viewBox="0 0 220 180" className="w-full max-w-xs mx-auto" aria-label="Water molecule H2O">
    {/* Oxygen */}
    <circle cx="110" cy="90" r="28" fill="#EFF6FF" stroke={RED} strokeWidth="2"/>
    <text x="110" y="95" textAnchor="middle" fill={RED} fontSize="16" fontWeight="700">O</text>
    {/* Hydrogen 1 */}
    <circle cx="40" cy="145" r="18" fill="#FFF7ED" stroke={BLUE} strokeWidth="2"/>
    <text x="40" y="151" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="700">H</text>
    {/* Hydrogen 2 */}
    <circle cx="180" cy="145" r="18" fill="#FFF7ED" stroke={BLUE} strokeWidth="2"/>
    <text x="180" y="151" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="700">H</text>
    {/* Bonds */}
    <line x1="86" y1="112" x2="58" y2="132" stroke={NAVY} strokeWidth="2.5"/>
    <line x1="134" y1="112" x2="162" y2="132" stroke={NAVY} strokeWidth="2.5"/>
    {/* Angle label */}
    <text x="110" y="65" textAnchor="middle" fill={GRAY} fontSize="11">104.5°</text>
    <text x="110" y="170" textAnchor="middle" fill={GRAY} fontSize="11">H₂O — covalent bonds</text>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// BIOLOGY
// ═══════════════════════════════════════════════════════════════════════════════

const AnimalCell: React.FC = () => (
  <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto" aria-label="Animal cell diagram">
    {/* Cell membrane */}
    <ellipse cx="140" cy="110" rx="125" ry="95" fill="#FFF7ED" stroke={AMBER} strokeWidth="2"/>
    {/* Nucleus */}
    <ellipse cx="130" cy="105" rx="40" ry="32" fill="#DBEAFE" stroke={BLUE} strokeWidth="2"/>
    <text x="130" y="101" textAnchor="middle" fill={BLUE} fontSize="10">Nucleus</text>
    {/* Nucleolus */}
    <circle cx="130" cy="110" r="10" fill={BLUE} opacity="0.4"/>
    <text x="130" y="113" textAnchor="middle" fill="white" fontSize="8">NL</text>
    {/* Mitochondria */}
    <ellipse cx="60" cy="145" rx="22" ry="12" fill="#FEF3C7" stroke={GOLD} strokeWidth="1.5"/>
    <text x="60" y="162" textAnchor="middle" fill={GOLD} fontSize="9">Mitochondria</text>
    <ellipse cx="210" cy="70" rx="20" ry="11" fill="#FEF3C7" stroke={GOLD} strokeWidth="1.5"/>
    <text x="210" y="58" textAnchor="middle" fill={GOLD} fontSize="9">Mitochondria</text>
    {/* Ribosomes (dots) */}
    {[[180,130],[165,150],[195,155],[175,90]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="4" fill={GREEN} opacity="0.7"/>
    ))}
    <text x="200" y="148" fill={GREEN} fontSize="9">Ribosomes</text>
    {/* Vacuole */}
    <ellipse cx="90" cy="75" rx="18" ry="13" fill="#F0FDF4" stroke={GREEN} strokeWidth="1.5"/>
    <text x="90" y="62" textAnchor="middle" fill={GREEN} fontSize="9">Vacuole</text>
    {/* Cell membrane label */}
    <text x="248" y="105" fill={AMBER} fontSize="9" textAnchor="start">Cell</text>
    <text x="248" y="116" fill={AMBER} fontSize="9" textAnchor="start">membrane</text>
    <text x="140" y="215" textAnchor="middle" fill={GRAY} fontSize="11">Animal Cell</text>
  </svg>
);

const DnaHelix: React.FC = () => {
  const pts1=Array.from({length:20},(_,i)=>{
    const t=i/19*2*Math.PI*2;
    const x=100+30*Math.sin(t);
    const y=15+i*9;
    return[x,y];
  });
  const pts2=Array.from({length:20},(_,i)=>{
    const t=i/19*2*Math.PI*2+Math.PI;
    const x=100+30*Math.sin(t);
    const y=15+i*9;
    return[x,y];
  });
  return(
    <svg viewBox="0 0 200 205" className="w-full max-w-xs mx-auto" aria-label="DNA double helix">
      {/* Base pairs (rungs) */}
      {Array.from({length:10},(_,i)=>{
        const y=15+i*18;
        return<line key={i} x1="70" y1={y+9} x2="130" y2={y+9} stroke={GREEN} strokeWidth="2" opacity="0.6"/>;
      })}
      {/* Strand 1 */}
      <polyline points={pts1.map(p=>p.join(',')).join(' ')} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Strand 2 */}
      <polyline points={pts2.map(p=>p.join(',')).join(' ')} fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Labels */}
      <text x="10" y="100" fill={BLUE} fontSize="11" fontWeight="600">5′</text>
      <text x="165" y="100" fill={RED} fontSize="11" fontWeight="600">3′</text>
      <text x="100" y="200" textAnchor="middle" fill={GRAY} fontSize="11">DNA Double Helix</text>
      <text x="100" y="15" textAnchor="middle" fill={GRAY} fontSize="10">A-T   G-C base pairs</text>
    </svg>
  );
};

const FoodChain: React.FC = () => {
  const items=[
    {label:'Sun',icon:'☀️',y:20},
    {label:'Plant',icon:'🌿',y:65},
    {label:'Herbivore',icon:'🐛',y:110},
    {label:'Carnivore',icon:'🦎',y:155},
    {label:'Apex',icon:'🦅',y:200},
  ];
  return(
    <svg viewBox="0 0 180 240" className="w-full max-w-xs mx-auto" aria-label="Food chain">
      <ArrowDefs id="fc-a" color={GREEN}/>
      {items.map((item,i)=>(
        <g key={i}>
          <text x="45" y={item.y+18} fontSize="24">{item.icon}</text>
          <text x="90" y={item.y+20} fill={NAVY} fontSize="12" fontWeight="500">{item.label}</text>
          {i<items.length-1&&(
            <line x1="58" y1={item.y+30} x2="58" y2={item.y+40} stroke={GREEN} strokeWidth="2" markerEnd="url(#fc-a)"/>
          )}
        </g>
      ))}
      <text x="5" y="235" fill={GRAY} fontSize="10">Energy flows upward</text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENTAL SCIENCE
// ═══════════════════════════════════════════════════════════════════════════════

const CarbonCycle: React.FC = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto" aria-label="Carbon cycle">
    <ArrowDefs id="cc-a" color={GREEN}/>
    <defs>
      <marker id="cc-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={GRAY}/></marker>
    </defs>
    {/* Atmosphere box */}
    <rect x="90" y="5" width="120" height="35" rx="8" fill="#DBEAFE" stroke={BLUE} strokeWidth="1.5"/>
    <text x="150" y="27" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">Atmosphere CO₂</text>
    {/* Plant */}
    <text x="30" y="110" fontSize="28">🌳</text>
    <text x="42" y="130" textAnchor="middle" fill={GREEN} fontSize="10">Plants</text>
    {/* Ocean */}
    <rect x="75" y="140" width="80" height="30" rx="6" fill="#BFDBFE" stroke={BLUE} strokeWidth="1.5"/>
    <text x="115" y="160" textAnchor="middle" fill={BLUE} fontSize="10">Ocean</text>
    {/* Industry */}
    <text x="210" y="110" fontSize="28">🏭</text>
    <text x="222" y="130" textAnchor="middle" fill={GRAY} fontSize="10">Industry</text>
    {/* Arrows */}
    <line x1="55" y1="85" x2="100" y2="42" stroke={GREEN} strokeWidth="1.5" markerEnd="url(#cc-a)"/>
    <text x="60" y="60" fill={GREEN} fontSize="9">Photosynthesis</text>
    <line x1="100" y1="42" x2="55" y2="92" stroke={GRAY} strokeWidth="1.5" markerEnd="url(#cc-b)"/>
    <text x="18" y="75" fill={GRAY} fontSize="9">Respiration</text>
    <line x1="215" y1="85" x2="185" y2="42" stroke={RED} strokeWidth="1.5" markerEnd="url(#cc-a)"/>
    <text x="197" y="60" fill={RED} fontSize="9">Combustion</text>
    <line x1="115" y1="140" x2="115" y2="44" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#cc-a)" strokeDasharray="4 3"/>
    <text x="120" y="100" fill={BLUE} fontSize="9">Exchange</text>
  </svg>
);

const GreenhouseEffect: React.FC = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto" aria-label="Greenhouse effect">
    <ArrowDefs id="gh-a" color={GOLD}/>
    <defs>
      <marker id="gh-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={RED}/></marker>
    </defs>
    {/* Sun */}
    <text x="25" y="45" fontSize="28">☀️</text>
    {/* Atmosphere band */}
    <rect x="0" y="55" width="300" height="25" fill="#DBEAFE" opacity="0.6"/>
    <text x="150" y="71" textAnchor="middle" fill={BLUE} fontSize="10">Atmosphere (CO₂, CH₄, H₂O…)</text>
    {/* Earth */}
    <rect x="0" y="150" width="300" height="30" fill="#D1FAE5" stroke={GREEN} strokeWidth="1"/>
    <text x="150" y="170" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="600">Earth's surface</text>
    {/* Solar radiation in */}
    <line x1="55" y1="45" x2="100" y2="80" stroke={GOLD} strokeWidth="2" markerEnd="url(#gh-a)"/>
    <line x1="100" y1="80" x2="130" y2="150" stroke={GOLD} strokeWidth="2" markerEnd="url(#gh-a)"/>
    <text x="70" y="100" fill={GOLD} fontSize="9">Solar in</text>
    {/* Re-radiated heat trapped */}
    <line x1="170" y1="150" x2="190" y2="80" stroke={RED} strokeWidth="2" markerEnd="url(#gh-b)"/>
    <line x1="190" y1="80" x2="195" y2="80" stroke={RED} strokeWidth="1.5"/>
    <line x1="195" y1="80" x2="175" y2="150" stroke={RED} strokeWidth="2" markerEnd="url(#gh-b)" strokeDasharray="4 3"/>
    <text x="218" y="110" fill={RED} fontSize="9">Heat</text>
    <text x="218" y="122" fill={RED} fontSize="9">trapped</text>
    {/* Escaped */}
    <line x1="235" y1="150" x2="260" y2="80" stroke={GRAY} strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#gh-a)"/>
    <text x="265" y="70" fill={GRAY} fontSize="9">Escaped</text>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// AGRICULTURE
// ═══════════════════════════════════════════════════════════════════════════════

const SoilLayers: React.FC = () => {
  const layers=[
    {label:'O — Organic/Humus',color:'#4B3621',h:25,text:'white'},
    {label:'A — Topsoil',color:'#8B5E3C',h:35,text:'white'},
    {label:'B — Subsoil',color:'#C4956A',h:35,text:NAVY},
    {label:'C — Parent material',color:'#D4B896',h:30,text:NAVY},
    {label:'R — Bedrock',color:'#9CA3AF',h:25,text:'white'},
  ];
  let y=15;
  return(
    <svg viewBox="0 0 300 185" className="w-full max-w-sm mx-auto" aria-label="Soil layers">
      <text x="150" y="12" textAnchor="middle" fill={NAVY} fontSize="11" fontWeight="600">Soil Profile</text>
      {layers.map((l,i)=>{
        const rect=<g key={i}>
          <rect x="40" y={y} width="220" height={l.h} fill={l.color} stroke="#E5E7EB" strokeWidth="1"/>
          <text x="150" y={y+l.h/2+4} textAnchor="middle" fill={l.text} fontSize="10" fontWeight="500">{l.label}</text>
        </g>;
        y+=l.h;
        return rect;
      })}
    </svg>
  );
};

const PlantGrowth: React.FC = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto" aria-label="Plant growth stages">
    {[
      {x:30,stage:'Seed',emoji:'🌱',h:20},
      {x:80,stage:'Sprout',emoji:'🌿',h:50},
      {x:135,stage:'Seedling',emoji:'🌾',h:80},
      {x:190,stage:'Mature',emoji:'🌳',h:110},
    ].map(({x,stage,emoji,h})=>(
      <g key={stage}>
        <line x1={x} y1={160} x2={x} y2={160-h} stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <text x={x} y={160-h-5} fontSize="24" textAnchor="middle">{emoji}</text>
        <text x={x} y={175} textAnchor="middle" fill={NAVY} fontSize="10">{stage}</text>
        {/* Soil line */}
        <line x1={x-18} y1={162} x2={x+18} y2={162} stroke={AMBER} strokeWidth="2"/>
      </g>
    ))}
    <line x1="10" y1="162" x2="250" y2="162" stroke={AMBER} strokeWidth="2"/>
    <text x="130" y="195" textAnchor="middle" fill={GRAY} fontSize="11">Plant Growth Stages</text>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPUTER STUDIES
// ═══════════════════════════════════════════════════════════════════════════════

const Flowchart: React.FC = () => (
  <svg viewBox="0 0 200 280" className="w-full max-w-xs mx-auto" aria-label="Flowchart symbols">
    <ArrowDefs id="fl-a" color={NAVY}/>
    {/* Start (oval) */}
    <ellipse cx="100" cy="25" rx="50" ry="18" fill={GREEN} opacity="0.8"/>
    <text x="100" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Start</text>
    <line x1="100" y1="43" x2="100" y2="60" stroke={NAVY} strokeWidth="2" markerEnd="url(#fl-a)"/>
    {/* Process (rectangle) */}
    <rect x="50" y="62" width="100" height="36" rx="4" fill="#DBEAFE" stroke={BLUE} strokeWidth="1.5"/>
    <text x="100" y="84" textAnchor="middle" fill={BLUE} fontSize="11">Process</text>
    <line x1="100" y1="98" x2="100" y2="118" stroke={NAVY} strokeWidth="2" markerEnd="url(#fl-a)"/>
    {/* Decision (diamond) */}
    <polygon points="100,120 155,155 100,190 45,155" fill="#FEF3C7" stroke={GOLD} strokeWidth="1.5"/>
    <text x="100" y="158" textAnchor="middle" fill={AMBER} fontSize="11">Decision?</text>
    {/* Yes arrow */}
    <line x1="100" y1="190" x2="100" y2="215" stroke={NAVY} strokeWidth="2" markerEnd="url(#fl-a)"/>
    <text x="108" y="205" fill={GREEN} fontSize="10">Yes</text>
    {/* No arrow */}
    <line x1="155" y1="155" x2="185" y2="155" stroke={NAVY} strokeWidth="2" markerEnd="url(#fl-a)"/>
    <text x="168" y="150" fill={RED} fontSize="10">No</text>
    {/* Output (parallelogram) */}
    <polygon points="55,217 145,217 135,250 65,250" fill="#F0FDF4" stroke={GREEN} strokeWidth="1.5"/>
    <text x="100" y="238" textAnchor="middle" fill={GREEN} fontSize="11">Output</text>
    <line x1="100" y1="250" x2="100" y2="265" stroke={NAVY} strokeWidth="2" markerEnd="url(#fl-a)"/>
    {/* End */}
    <ellipse cx="100" cy="272" rx="50" ry="13" fill={RED} opacity="0.8"/>
    <text x="100" y="276" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">End</text>
  </svg>
);

const NetworkTopology: React.FC = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto" aria-label="Network star topology">
    {/* Central switch/router */}
    <rect x="125" y="82" width="50" height="36" rx="6" fill={NAVY} opacity="0.9"/>
    <text x="150" y="103" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Switch</text>
    {/* Devices */}
    {[
      {x:50,y:50,label:'PC 1'},
      {x:200,y:50,label:'PC 2'},
      {x:50,y:150,label:'PC 3'},
      {x:200,y:150,label:'PC 4'},
      {x:130,y:20,label:'Server'},
    ].map(({x,y,label})=>(
      <g key={label}>
        <line x1={x+25} y1={y+15} x2={150} y2={100} stroke={BLUE} strokeWidth="1.5" strokeDasharray="4 3"/>
        <rect x={x} y={y} width="50" height="30" rx="5" fill="#EFF6FF" stroke={BLUE} strokeWidth="1.5"/>
        <text x={x+25} y={y+20} textAnchor="middle" fill={NAVY} fontSize="10">{label}</text>
      </g>
    ))}
    <text x="150" y="195" textAnchor="middle" fill={GRAY} fontSize="11">Star Topology</text>
  </svg>
);

const BinaryTable: React.FC = () => {
  const rows=[[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,0,1,1],[0,1,0,0],[1,0,0,0],[1,0,1,0],[1,1,1,1]];
  const decs=[0,1,2,3,4,8,10,15];
  return(
    <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto" aria-label="Binary to decimal table">
      <text x="140" y="14" textAnchor="middle" fill={NAVY} fontSize="12" fontWeight="600">Binary ↔ Decimal</text>
      {/* Header */}
      {['2³','2²','2¹','2⁰','Dec'].map((h,i)=>(
        <text key={i} x={30+i*50} y="32" textAnchor="middle" fill={GRAY} fontSize="11" fontWeight="600">{h}</text>
      ))}
      <line x1="10" y1="36" x2="270" y2="36" stroke={GRAY} strokeWidth="1"/>
      {rows.map((r,ri)=>(
        <g key={ri}>
          {r.map((b,bi)=>(
            <text key={bi} x={30+bi*50} y={55+ri*18} textAnchor="middle" fill={b?RED:NAVY} fontSize="12" fontWeight={b?"700":"400"}>{b}</text>
          ))}
          <text x="230" y={55+ri*18} textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">{decs[ri]}</text>
        </g>
      ))}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL SCIENCE
// ═══════════════════════════════════════════════════════════════════════════════

const ScientificMethod: React.FC = () => {
  const steps=[
    {label:'Observe',color:'#DBEAFE',border:BLUE},
    {label:'Question',color:'#FEF3C7',border:GOLD},
    {label:'Hypothesis',color:'#F0FDF4',border:GREEN},
    {label:'Experiment',color:'#FEE2E2',border:RED},
    {label:'Analyse',color:'#EDE9FE',border:PURPLE},
    {label:'Conclude',color:'#ECFDF5',border:TEAL},
  ];
  return(
    <svg viewBox="0 0 180 240" className="w-full max-w-xs mx-auto" aria-label="Scientific method">
      <ArrowDefs id="sm-a" color={NAVY}/>
      {steps.map((s,i)=>(
        <g key={i}>
          <rect x="20" y={10+i*36} width="140" height="28" rx="8" fill={s.color} stroke={s.border} strokeWidth="1.5"/>
          <text x="90" y={10+i*36+18} textAnchor="middle" fill={NAVY} fontSize="12" fontWeight="500">{s.label}</text>
          {i<steps.length-1&&(
            <line x1="90" y1={38+i*36} x2="90" y2={44+i*36} stroke={NAVY} strokeWidth="2" markerEnd="url(#sm-a)"/>
          )}
        </g>
      ))}
    </svg>
  );
};

const StatesOfMatter: React.FC = () => {
  const circlePositions=(cx:number,cy:number,r:number,n:number,spacing:number)=>
    Array.from({length:n},(_,i)=>[cx+(i%3)*spacing-spacing,cy+Math.floor(i/3)*spacing-spacing/2]);
  const solid=circlePositions(55,110,4,9,16);
  const liquid=circlePositions(150,110,4,7,18);
  const gas=circlePositions(248,110,4,5,30);
  return(
    <svg viewBox="0 0 310 170" className="w-full max-w-sm mx-auto" aria-label="States of matter">
      {/* Boxes */}
      {[{x:15,label:'Solid',color:'#DBEAFE'},{x:110,label:'Liquid',color:'#FEF3C7'},{x:205,label:'Gas',color:'#F0FDF4'}].map(({x,label,color})=>(
        <g key={label}>
          <rect x={x} y="80" width="85" height="65" rx="8" fill={color} stroke={GRAY} strokeWidth="1.5"/>
          <text x={x+42} y="155" textAnchor="middle" fill={NAVY} fontSize="11" fontWeight="600">{label}</text>
        </g>
      ))}
      {/* Particles */}
      {solid.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill={BLUE} opacity="0.8"/>)}
      {liquid.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill={GOLD} opacity="0.8"/>)}
      {gas.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill={GREEN} opacity="0.8"/>)}
      {/* Arrows */}
      <ArrowDefs id="sm2-a" color={RED}/>
      <defs><marker id="sm2-b" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={BLUE}/></marker></defs>
      <line x1="102" y1="85" x2="112" y2="85" stroke={RED} strokeWidth="1.5" markerEnd="url(#sm2-a)"/>
      <text x="107" y="80" textAnchor="middle" fill={RED} fontSize="8">heat</text>
      <line x1="112" y1="95" x2="102" y2="95" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#sm2-b)"/>
      <text x="107" y="105" textAnchor="middle" fill={BLUE} fontSize="8">cool</text>
      <line x1="197" y1="85" x2="207" y2="85" stroke={RED} strokeWidth="1.5" markerEnd="url(#sm2-a)"/>
      <line x1="207" y1="95" x2="197" y2="95" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#sm2-b)"/>
      <text x="150" y="20" textAnchor="middle" fill={NAVY} fontSize="12" fontWeight="600">States of Matter</text>
      <text x="55" y="60" textAnchor="middle" fill={BLUE} fontSize="9">Fixed shape</text>
      <text x="152" y="60" textAnchor="middle" fill={AMBER} fontSize="9">Flows freely</text>
      <text x="248" y="60" textAnchor="middle" fill={GREEN} fontSize="9">Fills space</text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Diagram registry
// ═══════════════════════════════════════════════════════════════════════════════
const DIAGRAMS: Record<string, React.FC> = {
  // Physics
  'parallel-plate':           ParallelPlate,
  'cap-series':               CapSeries,
  'cap-parallel':             CapParallel,
  'rc-circuit':               RcCircuit,
  'rc-curve':                 RcCurve,
  'dielectric-polarisation':  DielectricPolarisation,
  'energy-in-capacitor':      EnergyInCapacitor,
  'wave-diagram':             WaveDiagram,
  'force-diagram':            ForceDiagram,
  // Mathematics
  'coordinate-plane':         CoordinatePlane,
  'triangle-labels':          TriangleLabels,
  'number-line':              NumberLine,
  'circle-parts':             CircleParts,
  'normal-curve':             NormalCurve,
  'histogram':                Histogram,
  'box-plot':                 BoxPlot,
  // Chemistry
  'bohr-atom':                BohrAtom,
  'periodic-elements':        PeriodicTable,
  'ph-scale':                 PhScale,
  'molecule-h2o':             MoleculeH2O,
  // Biology
  'animal-cell':              AnimalCell,
  'dna-helix':                DnaHelix,
  'food-chain':               FoodChain,
  // Environmental Science
  'carbon-cycle':             CarbonCycle,
  'greenhouse-effect':        GreenhouseEffect,
  // Agriculture
  'soil-layers':              SoilLayers,
  'plant-growth':             PlantGrowth,
  // Computer Studies
  'flowchart':                Flowchart,
  'network-topology':         NetworkTopology,
  'binary-table':             BinaryTable,
  // General Science
  'scientific-method':        ScientificMethod,
  'states-of-matter':         StatesOfMatter,
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
