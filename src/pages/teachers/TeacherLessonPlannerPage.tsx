import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, AlertCircle, BookOpen, Trash2, Download, Brain, X, CheckCircle, ChevronDown, Wand2, Calendar, Clock } from 'lucide-react';
import { downloadMarkdownAsDocx } from '../../lib/markdown-to-docx';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import { fetchTeacherClasses } from '../../lib/api/teacher-api';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { format, parseISO } from 'date-fns';
import { supabase } from '../../lib/supabase';

const TeacherLessonPlannerPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('teacherSidebarCollapsed') === 'true');

  useEffect(() => {
    document.title = "Lesson Planner | GreyEd Teachers";

    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const classData = await fetchTeacherClasses(user.id);
        setClasses(classData);

        const { data, error } = await supabase
          .from('lesson_plans')
          .select(`*, classes(name, subject, grade)`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedData = data.map(plan => ({
          ...plan,
          className: plan.classes?.name || 'Unknown',
          subject: plan.classes?.subject || '',
          grade: plan.classes?.grade || ''
        }));

        setLessonPlans(transformedData);
      } catch {
        setError('Failed to load data. Please try again later.');
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

  const filteredLessonPlans = lessonPlans.filter(plan => {
    const matchesTerm =
      plan.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.className?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || plan.class_id === filterClass;
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    return matchesTerm && matchesClass && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleUpdateStatus = async (planId: string, status: 'draft' | 'ready' | 'taught') => {
    try {
      setError(null);

      const { error } = await supabase
        .from('lesson_plans')
        .update({ status })
        .eq('id', planId);

      if (error) throw error;

      setLessonPlans(plans =>
        plans.map(plan =>
          plan.id === planId ? { ...plan, status } : plan
        )
      );

      setSuccess('Lesson plan status updated!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update lesson plan status. Please try again.');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this lesson plan?')) return;

    try {
      setError(null);

      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      setLessonPlans(plans => plans.filter(plan => plan.id !== planId));
      setSuccess('Lesson plan deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to delete lesson plan. Please try again.');
    }
  };

  const handleDownloadPlan = (plan: any) => {
    try {
      downloadMarkdownAsDocx(plan.md_path, `${plan.topic.replace(/\s+/g, '_')}_lesson_plan.docx`, plan.topic);
    } catch {
      setError('Failed to download as Word document. Please try again.');
    }
  };

  const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-[#dedbc2]/40', text: 'text-[#212754]/70' },
    ready: { label: 'Ready', bg: 'bg-slate-800', text: 'text-cyan-300' },
    taught: { label: 'Taught', bg: 'bg-[#bbd7eb]/15', text: 'text-[#212754]' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <>
      <NavBar
        sidebarCollapsed={sidebarCollapsed}
        actionButton={
          <button
            onClick={() => navigate('/teachers/lesson-planner/generate')}
            className="inline-flex items-center bg-[#212754] text-white px-4 py-2.5 rounded-xl hover:bg-[#212754]/90 transition-colors text-sm font-medium whitespace-nowrap shadow-sm"
          >
            <PlusCircle size={16} className="mr-2" />
            Generate New Plan
          </button>
        }
      />

      <div className="min-h-screen pt-[72px] bg-[#FAFAF8] flex overflow-x-hidden">
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)} />
        )}

        <div className={`bg-white border-r border-white/5 shadow-sm ${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="lesson-planner"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              const newState = !sidebarCollapsed;
              setSidebarCollapsed(newState);
              localStorage.setItem('teacherSidebarCollapsed', String(newState));
            }}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />

          {showMobileMenu && isMobile && (
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-[#212754]/50 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 pt-0 pb-16 md:pb-0 transition-[margin] duration-300 overflow-x-hidden"
          style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
          <main className="px-4 sm:px-6 lg:px-8 max-w-6xl">

            {/* Notifications */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-slate-800 border border-emerald-200 text-cyan-300 px-4 py-3 rounded-xl mb-6 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2.5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-[#dedbc2]/30 border border-[#212754]/15 text-[#212754] px-4 py-3 rounded-xl mb-6 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-2.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-4 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-greyed-beige" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl text-sm text-greyed-black focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40 transition-all placeholder:text-gray-400"
                    placeholder="Search lesson plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative md:w-44">
                  <select
                    title="Filter by class"
                    className="w-full py-2.5 pl-3.5 pr-9 border border-gray-300 rounded-xl text-sm text-greyed-black focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40 appearance-none bg-white transition-all"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-greyed-beige" />
                  </div>
                </div>

                <div className="relative md:w-44">
                  <select
                    title="Filter by status"
                    className="w-full py-2.5 pl-3.5 pr-9 border border-gray-300 rounded-xl text-sm text-greyed-black focus:outline-none focus:ring-2 focus:ring-greyed-navy/20 focus:border-greyed-navy/40 appearance-none bg-white transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="ready">Ready to teach</option>
                    <option value="taught">Taught</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-greyed-beige" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-[#212754]/20 border-t-greyed-navy rounded-full animate-spin" />
              </div>
            ) : filteredLessonPlans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-12 text-center"
              >
                <div className="w-16 h-16 bg-[#dedbc2]/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <BookOpen className="w-7 h-7 text-[#212754]/60" />
                </div>
                <h2 className="text-lg font-headline font-semibold text-[#212754] mb-2">No lesson plans found</h2>
                <p className="text-[#212754]/50 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                  {searchTerm || filterClass || filterStatus
                    ? "Try adjusting your search or filters to see more results."
                    : "You haven't created any lesson plans yet. Generate your first plan to get started."}
                </p>
                {!searchTerm && !filterClass && !filterStatus && (
                  <button
                    onClick={() => navigate('/teachers/lesson-planner/generate')}
                    className="inline-flex items-center bg-[#212754] text-white px-5 py-2.5 rounded-xl hover:bg-[#212754]/90 transition-colors text-sm font-medium shadow-sm"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Generate Your First Plan
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {filteredLessonPlans.map((plan) => {
                  const status = statusConfig[plan.status as keyof typeof statusConfig] || statusConfig.draft;

                  return (
                    <motion.div
                      key={plan.id}
                      variants={cardVariants}
                      layout
                      className="bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-headline font-semibold text-[#212754] text-[15px] leading-snug pr-3 line-clamp-2">
                          {plan.topic}
                        </h3>
                        <div className="relative flex-shrink-0">
                          <div className="group/status relative">
                            <button type="button" title="Change status" className={`px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.text} transition-colors`}>
                              {status.label}
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-xl border border-white/5 overflow-hidden hidden group-hover/status:block z-10 w-36">
                              <button
                                onClick={() => handleUpdateStatus(plan.id, 'draft')}
                                className={`w-full px-3 py-2 text-left text-sm transition-colors ${plan.status === 'draft' ? 'bg-[#dedbc2]/20 font-medium text-[#212754]' : 'text-greyed-beige hover:bg-greyed-navy'}`}
                              >
                                Draft
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(plan.id, 'ready')}
                                className={`w-full px-3 py-2 text-left text-sm transition-colors ${plan.status === 'ready' ? 'bg-[#dedbc2]/20 font-medium text-[#212754]' : 'text-greyed-beige hover:bg-greyed-navy'}`}
                              >
                                Ready to teach
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(plan.id, 'taught')}
                                className={`w-full px-3 py-2 text-left text-sm transition-colors ${plan.status === 'taught' ? 'bg-[#dedbc2]/20 font-medium text-[#212754]' : 'text-greyed-beige hover:bg-greyed-navy'}`}
                              >
                                Taught
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Meta */}
                      <div className="flex items-center gap-4 text-xs text-[#212754]/45 mb-4">
                        {plan.className !== 'Unknown' && (
                          <span className="truncate">{plan.className}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(plan.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {plan.meta?.duration || 60}m
                        </span>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-1 pt-3 border-t border-greyed-beige/60">
                        <button
                          onClick={() => handleDownloadPlan(plan)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#212754]/70 hover:text-[#212754] hover:bg-[#dedbc2]/20 rounded-lg transition-colors"
                          title="Download as Word"
                        >
                          <Download size={14} />
                          Download
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 text-greyed-beige hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete plan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Help Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 mb-6 bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-6 border-l-4 border-l-greyed-blue/60"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#bbd7eb]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-[#bbd7eb]" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-[#212754] text-[15px] mb-1.5">AI-Powered Lesson Planning</h3>
                  <p className="text-[#212754]/50 text-sm leading-relaxed mb-3">
                    Create comprehensive, curriculum-aligned lesson plans in seconds. Each plan includes objectives, activities, assessments, and differentiation strategies.
                  </p>
                  <button
                    onClick={() => navigate('/teachers/lesson-planner/generate')}
                    className="inline-flex items-center text-sm font-medium text-[#212754] hover:text-[#212754]/80 transition-colors"
                  >
                    <Wand2 size={14} className="mr-1.5 text-[#bbd7eb]" />
                    Generate a plan
                  </button>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      <div className="transition-[margin] duration-300" style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
        <Footer />
      </div>
    </>
  );
};

export default TeacherLessonPlannerPage;
