import React, { useState, useEffect } from 'react';
import {
  BookOpen, FlaskConical, Brain, Compass, Network,
  Globe, HelpCircle, ChevronLeft, Star, CheckCircle2
} from 'lucide-react';
import type { FlagshipTopic, DifficultyLevel, MicroTopic } from '../../data/knowledgeGalaxy';
import { saveQuizScore } from '../../lib/kgProgress';
import DifficultySelector from './DifficultySelector';
import FlashcardDeck from './FlashcardDeck';
import ExperimentCard from './ExperimentCard';
import CuriosityTree from './CuriosityTree';
import ConceptMap from './ConceptMap';
import NotesRenderer from './NotesRenderer';
import Diagram from './DiagramLibrary';

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

const MiniQuiz: React.FC<{ topic: FlagshipTopic; selectedMicroTopicId?: string | null }> = ({ topic, selectedMicroTopicId }) => {

  const questions = selectedMicroTopicId
    ? topic.quiz.filter(q => q.microTopicId === selectedMicroTopicId)
    : topic.quiz;
  const activeQuiz = questions.length >= 3 ? questions : topic.quiz;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  React.useEffect(() => {
    setIndex(0); setSelected(null); setScore(0); setDone(false);
  }, [selectedMicroTopicId]);

  const q = activeQuiz[index];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= activeQuiz.length) {
      setDone(true);
      saveQuizScore(topic.id, selected === q.answer ? score + 1 : score, activeQuiz.length);
      return;
    }
    setIndex(i => i + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setIndex(0); setSelected(null); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / activeQuiz.length) * 100);
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <Star className={`w-12 h-12 ${pct >= 80 ? 'text-yellow-400' : 'text-premium-neutral-300'}`} />
        <h3 className="text-xl font-bold text-premium-navy">
          {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practising!'}
        </h3>
        <p className="text-3xl font-bold text-greyed-navy">{score}/{activeQuiz.length}</p>
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
        <span>Question {index + 1} of {activeQuiz.length}</span>
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

// ── Build rich notes from existing tagged data when explicit notes are absent ─
function buildSubtopicNotes(topic: FlagshipTopic, mt: MicroTopic, difficulty: DifficultyLevel): string {
  const lines: string[] = [];

  // ── 1. Topic overview at the chosen level ──────────────────────────────────
  lines.push(`## ${topic.title}`);
  lines.push('');
  lines.push(topic.explanations[difficulty]);
  lines.push('');

  // ── 2. Subtopic key facts (from tagged flashcards) ─────────────────────────
  const cards = topic.flashcards.filter(f => f.microTopicId === mt.id);
  if (cards.length > 0) {
    lines.push(`## Key Facts: ${mt.title}`);
    lines.push('');
    cards.forEach(card => {
      lines.push(`### ${card.question}`);
      lines.push(card.answer);
      lines.push('');
    });
  }

  // ── 3. Related experiments (from tagged experiments) ──────────────────────
  const exps = topic.experiments.filter(e => e.microTopicId === mt.id);
  if (exps.length > 0) {
    lines.push(`## Practical: ${mt.title}`);
    lines.push('');
    exps.forEach(exp => {
      lines.push(`### ${exp.title} (${exp.level})`);
      lines.push(exp.description);
      lines.push('');
      if (exp.materials.length > 0) {
        lines.push('**Materials needed:**');
        exp.materials.forEach(m => lines.push(`- ${m}`));
        lines.push('');
      }
      lines.push('**What to expect:** ' + exp.expected);
      lines.push('');
    });
  }

  // ── 4. Practice questions (from tagged quiz items) ─────────────────────────
  const qs = topic.quiz.filter(q => q.microTopicId === mt.id);
  if (qs.length > 0) {
    lines.push(`## Check Your Understanding`);
    lines.push('');
    qs.forEach((q, i) => {
      lines.push(`### Q${i + 1}. ${q.question}`);
      q.options.forEach((opt, j) => {
        if (j === q.answer) {
          lines.push(`- **${String.fromCharCode(65 + j)}. ${opt}** ✓`);
        } else {
          lines.push(`- ${String.fromCharCode(65 + j)}. ${opt}`);
        }
      });
      lines.push('');
      lines.push(`> ${q.explanation}`);
      lines.push('');
    });
  }

  return lines.join('\n');
}

// ── TopicView ────────────────────────────────────────────────────────────────

const TopicView: React.FC<TopicViewProps> = ({
  topic, subjectTitle, domainTitle, onBack, onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('investigator');
  const [selectedMicroTopicId, setSelectedMicroTopicId] = useState<string | null>(null);

  // Reset subtopic selection when navigating to a new flagship topic
  useEffect(() => { setSelectedMicroTopicId(null); }, [topic.id]);

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
                {(() => {
                  const selectedMT = selectedMicroTopicId
                    ? topic.microTopics.find(mt => mt.id === selectedMicroTopicId)
                    : null;

                  // Explicit hand-written notes take priority; otherwise build from data
                  const notesContent = selectedMT
                    ? (selectedMT.notes?.[difficulty] ?? buildSubtopicNotes(topic, selectedMT, difficulty))
                    : topic.explanations[difficulty];

                  return (
                    <>
                      {selectedMT && (
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-premium-neutral-100">
                          <span className="w-2 h-2 rounded-full bg-greyed-blue" />
                          <span className="text-xs font-semibold text-greyed-navy">{selectedMT.title}</span>
                          <span className="text-xs text-premium-neutral-400">— study notes</span>
                        </div>
                      )}
                      <NotesRenderer content={notesContent} />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Visual diagrams gallery */}
            {topic.diagrams && topic.diagrams.length > 0 && (
              <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-premium-neutral-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span>📐</span> Visual Diagrams
                </h3>
                <div className={`grid gap-4 ${topic.diagrams.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {topic.diagrams.map(name => (
                    <div key={name} className="bg-premium-neutral-50 border border-premium-neutral-100 rounded-xl p-3 flex items-center justify-center">
                      <Diagram name={name} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Micro topics — dropdown */}
            <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-premium-navy mb-3">
                Subtopics in {topic.title}
              </h3>
              <select
                value={selectedMicroTopicId ?? ''}
                onChange={e => setSelectedMicroTopicId(e.target.value || null)}
                className="w-full rounded-xl border border-premium-neutral-200 px-3 py-2.5 text-sm text-premium-neutral-800 bg-premium-neutral-50 focus:outline-none focus:border-greyed-blue appearance-none cursor-pointer"
              >
                <option value="">— All subtopics —</option>
                {topic.microTopics.map(mt => (
                  <option key={mt.id} value={mt.id}>{mt.title}</option>
                ))}
              </select>

              {/* Chip list — highlights selected */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {topic.microTopics.map(mt => (
                  <button
                    key={mt.id}
                    onClick={() => setSelectedMicroTopicId(prev => prev === mt.id ? null : mt.id)}
                    className={`flex items-center gap-2 text-sm rounded-xl px-3 py-2 text-left transition-colors ${
                      mt.id === selectedMicroTopicId
                        ? 'bg-greyed-navy text-white font-medium'
                        : 'text-premium-neutral-700 bg-premium-neutral-50 hover:bg-premium-neutral-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${mt.id === selectedMicroTopicId ? 'bg-white' : 'bg-greyed-blue'}`} />
                    {mt.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Concept map — updates when a subtopic is selected */}
            <ConceptMap
              topicId={topic.id}
              relatedTopicIds={topic.relatedTopicIds}
              onNavigate={onNavigate}
              microTopics={topic.microTopics}
              selectedMicroTopicId={selectedMicroTopicId}
              onSelectMicroTopic={setSelectedMicroTopicId}
            />
          </div>
        )}

        {/* Flashcards */}
        {activeTab === 'flashcards' && (
          <FlashcardDeck
            cards={topic.flashcards}
            topicTitle={topic.title}
            selectedMicroTopicId={selectedMicroTopicId}
            microTopics={topic.microTopics}
          />
        )}

        {/* Experiments */}
        {activeTab === 'experiments' && (
          <ExperimentCard
            experiments={topic.experiments}
            selectedMicroTopicId={selectedMicroTopicId}
            microTopics={topic.microTopics}
          />
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
            <MiniQuiz topic={topic} selectedMicroTopicId={selectedMicroTopicId} />
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
