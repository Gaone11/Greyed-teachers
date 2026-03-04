import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AlertCircle,
  X,
  Snowflake,
  PlusCircle,
  BookOpen,
  FileText,
  MessageSquare,
  Sparkles,
  Users,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import LoaderComponent from '../../components/ui/Loader';
import { fetchTeacherClasses, getTeacherDashboardData } from '../../lib/api/teacher-api';
import { useMediaQuery } from '../../hooks/useMediaQuery';

// Color palette for class cards — cycles through these
const CLASS_COLORS = [
  { bg: 'bg-gradient-to-br from-[#1B4332] to-[#2D6A4F]', text: 'text-white', badge: 'bg-white/20 text-white' },
  { bg: 'bg-gradient-to-br from-[#D4A843] to-[#E8C96A]', text: 'text-[#1B4332]', badge: 'bg-[#1B4332]/10 text-[#1B4332]' },
  { bg: 'bg-gradient-to-br from-[#2D6A4F] to-[#52B788]', text: 'text-white', badge: 'bg-white/20 text-white' },
  { bg: 'bg-gradient-to-br from-[#7A6548] to-[#A89070]', text: 'text-white', badge: 'bg-white/20 text-white' },
  { bg: 'bg-gradient-to-br from-[#C4572A] to-[#D97750]', text: 'text-white', badge: 'bg-white/20 text-white' },
  { bg: 'bg-gradient-to-br from-[#3D2E1C] to-[#5C4A33]', text: 'text-white', badge: 'bg-white/20 text-white' },
];

const TeacherDashboardPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    lessonPlans: 0,
    assessments: 0
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('teacherSidebarCollapsed') === 'true');

  useEffect(() => {
    document.title = "Dashboard | GreyEd Teachers";

    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
          const data = await getTeacherDashboardData(user.id);
          setClasses(data.classes);
          setStats({
            totalClasses: data.stats.classesCount,
            totalStudents: data.classes.reduce((sum: number, cls: any) => sum + (cls.student_count || 0), 0),
            lessonPlans: data.stats.lessonPlansCount,
            assessments: data.stats.assessmentsCount
          });
        } catch {
          const classData = await fetchTeacherClasses(user.id);
          setClasses(classData);
          const totalStudents = classData.reduce((sum: number, cls: any) => sum + (cls.student_count || 0), 0);
          setStats({
            totalClasses: classData.length,
            totalStudents,
            lessonPlans: 0,
            assessments: 0
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
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('teacherSidebarCollapsed', String(newState));
  };

  const firstName = user?.user_metadata?.first_name || user?.user_metadata?.name?.split(' ')[0] || 'Teacher';

  if (authLoading || (loading && user)) {
    return <LoaderComponent fullScreen message="Loading your dashboard..." />;
  }

  // Quick nav items — tools accessible from dashboard
  const quickNav = [
    { icon: BookOpen, label: 'Lesson Planner', path: '/teachers/lesson-planner', color: 'from-[#1B4332] to-[#2D6A4F]' },
    { icon: FileText, label: 'Test Maker', path: '/teachers/assessments', color: 'from-[#D4A843] to-[#E8C96A]' },
    { icon: Snowflake, label: 'Siyafunda AI', path: '/teachers/el-ai', color: 'from-[#2D6A4F] to-[#52B788]' },
    { icon: MessageSquare, label: 'Tutor Updates', path: '/teachers/tutors', color: 'from-[#7A6548] to-[#A89070]' },
    { icon: Sparkles, label: 'Teaching Assistant', path: '/teachers/grey-ed-ta', color: 'from-[#3D2E1C] to-[#5C4A33]' },
    { icon: GraduationCap, label: 'Courses', path: '/teachers/courses', color: 'from-[#C4572A] to-[#D97750]' },
  ];

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar sidebarCollapsed={sidebarCollapsed} />

      <div className="min-h-screen pt-16 bg-[#FAFAF8] flex">
        {/* Mobile menu overlay */}
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setShowMobileMenu(false)} />
        )}

        {/* Left sidebar */}
        <div className={`${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform duration-300 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="dashboard"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
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

        {/* Main content */}
        <div className={`flex-1 pt-3 pb-20 md:pb-6 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
          <main className="px-4 sm:px-6 lg:px-8 max-w-7xl">
            {error && (
              <div className="bg-white border border-red-200 text-red-800 px-5 py-4 rounded-2xl mb-4 flex items-start shadow-sm animate-slide-down">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* ────── Quick Nav Strip ────── */}
            <section className="mb-6 animate-slide-up">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {quickNav.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="group flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-[#E8E6E0]/60 hover:border-[#1B4332]/30 hover:shadow-md transition-all duration-200 touch-manipulation"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-[#1B4332] whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* ────── Stats Row ────── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '60ms' }}>
              {[
                { label: 'Classes', value: stats.totalClasses, icon: Users },
                { label: 'Students', value: stats.totalStudents, icon: GraduationCap },
                { label: 'Lesson Plans', value: stats.lessonPlans, icon: BookOpen },
                { label: 'Assessments', value: stats.assessments, icon: FileText },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white border border-[#E8E6E0]/60 p-4 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${80 + i * 40}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1B4332]/8 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#1B4332]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#1B4332] leading-tight">{stat.value}</div>
                        <div className="text-xs text-[#292828]/60 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* ────── Your Classes — Main Hero Section ────── */}
            <section className="animate-slide-up" style={{ animationDelay: '120ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-headline font-bold text-[#1B4332]">Your Classes</h2>
                  <p className="text-sm text-[#292828]/60 mt-0.5">Select a class to start working</p>
                </div>
                <Link
                  to="/teachers/classes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#2D6A4F] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 touch-manipulation"
                >
                  <PlusCircle size={16} />
                  <span className="hidden sm:inline">New Class</span>
                </Link>
              </div>

              {classes.length === 0 ? (
                /* Empty state */
                <div className="rounded-2xl bg-white border border-[#E8E6E0]/60 p-12 text-center shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-[#D4A843]/15 flex items-center justify-center mx-auto mb-5">
                    <Users className="w-10 h-10 text-[#D4A843]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B4332] mb-2">Create your first class</h3>
                  <p className="text-sm text-[#292828]/60 max-w-md mx-auto mb-6">
                    Add a class to unlock lesson planning, assessments, tutor updates, and AI-powered teaching tools — all tailored to your curriculum.
                  </p>
                  <Link
                    to="/teachers/classes"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#2D6A4F] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <PlusCircle size={18} />
                    Create Your First Class
                  </Link>
                </div>
              ) : (
                /* Class grid — large blocks */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((cls, index) => {
                    const colorScheme = CLASS_COLORS[index % CLASS_COLORS.length];
                    return (
                      <Link
                        key={cls.id}
                        to={`/teachers/classes/${cls.id}`}
                        className={`group relative ${colorScheme.bg} rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 touch-manipulation overflow-hidden min-h-[180px] flex flex-col justify-between`}
                        style={{ animationDelay: `${160 + index * 60}ms` }}
                      >
                        {/* Subtle decorative circle */}
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />

                        <div className="relative">
                          <h3 className={`text-lg font-bold ${colorScheme.text} mb-2 line-clamp-2`}>
                            {cls.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className={`${colorScheme.badge} px-2.5 py-1 rounded-lg text-xs font-semibold`}>
                              {cls.subject}
                            </span>
                            <span className={`${colorScheme.badge} px-2.5 py-1 rounded-lg text-xs font-semibold`}>
                              {cls.grade}
                            </span>
                          </div>
                        </div>

                        <div className="relative flex items-center justify-between mt-4">
                          <div className={`flex items-center gap-1.5 ${colorScheme.text} opacity-80`}>
                            <Users size={14} />
                            <span className="text-sm font-medium">{cls.student_count || 0} learners</span>
                          </div>
                          <div className={`w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors`}>
                            <ChevronRight className={`w-4 h-4 ${colorScheme.text}`} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {/* Add class card */}
                  <Link
                    to="/teachers/classes"
                    className="group rounded-2xl border-2 border-dashed border-[#E8E6E0]/60 hover:border-[#1B4332]/30 p-5 sm:p-6 flex flex-col items-center justify-center min-h-[180px] hover:bg-[#D4A843]/5 transition-all duration-200 touch-manipulation"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#FAFAF8] group-hover:bg-[#D4A843]/20 flex items-center justify-center mb-3 transition-colors duration-200">
                      <PlusCircle className="w-7 h-7 text-[#292828]/40 group-hover:text-[#1B4332] transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-[#292828]/50 group-hover:text-[#1B4332] transition-colors">Add New Class</span>
                  </Link>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNavigation onMenuClick={toggleMobileMenu} />

      {/* Footer */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <Footer />
      </div>
    </LandingLayout>
  );
};

export default TeacherDashboardPage;
