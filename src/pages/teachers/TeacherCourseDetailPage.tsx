import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle,
  Circle,
  Award,
  FileText,
  Download,
  Sparkles,
  X
} from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { supabase } from '../../lib/supabase';
import Loader from '../../components/ui/Loader';

interface Module {
  id: number;
  title: string;
  duration: number;
  objectives: string[];
  keyIdeas?: string[];
  signals?: {
    dyslexia?: string[];
    adhd?: string[];
  };
  accommodations?: {
    textTweaks?: string[];
    taskTweaks?: string[];
    responseChoice?: string[];
  };
  greyedFeatures?: {
    generate?: string;
    studentMode?: string;
    review?: string;
  };
  barrierScan?: string;
  quickAction: string;
  content: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface CheatSheet {
  signals: {
    dyslexia: string[];
    adhd: string[];
  };
  quickSupports: string[];
  greyedClicks: string;
  parentTalkTrack: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  module_count: number;
  content: {
    modules: Module[];
    quiz: QuizQuestion[];
    cheatSheet: CheatSheet;
  };
}

const TeacherCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentView, setCurrentView] = useState<'modules' | 'quiz' | 'cheatsheet' | 'certificate'>('modules');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('teacherSidebarCollapsed') === 'true');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    document.title = 'Course | GreyEd Teachers';

    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    const fetchCourseData = async () => {
      if (!user || !courseId) return;

      try {
        setLoading(true);
        setError(null);

        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;

        setCourse(courseData);

        const { data: progressData, error: progressError } = await supabase
          .from('teacher_course_progress')
          .select('*')
          .eq('teacher_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError;
        }

        if (progressData) {
          setCompletedModules(progressData.completed_modules || []);
          setQuizScore(progressData.quiz_score);
          setQuizPassed(progressData.quiz_passed);
          setCourseCompleted(!!progressData.completed_at);

          if (progressData.completed_at) {
            setCurrentView('certificate');
          }
        }
      } catch {
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [user, authLoading, navigate, courseId]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('teacherSidebarCollapsed', String(newState));
  };

  const markModuleComplete = async (moduleId: number) => {
    if (!user || !courseId || completedModules.includes(moduleId)) return;

    const newCompletedModules = [...completedModules, moduleId];
    setCompletedModules(newCompletedModules);

    try {
      const { error } = await supabase
        .from('teacher_course_progress')
        .upsert({
          teacher_id: user.id,
          course_id: parseInt(courseId),
          completed_modules: newCompletedModules,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch {
    }
  };

  const submitQuiz = async () => {
    if (!course || !user || !courseId) return;

    let correct = 0;
    course.content.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / course.content.quiz.length) * 100);
    const passed = score >= 80;

    setQuizScore(score);
    setQuizPassed(passed);

    try {
      const { error } = await supabase
        .from('teacher_course_progress')
        .upsert({
          teacher_id: user.id,
          course_id: parseInt(courseId),
          completed_modules: completedModules,
          quiz_score: score,
          quiz_passed: passed,
          completed_at: passed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      if (passed) {
        setCourseCompleted(true);

        await supabase
          .from('teacher_certificates')
          .upsert({
            teacher_id: user.id,
            course_id: parseInt(courseId),
            certificate_data: {
              courseName: course.title,
              completionDate: new Date().toISOString(),
              score: score
            }
          });

        setCurrentView('certificate');
      }
    } catch {
    }
  };

  if (authLoading || loading) {
    return <Loader />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-greyed-navy">
        <NavBar sidebarCollapsed={sidebarCollapsed} />

        <div className="min-h-screen pt-[72px] bg-slate-50 flex">
          {showMobileMenu && isMobile && (
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}></div>
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
          </div>

          <div className="flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300"
            style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
            <main className="px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-800">{error || 'Course not found'}</p>
                  <button
                    onClick={() => navigate('/teachers/courses')}
                    className="mt-4 text-greyed-navy hover:underline"
                  >
                    Return to Courses
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>

        <MobileBottomNavigation onMenuClick={toggleMobileMenu} />
      </div>
    );
  }

  const currentModule = course.content.modules[currentModuleIndex];
  const allModulesCompleted = completedModules.length === course.content.modules.length;

  return (
    <div className="min-h-screen bg-greyed-navy">
      <NavBar sidebarCollapsed={sidebarCollapsed} />

      <div className="min-h-screen pt-[72px] bg-slate-50 flex">
        {/* Mobile menu overlay */}
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}></div>
        )}

        {/* Left sidebar navigation */}
        <div className={`${
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

          {/* Close button for mobile menu */}
          {showMobileMenu && isMobile && (
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-greyed-navy/50 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
          <main className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

            <div className="bg-white rounded-lg shadow-sm p-6 mb-3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-greyed-navy mb-2">{course.title}</h1>
                  <p className="text-greyed-navy/70">{course.description}</p>
                </div>
                {courseCompleted && (
                  <Award className="w-12 h-12 text-slate-300" />
                )}
              </div>

              <div className="flex gap-4 border-b border-greyed-navy/10 mb-6">
                <button
                  onClick={() => setCurrentView('modules')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    currentView === 'modules'
                      ? 'border-b-2 border-greyed-navy text-greyed-navy'
                      : 'text-greyed-navy/60 hover:text-greyed-navy'
                  }`}
                >
                  Modules
                </button>
                <button
                  onClick={() => setCurrentView('cheatsheet')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    currentView === 'cheatsheet'
                      ? 'border-b-2 border-greyed-navy text-greyed-navy'
                      : 'text-greyed-navy/60 hover:text-greyed-navy'
                  }`}
                >
                  Cheat Sheet
                </button>
                <button
                  onClick={() => setCurrentView('quiz')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    currentView === 'quiz'
                      ? 'border-b-2 border-greyed-navy text-greyed-navy'
                      : 'text-greyed-navy/60 hover:text-greyed-navy'
                  }`}
                  disabled={!allModulesCompleted && !courseCompleted}
                >
                  Knowledge Check
                  {!allModulesCompleted && !courseCompleted && (
                    <span className="ml-2 text-xs">(Complete all modules first)</span>
                  )}
                </button>
                {courseCompleted && (
                  <button
                    onClick={() => setCurrentView('certificate')}
                    className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                      currentView === 'certificate'
                        ? 'border-b-2 border-greyed-navy text-greyed-navy'
                        : 'text-greyed-navy/60 hover:text-greyed-navy'
                    }`}
                  >
                    <Sparkles size={16} />
                    Certificate
                  </button>
                )}
              </div>

              {currentView === 'modules' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {course.content.modules.map((module, index) => (
                      <button
                        key={module.id}
                        onClick={() => setCurrentModuleIndex(index)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          currentModuleIndex === index
                            ? 'border-greyed-blue bg-greyed-blue/10'
                            : 'border-greyed-navy/10 hover:border-greyed-navy/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-bold text-greyed-navy">
                            Module {index + 1}
                          </span>
                          {completedModules.includes(module.id) ? (
                            <CheckCircle size={20} className="text-cyan-400" />
                          ) : (
                            <Circle size={20} className="text-greyed-navy/30" />
                          )}
                        </div>
                        <p className="text-xs text-greyed-navy/70 line-clamp-2">{module.title}</p>
                      </button>
                    ))}
                  </div>

                  <div className="bg-greyed-beige/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-greyed-navy">
                        Module {currentModuleIndex + 1}: {currentModule.title}
                      </h2>
                      <span className="text-sm text-greyed-navy/60">
                        ~{currentModule.duration} min
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-greyed-navy mb-2">Objectives</h3>
                        <ul className="list-disc list-inside space-y-1 text-greyed-navy/80">
                          {currentModule.objectives.map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      {currentModule.keyIdeas && (
                        <div>
                          <h3 className="font-bold text-greyed-navy mb-2">Key Ideas</h3>
                          <ul className="list-disc list-inside space-y-1 text-greyed-navy/80">
                            {currentModule.keyIdeas.map((idea, idx) => (
                              <li key={idx}>{idea}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentModule.signals && (
                        <div>
                          <h3 className="font-bold text-greyed-navy mb-2">Signals to Notice</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {currentModule.signals.dyslexia && (
                              <div className="bg-white rounded-lg p-4">
                                <p className="font-semibold text-greyed-navy mb-2">Dyslexia</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                                  {currentModule.signals.dyslexia.map((signal, idx) => (
                                    <li key={idx}>{signal}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {currentModule.signals.adhd && (
                              <div className="bg-white rounded-lg p-4">
                                <p className="font-semibold text-greyed-navy mb-2">ADHD</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                                  {currentModule.signals.adhd.map((signal, idx) => (
                                    <li key={idx}>{signal}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {currentModule.accommodations && (
                        <div>
                          <h3 className="font-bold text-greyed-navy mb-2">Quick Accommodations</h3>
                          <div className="space-y-3">
                            {currentModule.accommodations.textTweaks && (
                              <div className="bg-white rounded-lg p-4">
                                <p className="font-semibold text-greyed-navy mb-2">Text Tweaks</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                                  {currentModule.accommodations.textTweaks.map((tweak, idx) => (
                                    <li key={idx}>{tweak}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {currentModule.accommodations.taskTweaks && (
                              <div className="bg-white rounded-lg p-4">
                                <p className="font-semibold text-greyed-navy mb-2">Task Tweaks</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                                  {currentModule.accommodations.taskTweaks.map((tweak, idx) => (
                                    <li key={idx}>{tweak}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {currentModule.accommodations.responseChoice && (
                              <div className="bg-white rounded-lg p-4">
                                <p className="font-semibold text-greyed-navy mb-2">Response Choices</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                                  {currentModule.accommodations.responseChoice.map((choice, idx) => (
                                    <li key={idx}>{choice}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {currentModule.greyedFeatures && (
                        <div>
                          <h3 className="font-bold text-greyed-navy mb-2">In GreyEd</h3>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            {currentModule.greyedFeatures.generate && (
                              <p className="text-sm"><span className="font-semibold">Generate:</span> {currentModule.greyedFeatures.generate}</p>
                            )}
                            {currentModule.greyedFeatures.studentMode && (
                              <p className="text-sm"><span className="font-semibold">Student Mode:</span> {currentModule.greyedFeatures.studentMode}</p>
                            )}
                            {currentModule.greyedFeatures.review && (
                              <p className="text-sm"><span className="font-semibold">Review:</span> {currentModule.greyedFeatures.review}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-white rounded-lg p-6">
                        <p className="text-greyed-navy leading-relaxed">{currentModule.content}</p>
                      </div>

                      <div className="bg-greyed-blue/20 rounded-lg p-4 border-l-4 border-greyed-blue">
                        <p className="font-semibold text-greyed-navy mb-1">Quick Action for Today</p>
                        <p className="text-greyed-navy/80">{currentModule.quickAction}</p>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <button
                          onClick={() => setCurrentModuleIndex(Math.max(0, currentModuleIndex - 1))}
                          disabled={currentModuleIndex === 0}
                          className="px-4 py-2 text-greyed-navy hover:bg-greyed-navy/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <button
                          onClick={() => {
                            markModuleComplete(currentModule.id);
                            if (currentModuleIndex < course.content.modules.length - 1) {
                              setCurrentModuleIndex(currentModuleIndex + 1);
                            }
                          }}
                          className="px-6 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors flex items-center gap-2"
                        >
                          {completedModules.includes(currentModule.id) ? (
                            <>
                              <CheckCircle size={20} />
                              Completed
                            </>
                          ) : (
                            'Mark Complete'
                          )}
                        </button>

                        <button
                          onClick={() => setCurrentModuleIndex(Math.min(course.content.modules.length - 1, currentModuleIndex + 1))}
                          disabled={currentModuleIndex === course.content.modules.length - 1}
                          className="px-4 py-2 text-greyed-navy hover:bg-greyed-navy/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'cheatsheet' && (
                <div className="space-y-6">
                  <div className="bg-greyed-beige/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-greyed-navy">Quick Reference Cheat Sheet</h2>
                      <button className="flex items-center gap-2 px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors">
                        <Download size={16} />
                        Download PDF
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="font-bold text-greyed-navy mb-3">Signals</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold text-sm text-greyed-navy mb-1">Dyslexia</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                              {course.content.cheatSheet.signals.dyslexia.map((signal, idx) => (
                                <li key={idx}>{signal}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-greyed-navy mb-1">ADHD</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                              {course.content.cheatSheet.signals.adhd.map((signal, idx) => (
                                <li key={idx}>{signal}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h3 className="font-bold text-greyed-navy mb-3">6 Quick Supports</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-greyed-navy/80">
                          {course.content.cheatSheet.quickSupports.map((support, idx) => (
                            <li key={idx}>{support}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h3 className="font-bold text-greyed-navy mb-3">GreyEd Clicks</h3>
                        <p className="text-sm text-greyed-navy/80 font-mono bg-greyed-beige/20 p-3 rounded">
                          {course.content.cheatSheet.greyedClicks}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h3 className="font-bold text-greyed-navy mb-3">Parent Talk Track</h3>
                        <p className="text-sm text-greyed-navy/80 italic">
                          "{course.content.cheatSheet.parentTalkTrack}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'quiz' && (
                <div className="space-y-6">
                  <div className="bg-greyed-beige/20 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-greyed-navy mb-2">Knowledge Check</h2>
                    <p className="text-greyed-navy/70 mb-6">
                      Answer all questions to test your understanding. You need 80% to pass and earn your certificate.
                    </p>

                    {quizScore === null ? (
                      <div className="space-y-6">
                        {course.content.quiz.map((question, qIndex) => (
                          <div key={question.id} className="bg-white rounded-lg p-6">
                            <p className="font-semibold text-greyed-navy mb-4">
                              {qIndex + 1}. {question.question}
                            </p>

                            {question.type === 'multiple-choice' && question.options && (
                              <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                  <label
                                    key={oIndex}
                                    className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors hover:bg-greyed-beige/10"
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      value={option}
                                      checked={quizAnswers[question.id] === option}
                                      onChange={(e) => setQuizAnswers({
                                        ...quizAnswers,
                                        [question.id]: e.target.value
                                      })}
                                      className="w-4 h-4"
                                    />
                                    <span className="text-greyed-navy">{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {question.type === 'true-false' && (
                              <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors hover:bg-greyed-beige/10">
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value="true"
                                    checked={quizAnswers[question.id] === 'true'}
                                    onChange={(e) => setQuizAnswers({
                                      ...quizAnswers,
                                      [question.id]: e.target.value
                                    })}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-greyed-navy">True</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors hover:bg-greyed-beige/10">
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value="false"
                                    checked={quizAnswers[question.id] === 'false'}
                                    onChange={(e) => setQuizAnswers({
                                      ...quizAnswers,
                                      [question.id]: e.target.value
                                    })}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-greyed-navy">False</span>
                                </label>
                              </div>
                            )}
                          </div>
                        ))}

                        <button
                          onClick={submitQuiz}
                          disabled={Object.keys(quizAnswers).length !== course.content.quiz.length}
                          className="w-full px-6 py-3 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                          Submit Quiz
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className={`text-center p-6 rounded-lg ${quizPassed ? 'bg-slate-700' : 'bg-slate-700'}`}>
                          <p className="text-3xl font-bold mb-2">{quizScore}%</p>
                          <p className={`text-lg ${quizPassed ? 'text-slate-200' : 'text-slate-200'}`}>
                            {quizPassed ? 'Congratulations! You passed!' : 'Keep studying and try again'}
                          </p>
                        </div>

                        {course.content.quiz.map((question, qIndex) => {
                          const userAnswer = quizAnswers[question.id];
                          const isCorrect = userAnswer === question.correctAnswer;

                          return (
                            <div key={question.id} className={`bg-white rounded-lg p-6 border-2 ${isCorrect ? 'border-cyan-500' : 'border-red-500'}`}>
                              <div className="flex items-start gap-3 mb-3">
                                {isCorrect ? (
                                  <CheckCircle size={24} className="text-cyan-400 flex-shrink-0" />
                                ) : (
                                  <Circle size={24} className="text-red-600 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-greyed-navy mb-2">
                                    {qIndex + 1}. {question.question}
                                  </p>
                                  <p className="text-sm text-greyed-navy/70 mb-1">
                                    Your answer: <span className={isCorrect ? 'text-cyan-400' : 'text-red-600'}>{userAnswer}</span>
                                  </p>
                                  {!isCorrect && (
                                    <p className="text-sm text-greyed-navy/70 mb-2">
                                      Correct answer: <span className="text-cyan-400">{question.correctAnswer}</span>
                                    </p>
                                  )}
                                  <p className="text-sm text-greyed-navy/80 italic mt-2">
                                    {question.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {!quizPassed && (
                          <button
                            onClick={() => {
                              setQuizAnswers({});
                              setQuizScore(null);
                            }}
                            className="w-full px-6 py-3 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors font-semibold"
                          >
                            Retake Quiz
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentView === 'certificate' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-greyed-beige/30 to-greyed-blue/20 rounded-lg p-12 text-center border-4 border-greyed-navy/20">
                    <Award className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-greyed-navy mb-4">
                      Certificate of Completion
                    </h2>
                    <p className="text-xl text-greyed-navy mb-2">
                      This certifies that
                    </p>
                    <p className="text-2xl font-bold text-greyed-navy mb-6">
                      {user?.user_metadata?.first_name || 'Teacher'} {user?.user_metadata?.last_name || ''}
                    </p>
                    <p className="text-lg text-greyed-navy mb-2">
                      has successfully completed
                    </p>
                    <p className="text-2xl font-bold text-greyed-navy mb-6">
                      {course.title}
                    </p>
                    <p className="text-greyed-navy/70 mb-8">
                      Score: {quizScore}% | Date: {new Date().toLocaleDateString()}
                    </p>
                    <button className="px-8 py-3 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors font-semibold flex items-center gap-2 mx-auto">
                      <Download size={20} />
                      Download Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNavigation onMenuClick={toggleMobileMenu} />
    </div>
  );
};

export default TeacherCourseDetailPage;
