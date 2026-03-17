import React, { useEffect } from 'react';
import type { DifficultyLevel } from '../../data/knowledgeGalaxy';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
  /** If true, persists the selection in localStorage */
  persist?: boolean;
  storageKey?: string;
}

const LEVELS: { id: DifficultyLevel; emoji: string; label: string; sublabel: string; color: string; activeClass: string }[] = [
  {
    id: 'explorer',
    emoji: '🌱',
    label: 'Explorer',
    sublabel: 'Ages 7–10',
    color: 'border-emerald-200 hover:border-emerald-400',
    activeClass: 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md',
  },
  {
    id: 'investigator',
    emoji: '🔬',
    label: 'Investigator',
    sublabel: 'Ages 11–14',
    color: 'border-blue-200 hover:border-blue-400',
    activeClass: 'bg-blue-50 border-blue-500 text-blue-800 shadow-md',
  },
  {
    id: 'scholar',
    emoji: '🧠',
    label: 'Scholar',
    sublabel: 'High School',
    color: 'border-purple-200 hover:border-purple-400',
    activeClass: 'bg-purple-50 border-purple-500 text-purple-800 shadow-md',
  },
  {
    id: 'researcher',
    emoji: '🚀',
    label: 'Researcher',
    sublabel: 'University',
    color: 'border-orange-200 hover:border-orange-400',
    activeClass: 'bg-orange-50 border-orange-500 text-orange-800 shadow-md',
  },
];

const STORAGE_KEY_DEFAULT = 'knowledge_difficulty_level';

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  persist = true,
  storageKey = STORAGE_KEY_DEFAULT,
}) => {
  // Load persisted value on mount
  useEffect(() => {
    if (!persist) return;
    const saved = localStorage.getItem(storageKey) as DifficultyLevel | null;
    if (saved && LEVELS.some(l => l.id === saved)) {
      onChange(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (level: DifficultyLevel) => {
    onChange(level);
    if (persist) localStorage.setItem(storageKey, level);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {LEVELS.map(level => {
        const isActive = value === level.id;
        return (
          <button
            key={level.id}
            onClick={() => handleSelect(level.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 text-left
              ${isActive ? level.activeClass : `bg-white ${level.color} text-premium-neutral-600`}
            `}
          >
            <span className="text-lg leading-none">{level.emoji}</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight">{level.label}</span>
              <span className={`text-[10px] leading-tight ${isActive ? 'opacity-70' : 'text-premium-neutral-400'}`}>
                {level.sublabel}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DifficultySelector;
