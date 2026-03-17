import React, { useMemo } from 'react';
import { Network } from 'lucide-react';
import { getTopicById } from '../../data/knowledgeGalaxy';

interface ConceptMapProps {
  topicId: string;
  relatedTopicIds: string[];
  onNavigate: (topicId: string) => void;
}

interface Node {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  isCenter: boolean;
}

const ConceptMap: React.FC<ConceptMapProps> = ({ topicId, relatedTopicIds, onNavigate }) => {
  const centerTopic = getTopicById(topicId);

  const nodes: Node[] = useMemo(() => {
    const known = relatedTopicIds
      .map(id => getTopicById(id))
      .filter((t): t is NonNullable<typeof t> => t !== undefined)
      .slice(0, 6);

    const count = known.length;
    const cx = 160;
    const cy = 120;
    const radius = 90;

    const related: Node[] = known.map((t, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      return {
        id: t.id,
        label: t.title,
        icon: t.icon,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        isCenter: false,
      };
    });

    return [
      {
        id: topicId,
        label: centerTopic?.title ?? topicId,
        icon: centerTopic?.icon ?? '•',
        x: cx,
        y: cy,
        isCenter: true,
      },
      ...related,
    ];
  }, [topicId, relatedTopicIds, centerTopic]);

  const centerNode = nodes[0];
  const relatedNodes = nodes.slice(1);

  if (relatedNodes.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-premium-neutral-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Network className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-premium-navy text-sm">Concept Map</h3>
          <p className="text-xs text-premium-neutral-400">Related ideas — click to explore</p>
        </div>
      </div>

      {/* SVG Map */}
      <div className="px-4 py-4">
        <svg
          viewBox="0 0 320 240"
          className="w-full"
          style={{ maxHeight: '240px' }}
        >
          {/* Connection lines */}
          {relatedNodes.map(node => (
            <line
              key={`line-${node.id}`}
              x1={centerNode.x}
              y1={centerNode.y}
              x2={node.x}
              y2={node.y}
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          ))}

          {/* Related nodes */}
          {relatedNodes.map(node => (
            <g
              key={node.id}
              className="cursor-pointer group"
              onClick={() => onNavigate(node.id)}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="22"
                fill="white"
                stroke="#94A3B8"
                strokeWidth="1.5"
                className="group-hover:stroke-indigo-400 group-hover:fill-indigo-50 transition-all duration-150"
              />
              <text
                x={node.x}
                y={node.y - 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
              >
                {node.icon}
              </text>
              {/* Label below node */}
              <text
                x={node.x}
                y={node.y + 29}
                textAnchor="middle"
                fontSize="8"
                fill="#64748B"
                className="group-hover:fill-indigo-600"
              >
                {node.label.length > 10 ? node.label.slice(0, 10) + '…' : node.label}
              </text>
            </g>
          ))}

          {/* Center node */}
          <circle
            cx={centerNode.x}
            cy={centerNode.y}
            r="28"
            fill="#1B3A6B"
          />
          <text
            x={centerNode.x}
            y={centerNode.y - 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
          >
            {centerNode.icon}
          </text>
          <text
            x={centerNode.x}
            y={centerNode.y + 35}
            textAnchor="middle"
            fontSize="8"
            fontWeight="bold"
            fill="#1B3A6B"
          >
            {centerNode.label.length > 12 ? centerNode.label.slice(0, 12) + '…' : centerNode.label}
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-premium-neutral-100">
          {relatedNodes.map(node => (
            <button
              key={node.id}
              onClick={() => onNavigate(node.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-premium-neutral-50 hover:bg-indigo-50 border border-premium-neutral-200 hover:border-indigo-300 rounded-lg text-xs text-premium-neutral-600 hover:text-indigo-700 transition-colors"
            >
              <span>{node.icon}</span>
              {node.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConceptMap;
