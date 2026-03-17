import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';

interface HoverTermProps {
  term: string;
  explanations: {
    kid: string;
    standard: string;
    advanced: string;
    realWorld?: string[];
  };
  children?: React.ReactNode;
}

const LEVEL_LABELS = [
  { key: 'kid', label: '🌱 Kid', color: 'text-emerald-600' },
  { key: 'standard', label: '🔬 Standard', color: 'text-blue-600' },
  { key: 'advanced', label: '🧠 Advanced', color: 'text-purple-600' },
];

const HoverTerm: React.FC<HoverTermProps> = ({ term, explanations, children }) => {
  const [visible, setVisible] = useState(false);
  const [activeLevel, setActiveLevel] = useState<'kid' | 'standard' | 'advanced'>('standard');
  const [position, setPosition] = useState<'above' | 'below'>('above');
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition(rect.top < 220 ? 'below' : 'above');
  }, [visible]);

  // Close when clicking outside
  useEffect(() => {
    if (!visible) return;
    const handler = (e: MouseEvent) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [visible]);

  const currentExplanation = explanations[activeLevel];

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        className="cursor-help border-b-2 border-dotted border-blue-400 text-blue-700 font-medium hover:text-blue-900 hover:border-blue-600 transition-colors"
        onMouseEnter={() => setVisible(true)}
        onClick={() => setVisible(v => !v)}
      >
        {children ?? term}
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-72 bg-white rounded-2xl shadow-2xl border border-premium-neutral-200 overflow-hidden
            ${position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'}
            left-1/2 -translate-x-1/2`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-greyed-navy to-greyed-blue px-4 py-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-white/80" />
            <span className="text-white font-semibold text-sm">{term}</span>
          </div>

          {/* Level tabs */}
          <div className="flex border-b border-premium-neutral-100">
            {LEVEL_LABELS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setActiveLevel(key as typeof activeLevel)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  activeLevel === key
                    ? `${color} border-b-2 border-current bg-premium-neutral-50`
                    : 'text-premium-neutral-400 hover:text-premium-neutral-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Explanation */}
          <div className="px-4 py-3">
            <p className="text-sm text-premium-neutral-700 leading-relaxed">
              {currentExplanation}
            </p>

            {explanations.realWorld && explanations.realWorld.length > 0 && (
              <div className="mt-3 pt-3 border-t border-premium-neutral-100">
                <p className="text-xs font-semibold text-premium-neutral-500 uppercase tracking-wide mb-1.5">
                  Real World
                </p>
                <ul className="space-y-1">
                  {explanations.realWorld.slice(0, 2).map((item, i) => (
                    <li key={i} className="text-xs text-premium-neutral-600 flex gap-1.5">
                      <span className="text-greyed-blue mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Close hint */}
          <div className="px-4 pb-2 flex justify-end">
            <button
              onClick={() => setVisible(false)}
              className="text-xs text-premium-neutral-400 hover:text-premium-neutral-600 flex items-center gap-1"
            >
              <ChevronDown className="w-3 h-3" /> close
            </button>
          </div>
        </div>
      )}
    </span>
  );
};

export default HoverTerm;
