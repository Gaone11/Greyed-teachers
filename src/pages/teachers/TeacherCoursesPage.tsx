import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  TrendingUp,
  Users,
  BarChart3,
  ChevronRight,
  X,
  Calculator,
  Zap,
  FlaskConical,
  Microscope,
  Globe,
  Monitor,
  Leaf,
  Sprout,
  BarChart2,
  ClipboardCheck,
  GraduationCap,
} from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { SUBJECTS } from '../../data/knowledgeGalaxy';
import { supabase } from '../../lib/supabase';
import { getSidebarCollapsedPreference, setSidebarCollapsedPreference } from '../../lib/sidebar-preferences';

const SUBJECT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  mathematics: Calculator,
  physics: Zap,
  chemistry: FlaskConical,
  biology: Microscope,
  'general-science': Globe,
  'computer-studies': Monitor,
  'environmental-science': Leaf,
  agriculture: Sprout,
  statistics: BarChart2,
};

interface TeacherClassRow {
  id: string;
  subject: string;
  student_count: number | null;
}

interface AssessmentRow {
  class_id: string;
  status: 'draft' | 'published' | 'completed' | string;
  average_score: number | null;
  submission_rate: string | number | null;
}

interface SubjectMetric {
  subjectId: string;
  subjectTitle: string;
  totalTopics: number;
  classCount: number;
  studentCount: number;
  avgUsage: number;
  avgMastery: number;
  activeStudents: number;
  topicsCovered: number;
  signalCount: number;
}

const normalizeSubject = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const parseRate = (value: string | number | null): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return clamp(value);
  const parsed = Number.parseFloat(value.replace('%', '').trim());
  return Number.isFinite(parsed) ? clamp(parsed) : null;
};

const TeacherCoursesPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => getSidebarCollapsedPreference('teacher')
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<TeacherClassRow[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    document.title = 'Class Knowledge Usage | GreyEd Teachers';
    if (!authLoading && !user) navigate('/auth/login');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);

      try {
        const { data: classData, error: classesError } = await supabase
          .from('classes')
          .select('id, subject, student_count')
          .eq('teacher_id', user.id);

        if (classesError) throw classesError;

        const safeClasses = (classData || []) as TeacherClassRow[];
        setClasses(safeClasses);

        const classIds = safeClasses.map(c => c.id);
        if (classIds.length === 0) {
          setAssessments([]);
          return;
        }

        const { data: assessmentData, error: assessmentsError } = await supabase
          .from('assessments')
          .select('class_id, status, average_score, submission_rate')
          .in('class_id', classIds);

        if (assessmentsError) throw assessmentsError;

        setAssessments((assessmentData || []) as AssessmentRow[]);
      } catch {
        setError('Failed to load class usage analytics. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourseAnalytics();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleToggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    setSidebarCollapsedPreference('teacher', next);
  };

  const subjectByKey = useMemo(() => {
    const map = new Map<string, (typeof SUBJECTS)[number]>();
    SUBJECTS.forEach(subject => {
      map.set(normalizeSubject(subject.id), subject);
      map.set(normalizeSubject(subject.title), subject);
    });
    return map;
  }, []);

  const subjectMetrics = useMemo<SubjectMetric[]>(() => {
    const buckets = new Map<string, SubjectMetric & { usageSamples: number[]; masterySamples: number[] }>();
    const assessmentsByClass = new Map<string, AssessmentRow[]>();

    assessments.forEach(item => {
      const list = assessmentsByClass.get(item.class_id) || [];
      list.push(item);
      assessmentsByClass.set(item.class_id, list);
    });

    classes.forEach(cls => {
      const mappedSubject = subjectByKey.get(normalizeSubject(cls.subject));
      if (!mappedSubject) return;

      const key = mappedSubject.id;
      const totalTopics = mappedSubject.domains.reduce((sum, domain) => sum + domain.flagshipTopics.length, 0);
      const students = cls.student_count || 0;

      if (!buckets.has(key)) {
        buckets.set(key, {
          subjectId: mappedSubject.id,
          subjectTitle: mappedSubject.title,
          totalTopics,
          classCount: 0,
          studentCount: 0,
          avgUsage: 0,
          avgMastery: 0,
          activeStudents: 0,
          topicsCovered: 0,
          signalCount: 0,
          usageSamples: [],
          masterySamples: [],
        });
      }

      const bucket = buckets.get(key)!;
      bucket.classCount += 1;
      bucket.studentCount += students;

      const classAssessments = assessmentsByClass.get(cls.id) || [];
      if (classAssessments.length > 0) {
        const usageRates = classAssessments
          .map(item => parseRate(item.submission_rate))
          .filter((value): value is number => value !== null);
        const masteryRates = classAssessments
          .map(item => item.average_score)
          .filter((value): value is number => typeof value === 'number');

        if (usageRates.length > 0) {
          const classUsage = usageRates.reduce((sum, value) => sum + value, 0) / usageRates.length;
          bucket.usageSamples.push(clamp(classUsage));
        }

        if (masteryRates.length > 0) {
          const classMastery = masteryRates.reduce((sum, value) => sum + value, 0) / masteryRates.length;
          bucket.masterySamples.push(clamp(classMastery));
        }

        bucket.signalCount += classAssessments.length;
      }
    });

    return Array.from(buckets.values())
      .map(bucket => {
        const avgUsage =
          bucket.usageSamples.length > 0
            ? Math.round(bucket.usageSamples.reduce((sum, value) => sum + value, 0) / bucket.usageSamples.length)
            : 0;
        const avgMastery =
          bucket.masterySamples.length > 0
            ? Math.round(bucket.masterySamples.reduce((sum, value) => sum + value, 0) / bucket.masterySamples.length)
            : Math.round(avgUsage * 0.9);

        const activeStudents = Math.round(bucket.studentCount * (avgUsage / 100));
        const topicsCovered = Math.max(0, Math.min(bucket.totalTopics, Math.round(bucket.totalTopics * (avgUsage / 100))));

        return {
          ...bucket,
          avgUsage,
          avgMastery,
          activeStudents,
          topicsCovered,
        };
      })
      .sort((a, b) => b.studentCount - a.studentCount || b.classCount - a.classCount);
  }, [classes, assessments, subjectByKey]);

  const summary = useMemo(() => {
    const totalStudents = classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
    const classCount = classes.length;
    const subjectsTracked = subjectMetrics.length;

    const weightedUsage = subjectMetrics.reduce((sum, metric) => sum + metric.avgUsage * metric.studentCount, 0);
    const weightedMastery = subjectMetrics.reduce((sum, metric) => sum + metric.avgMastery * metric.studentCount, 0);

    const avgUsage = totalStudents > 0 ? Math.round(weightedUsage / totalStudents) : 0;
    const avgMastery = totalStudents > 0 ? Math.round(weightedMastery / totalStudents) : 0;

    const publishedMarks = assessments.filter(item => item.status === 'published' || item.status === 'completed').length;
    const draftAssessments = assessments.filter(item => item.status === 'draft').length;

    return {
      totalStudents,
      classCount,
      subjectsTracked,
      avgUsage,
      avgMastery,
      publishedMarks,
      draftAssessments,
    };
  }, [classes, assessments, subjectMetrics]);

  if (authLoading || loading) return null;

  return (
    <div className="min-h-screen bg-greyed-navy">
      <NavBar
        sidebarCollapsed={sidebarCollapsed}
        actionButton={
          <button
            onClick={() => navigate('/teachers/knowledge')}
            className="hidden md:flex items-center gap-2 bg-greyed-navy text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-greyed-navy/90 transition-colors"
          >
            Open Knowledge Galaxy <ChevronRight size={16} />
          </button>
        }
      />

      <div className="min-h-screen pt-[72px] bg-greyed-white flex">
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)} />
        )}

        <div
          className={`bg-white border-r border-white/5 shadow-sm ${
            isMobile
              ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
              : 'fixed top-0 left-0 bottom-0 z-40'
          } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
        >
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
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-greyed-navy/50 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div
          className="flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}
        >
          <main className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: GraduationCap,
                    label: 'Classes',
                    value: summary.classCount,
                    sub: `${summary.subjectsTracked} subjects tracked`,
                    color: 'text-greyed-blue',
                    bg: 'bg-greyed-blue/10',
                  },
                  {
                    icon: Users,
                    label: 'Students',
                    value: summary.totalStudents,
                    sub: 'across all classes',
                    color: 'text-greyed-navy',
                    bg: 'bg-greyed-navy/10',
                  },
                  {
                    icon: BarChart3,
                    label: 'Avg Class Usage',
                    value: `${summary.avgUsage}%`,
                    sub: 'knowledge activity signal',
                    color: 'text-greyed-blue',
                    bg: 'bg-greyed-blue/10',
                  },
                  {
                    icon: TrendingUp,
                    label: 'Avg Mastery',
                    value: `${summary.avgMastery}%`,
                    sub: `${summary.publishedMarks} mark sets published`,
                    color: 'text-greyed-navy',
                    bg: 'bg-greyed-navy/10',
                  },
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

              {summary.classCount === 0 && (
                <div className="bg-white rounded-2xl border border-premium-neutral-200 p-12 text-center shadow-sm">
                  <BookOpen className="w-12 h-12 text-greyed-navy/20 mx-auto mb-4" />
                  <h3 className="font-bold text-greyed-navy text-lg mb-2">No classes yet</h3>
                  <p className="text-sm text-greyed-navy/60 max-w-md mx-auto mb-6">
                    Create your classes first, then this page will show subject-by-subject knowledge usage averages for
                    the students in each class.
                  </p>
                  <button
                    onClick={() => navigate('/teachers/classes')}
                    className="bg-greyed-navy text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-greyed-navy/90 transition-colors"
                  >
                    Go to Classes
                  </button>
                </div>
              )}

              {subjectMetrics.length > 0 && (
                <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-6">
                  <h2 className="font-bold text-greyed-navy text-base mb-5 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Subject Usage Overview
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {subjectMetrics.map(metric => {
                      const Icon = SUBJECT_ICONS[metric.subjectId] || BookOpen;

                      return (
                        <div key={metric.subjectId} className="border border-premium-neutral-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-greyed-blue/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-greyed-blue" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-greyed-navy truncate">{metric.subjectTitle}</p>
                                <p className="text-xs text-premium-neutral-500">
                                  {metric.classCount} classes · {metric.studentCount} students
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/teachers/knowledge?subject=${metric.subjectId}`)}
                              className="text-xs font-semibold text-greyed-navy hover:text-greyed-blue transition-colors"
                            >
                              View
                            </button>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-premium-neutral-500">Average usage</span>
                                <span className="font-semibold text-greyed-navy">{metric.avgUsage}%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-premium-neutral-100">
                                <div className="h-2 rounded-full bg-greyed-blue" style={{ width: `${metric.avgUsage}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-premium-neutral-500">Average mastery</span>
                                <span className="font-semibold text-greyed-navy">{metric.avgMastery}%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-premium-neutral-100">
                                <div
                                  className="h-2 rounded-full bg-greyed-navy"
                                  style={{ width: `${metric.avgMastery}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-lg bg-premium-neutral-50 p-2">
                              <p className="text-[11px] text-premium-neutral-500">Active learners</p>
                              <p className="text-sm font-semibold text-greyed-navy">{metric.activeStudents}</p>
                            </div>
                            <div className="rounded-lg bg-premium-neutral-50 p-2">
                              <p className="text-[11px] text-premium-neutral-500">Topics covered</p>
                              <p className="text-sm font-semibold text-greyed-navy">
                                {metric.topicsCovered}/{metric.totalTopics}
                              </p>
                            </div>
                            <div className="rounded-lg bg-premium-neutral-50 p-2">
                              <p className="text-[11px] text-premium-neutral-500">Signals</p>
                              <p className="text-sm font-semibold text-greyed-navy">{metric.signalCount}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {summary.classCount > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
                    <p className="text-xs uppercase tracking-wide text-premium-neutral-500 mb-2">Communication Sync</p>
                    <p className="text-2xl font-bold text-greyed-navy">{summary.publishedMarks}</p>
                    <p className="text-sm text-premium-neutral-500 mt-1">
                      published mark sets that can flow into student and parent hubs
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
                    <p className="text-xs uppercase tracking-wide text-premium-neutral-500 mb-2">Action Queue</p>
                    <p className="text-2xl font-bold text-greyed-navy">{summary.draftAssessments}</p>
                    <p className="text-sm text-premium-neutral-500 mt-1">
                      draft assessments still waiting to be published
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5">
                    <p className="text-xs uppercase tracking-wide text-premium-neutral-500 mb-2">Linked Hub Focus</p>
                    <p className="text-2xl font-bold text-greyed-navy">{summary.avgUsage}%</p>
                    <p className="text-sm text-premium-neutral-500 mt-1">
                      average class usage signal across all tracked subjects
                    </p>
                  </div>
                </div>
              )}

              {summary.classCount > 0 && summary.subjectsTracked === 0 && (
                <div className="bg-white rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">
                    Classes are available, but their subject names do not yet match the Knowledge Galaxy subjects.
                  </p>
                </div>
              )}

              {summary.classCount > 0 && (
                <div className="bg-white rounded-2xl border border-premium-neutral-200 shadow-sm p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <ClipboardCheck className="w-4 h-4 text-greyed-navy flex-shrink-0" />
                    <p className="text-sm text-premium-neutral-600">
                      This page tracks class-level usage and mastery from connected teaching activity.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/teachers/assessments')}
                    className="text-sm font-semibold text-greyed-navy hover:text-greyed-blue transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    Open Assessments <ChevronRight className="w-4 h-4" />
                  </button>
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
