import React, { useMemo, useState } from 'react';
import { Zap, ArrowRight, RefreshCw, Calculator, FlaskConical, Microscope, Globe, Monitor, Leaf, Sprout, BarChart2, BookOpen } from 'lucide-react';
import { SUBJECTS } from '../../data/knowledgeGalaxy';

const SUBJECT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'mathematics':           Calculator,
  'physics':               Zap,
  'chemistry':             FlaskConical,
  'biology':               Microscope,
  'general-science':       Globe,
  'computer-studies':      Monitor,
  'environmental-science': Leaf,
  'agriculture':           Sprout,
  'statistics':            BarChart2,
};

interface FeedCard {
  question: string;
  answer: string;
  topicTitle: string;
  topicId: string;
  subjectId: string;
  subjectTitle: string;
}

function buildFeed(): FeedCard[] {
  const cards: FeedCard[] = [];
  for (const subject of SUBJECTS) {
    for (const domain of subject.domains) {
      for (const topic of domain.flagshipTopics) {
        topic.realWorld.forEach((fact) => {
          cards.push({
            question: `Did you know? — ${topic.title}`,
            answer: fact,
            topicTitle: topic.title,
            topicId: topic.id,
            subjectId: subject.id,
            subjectTitle: subject.title,
          });
        });
        topic.curiosityBranches.slice(0, 2).forEach(branch => {
          cards.push({
            question: branch.label,
            answer: topic.explanations.explorer,
            topicTitle: topic.title,
            topicId: topic.id,
            subjectId: subject.id,
            subjectTitle: subject.title,
          });
        });
      }
    }
  }
  return cards;
}

const ALL_CARDS = buildFeed();

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CARD_COLORS = [
  'from-[#212754] to-[#1e2d6b]',
  'from-[#212754] to-[#1c2063]',
  'from-[#2a2f6e] to-[#212754]',
  'from-[#212754] to-[#1a2858]',
  'from-[#212754] to-[#191d4a]',
  'from-[#1c2063] to-[#212754]',
];

interface DiscoveryFeedProps {
  onNavigate: (topicId: string) => void;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ onNavigate }) => {
  const [seed, setSeed] = useState(0);

  const cards = useMemo(() => shuffle(ALL_CARDS).slice(0, 8), [seed]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-slate-300" />
          <h2 className="font-bold text-premium-navy text-lg">Discovery Feed</h2>
        </div>
        <button
          onClick={() => setSeed(s => s + 1)}
          className="flex items-center gap-1.5 text-xs text-premium-neutral-500 hover:text-greyed-navy px-3 py-1.5 rounded-lg hover:bg-premium-neutral-100 border border-premium-neutral-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const gradient = CARD_COLORS[i % CARD_COLORS.length];
          return (
            <div
              key={`${card.topicId}-${i}`}
              className={`bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden shadow-md`}
            >
              {/* Subject badge */}
              <div className="px-4 pt-4 flex items-center gap-2">
                {(() => { const Icon = SUBJECT_ICONS[card.subjectId] || BookOpen; return <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0"><Icon className="w-3.5 h-3.5 text-greyed-blue" /></div>; })()}
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  {card.subjectTitle} · {card.topicTitle}
                </span>
              </div>

              {/* Question */}
              <div className="px-4 pt-3">
                <p className="text-white font-bold text-sm leading-snug">
                  {card.question}
                </p>
              </div>

              {/* Answer preview */}
              <div className="px-4 pt-2 pb-4">
                <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
                  {card.answer}
                </p>
              </div>

              {/* Explore link */}
              <button
                onClick={() => onNavigate(card.topicId)}
                className="w-full flex items-center justify-between px-4 py-3 bg-black/20 hover:bg-black/30 transition-colors text-white/90 hover:text-white"
              >
                <span className="text-xs font-semibold">Explore {card.topicTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoveryFeed;
