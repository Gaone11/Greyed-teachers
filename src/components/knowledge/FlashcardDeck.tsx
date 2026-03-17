import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Trophy, Brain, BookOpen } from 'lucide-react';
import type { Flashcard } from '../../data/knowledgeGalaxy';

type DeckMode = 'memory' | 'quiz' | 'battle';

interface FlashcardDeckProps {
  cards: Flashcard[];
  topicTitle: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MODE_CONFIG: { id: DeckMode; icon: React.ElementType; label: string; description: string }[] = [
  { id: 'memory', icon: Brain, label: 'Memory', description: 'Flip to reveal' },
  { id: 'quiz', icon: BookOpen, label: 'Quiz', description: 'Multiple choice' },
  { id: 'battle', icon: Trophy, label: 'Battle', description: 'Score attack' },
];

// ── Memory Mode ──────────────────────────────────────────────────────────────

interface MemoryCardProps {
  card: Flashcard;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, index, total, onNext, onPrev }) => {
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => { setFlipped(false); setTimeout(onNext, 150); };
  const handlePrev = () => { setFlipped(false); setTimeout(onPrev, 150); };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress */}
      <div className="w-full flex items-center gap-2 text-sm text-premium-neutral-500">
        <span>{index + 1} / {total}</span>
        <div className="flex-1 h-1.5 bg-premium-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-greyed-navy to-greyed-blue rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card with 3D flip */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '180px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-greyed-navy to-greyed-blue rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-white/60 text-xs uppercase tracking-widest mb-3">Question</p>
            <p className="text-white font-semibold text-lg leading-snug">{card.question}</p>
            <p className="text-white/40 text-xs mt-4">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-white/60 text-xs uppercase tracking-widest mb-3">Answer</p>
            <p className="text-white font-semibold text-lg leading-snug">{card.answer}</p>
            <p className="text-white/40 text-xs mt-4">Tap to flip back</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-premium-neutral-200 text-sm text-premium-neutral-600 hover:bg-premium-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <button
          onClick={handleNext}
          disabled={index === total - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-greyed-navy text-white text-sm hover:bg-greyed-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Quiz Mode ─────────────────────────────────────────────────────────────────

interface QuizModeProps {
  cards: Flashcard[];
  onComplete: (score: number) => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ cards, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const card = cards[index];

  // Generate 3 distractors from other cards' answers
  const options = React.useMemo(() => {
    const others = cards.filter((_, i) => i !== index).map(c => c.answer);
    const shuffled = shuffleArray(others).slice(0, 3);
    return shuffleArray([card.answer, ...shuffled]);
  }, [cards, index, card.answer]);

  const correctIndex = options.indexOf(card.answer);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= cards.length) {
      onComplete(score + (selected === correctIndex ? 1 : 0));
    } else {
      setIndex(i => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-premium-neutral-500">
        <span>Question {index + 1} of {cards.length}</span>
        <span className="font-semibold text-greyed-navy">Score: {score}</span>
      </div>

      <div className="bg-premium-neutral-50 rounded-2xl p-5 border border-premium-neutral-200">
        <p className="font-semibold text-premium-navy text-base leading-snug">{card.question}</p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          let cls = 'bg-white border-premium-neutral-200 text-premium-neutral-700 hover:border-greyed-blue hover:bg-blue-50';
          if (selected !== null) {
            if (i === correctIndex) cls = 'bg-emerald-50 border-emerald-500 text-emerald-800';
            else if (i === selected) cls = 'bg-red-50 border-red-400 text-red-700';
            else cls = 'bg-white border-premium-neutral-100 text-premium-neutral-400 opacity-60';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${cls}`}
            >
              <span className="text-xs text-premium-neutral-400 mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="self-end px-5 py-2.5 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-blue transition-colors"
        >
          {index + 1 >= cards.length ? 'See Results' : 'Next →'}
        </button>
      )}
    </div>
  );
};

// ── Battle Mode ───────────────────────────────────────────────────────────────

interface BattleModeProps {
  cards: Flashcard[];
}

const BattleMode: React.FC<BattleModeProps> = ({ cards }) => {
  const [deck, setDeck] = useState(() => shuffleArray(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  const card = deck[index];
  const total = deck.length;

  const handleAnswer = (correct: boolean) => {
    setScore(s => ({ ...s, [correct ? 'correct' : 'wrong']: s[correct ? 'correct' : 'wrong'] + 1 }));
    setFlipped(false);
    if (index + 1 >= total) { setDone(true); return; }
    setTimeout(() => setIndex(i => i + 1), 200);
  };

  const handleRestart = () => {
    setDeck(shuffleArray(cards));
    setIndex(0);
    setFlipped(false);
    setScore({ correct: 0, wrong: 0 });
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <Trophy className={`w-12 h-12 ${pct >= 80 ? 'text-yellow-500' : 'text-premium-neutral-400'}`} />
        <h3 className="text-xl font-bold text-premium-navy">{pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good effort!' : 'Keep practising!'}</h3>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-600">{score.correct}</p>
            <p className="text-xs text-premium-neutral-500">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{score.wrong}</p>
            <p className="text-xs text-premium-neutral-500">Wrong</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-greyed-navy">{pct}%</p>
            <p className="text-xs text-premium-neutral-500">Score</p>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-5 py-2.5 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-blue transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-sm">
        <span className="text-premium-neutral-500">{index + 1} / {total}</span>
        <div className="flex gap-3">
          <span className="text-emerald-600 font-semibold">✓ {score.correct}</span>
          <span className="text-red-500 font-semibold">✗ {score.wrong}</span>
        </div>
      </div>

      <div
        className="cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '160px',
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-greyed-navy to-greyed-blue rounded-2xl flex flex-col items-center justify-center p-5 text-center shadow-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-white font-semibold text-base leading-snug">{card.question}</p>
            <p className="text-white/40 text-xs mt-3">Tap to reveal</p>
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex flex-col items-center justify-center p-5 text-center shadow-lg"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-white font-semibold text-base leading-snug">{card.answer}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-2.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            ✗ Got it wrong
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition-colors"
          >
            ✓ Got it right
          </button>
        </div>
      )}
    </div>
  );
};

// ── Score Screen ──────────────────────────────────────────────────────────────

interface ScoreScreenProps {
  score: number;
  total: number;
  onRetry: () => void;
  onShuffle: () => void;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, total, onRetry, onShuffle }) => {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Trophy className={`w-12 h-12 ${pct >= 80 ? 'text-yellow-500' : 'text-premium-neutral-400'}`} />
      <h3 className="text-xl font-bold text-premium-navy">
        {pct >= 80 ? '🌟 Excellent!' : pct >= 50 ? '👍 Good effort!' : '📚 Keep studying!'}
      </h3>
      <p className="text-3xl font-bold text-greyed-navy">{score}/{total}</p>
      <p className="text-sm text-premium-neutral-500">{pct}% correct</p>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 bg-greyed-navy text-white rounded-xl text-sm font-semibold hover:bg-greyed-blue transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Retry
        </button>
        <button
          onClick={onShuffle}
          className="flex items-center gap-2 px-4 py-2.5 border border-premium-neutral-300 text-premium-neutral-600 rounded-xl text-sm font-semibold hover:bg-premium-neutral-50 transition-colors"
        >
          <Shuffle className="w-4 h-4" /> Shuffle & Retry
        </button>
      </div>
    </div>
  );
};

// ── Main FlashcardDeck ─────────────────────────────────────────────────────────

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards, topicTitle }) => {
  const [mode, setMode] = useState<DeckMode>('memory');
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [deck, setDeck] = useState(cards);
  const [quizKey, setQuizKey] = useState(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleShuffle = useCallback(() => {
    setDeck(shuffleArray(cards));
    setMemoryIndex(0);
    setQuizKey(k => k + 1);
    setQuizScore(null);
  }, [cards]);

  const handleModeChange = (m: DeckMode) => {
    setMode(m);
    setQuizScore(null);
    setMemoryIndex(0);
  };

  return (
    <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-premium-neutral-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-premium-navy text-sm">Flashcards</h3>
          <p className="text-xs text-premium-neutral-400">{deck.length} cards · {topicTitle}</p>
        </div>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 text-xs text-premium-neutral-500 hover:text-greyed-navy px-3 py-1.5 rounded-lg hover:bg-premium-neutral-50 border border-premium-neutral-200 transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" /> Shuffle
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex border-b border-premium-neutral-100">
        {MODE_CONFIG.map(({ id, icon: Icon, label, description }) => (
          <button
            key={id}
            onClick={() => handleModeChange(id)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
              mode === id
                ? 'text-greyed-navy border-b-2 border-greyed-navy bg-premium-neutral-50'
                : 'text-premium-neutral-400 hover:text-premium-neutral-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-[10px] text-premium-neutral-400 hidden sm:block">{description}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        {mode === 'memory' && (
          <MemoryCard
            card={deck[memoryIndex]}
            index={memoryIndex}
            total={deck.length}
            onNext={() => setMemoryIndex(i => Math.min(i + 1, deck.length - 1))}
            onPrev={() => setMemoryIndex(i => Math.max(i - 1, 0))}
          />
        )}

        {mode === 'quiz' && (
          quizScore !== null ? (
            <ScoreScreen
              score={quizScore}
              total={deck.length}
              onRetry={() => setQuizScore(null)}
              onShuffle={() => { handleShuffle(); setQuizKey(k => k + 1); setQuizScore(null); }}
            />
          ) : (
            <QuizMode
              key={quizKey}
              cards={deck}
              onComplete={s => setQuizScore(s)}
            />
          )
        )}

        {mode === 'battle' && (
          <BattleMode key={quizKey} cards={deck} />
        )}
      </div>
    </div>
  );
};

export default FlashcardDeck;
