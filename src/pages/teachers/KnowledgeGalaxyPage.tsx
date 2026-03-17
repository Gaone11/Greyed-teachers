import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import NavBar from '../../components/layout/NavBar';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import TopicView from '../../components/knowledge/TopicView';
import DiscoveryFeed from '../../components/knowledge/DiscoveryFeed';
import {
  SUBJECTS,
  getSubjectById,
  getDomainById,
  getTopicById,
  type Subject,
  type Domain,
  type FlagshipTopic,
} from '../../data/knowledgeGalaxy';
import { Telescope, ChevronRight, ArrowLeft, BookOpen, Layers, Star } from 'lucide-react';

// ─── Layer types ────────────────────────────────────────────────────────────

type View =
  | { layer: 'subjects' }
  | { layer: 'domains'; subjectId: string }
  | { layer: 'topics'; subjectId: string; domainId: string }
  | { layer: 'topic'; subjectId: string; domainId: string; topicId: string };

// ─── Subject card ────────────────────────────────────────────────────────────

const SubjectCard: React.FC<{ subject: Subject; onClick: () => void }> = ({ subject, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${subject.color} rounded-2xl p-5 text-left shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group`}
  >
    <span className="text-4xl block mb-3">{subject.icon}</span>
    <h3 className="text-white font-bold text-lg leading-tight">{subject.title}</h3>
    <p className="text-white/60 text-xs mt-1">{subject.domains.length} domains</p>
    <div className="mt-3 flex items-center gap-1 text-white/70 text-xs group-hover:text-white transition-colors">
      Explore <ChevronRight className="w-3 h-3" />
    </div>
  </button>
);

// ─── Domain card ─────────────────────────────────────────────────────────────

const DomainCard: React.FC<{ domain: Domain; subject: Subject; onClick: () => void }> = ({
  domain, subject, onClick
}) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl p-5 border-2 border-premium-neutral-200 text-left hover:border-greyed-blue hover:shadow-md transition-all duration-200 group"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-xl flex-shrink-0`}>
        {domain.icon}
      </div>
      <div>
        <h3 className="font-bold text-premium-navy text-sm">{domain.title}</h3>
        <p className={`text-xs font-medium ${subject.textColor}`}>{subject.title}</p>
      </div>
    </div>
    <p className="text-xs text-premium-neutral-500 leading-relaxed">{domain.description}</p>
    <div className="mt-3 flex items-center justify-between">
      <span className="text-xs text-premium-neutral-400">
        {domain.flagshipTopics.length} flagship topics
      </span>
      <ChevronRight className="w-4 h-4 text-premium-neutral-300 group-hover:text-greyed-blue transition-colors" />
    </div>
  </button>
);

// ─── Flagship topic card ──────────────────────────────────────────────────────

const FlagshipCard: React.FC<{ topic: FlagshipTopic; subject: Subject; onClick: () => void }> = ({
  topic, subject, onClick
}) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl p-5 border-2 border-premium-neutral-200 text-left hover:border-greyed-blue hover:shadow-md transition-all duration-200 group"
  >
    <div className="flex items-start gap-3">
      <span className="text-3xl leading-none flex-shrink-0">{topic.icon}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-premium-navy text-sm">{topic.title}</h3>
        <p className="text-xs text-premium-neutral-500 mt-0.5 leading-snug">{topic.tagline}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5 mt-3">
      {topic.microTopics.slice(0, 3).map(mt => (
        <span key={mt.id} className="text-[10px] bg-premium-neutral-100 text-premium-neutral-600 px-2 py-0.5 rounded-full">
          {mt.title}
        </span>
      ))}
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="flex gap-2 text-[10px] text-premium-neutral-400">
        <span>📚 {topic.flashcards.length} cards</span>
        <span>🧪 {topic.experiments.length} experiments</span>
        <span>❓ {topic.quiz.length} quiz</span>
      </div>
      <ChevronRight className="w-4 h-4 text-premium-neutral-300 group-hover:text-greyed-blue transition-colors" />
    </div>
  </button>
);

// ─── Empty domain state ───────────────────────────────────────────────────────

