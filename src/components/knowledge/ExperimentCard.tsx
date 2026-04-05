import React, { useState } from 'react';
import { FlaskConical, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Package, ListChecks } from 'lucide-react';
import type { Experiment } from '../../data/knowledgeGalaxy';

interface ExperimentCardProps {
  experiments: Experiment[];
  selectedMicroTopicId?: string | null;
  microTopics?: { id: string; title: string }[];
}

const LEVEL_CONFIG = {
  easy: {
    label: '🏠 Easy',
    sublabel: 'At home',
    activeClass: 'bg-emerald-50 border-emerald-500 text-emerald-800',
    inactiveClass: 'border-emerald-200 text-emerald-600 hover:border-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  medium: {
    label: '🔧 Medium',
    sublabel: 'In class',
    activeClass: 'bg-blue-50 border-blue-500 text-blue-800',
    inactiveClass: 'border-blue-200 text-blue-600 hover:border-blue-400',
    badge: 'bg-blue-100 text-blue-700',
  },
  hard: {
    label: '🧪 Advanced',
    sublabel: 'Lab / research',
    activeClass: 'bg-purple-50 border-purple-500 text-purple-800',
    inactiveClass: 'border-purple-200 text-purple-600 hover:border-purple-400',
    badge: 'bg-purple-100 text-purple-700',
  },
};

const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiments, selectedMicroTopicId, microTopics }) => {
  const filtered = selectedMicroTopicId
    ? experiments.filter(e => e.microTopicId === selectedMicroTopicId)
    : experiments;

  const activeExperiments = filtered.length > 0 ? filtered : experiments;

  const [activeLevel, setActiveLevel] = useState<Experiment['level']>(
    activeExperiments[0]?.level ?? 'easy'
  );
  const [expandedSection, setExpandedSection] = useState<string | null>('steps');

  React.useEffect(() => {
    const first = activeExperiments[0];
    if (first) setActiveLevel(first.level);
    setExpandedSection('steps');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMicroTopicId]);

  const experiment = activeExperiments.find(e => e.level === activeLevel) ?? activeExperiments[0];

  if (!experiment) return null;

  const toggle = (section: string) =>
    setExpandedSection(s => (s === section ? null : section));

  const cfg = LEVEL_CONFIG[experiment.level];

  return (
    <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-premium-neutral-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-greyed-navy to-greyed-blue flex items-center justify-center flex-shrink-0">
          <FlaskConical className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-premium-navy text-sm">Experiments</h3>
          <p className="text-xs text-premium-neutral-400">
            {activeExperiments.length} experiment{activeExperiments.length !== 1 ? 's' : ''}
            {selectedMicroTopicId && microTopics
              ? ` · ${microTopics.find(m => m.id === selectedMicroTopicId)?.title ?? ''}`
              : ' · hands-on science'}
          </p>
        </div>
      </div>

      {/* Level selector */}
      <div className="px-5 pt-4 flex gap-2 flex-wrap">
        {(['easy', 'medium', 'hard'] as Experiment['level'][]).map(level => {
          const c = LEVEL_CONFIG[level];
          const isActive = activeLevel === level;
          const available = activeExperiments.some(e => e.level === level);
          if (!available) return null;
          return (
            <button
              key={level}
              onClick={() => { setActiveLevel(level); setExpandedSection('steps'); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 text-left
                ${isActive ? c.activeClass : `bg-white ${c.inactiveClass}`}`}
            >
              <span className="text-xs font-semibold">{c.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.badge}`}>
                {c.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Experiment content */}
      <div className="px-5 py-4 space-y-3">
        {/* Title + description */}
        <div>
          <h4 className="font-bold text-premium-navy text-base">{experiment.title}</h4>
          <p className="text-sm text-premium-neutral-600 mt-1">{experiment.description}</p>
        </div>

        {/* Materials accordion */}
        <div className="border border-premium-neutral-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('materials')}
            className="w-full flex items-center justify-between px-4 py-3 bg-premium-neutral-50 hover:bg-premium-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-premium-navy">
              <Package className="w-4 h-4 text-greyed-blue" />
              Materials ({experiment.materials.length})
            </div>
            {expandedSection === 'materials'
              ? <ChevronUp className="w-4 h-4 text-premium-neutral-400" />
              : <ChevronDown className="w-4 h-4 text-premium-neutral-400" />}
          </button>
          {expandedSection === 'materials' && (
            <div className="px-4 py-3 grid grid-cols-2 gap-1.5">
              {experiment.materials.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-premium-neutral-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-greyed-blue flex-shrink-0" />
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Steps accordion */}
        <div className="border border-premium-neutral-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('steps')}
            className="w-full flex items-center justify-between px-4 py-3 bg-premium-neutral-50 hover:bg-premium-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-premium-navy">
              <ListChecks className="w-4 h-4 text-greyed-blue" />
              Steps ({experiment.steps.length})
            </div>
            {expandedSection === 'steps'
              ? <ChevronUp className="w-4 h-4 text-premium-neutral-400" />
              : <ChevronDown className="w-4 h-4 text-premium-neutral-400" />}
          </button>
          {expandedSection === 'steps' && (
            <div className="px-4 py-3 space-y-2.5">
              {experiment.steps.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm text-premium-neutral-700">
                  <span className="w-5 h-5 rounded-full bg-greyed-navy text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety note */}
        {experiment.safety && experiment.safety !== 'No safety concerns.' && (
          <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Safety</p>
              <p className="text-sm text-amber-800 mt-0.5">{experiment.safety}</p>
            </div>
          </div>
        )}

        {/* Expected results */}
        <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Expected Results</p>
            <p className="text-sm text-emerald-800 mt-0.5">{experiment.expected}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentCard;
