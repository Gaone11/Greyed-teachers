// Learning Hub progress tracking — stored in localStorage

export interface LearningHubTopicVisit {
  subjectId: string;
  domainId: string;
  visitedAt: string;
}

export interface LearningHubQuizScore {
  score: number;
  total: number;
  completedAt: string;
}

export interface LearningHubProgress {
  visitedTopics: Record<string, LearningHubTopicVisit>;   // keyed by topicId
  quizScores: Record<string, LearningHubQuizScore>;        // keyed by topicId
}

// Key keeps its pre-rename value so existing users' progress is preserved
const KEY = 'kg_progress';

export function loadLearningHubProgress(): LearningHubProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as LearningHubProgress;
  } catch { /* ignore */ }
  return { visitedTopics: {}, quizScores: {} };
}

export function saveTopicVisit(topicId: string, subjectId: string, domainId: string): void {
  const prog = loadLearningHubProgress();
  // Only update visitedAt if not yet visited (preserve first-visit time)
  if (!prog.visitedTopics[topicId]) {
    prog.visitedTopics[topicId] = { subjectId, domainId, visitedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(prog));
  }
}

export function saveQuizScore(topicId: string, score: number, total: number): void {
  const prog = loadLearningHubProgress();
  // Always save the latest quiz attempt
  prog.quizScores[topicId] = { score, total, completedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(prog));
}
