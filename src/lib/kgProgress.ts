// Knowledge Galaxy progress tracking — stored in localStorage

export interface KGTopicVisit {
  subjectId: string;
  domainId: string;
  visitedAt: string;
}

export interface KGQuizScore {
  score: number;
  total: number;
  completedAt: string;
}

export interface KGProgress {
  visitedTopics: Record<string, KGTopicVisit>;   // keyed by topicId
  quizScores: Record<string, KGQuizScore>;        // keyed by topicId
}

const KEY = 'kg_progress';

export function loadKGProgress(): KGProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as KGProgress;
  } catch { /* ignore */ }
  return { visitedTopics: {}, quizScores: {} };
}

export function saveTopicVisit(topicId: string, subjectId: string, domainId: string): void {
  const prog = loadKGProgress();
  // Only update visitedAt if not yet visited (preserve first-visit time)
  if (!prog.visitedTopics[topicId]) {
    prog.visitedTopics[topicId] = { subjectId, domainId, visitedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(prog));
  }
}

export function saveQuizScore(topicId: string, score: number, total: number): void {
  const prog = loadKGProgress();
  // Always save the latest quiz attempt
  prog.quizScores[topicId] = { score, total, completedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(prog));
}