const EmptyDomain: React.FC<{ domainTitle: string }> = ({ domainTitle }) => (
  <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center">
    <Star className="w-10 h-10 text-premium-neutral-300" />
    <h3 className="font-semibold text-premium-navy">Coming Soon</h3>
    <p className="text-sm text-premium-neutral-500 max-w-sm">
      Flagship topics for <strong>{domainTitle}</strong> are being added. Check back soon!
    </p>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const KnowledgeGalaxyPage: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('teacherSidebarCollapsed') === 'true'
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [view, setView] = useState<View>({ layer: 'subjects' });

  React.useEffect(() => {
    document.title = 'Knowledge Galaxy | Siyafunda';
  }, []);

  const handleToggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem('teacherSidebarCollapsed', String(next));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const goToTopic = useCallback((topicId: string) => {
    // Find which subject/domain contains this topic
    for (const subject of SUBJECTS) {
      for (const domain of subject.domains) {
        if (domain.flagshipTopics.some(t => t.id === topicId)) {
          setView({ layer: 'topic', subjectId: subject.id, domainId: domain.id, topicId });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    }
  }, []);

  // ─── Derive current data ──────────────────────────────────────────────────

  const currentSubject = view.layer !== 'subjects' ? getSubjectById(view.subjectId) : undefined;
  const currentDomain =
    (view.layer === 'topics' || view.layer === 'topic')
      ? getDomainById(view.subjectId, view.domainId)
      : undefined;
  const currentTopic = view.layer === 'topic' ? getTopicById(view.topicId) : undefined;

  // ─── Breadcrumb ───────────────────────────────────────────────────────────

  const renderBreadcrumb = () => {
    if (view.layer === 'subjects') return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-premium-neutral-500 mb-4 flex-wrap">
        <button
          onClick={() => setView({ layer: 'subjects' })}
          className="hover:text-greyed-navy font-medium transition-colors"
        >
          Galaxy
        </button>
        {view.layer !== 'subjects' && currentSubject && (
          <>
            <ChevronRight className="w-3 h-3" />
            <button
              onClick={() => setView({ layer: 'domains', subjectId: view.subjectId })}
              className="hover:text-greyed-navy font-medium transition-colors"
            >
              {currentSubject.title}
            </button>
          </>
        )}
        {(view.layer === 'topics' || view.layer === 'topic') && currentDomain && (
          <>
            <ChevronRight className="w-3 h-3" />
            <button
              onClick={() => setView({ layer: 'topics', subjectId: view.subjectId, domainId: view.domainId })}
              className="hover:text-greyed-navy font-medium transition-colors"
            >
              {currentDomain.title}
            </button>
          </>
        )}
        {view.layer === 'topic' && currentTopic && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-premium-navy font-semibold">{currentTopic.title}</span>
          </>
        )}
      </div>
    );
  };

  // ─── Content by layer ─────────────────────────────────────────────────────

  const renderContent = () => {
    // ── Layer 1: Subject grid ─────────────────────────────────────────────
    if (view.layer === 'subjects') {
      return (
        <div className="space-y-8">
          {/* Hero */}
          <div className="bg-gradient-to-br from-greyed-navy via-greyed-blue to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-start gap-4">
              <Telescope className="w-10 h-10 text-white/80 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-3xl font-bold leading-tight">Knowledge Galaxy</h1>
                <p className="text-white/70 mt-2 text-sm leading-relaxed max-w-lg">
                  An AI-driven knowledge universe. Every concept is interactive, explorable,
                  experimentable, and explainable across all difficulty levels.
                </p>
                <div className="flex flex-wrap gap-3 mt-4 text-xs text-white/60">
                  <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {SUBJECTS.length} subjects</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Multi-level explanations</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Experiments + quizzes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject grid */}
          <div>
            <h2 className="text-lg font-bold text-premium-navy mb-4">Choose a Subject</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SUBJECTS.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={() => setView({ layer: 'domains', subjectId: subject.id })}
                />
              ))}
            </div>
          </div>

          {/* Discovery feed */}
          <DiscoveryFeed onNavigate={goToTopic} />
        </div>
      );
    }

    // ── Layer 2: Domain grid ──────────────────────────────────────────────
    if (view.layer === 'domains' && currentSubject) {
      return (
        <div className="space-y-6">
          {renderBreadcrumb()}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView({ layer: 'subjects' })}
              className="flex items-center gap-1.5 text-sm text-premium-neutral-500 hover:text-greyed-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-3xl">{currentSubject.icon}</span>
            <h1 className="text-2xl font-bold text-premium-navy">{currentSubject.title}</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentSubject.domains.map(domain => (
              <DomainCard
                key={domain.id}
                domain={domain}
                subject={currentSubject}
                onClick={() => setView({ layer: 'topics', subjectId: view.subjectId, domainId: domain.id })}
              />
            ))}
          </div>
        </div>
      );
    }

    // ── Layer 3: Flagship topics grid ────────────────────────────────────
    if (view.layer === 'topics' && currentSubject && currentDomain) {
      return (
        <div className="space-y-6">
          {renderBreadcrumb()}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView({ layer: 'domains', subjectId: view.subjectId })}
              className="flex items-center gap-1.5 text-sm text-premium-neutral-500 hover:text-greyed-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-3xl">{currentDomain.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-premium-navy">{currentDomain.title}</h1>
              <p className="text-sm text-premium-neutral-500">{currentDomain.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentDomain.flagshipTopics.length > 0
              ? currentDomain.flagshipTopics.map(topic => (
                  <FlagshipCard
                    key={topic.id}
                    topic={topic}
                    subject={currentSubject}
                    onClick={() => setView({ layer: 'topic', subjectId: view.subjectId, domainId: view.domainId, topicId: topic.id })}
                  />
                ))
              : <EmptyDomain domainTitle={currentDomain.title} />
            }
          </div>
        </div>
      );
    }

    // ── Layer 4: Full topic view ──────────────────────────────────────────
    if (view.layer === 'topic' && currentSubject && currentDomain && currentTopic) {
      return (
        <TopicView
          topic={currentTopic}
          subjectTitle={currentSubject.title}
          domainTitle={currentDomain.title}
          onBack={() => setView({ layer: 'topics', subjectId: view.subjectId, domainId: view.domainId })}
          onNavigate={goToTopic}
        />
      );
    }

    return null;
  };

  // ─── Layout shell (matches TeacherCoursesPage pattern) ───────────────────

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <NavBar sidebarCollapsed={sidebarCollapsed} />

      <div className="min-h-screen pt-16 bg-[#f8f8f6] flex">
        {/* Mobile overlay */}
        {showMobileMenu && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="knowledge"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />
        </div>

        {/* Main content */}
        <div className={`flex-1 pt-3 pb-20 md:pb-6 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
          <main className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <MobileBottomNavigation onMenuClick={() => setShowMobileMenu(m => !m)} />
    </div>
  );
};

export default KnowledgeGalaxyPage;
