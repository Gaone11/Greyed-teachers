import React, { useMemo, useState } from 'react';
import { Zap, ArrowRight, RefreshCw } from 'lucide-react';
import { SUBJECTS } from '../../data/knowledgeGalaxy';

interface FeedCard {
  question: string;
  answer: string;
  topicTitle: string;
  topicId: string;
  subjectIcon: string;
  subjectTitle: string;
}

function buildFeed(): FeedCard[] {
  const cards: FeedCard[] = [];
  for (const subject of SUBJECTS) {
    for (const domain of subject.domains) {
      for (const topic of domain.flagshipTopics) {
        // Use real-world items as "did you know" cards
        topic.realWorld.forEach((fact, i) => {
          cards.push({
            question: `Did you know? — ${topic.title}`,
            answer: fact,
            topicTitle: topic.title,
            topicId: topic.id,
            subjectIcon: subject.icon,
            subjectTitle: subject.title,
          });
        });
        // Also use curiosity branches as teaser cards
        topic.curiosityBranches.slice(0, 2).forEach(branch => {
          cards.push({
            question: branch.label,
            answer: topic.explanations.explorer,
            topicTitle: topic.title,
            topicId: topic.id,
            subjectIcon: subject.icon,
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
  'from-indigo-600 to-purple-700',
  'from-greyed-navy to-greyed-blue',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-sky-600 to-cyan-700',
  'from-rose-600 to-pink-700',
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
          <Zap className="w-5 h-5 text-amber-500" />
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
                <span className="text-lg">{card.subjectIcon}</span>
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
