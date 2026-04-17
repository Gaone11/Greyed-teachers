import React, { useState } from 'react';
import { Compass, ChevronRight, Sparkles } from 'lucide-react';
import type { CuriosityBranch } from '../../data/knowledgeGalaxy';

interface CuriosityTreeProps {
  branches: CuriosityBranch[];
  onNavigate: (topicId: string) => void;
  topicTitle: string;
}

const CuriosityTree: React.FC<CuriosityTreeProps> = ({ branches, onNavigate, topicTitle }) => {
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  if (branches.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-5 py-4 border-b border-premium-neutral-100 flex items-center justify-between hover:bg-premium-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#2a2f6e] flex items-center justify-center flex-shrink-0">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-premium-navy text-sm">Explore Further</h3>
            <p className="text-xs text-premium-neutral-400">Curious about {topicTitle}? Go deeper</p>
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-premium-neutral-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {expanded && (
        <div className="p-4 space-y-2">
          {/* Intro line */}
          <p className="text-xs text-premium-neutral-400 px-1 mb-3">
            Every question leads to a new universe of knowledge. Click a branch to explore.
          </p>

          {branches.map((branch, i) => (
            <button
              key={branch.topicId}
              onMouseEnter={() => setHovered(branch.topicId)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onNavigate(branch.topicId)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left border-2 transition-all duration-200
                ${hovered === branch.topicId
                  ? 'border-amber-400 bg-slate-800 shadow-sm'
                  : 'border-premium-neutral-100 bg-premium-neutral-50 hover:border-amber-300'
                }`}
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {/* Tree connector */}
              <div className="flex flex-col items-center flex-shrink-0 self-stretch">
                <div className={`w-2 h-2 rounded-full border-2 transition-colors ${hovered === branch.topicId ? 'border-amber-500 bg-slate-400' : 'border-premium-neutral-300 bg-white'}`} />
                {i < branches.length - 1 && (
                  <div className="w-0.5 flex-1 bg-premium-neutral-200 mt-1" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug transition-colors ${hovered === branch.topicId ? 'text-slate-200' : 'text-premium-neutral-700'}`}>
                  {branch.label}
                </p>
              </div>

              <Sparkles
                className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${hovered === branch.topicId ? 'text-slate-300' : 'text-premium-neutral-300'}`}
              />
            </button>
          ))}

          <p className="text-center text-xs text-premium-neutral-300 pt-2">
            More branches unlock as you explore topics
          </p>
        </div>
      )}
    </div>
  );
};

export default CuriosityTree;
