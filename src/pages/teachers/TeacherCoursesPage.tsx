import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen, Brain, HelpCircle, Telescope,
  TrendingUp, CheckCircle2, Clock, Star, ChevronRight, X,
  Calculator, Zap, FlaskConical, Microscope, Globe, Monitor, Leaf, Sprout, BarChart2,
} from 'lucide-react';

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
import NavBar from '../../components/layout/NavBar';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { loadKGProgress } from '../../lib/kgProgress';
import { SUBJECTS, getTopicById } from '../../data/knowledgeGalaxy';
import { formatDistanceToNow, parseISO } from 'date-fns';

const TeacherCoursesPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('teacherSidebarCollapsed') === 'true'
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    document.title = 'Knowledge Progress | GreyEd Teachers';
    if (!authLoading && !user) navigate('/auth/login');
  }, [authLoading, user, navigate]);

  const handleLogout = async () => { await signOut(); navigate('/'); };
  const handleToggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem('teacherSidebarCollapsed', String(next));
  };

  // ── Read progress from localStorage ────────────────────────────────────────
  const progress = loadKGProgress();
  const visitedIds = Object.keys(progress.visitedTopics);
  const quizIds = Object.keys(progress.quizScores);

  // Total stats
  const totalTopics = SUBJECTS.reduce(
    (sum, s) => sum + s.domains.reduce((d, domain) => d + domain.flagshipTopics.length, 0), 0
  );
  const avgScore = quizIds.length > 0
    ? Math.round(quizIds.reduce((sum, id) => {
        const q = progress.quizScores[id];
        return sum + (q.score / q.total) * 100;
      }, 0) / quizIds.length)
    : null;

  // Per-subject stats
  const subjectStats = SUBJECTS.map(subject => {
    const allTopicsInSubject = subject.domains.flatMap(d => d.flagshipTopics.map(t => t.id));
    const visited = allTopicsInSubject.filter(id => visitedIds.includes(id));
    const quizzed = allTopicsInSubject.filter(id => quizIds.includes(id));
    const pct = allTopicsInSubject.length > 0
      ? Math.round((visited.length / allTopicsInSubject.length) * 100)
      : 0;
    return { subject, total: allTopicsInSubject.length, visited: visited.length, quizzed: quizzed.length, pct };
  }).filter(s => s.visited > 0 || s.total > 0);

  // Recent activity (last 8 visits, newest first)
  const recentVisits = visitedIds
    .map(id => ({ id, ...progress.visitedTopics[id] }))
    .sort((a, b) => b.visitedAt.localeCompare(a.visitedAt))
    .slice(0, 8);

  // Quiz results (latest scores)
  const quizResults = quizIds
    .map(id => ({ topicId: id, ...progress.quizScores[id] }))
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-greyed-navy">
      <NavBar
        sidebarCollapsed={sidebarCollapsed}
        actionButton={
          <button
            onClick={() => navigate('/teachers/knowledge')}
            className="hidden md:flex items-center gap-2 bg-greyed-navy text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-greyed-navy/90 transition-colors"
          >
            Continue Exploring <ChevronRight size={16} />
          </button>
        }
      />

      <div className="min-h-screen pt-[72px] bg-slate-50 flex">
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)} />
        )}

        <div className={`bg-white border-r border-white/5 shadow-sm ${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="courses"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />
          {showMobileMenu && isMobile && (
            <button onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-greyed-navy/50 rounded-full">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
          <main className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Stat tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: BookOpen, label: 'Topics Explored', value: visitedIds.length, sub: `of ${totalTopics}`, color: 'text-greyed-blue', bg: 'bg-greyed-blue/10' },
                  { icon: Brain, label: 'Quizzes Taken', value: quizIds.length, sub: 'completed', color: 'text-greyed-blue', bg: 'bg-greyed-navy' },
                  { icon: TrendingUp, label: 'Avg Quiz Score', value: avgScore !== null ? `${avgScore}%` : '—', sub: avgScore !== null ? (avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : 'Keep going') : 'No quizzes yet', color: 'text-greyed-blue', bg: 'bg-greyed-navy' },
                  { icon: Star, label: 'Subjects Visited', value: subjectStats.filter(s => s.visited > 0).length, sub: `of ${SUBJECTS.length}`, color: 'text-greyed-blue', bg: 'bg-greyed-blue/10' },
                ].map(({ icon: Icon, label, value, sub, color, bg }) => (
                  <div key={label} className="bg-white rounded-2xl border border-premium-neutral-200 p-5 shadow-sm">
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p className="text-2xl font-bold text-greyed-navy">{value}</p>
                    <p className="text-xs font-semibold text-premium-neutral-600 mt-0.5">{label}</p>
                    <p className="text-xs text-premium-neutral-400 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>

              {/* No activity yet */}
              {visitedIds.length === 0 && (
                <div className="bg-white rounded-2xl border border-premium-neutral-200 p-12 text-center shadow-sm">
                  <Telescope className="w-12 h-12 text-greyed-navy/20 mx-auto mb-4" />
                  <h3 className="font-bold text-greyed-navy text-lg mb-2">Your galaxy awaits</h3>
                  <p className="text-sm text-greyed-navy/60 max-w-sm mx-auto mb-6">
                    Start exploring the Knowledge Galaxy to track your progress, quiz scores, and learning activity here.
                  </p>
                  <button
                    onClick={() => navigate('/teachers/knowledge')}
                    className="bg-greyed-navy text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 transition-colors"
                  >
                    Open Knowledge Galaxy
                  </button>
                </div>
              )}

              {/* Subject progress breakdown */}
              {visitedIds.length > 0 && (
                <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-6">
                  <h2 className="font-bold text-greyed-navy text-base mb-5 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Subject Progress
                  </h2>
                  <div className="space-y-4">
                    {subjectStats.map(({ subject, total, visited, quizzed, pct }) => (
                      <div key={subject.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {(() => { const Icon = SUBJECT_ICONS[subject.id] || BookOpen; return <div className="w-7 h-7 rounded-lg bg-greyed-blue/10 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-greyed-blue" /></div>; })()}
                            <span className="text-sm font-semibold text-greyed-navy">{subject.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-premium-neutral-500">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {visited}/{total} topics
                            </span>
                            {quizzed > 0 && (
                              <span className="flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" /> {quizzed} quizzes
                              </span>
                            )}
                            <span className={`font-bold ${pct > 0 ? 'text-greyed-navy' : 'text-premium-neutral-500'}`}>
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-premium-neutral-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${'bg-greyed-blue'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom 2-col: recent activity + quiz scores */}
              {visitedIds.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Recent activity */}
                  <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-6">
                    <h2 className="font-bold text-greyed-navy text-base mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Recent Activity
                    </h2>
                    <div className="space-y-3">
                      {recentVisits.map(({ id, subjectId, visitedAt }) => {
                        const topic = getTopicById(id);
                        const subject = SUBJECTS.find(s => s.id === subjectId);
                        if (!topic || !subject) return null;
                        const quizScore = progress.quizScores[id];
                        return (
                          <button
                            key={id}
                            onClick={() => navigate(`/teachers/knowledge?subject=${subjectId}&topic=${id}`)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-premium-neutral-50 transition-colors text-left group"
                          >
                            {(() => { const Icon = SUBJECT_ICONS[subject?.id || ''] || BookOpen; return <div className="w-8 h-8 rounded-lg bg-greyed-blue/10 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-greyed-blue" /></div>; })()}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-greyed-navy truncate">{topic.title}</p>
                              <p className="text-xs text-premium-neutral-400">
                                {subject.title} · {formatDistanceToNow(parseISO(visitedAt), { addSuffix: true })}
                              </p>
                            </div>
                            {quizScore && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                (quizScore.score / quizScore.total) >= 0.8
                                  ? 'bg-slate-700 text-cyan-300'
                                  : (quizScore.score / quizScore.total) >= 0.6
                                  ? 'bg-slate-700 text-slate-200'
                                  : 'bg-red-50 text-red-600'
                              }`}>
                                {Math.round((quizScore.score / quizScore.total) * 100)}%
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-premium-neutral-300 group-hover:text-greyed-navy flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quiz performance */}
                  <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-6">
                    <h2 className="font-bold text-greyed-navy text-base mb-4 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Quiz Performance
                    </h2>
                    {quizResults.length === 0 ? (
                      <div className="flex flex-col items-center py-8 text-center">
                        <HelpCircle className="w-8 h-8 text-premium-neutral-300 mb-2" />
                        <p className="text-sm text-premium-neutral-500">No quizzes completed yet.</p>
                        <p className="text-xs text-premium-neutral-400 mt-1">
                          Open a topic and take the quiz to see your scores here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {quizResults.map(({ topicId, score, total, completedAt }) => {
                          const topic = getTopicById(topicId);
                          const pct = Math.round((score / total) * 100);
                          if (!topic) return null;
                          return (
                            <div key={topicId} className="flex items-center gap-3 p-3 bg-premium-neutral-50 rounded-xl">
                              <span className="text-xl flex-shrink-0">{topic.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-greyed-navy truncate">{topic.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 bg-premium-neutral-200 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full ${'bg-greyed-blue'}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-premium-neutral-500 flex-shrink-0">
                                    {formatDistanceToNow(parseISO(completedAt), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {pct >= 80 && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                <span className={`text-sm font-bold ${'text-greyed-navy'}`}>
                                  {score}/{total}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <MobileBottomNavigation onMenuClick={() => setShowMobileMenu(m => !m)} />
    </div>
  );
};

export default TeacherCoursesPage;
