import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AlertCircle,
  Snowflake,
  PlusCircle,
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  MapPin,
  FileText,
  Settings,
} from 'lucide-react';
import TeacherPageLayout from '../../components/teachers/TeacherPageLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { fetchTeacherClasses, getTeacherDashboardData, hasActiveSubscription } from '../../lib/api/teacher-api';

const TeacherDashboardPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    lessonPlans: 0,
    assessments: 0,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.title = 'Teacher Dashboard | Cophetsheni Primary School';

    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        if (!user) return;
        setLoading(true);
        setError(null);

        const subscriptionActive = await hasActiveSubscription();
        setIsSubscribed(subscriptionActive);

        try {
          const data = await getTeacherDashboardData(user.id);
          setClasses(data.classes);
          setTodaySchedule(data.todaySchedule);
          setAiSuggestions(data.aiSuggestions);
        } catch {
          const classData = await fetchTeacherClasses(user.id);
          setClasses(classData);
          setTodaySchedule([]);
          setAiSuggestions([]);
          const totalStudents = classData.reduce(
            (sum: number, cls: any) => sum + (cls.student_count || 0),
            0
          );
          setStats({
            totalClasses: classData.length,
            totalStudents,
            lessonPlans: 0,
            assessments: 0,
          });
        }
      } catch {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }

    try {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed');
      if (savedCollapsed === 'true') {
        setSidebarCollapsed(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    try {
      localStorage.setItem('sidebarCollapsed', String(newState));
    } catch {
      /* private browsing */
    }
  };

  return (
    <TeacherPageLayout
      activePage="dashboard"
      onLogout={handleLogout}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
      loading={authLoading || (loading && !!user)}
      loadingMessage="Loading your dashboard..."
    >
      {error && (
        <Card variant="outlined" padding="sm" className="mb-4 border-error/30">
          <div className="flex items-start gap-2 text-error">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      )}

      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your teaching overview."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Total Classes" value={stats.totalClasses} color="primary" />
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="accent" />
        <StatCard icon={BookOpen} label="Lesson Plans" value={stats.lessonPlans} color="success" />
        <StatCard icon={ClipboardList} label="Assessments" value={stats.assessments} color="primary" />
      </div>

      {/* Today's Schedule */}
      <Card variant="outlined" padding="none" className="mb-6 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-premium-neutral-200">
          <div className="bg-accent/20 p-1.5 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-h4 text-text">Today&apos;s Schedule</h3>
        </div>
        <div className="p-4">
          {todaySchedule.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No classes scheduled for today"
              description="Manage your classes to set up your teaching schedule"
            />
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((session) => (
                <div
                  key={session.id}
                  className="group relative rounded-xl p-3 sm:p-4 bg-white border border-premium-neutral-200 hover:border-primary hover:bg-accent/5 hover:shadow-md transition-all duration-200 touch-manipulation"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {session.startTime.split(':')[0]}:{session.startTime.split(':')[1]}
                        </div>
                        <div className="hidden sm:block w-0.5 h-8 bg-premium-neutral-200 my-1" />
                        <div className="text-xs text-text-muted font-medium mt-1 sm:mt-0">
                          {session.endTime}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-text text-sm sm:text-base mb-2 truncate">
                          {session.className}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center rounded-lg bg-accent/30 text-primary px-2 sm:px-3 py-1 text-xs font-semibold">
                            Grade {session.grade || '10'}
                          </span>
                          <span className="inline-flex items-center rounded-lg bg-surface text-primary px-2 sm:px-3 py-1 text-xs font-semibold">
                            <MapPin className="h-3 w-3 mr-1" />
                            {session.room}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/teachers/classes/${session.classId}`}
                      className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-primary hover:bg-accent/80 hover:shadow-md transition-all duration-200 touch-manipulation whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center"
                    >
                      View Class
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Recent Classes */}
        <Card variant="outlined" padding="none" className="overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-premium-neutral-200">
            <div className="bg-accent/20 p-1.5 rounded-lg">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-h4 text-text">Your Classes</h3>
          </div>
          <div className="p-4">
            {classes.length === 0 ? (
              <EmptyState
                icon={PlusCircle}
                title="No classes yet"
                description="Create your first class to get started"
                action={
                  <Link
                    to="/teachers/classes"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-medium"
                  >
                    <PlusCircle size={18} />
                    Create Your First Class
                  </Link>
                }
              />
            ) : (
              <div className="space-y-2">
                {classes.slice(0, 3).map((cls) => (
                  <Link
                    key={cls.id}
                    to={`/teachers/classes/${cls.id}`}
                    className="group block p-4 rounded-xl bg-white border border-premium-neutral-200 hover:border-primary hover:shadow-md hover:bg-accent/5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-text text-base flex-1">{cls.name}</h4>
                      <div className="flex items-center gap-1 text-text-muted">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-semibold">{cls.student_count || 0}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-accent/30 text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                        {cls.subject}
                      </span>
                      <span className="bg-surface text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                        {cls.grade}
                      </span>
                    </div>
                  </Link>
                ))}
                {classes.length > 3 && (
                  <Link
                    to="/teachers/classes"
                    className="block text-center text-sm text-primary hover:text-primary-light font-semibold mt-4 py-3 rounded-xl hover:bg-accent/10 transition-all duration-200"
                  >
                    View all {classes.length} classes →
                  </Link>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* AI Suggestions */}
        <Card variant="outlined" padding="none" className="overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-premium-neutral-200">
            <div className="bg-accent/20 p-1.5 rounded-lg">
              <Snowflake className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-h4 text-text">AI Suggestions</h3>
          </div>
          <div className="p-4">
            {aiSuggestions.length === 0 ? (
              <EmptyState
                icon={Snowflake}
                title="No suggestions yet"
                description="Create classes to get personalized AI assistance"
              />
            ) : (
              <div className="space-y-2">
                {aiSuggestions.map((suggestion) => (
                  <Link
                    key={suggestion.id}
                    to={suggestion.actionLink}
                    className="group block rounded-xl bg-white border border-premium-neutral-200 hover:border-primary hover:shadow-md hover:bg-accent/5 transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-xl bg-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Snowflake className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-text text-base mb-1">
                          {suggestion.title}
                        </div>
                        <div className="text-sm text-text-muted mb-3 line-clamp-2">
                          {suggestion.description}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-xl bg-primary text-white px-4 py-2 text-xs font-semibold">
                            {suggestion.actionText} →
                          </span>
                          {suggestion.subscriptionRequired && (
                            <span className="inline-flex items-center rounded-lg bg-surface text-primary px-2 py-1 text-xs font-semibold">
                              Pro
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="outlined" padding="none" className="overflow-hidden">
        <div className="px-5 py-3 border-b border-premium-neutral-200">
          <h3 className="text-h4 text-text">Quick Actions</h3>
        </div>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              { to: '/teachers/lesson-planner', icon: BookOpen, label: 'Create Lesson Plan', bg: 'bg-accent' },
              { to: '/teachers/assessments', icon: FileText, label: 'Create Assessment', bg: 'bg-accent' },
              { to: '/teachers/families', icon: Users, label: 'Send Updates', bg: 'bg-accent' },
              { to: '/teachers/el-ai', icon: Snowflake, label: 'Siyafunda AI', bg: 'bg-primary' },
              { to: '/teachers/settings', icon: Settings, label: 'Settings', bg: 'bg-primary/70' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-white border border-premium-neutral-200 hover:border-primary hover:bg-accent/5 hover:shadow-md transition-all duration-200 touch-manipulation min-h-[120px]"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${action.bg} text-white flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  <action.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <span className="text-text font-bold text-xs sm:text-sm text-center line-clamp-2">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </TeacherPageLayout>
  );
};

export default TeacherDashboardPage;
