import React, { useState } from 'react';
import {
  BookOpen, FlaskConical, Brain, Compass, Network,
  Globe, HelpCircle, ChevronLeft, Star, CheckCircle2
} from 'lucide-react';
import type { FlagshipTopic, DifficultyLevel } from '../../data/knowledgeGalaxy';
import DifficultySelector from './DifficultySelector';
import FlashcardDeck from './FlashcardDeck';
import ExperimentCard from './ExperimentCard';
import CuriosityTree from './CuriosityTree';
import ConceptMap from './ConceptMap';

type Tab = 'overview' | 'flashcards' | 'experiments' | 'curiosity' | 'quiz' | 'realworld';

const TABS: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: 'overview', icon: BookOpen, label: 'Overview' },
  { id: 'flashcards', icon: Brain, label: 'Flashcards' },
  { id: 'experiments', icon: FlaskConical, label: 'Experiments' },
  { id: 'curiosity', icon: Compass, label: 'Curiosity' },
  { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
  { id: 'realworld', icon: Globe, label: 'Real World' },
];

interface TopicViewProps {
  topic: FlagshipTopic;
  subjectTitle: string;
  domainTitle: string;
  onBack: () => void;
  onNavigate: (topicId: string) => void;
}

// ── Mini Quiz ─────────────────────────────────────────────────────────────────

const MiniQuiz: React.FC<{ topic: FlagshipTopic }> = ({ topic }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = topic.quiz[index];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= topic.quiz.length) { setDone(true); return; }
    setIndex(i => i + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setIndex(0); setSelected(null); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / topic.quiz.length) * 100);
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <Star className={`w-12 h-12 ${pct >= 80 ? 'text-yellow-400' : 'text-premium-neutral-300'}`} />
        <h3 className="text-xl font-bold text-premium-navy">
          {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practising!'}
        </h3>
        <p className="text-3xl font-bold text-greyed-navy">{score}/{topic.quiz.length}</p>
        <p className="text-sm text-premium-neutral-500">{pct}% correct</p>
        <button
          onClick={handleRestart}
          className="px-5 py-2.5 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-blue transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-premium-neutral-500">
        <span>Question {index + 1} of {topic.quiz.length}</span>
        <span className="font-semibold text-greyed-navy">Score: {score}</span>
      </div>

      <div className="bg-premium-neutral-50 rounded-2xl p-5 border border-premium-neutral-200">
        <p className="font-semibold text-premium-navy text-base leading-snug">{q.question}</p>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = 'bg-white border-premium-neutral-200 text-premium-neutral-700 hover:border-greyed-blue hover:bg-blue-50';
          if (selected !== null) {
            if (i === q.answer) cls = 'bg-emerald-50 border-emerald-500 text-emerald-800';
            else if (i === selected && i !== q.answer) cls = 'bg-red-50 border-red-400 text-red-700';
            else cls = 'opacity-50 bg-white border-premium-neutral-100 text-premium-neutral-400';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${cls}`}
            >
              <span className="text-xs text-premium-neutral-400 mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="space-y-3">
          <div className={`flex gap-2 px-4 py-3 rounded-xl text-sm ${selected === q.answer ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{q.explanation}</span>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-2.5 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-blue transition-colors"
          >
            {index + 1 >= topic.quiz.length ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
};

// ── TopicView ────────────────────────────────────────────────────────────────

const TopicView: React.FC<TopicViewProps> = ({
  topic, subjectTitle, domainTitle, onBack, onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('investigator');

  return (
    <div className="space-y-4">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 text-sm text-premium-neutral-500">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-greyed-navy transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span>/</span>
        <span>{subjectTitle}</span>
        <span>/</span>
        <span>{domainTitle}</span>
        <span>/</span>
        <span className="text-premium-navy font-semibold">{topic.title}</span>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-greyed-navy to-greyed-blue rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <span className="text-5xl leading-none">{topic.icon}</span>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white leading-tight">{topic.title}</h1>
            <p className="text-white/70 text-sm mt-1">{topic.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {topic.microTopics.slice(0, 4).map(mt => (
                <span key={mt.id} className="text-xs bg-white/15 text-white/90 px-2.5 py-1 rounded-full">
                  {mt.title}
                </span>
              ))}
              {topic.microTopics.length > 4 && (
                <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded-full">
                  +{topic.microTopics.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-hide">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0
              ${activeTab === id
                ? 'bg-greyed-navy text-white shadow-sm'
                : 'bg-white border border-premium-neutral-200 text-premium-neutral-600 hover:border-greyed-blue hover:text-greyed-navy'
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-premium-neutral-500 uppercase tracking-wide mb-3">
                  Explanation Level
                </h3>
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
              </div>
              <div className="border-t border-premium-neutral-100 pt-4">
                <p className="text-premium-neutral-800 leading-relaxed text-sm">
                  {topic.explanations[difficulty]}
                </p>
              </div>
            </div>

            {/* Micro topics */}
            <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-premium-navy mb-3">
                Subtopics in {topic.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {topic.microTopics.map(mt => (
                  <div key={mt.id} className="flex items-center gap-2 text-sm text-premium-neutral-700 bg-premium-neutral-50 rounded-xl px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-greyed-blue flex-shrink-0" />
                    {mt.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Concept map */}
            {topic.relatedTopicIds.length > 0 && (
              <ConceptMap
                topicId={topic.id}
                relatedTopicIds={topic.relatedTopicIds}
                onNavigate={onNavigate}
              />
            )}
          </div>
        )}

        {/* Flashcards */}
        {activeTab === 'flashcards' && (
          <FlashcardDeck cards={topic.flashcards} topicTitle={topic.title} />
        )}

        {/* Experiments */}
        {activeTab === 'experiments' && (
          <ExperimentCard experiments={topic.experiments} />
        )}

        {/* Curiosity */}
        {activeTab === 'curiosity' && (
          <div className="space-y-4">
            <CuriosityTree
              branches={topic.curiosityBranches}
              onNavigate={onNavigate}
              topicTitle={topic.title}
            />

            {/* All difficulty levels side by side */}
            <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-premium-navy mb-4">How deep can you go?</h3>
              <div className="space-y-3">
                {(['explorer', 'investigator', 'scholar', 'researcher'] as DifficultyLevel[]).map(level => {
                  const labels: Record<DifficultyLevel, string> = {
                    explorer: '🌱 Explorer',
                    investigator: '🔬 Investigator',
                    scholar: '🧠 Scholar',
                    researcher: '🚀 Researcher',
                  };
                  return (
                    <div key={level} className="p-3 bg-premium-neutral-50 rounded-xl">
                      <p className="text-xs font-semibold text-premium-neutral-500 mb-1">{labels[level]}</p>
                      <p className="text-sm text-premium-neutral-700 leading-relaxed">
                        {topic.explanations[level]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quiz */}
        {activeTab === 'quiz' && (
          <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-greyed-navy to-greyed-blue flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-premium-navy text-sm">Knowledge Check</h3>
                <p className="text-xs text-premium-neutral-400">{topic.quiz.length} questions on {topic.title}</p>
              </div>
            </div>
            <MiniQuiz topic={topic} />
          </div>
        )}

        {/* Real World */}
        {activeTab === 'realworld' && (
          <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-premium-navy text-sm">Real World Applications</h3>
                <p className="text-xs text-premium-neutral-400">Where {topic.title} appears in everyday life</p>
              </div>
            </div>
            <div className="space-y-3">
              {topic.realWorld.map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-emerald-600 font-bold text-sm flex-shrink-0 w-5">{i + 1}.</span>
                  <p className="text-sm text-emerald-800 leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicView;
