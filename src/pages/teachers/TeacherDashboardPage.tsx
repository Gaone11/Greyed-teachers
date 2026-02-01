import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Loader,
  AlertCircle,
  X,
  Menu,
  Snowflake,
  Settings,
  PlusCircle
} from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import { fetchTeacherClasses, getTeacherDashboardData, hasActiveSubscription } from '../../lib/api/teacher-api';
import { useMediaQuery } from '../../hooks/useMediaQuery';

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
    assessments: 0
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.title = "Teacher Dashboard | GreyEd";
    
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        // Check subscription status
        const subscriptionActive = await hasActiveSubscription();
        setIsSubscribed(subscriptionActive);
        
        try {
          // Attempt to fetch teacher dashboard data
          const data = await getTeacherDashboardData(user.id);
          
          setClasses(data.classes);
          setTodaySchedule(data.todaySchedule);
          setAiSuggestions(data.aiSuggestions);
        } catch {
          
          // Fallback to just fetching classes if the full dashboard data fails
          const classData = await fetchTeacherClasses(user.id);
          setClasses(classData);
          
          // Set empty arrays for the other data
          setTodaySchedule([]);
          setAiSuggestions([]);

          // Calculate stats from class data
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
    
    // Load sidebar collapsed state from localStorage
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true);
    }
  }, [user, authLoading, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  if (authLoading || (loading && user)) {
    return (
      <LandingLayout disableSnapScroll={true}>
        <NavBar />
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-[#f8f8f6]">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#212754] mx-auto flex items-center justify-center shadow-sm animate-pulse">
                <Loader className="w-10 h-10 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-[#bbd7eb]/20 blur-2xl animate-pulse"></div>
            </div>
            <p className="mt-6 text-[#212754] font-bold text-base">Loading your dashboard...</p>
            <p className="mt-2 text-[#292828] text-opacity-70 text-sm">Just a moment</p>
          </div>
        </div>
        <Footer />
      </LandingLayout>
    );
  }

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-16 bg-[#f8f8f6] flex">
        {/* Mobile menu overlay */}
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40\" onClick={() => setShowMobileMenu(false)}></div>
        )}
        
        {/* Left sidebar navigation */}
        <div className={`${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="dashboard"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
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
        
        {/* Main content area - Reduced top padding */}
        <div className={`flex-1 pt-2 pb-16 md:pb-0 transition-all duration-300 ${
          isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
        }`}>
          <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
            {error && (
              <div className="bg-white border border-[#e8e6e0] text-[#212754] px-5 py-4 rounded-2xl mb-6 flex items-start shadow-md animate-slide-down">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 animate-fade-in">
              <div className="flex items-center">
                <div>
                  <h1 className="text-xl md:text-2xl font-headline font-bold text-[#212754] mb-1 tracking-tight">
                    Welcome back, {user?.user_metadata?.first_name || user?.user_metadata?.name || 'Teacher'}
                  </h1>
                  <p className="text-[#292828] text-opacity-70 text-xs md:text-sm font-medium">
                    Here's what's happening with your classes today
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="rounded-xl bg-white shadow-md border border-[#e8e6e0] p-4 hover:shadow-lg transition-all duration-300 animate-slide-up">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#212754]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#212754]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#212754] mb-1">{stats.totalClasses}</div>
                <div className="text-xs text-[#292828] text-opacity-70 font-medium">Total Classes</div>
              </div>

              <div className="rounded-xl bg-white shadow-md border border-[#e8e6e0] p-4 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '50ms' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#212754]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#212754]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#212754] mb-1">{stats.totalStudents}</div>
                <div className="text-xs text-[#292828] text-opacity-70 font-medium">Total Students</div>
              </div>

              <div className="rounded-xl bg-white shadow-md border border-[#e8e6e0] p-4 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#212754]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#212754]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#212754] mb-1">{stats.lessonPlans}</div>
                <div className="text-xs text-[#292828] text-opacity-70 font-medium">Lesson Plans</div>
              </div>

              <div className="rounded-xl bg-white shadow-md border border-[#e8e6e0] p-4 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#212754]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#212754]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#212754] mb-1">{stats.assessments}</div>
                <div className="text-xs text-[#292828] text-opacity-70 font-medium">Assessments</div>
              </div>
            </div>

            {/* Today's Schedule - Premium Card Timeline */}
            <div className="rounded-2xl bg-white shadow-md border border-[#e8e6e0] mb-6 overflow-hidden animate-slide-up hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8e6e0] bg-white">
                <h3 className="font-bold text-[#212754] flex items-center text-base">
                  <div className="w-8 h-8 rounded-lg bg-[#bbd7eb]/20 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#212754]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Today's Schedule
                </h3>
              </div>

              <div className="p-4">
                {todaySchedule.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#f8f8f6] flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#292828] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-[#212754] font-medium mb-1">No classes scheduled for today</p>
                    <p className="text-sm text-[#292828] text-opacity-70">Manage your classes to set up your teaching schedule</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaySchedule.map((session, index) => (
                      <div
                        key={session.id}
                        className="group relative rounded-2xl p-3 sm:p-4 bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:bg-[#bbd7eb]/5 hover:shadow-lg transition-all duration-200 touch-manipulation"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-xl bg-[#212754] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {session.startTime.split(':')[0]}:{session.startTime.split(':')[1]}
                              </div>
                              <div className="hidden sm:block w-0.5 h-8 bg-[#e8e6e0] my-1"></div>
                              <div className="text-xs text-[#292828] text-opacity-70 font-medium mt-1 sm:mt-0">
                                {session.endTime}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[#212754] text-sm sm:text-base mb-2 transition-colors truncate">
                                {session.className}
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center rounded-lg bg-[#bbd7eb]/30 text-[#212754] px-2 sm:px-3 py-1 text-xs font-semibold">
                                  Grade {session.grade || '10'}
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-[#f8f8f6] text-[#212754] px-2 sm:px-3 py-1 text-xs font-semibold">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  {session.room}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Link
                            to={`/teachers/classes/${session.classId}`}
                            className="rounded-xl border border-[#e8e6e0] bg-[#bbd7eb] px-4 py-2.5 text-sm font-semibold text-[#212754] hover:bg-[#bbd7eb]/80 hover:shadow-md transition-all duration-200 touch-manipulation whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center"
                          >
                            View Class
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Recent Classes */}
              <div className="rounded-2xl bg-white shadow-md border border-[#e8e6e0] overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8e6e0] bg-white">
                  <h3 className="font-bold text-[#212754] flex items-center text-base">
                    <div className="w-8 h-8 rounded-lg bg-[#bbd7eb]/20 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#212754]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    Your Classes
                  </h3>
                </div>

                <div className="p-4">
                  {classes.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#f8f8f6] flex items-center justify-center mx-auto mb-4">
                        <PlusCircle className="h-8 w-8 text-[#292828] opacity-70" />
                      </div>
                      <p className="text-[#212754] font-medium mb-3">No classes yet</p>
                      <Link
                        to="/teachers/classes"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#212754] text-white px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-medium"
                      >
                        <PlusCircle size={18} />
                        Create Your First Class
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {classes.slice(0, 3).map((cls, index) => (
                        <Link
                          key={cls.id}
                          to={`/teachers/classes/${cls.id}`}
                          className="group block p-4 rounded-2xl bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:shadow-lg hover:bg-[#bbd7eb]/5 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-[#212754] text-base transition-colors flex-1">
                              {cls.name}
                            </h4>
                            <div className="flex items-center gap-1 text-[#292828] text-opacity-70">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                              <span className="text-sm font-semibold">{cls.student_count || 0}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="bg-[#bbd7eb]/30 text-[#212754] px-3 py-1 rounded-lg text-xs font-semibold">
                              {cls.subject}
                            </span>
                            <span className="bg-[#f8f8f6] text-[#212754] px-3 py-1 rounded-lg text-xs font-semibold">
                              {cls.grade}
                            </span>
                          </div>
                        </Link>
                      ))}

                      {classes.length > 3 && (
                        <Link
                          to="/teachers/classes"
                          className="block text-center text-sm text-[#212754] hover:text-[#212754]/80 font-semibold mt-4 py-3 rounded-xl hover:bg-[#bbd7eb]/10 transition-all duration-200"
                        >
                          View all {classes.length} classes →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* AI Suggestions */}
              <div className="rounded-2xl bg-white shadow-md border border-[#e8e6e0] overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8e6e0] bg-white">
                  <h3 className="font-bold text-[#212754] flex items-center text-base">
                    AI Suggestions
                  </h3>
                </div>

                <div className="p-4">
                  {aiSuggestions.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#f8f8f6] flex items-center justify-center mx-auto mb-4">
                        <Snowflake className="h-8 w-8 text-[#292828] opacity-70" />
                      </div>
                      <p className="text-[#212754] font-medium">No suggestions yet</p>
                      <p className="text-sm text-[#292828] text-opacity-70 mt-1">Create classes to get personalized AI assistance</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <Link
                          key={suggestion.id}
                          to={suggestion.actionLink}
                          className="group block rounded-2xl bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:shadow-lg hover:bg-[#bbd7eb]/5 transition-all duration-300 overflow-hidden"
                        >
                          <div className="flex gap-4 p-4">
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 rounded-xl bg-[#bbd7eb]/30 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl">✨</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-[#212754] text-base mb-1 transition-colors">
                                {suggestion.title}
                              </div>
                              <div className="text-sm text-[#292828] text-opacity-70 mb-3 line-clamp-2">
                                {suggestion.description}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center rounded-xl bg-[#212754] text-white px-4 py-2 text-xs font-semibold hover:bg-[#212754]/90 transition-colors">
                                  {suggestion.actionText} →
                                </span>
                                {suggestion.subscriptionRequired && (
                                  <span className="inline-flex items-center rounded-lg bg-[#f8f8f6] text-[#212754] px-2 py-1 text-xs font-semibold">
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
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="rounded-2xl bg-white shadow-md border border-[#e8e6e0] overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e8e6e0] bg-white">
                <h3 className="font-bold text-[#212754] text-base">Quick Actions</h3>
              </div>

              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  <Link
                    to="/teachers/lesson-planner"
                    className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:bg-[#bbd7eb]/5 hover:shadow-lg transition-all duration-200 touch-manipulation min-h-[120px]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#bbd7eb] text-white flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-[#212754] font-bold text-xs sm:text-sm text-center transition-colors line-clamp-2">Create Lesson Plan</span>
                  </Link>

                  <Link
                    to="/teachers/assessments"
                    className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:bg-[#bbd7eb]/5 hover:shadow-lg transition-all duration-200 touch-manipulation min-h-[120px]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#bbd7eb] text-white flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-[#212754] font-bold text-xs sm:text-sm text-center transition-colors line-clamp-2">Create Assessment</span>
                  </Link>

                  <Link
                    to="/teachers/families"
                    className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:bg-[#bbd7eb]/5 hover:shadow-lg transition-all duration-200 touch-manipulation min-h-[120px]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#bbd7eb] text-white flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656.126-1.283.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-[#212754] font-bold text-xs sm:text-sm text-center transition-colors line-clamp-2">Send Updates</span>
                  </Link>

                  <Link
                    to="/teachers/el-ai"
                    className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:bg-[#bbd7eb]/5 hover:shadow-lg transition-all duration-200 touch-manipulation min-h-[120px]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#212754] text-white flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Snowflake className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <span className="text-[#212754] font-bold text-xs sm:text-sm text-center transition-colors line-clamp-2">El AI</span>
                  </Link>

                  <Link
                    to="/teachers/settings"
                    className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-[#e8e6e0] hover:border-[#212754] hover:bg-[#bbd7eb]/5 hover:shadow-lg transition-all duration-200 touch-manipulation min-h-[120px]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#292828] bg-opacity-70 text-white flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Settings className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <span className="text-[#212754] font-bold text-xs sm:text-sm text-center transition-colors line-clamp-2">Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNavigation onMenuClick={toggleMobileMenu} />
      
      <Footer />
    </LandingLayout>
  );
};

export default TeacherDashboardPage;