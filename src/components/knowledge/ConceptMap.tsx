import React, { useMemo } from 'react';
import { Network } from 'lucide-react';
import { getTopicById } from '../../data/knowledgeGalaxy';

interface ConceptMapProps {
  topicId: string;
  relatedTopicIds: string[];
  onNavigate: (topicId: string) => void;
  microTopics?: { id: string; title: string }[];
  selectedMicroTopicId?: string | null;
  onSelectMicroTopic?: (id: string | null) => void;
}

interface MapNode {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  isCenter: boolean;
  ring: 'center' | 'inner' | 'outer';
  onClick?: () => void;
}

// Assign a visual emoji to a micro-topic based on its index
const MICRO_ICONS = ['🔵', '🟢', '🟡', '🟠', '🔴', '🟣', '⚪', '🟤'];

const ConceptMap: React.FC<ConceptMapProps> = ({
  topicId,
  relatedTopicIds,
  onNavigate,
  microTopics = [],
  selectedMicroTopicId,
  onSelectMicroTopic,
}) => {
  const centerTopic = getTopicById(topicId);

  const nodes: MapNode[] = useMemo(() => {
    const cx = 250;
    const cy = 190;

    if (selectedMicroTopicId && microTopics.length > 0) {
      const selectedMt = microTopics.find(mt => mt.id === selectedMicroTopicId);
      if (!selectedMt) return [];

      // Inner ring: other micro-topics (up to 5)
      const others = microTopics.filter(mt => mt.id !== selectedMicroTopicId).slice(0, 5);
      const innerRadius = 95;
      const innerNodes: MapNode[] = others.map((mt, i) => {
        const angle = (2 * Math.PI * i) / others.length - Math.PI / 2;
        const mtIdx = microTopics.findIndex(m => m.id === mt.id);
        return {
          id: `micro-${mt.id}`,
          label: mt.title,
          icon: MICRO_ICONS[mtIdx % MICRO_ICONS.length],
          x: cx + innerRadius * Math.cos(angle),
          y: cy + innerRadius * Math.sin(angle),
          isCenter: false,
          ring: 'inner',
          onClick: () => onSelectMicroTopic?.(mt.id),
        };
      });

      // Outer ring: related flagship topics (up to 3)
      const relatedTopics = relatedTopicIds
        .slice(0, 3)
        .map(id => getTopicById(id))
        .filter((t): t is NonNullable<typeof t> => t !== undefined);

      const outerRadius = 160;
      const outerNodes: MapNode[] = relatedTopics.map((t, i) => {
        const angle = (2 * Math.PI * i) / Math.max(relatedTopics.length, 1) - Math.PI / 4;
        return {
          id: t.id,
          label: t.title,
          icon: t.icon,
          x: cx + outerRadius * Math.cos(angle),
          y: cy + outerRadius * Math.sin(angle),
          isCenter: false,
          ring: 'outer',
          onClick: () => onNavigate(t.id),
        };
      });

      const centerIdx = microTopics.findIndex(m => m.id === selectedMicroTopicId);

      return [
        {
          id: `micro-center-${selectedMt.id}`,
          label: selectedMt.title,
          icon: MICRO_ICONS[centerIdx % MICRO_ICONS.length],
          x: cx,
          y: cy,
          isCenter: true,
          ring: 'center',
        },
        ...innerNodes,
        ...outerNodes,
      ];
    }

    // Default: flagship topic at center, related flagship topics around it
    const known = relatedTopicIds
      .map(id => getTopicById(id))
      .filter((t): t is NonNullable<typeof t> => t !== undefined)
      .slice(0, 6);

    const radius = 115;
    const relatedNodes: MapNode[] = known.map((t, i) => {
      const angle = (2 * Math.PI * i) / known.length - Math.PI / 2;
      return {
        id: t.id,
        label: t.title,
        icon: t.icon,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        isCenter: false,
        ring: 'inner',
        onClick: () => onNavigate(t.id),
      };
    });

    return [
      {
        id: topicId,
        label: centerTopic?.title ?? topicId,
        icon: centerTopic?.icon ?? '●',
        x: cx,
        y: cy,
        isCenter: true,
        ring: 'center',
      },
      ...relatedNodes,
    ];
  }, [topicId, relatedTopicIds, centerTopic, microTopics, selectedMicroTopicId, onNavigate, onSelectMicroTopic]);

  const centerNode = nodes.find(n => n.isCenter);
  const innerNodes = nodes.filter(n => n.ring === 'inner');
  const outerNodes = nodes.filter(n => n.ring === 'outer');

  if (!centerNode || (innerNodes.length === 0 && outerNodes.length === 0)) return null;

  return (
    <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-premium-neutral-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#212754] to-[#1c2063] flex items-center justify-center flex-shrink-0">
          <Network className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-premium-navy text-sm">Concept Map</h3>
          <p className="text-xs text-premium-neutral-400">
            {selectedMicroTopicId
              ? 'Connections for selected subtopic — click nodes to switch'
              : 'Related topics — click to explore'}
          </p>
        </div>
      </div>

      {/* SVG canvas */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 mx-4 my-4 rounded-xl overflow-hidden">
        <svg viewBox="0 0 500 380" className="w-full" style={{ maxHeight: '360px' }}>
          <defs>
            {/* Soft glow for outer/inner nodes */}
            <filter id="glow-node" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Strong glow for center */}
            <filter id="glow-center" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Center gradient — indigo */}
            <radialGradient id="grad-center" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#4338CA" />
            </radialGradient>
            {/* Inner node gradient — teal/green */}
            <radialGradient id="grad-inner" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
            {/* Outer node gradient — amber */}
            <radialGradient id="grad-outer" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
            {/* Star / particle gradient */}
            <radialGradient id="grad-star" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" />
            </radialGradient>

            <style>{`
              .line-inner-flow {
                stroke-dasharray: 7 5;
                animation: flow-in 1.8s linear infinite;
              }
              .line-outer-flow {
                stroke-dasharray: 9 6;
                animation: flow-out 2.8s linear infinite reverse;
              }
              .pulse-ring-1 {
                animation: pulse-a 2.6s ease-in-out infinite;
                transform-origin: 250px 190px;
              }
              .pulse-ring-2 {
                animation: pulse-a 2.6s ease-in-out infinite 1.3s;
                transform-origin: 250px 190px;
              }
              .orbit-slow {
                animation: orbit 18s linear infinite;
                transform-origin: 250px 190px;
              }
              @keyframes flow-in {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -48; }
              }
              @keyframes flow-out {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -60; }
              }
              @keyframes pulse-a {
                0%,100% { r: 36; opacity: 0.18; }
                50%      { r: 50; opacity: 0.06; }
              }
              @keyframes orbit {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
            `}</style>
          </defs>

          {/* Background stars */}
          {[
            [40, 30], [470, 50], [80, 340], [450, 320], [160, 20], [370, 360],
            [20, 200], [490, 180], [280, 15], [140, 370],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#E0E7FF" opacity={0.3 + (i % 4) * 0.1} />
          ))}

          {/* Slow-orbiting decorative ring */}
          <circle
            cx={centerNode.x}
            cy={centerNode.y}
            r="68"
            fill="none"
            stroke="#818CF820"
            strokeWidth="1"
            strokeDasharray="3 8"
            className="orbit-slow"
          />

          {/* Outer connections */}
          {outerNodes.map(node => (
            <line
              key={`ol-${node.id}`}
              x1={centerNode.x}
              y1={centerNode.y}
              x2={node.x}
              y2={node.y}
              stroke="#FBBF2450"
              strokeWidth="1.5"
              className="line-outer-flow"
            />
          ))}

          {/* Inner connections */}
          {innerNodes.map(node => (
            <line
              key={`il-${node.id}`}
              x1={centerNode.x}
              y1={centerNode.y}
              x2={node.x}
              y2={node.y}
              stroke="#34D39960"
              strokeWidth="1.5"
              className="line-inner-flow"
            />
          ))}

          {/* Pulsing rings behind center */}
          <circle cx={centerNode.x} cy={centerNode.y} r="36" fill="none" stroke="#818CF8" strokeWidth="2" className="pulse-ring-1" />
          <circle cx={centerNode.x} cy={centerNode.y} r="36" fill="none" stroke="#818CF8" strokeWidth="2" className="pulse-ring-2" />

          {/* Outer nodes */}
          {outerNodes.map(node => (
            <g key={node.id} onClick={node.onClick} style={{ cursor: 'pointer' }}>
              <circle cx={node.x} cy={node.y} r="24" fill="url(#grad-outer)" filter="url(#glow-node)" />
              <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle" fontSize="14">
                {node.icon}
              </text>
              <text x={node.x} y={node.y + 33} textAnchor="middle" fontSize="7.5" fill="#FDE68A" opacity="0.9">
                {node.label.length > 11 ? node.label.slice(0, 11) + '…' : node.label}
              </text>
            </g>
          ))}

          {/* Inner nodes */}
          {innerNodes.map(node => (
            <g key={node.id} onClick={node.onClick} style={{ cursor: 'pointer' }}>
              <circle cx={node.x} cy={node.y} r="24" fill="url(#grad-inner)" filter="url(#glow-node)" />
              <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle" fontSize="14">
                {node.icon}
              </text>
              <text x={node.x} y={node.y + 33} textAnchor="middle" fontSize="7.5" fill="#6EE7B7" opacity="0.9">
                {node.label.length > 11 ? node.label.slice(0, 11) + '…' : node.label}
              </text>
            </g>
          ))}

          {/* Center node */}
          <circle cx={centerNode.x} cy={centerNode.y} r="34" fill="url(#grad-center)" filter="url(#glow-center)" />
          <text x={centerNode.x} y={centerNode.y} textAnchor="middle" dominantBaseline="middle" fontSize="20">
            {centerNode.icon}
          </text>
          <text x={centerNode.x} y={centerNode.y + 44} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#E0E7FF">
            {centerNode.label.length > 14 ? centerNode.label.slice(0, 14) + '…' : centerNode.label}
          </text>
        </svg>
      </div>

      {/* Legend chips */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        {innerNodes.map(node => (
          <button
            key={node.id}
            onClick={node.onClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-emerald-200 hover:border-emerald-400 rounded-lg text-xs text-slate-200 transition-colors"
          >
            <span>{node.icon}</span>
            {node.label}
          </button>
        ))}
        {outerNodes.map(node => (
          <button
            key={node.id}
            onClick={node.onClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-amber-200 hover:border-amber-400 rounded-lg text-xs text-slate-200 transition-colors"
          >
            <span>{node.icon}</span>
            {node.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConceptMap;
