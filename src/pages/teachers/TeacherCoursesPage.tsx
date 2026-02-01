import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader as LoaderIcon, BookOpen, Award, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { supabase } from '../../lib/supabase';
import Loader from '../../components/ui/Loader';

interface Course {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  module_count: number;
  content: any;
}

interface CourseProgress {
  completed_modules: number[];
  quiz_score: number;
  quiz_passed: boolean;
  completed_at: string | null;
}

const TeacherCoursesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<number, CourseProgress>>({});
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    document.title = 'Professional Development | GreyEd Teachers';

    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    const fetchCourses = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: true });

        if (coursesError) throw coursesError;

        setCourses(coursesData || []);

        const { data: progressData, error: progressError } = await supabase
          .from('teacher_course_progress')
          .select('*')
          .eq('teacher_id', user.id);

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError;
        }

        const progressMap: Record<number, CourseProgress> = {};
        progressData?.forEach((p: any) => {
          progressMap[p.course_id] = {
            completed_modules: p.completed_modules || [],
            quiz_score: p.quiz_score || 0,
            quiz_passed: p.quiz_passed || false,
            completed_at: p.completed_at,
          };
        });
        setProgress(progressMap);
      } catch {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }

    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed) {
      setSidebarCollapsed(savedCollapsed === 'true');
    }
  }, [user, authLoading, navigate]);

  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  if (authLoading || loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-greyed-white">
        <NavBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          showSidebarToggle={!isMobile}
        />
        <div className="flex-1 flex">
          {!isMobile && (
            <TeacherSidebar
              activePage="courses"
              collapsed={sidebarCollapsed}
              onToggle={handleToggleSidebar}
            />
          )}
          <main className={`flex-1 p-6 ${!isMobile && !sidebarCollapsed ? 'ml-64' : !isMobile ? 'ml-20' : ''}`}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </main>
        </div>
        {isMobile && <MobileBottomNavigation activePage="settings" />}
      </div>
    );
  }

  const getCourseProgress = (courseId: number, moduleCount: number) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    return Math.round((courseProgress.completed_modules.length / moduleCount) * 100);
  };

  const isCourseCompleted = (courseId: number) => {
    return progress[courseId]?.completed_at !== null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-greyed-white">
      <NavBar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        showSidebarToggle={!isMobile}
      />

      <div className="flex-1 flex pt-16">
        {!isMobile && (
          <TeacherSidebar
            activePage="courses"
            collapsed={sidebarCollapsed}
            onToggle={handleToggleSidebar}
          />
        )}

        <main className={`flex-1 p-6 transition-all duration-300 ${
          !isMobile && !sidebarCollapsed ? 'ml-64' : !isMobile ? 'ml-20' : ''
        }`}>
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
              <div className="flex items-center flex-1 min-w-0">
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-black truncate">
                    Professional Development
                  </h1>
                  <p className="text-xs md:text-sm text-black/70">
                    Enhance your skills with specialized training courses
                  </p>
                </div>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <BookOpen className="w-16 h-16 text-greyed-navy/30 mx-auto mb-4" />
                <p className="text-greyed-navy/60">No courses available at this time</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {courses.map((course) => {
                  const progressPercent = getCourseProgress(course.id, course.module_count);
                  const completed = isCourseCompleted(course.id);

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-greyed-navy/10"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-bold text-greyed-navy">{course.title}</h2>
                              {completed && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  <CheckCircle size={16} />
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-greyed-navy/70 mb-4">{course.description}</p>

                            <div className="flex items-center gap-6 text-sm text-greyed-navy/60">
                              <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{course.duration_minutes} minutes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen size={16} />
                                <span>{course.module_count} modules</span>
                              </div>
                            </div>
                          </div>

                          {completed && (
                            <Award className="w-12 h-12 text-yellow-500" />
                          )}
                        </div>

                        {progressPercent > 0 && !completed && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-greyed-navy/70 mb-2">
                              <span>Progress</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-greyed-navy/10 rounded-full h-2">
                              <div
                                className="bg-greyed-blue h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => navigate(`/teachers/courses/${course.id}`)}
                          className="flex items-center gap-2 bg-greyed-navy text-white px-6 py-3 rounded-lg hover:bg-greyed-navy/90 transition-colors font-medium"
                        >
                          {completed ? 'Review Course' : progressPercent > 0 ? 'Continue Course' : 'Start Course'}
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {isMobile && <MobileBottomNavigation activePage="settings" />}
    </div>
  );
};

export default TeacherCoursesPage;
