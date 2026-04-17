import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, AlertCircle, Wand2, FileText, X, CheckCircle, Eye, Download, Upload, Brain, ChevronDown, Calendar, BarChart3 } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import ClassForm from '../../components/teachers/ClassForm';
import AssessmentViewModal from '../../components/teachers/AssessmentViewModal';
import { fetchAssessments, fetchTeacherClasses, generateAssessment, createClass } from '../../lib/api/teacher-api';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const syllabusRequiredTests: Record<string, string[]> = {
  'Cambridge IGCSE': ['End of Unit Test', 'Mid-Term Assessment', 'Mock Examination', 'Practical Assessment', 'Final Examination'],
  'Cambridge A Level': ['AS Level Test', 'A2 Level Test', 'Practical Assessment', 'Mock Examination', 'Final Examination'],
  'Botswana BGCSE': ['Continuous Assessment', 'Term Test', 'BGCSE Mock Examination', 'Final Examination'],
  'Botswana JSE': ['Monthly Test', 'Term Assessment', 'Project Evaluation', 'Mock Examination', 'Final Examination']
};

const TeacherAssessmentsPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, _setSuccess] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('teacherSidebarCollapsed') === 'true');
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [requiredTestsForSyllabus, setRequiredTestsForSyllabus] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    assessmentType: 'quiz',
    difficulty: 'medium',
    questionCount: '5',
    includeAnswerKey: true,
    topic: '',
    requiredTest: ''
  });

  useEffect(() => {
    document.title = "Assessments | GreyEd Teachers";
    if (!authLoading && !user) { navigate('/auth/login'); return; }

    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const assessmentData = await fetchAssessments(user.id);
        setAssessments(assessmentData);
        const classData = await fetchTeacherClasses(user.id);
        setClasses(classData);
        if (classData.length > 0) {
          const firstClass = classData[0];
          setFormData(prev => ({ ...prev, classId: firstClass.id }));
          if (firstClass.syllabus && syllabusRequiredTests[firstClass.syllabus]) {
            setRequiredTestsForSyllabus(syllabusRequiredTests[firstClass.syllabus]);
          }
        }
      } catch {
        setError('Failed to load assessments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, authLoading, navigate]);

  const handleLogout = async () => { await signOut(); navigate('/'); };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || assessment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'classId' && value === 'new_class') { setShowCreateClassModal(true); return; }
    if (name === 'classId') {
      const selectedClass = classes.find(cls => cls.id === value);
      if (selectedClass && selectedClass.syllabus && syllabusRequiredTests[selectedClass.syllabus]) {
        setRequiredTestsForSyllabus(syllabusRequiredTests[selectedClass.syllabus]);
      } else {
        setRequiredTestsForSyllabus([]);
      }
      setFormData(prev => ({ ...prev, [name]: value, requiredTest: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title) { alert('Please enter an assessment title'); return; }
    if (!formData.classId) { alert('Please select a class'); return; }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateAssessment({
        title: formData.title,
        classId: formData.classId,
        assessmentType: formData.assessmentType,
        difficulty: formData.difficulty,
        questionCount: parseInt(formData.questionCount),
        includeAnswerKey: formData.includeAnswerKey,
        topic: formData.topic,
        requiredTest: formData.requiredTest
      });

      const newAssessment = {
        id: result.assessment.id,
        title: result.assessment.title,
        classId: formData.classId,
        className: classes.find(c => c.id === formData.classId)?.name || '',
        created: result.assessment.created_at,
        status: result.assessment.status,
        questionCount: parseInt(formData.questionCount),
        averageScore: null,
        submissionRate: `0/${classes.find(c => c.id === formData.classId)?.student_count || 0}`
      };

      setAssessments([newAssessment, ...assessments]);
      setFormData({ title: '', classId: '', assessmentType: 'quiz', difficulty: 'medium', questionCount: '5', includeAnswerKey: true, topic: '', requiredTest: '' });
      setShowCreateModal(false);
      setSelectedAssessment(newAssessment);
      setSelectedQuestions(result.questions);
      setShowViewModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateClass = async (classData: { name: string; subject: string; grade: string; description: string; syllabus: string; classSize?: number; duration?: number; }) => {
    if (!user) return;
    try {
      setError(null);
      const payload: any = { teacher_id: user.id, name: classData.name, subject: classData.subject, grade: classData.grade, description: classData.description };
      const newClass = await createClass(payload);
      setClasses((prevClasses: any[]) => [...prevClasses, newClass]);
      setFormData(prev => ({ ...prev, classId: newClass.id }));
      setShowCreateClassModal(false);
    } catch (err: any) {
      throw err;
    }
  };

  const handleViewAssessment = async (assessment: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockQuestions = generateMockQuestions(assessment.questionCount, assessment.title);
      setSelectedAssessment(assessment);
      setSelectedQuestions(mockQuestions);
      setShowViewModal(true);
    } catch {
      setError('Failed to load assessment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = (count: number, topic: string) => {
    const questions = [];
    for (let i = 1; i <= count; i++) {
      let question = {
        id: `q-${i}`,
        type: i % 3 === 0 ? 'short-answer' : i % 3 === 1 ? 'multiple-choice' : 'true-false',
        question: `Question ${i}: What is the main concept of ${topic}?`,
        options: [] as string[],
        answer: '',
        explanation: `Explanation for question ${i} about ${topic}.`
      };
      if (question.type === 'multiple-choice') {
        question.options = ['The first option related to the topic', 'The second option that might be correct', 'The third option with different wording', 'The fourth option that could distract'];
        question.answer = question.options[1];
      } else if (question.type === 'true-false') {
        question.question = `Question ${i}: True or False - ${topic} is a fundamental concept in this subject.`;
        question.answer = 'True';
      } else {
        question.answer = `The answer explains the main concept of ${topic} in detail.`;
      }
      questions.push(question);
    }
    return questions;
  };

  const handleSaveAssessment = async (updatedAssessment: any, updatedQuestions: any[]) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAssessments(assessments.map(a => a.id === updatedAssessment.id ? { ...a, ...updatedAssessment } : a));
      setSelectedAssessment({ ...selectedAssessment, ...updatedAssessment });
      setSelectedQuestions(updatedQuestions);
      return true;
    } catch {
      throw new Error('Failed to save assessment. Please try again.');
    }
  };

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    draft: { label: 'Draft', bg: 'bg-[#94A3B8]/30', text: 'text-[#0F172A]/70' },
    published: { label: 'Published', bg: 'bg-slate-800', text: 'text-cyan-300' },
    completed: { label: 'Completed', bg: 'bg-[#67E8F9]/12', text: 'text-[#0F172A]' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }
  };

  const inputClass = "w-full p-3 border border-white/10 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/15 focus:border-[#0F172A]/30 transition-all bg-white";
  const labelClass = "block text-sm font-medium text-[#0F172A]/70 mb-1.5";

  if (authLoading) {
    return (
      <>
        <NavBar sidebarCollapsed={sidebarCollapsed} />
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-[#FAFAF8]">
          <div className="w-6 h-6 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar
        sidebarCollapsed={sidebarCollapsed}
        actionButton={
          <div className="flex gap-2">
            <Link
              to="/teachers/assessment-grading"
              className="inline-flex items-center bg-[#0F172A]/8 text-[#0F172A] px-4 py-2.5 rounded-xl hover:bg-[#0F172A]/15 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Upload size={15} className="mr-2" />
              <span className="hidden md:inline">AI Grading</span>
              <span className="md:hidden">Grade</span>
            </Link>
            <button
              onClick={() => navigate('/teachers/assessments/generate')}
              className="inline-flex items-center bg-[#0F172A] text-white px-4 py-2.5 rounded-xl hover:bg-[#0F172A]/90 transition-colors text-sm font-medium whitespace-nowrap shadow-sm"
            >
              <PlusCircle size={15} className="mr-2" />
              <span className="hidden md:inline">New Assessment</span>
              <span className="md:hidden">New</span>
            </button>
          </div>
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
            activePage="assessments"
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
            <button onClick={() => setShowMobileMenu(false)} className="absolute top-4 right-4 p-2 text-white bg-[#0F172A]/50 rounded-full">
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
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-slate-800 border border-emerald-200 text-cyan-300 px-4 py-3 rounded-xl mb-6 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2.5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-[#94A3B8]/20 border border-[#0F172A]/15 text-[#0F172A] px-4 py-3 rounded-xl mb-6 flex items-center">
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
                    className="pl-10 pr-4 py-2.5 w-full border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/15 focus:border-[#0F172A]/30 transition-all placeholder:text-greyed-beige"
                    placeholder="Search assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative md:w-44">
                  <select
                    title="Filter by status"
                    className="w-full py-2.5 pl-3.5 pr-9 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/15 focus:border-[#0F172A]/30 appearance-none bg-white text-greyed-white transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
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
                <div className="w-6 h-6 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
              </div>
            ) : filteredAssessments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-12 text-center"
              >
                <div className="w-16 h-16 bg-[#67E8F9]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <FileText className="w-7 h-7 text-[#67E8F9]" />
                </div>
                <h2 className="text-lg font-headline font-semibold text-[#0F172A] mb-2">No assessments yet</h2>
                <p className="text-[#0F172A]/50 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                  {searchTerm || filterStatus
                    ? "Try adjusting your search or filters to see more results."
                    : "Create your first assessment to start evaluating your students with AI-powered tools."}
                </p>
                {!searchTerm && !filterStatus && (
                  <button
                    onClick={() => navigate('/teachers/assessments/generate')}
                    className="inline-flex items-center bg-[#0F172A] text-white px-5 py-2.5 rounded-xl hover:bg-[#0F172A]/90 transition-colors text-sm font-medium shadow-sm"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Create Your First Assessment
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
                {filteredAssessments.map((assessment) => {
                  const status = statusConfig[assessment.status] || statusConfig.draft;
                  return (
                    <motion.div
                      key={assessment.id}
                      variants={cardVariants}
                      layout
                      className="bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                      onClick={() => handleViewAssessment(assessment)}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-headline font-semibold text-[#0F172A] text-[15px] leading-snug pr-3 line-clamp-2">
                          {assessment.title}
                        </h3>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg flex-shrink-0 ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Card Meta */}
                      <div className="flex items-center gap-3 text-xs text-[#0F172A]/45 mb-4">
                        <span className="truncate">{assessment.className}</span>
                        <span className="w-1 h-1 rounded-full bg-[#0F172A]/20" />
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(assessment.created)}
                        </span>
                      </div>

                      {/* Card Stats */}
                      <div className="flex items-center gap-4 text-xs text-[#0F172A]/55 mb-4">
                        <span>{assessment.questionCount} questions</span>
                        {assessment.averageScore !== null && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[#0F172A]/20" />
                            <span className="flex items-center gap-1">
                              <BarChart3 size={12} />
                              {assessment.averageScore}% avg
                            </span>
                          </>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-1 pt-3 border-t border-greyed-beige/60">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewAssessment(assessment); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A]/70 hover:text-[#0F172A] hover:bg-[#0F172A]/5 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewAssessment(assessment); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A]/70 hover:text-[#0F172A] hover:bg-[#0F172A]/5 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={14} />
                          Download
                        </button>
                        <div className="flex-1" />
                        <span className="text-xs text-[#0F172A]/35">{assessment.submissionRate}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-6 border-l-4 border-l-[#67E8F9]/60"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#67E8F9]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-[#67E8F9]" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-[#0F172A] text-[15px] mb-1.5">AI Auto-Grading</h3>
                    <p className="text-[#0F172A]/50 text-sm leading-relaxed mb-3">
                      Save hours with intelligent grading. Works with multiple choice, short answer, and essay questions.
                    </p>
                    <Link
                      to="/teachers/assessment-grading"
                      className="inline-flex items-center text-sm font-medium text-[#0F172A] hover:text-[#0F172A]/80 transition-colors"
                    >
                      <Upload size={14} className="mr-1.5 text-[#67E8F9]" />
                      Grade assessments
                    </Link>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl border border-greyed-beige/60 shadow-sm p-6 border-l-4 border-l-[#0F172A]/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0F172A]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-[#0F172A] text-[15px] mb-1.5">Performance Insights</h3>
                    <p className="text-[#0F172A]/50 text-sm leading-relaxed mb-3">
                      Detailed analytics on student performance, knowledge gaps, and targeted intervention materials.
                    </p>
                    <Link
                      to="/teachers/assessment-grading"
                      className="inline-flex items-center text-sm font-medium text-[#0F172A] hover:text-[#0F172A]/80 transition-colors"
                    >
                      <BarChart3 size={14} className="mr-1.5 text-[#67E8F9]" />
                      View insights
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Create Assessment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-greyed-beige/60 flex justify-between items-center">
                <h3 className="text-lg font-headline font-semibold text-[#0F172A]">Create Assessment</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-greyed-beige hover:text-greyed-beige rounded-lg hover:bg-greyed-card transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAssessment} className="p-6 space-y-5">
                <div>
                  <label className={labelClass}>Assessment Title</label>
                  <input type="text" name="title" className={inputClass} placeholder="e.g. End of Unit Physics Test" value={formData.title} onChange={handleInputChange} required />
                </div>

                <div>
                  <label className={labelClass}>Class</label>
                  <select name="classId" className={inputClass} value={formData.classId} onChange={handleInputChange} required>
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name} ({cls.subject})</option>
                    ))}
                    <option value="new_class">+ Create New Class</option>
                  </select>
                </div>

                {requiredTestsForSyllabus.length > 0 && (
                  <div>
                    <label className={labelClass}>Required Test (from syllabus)</label>
                    <select name="requiredTest" className={inputClass} value={formData.requiredTest} onChange={handleInputChange}>
                      <option value="">Select a required test...</option>
                      {requiredTestsForSyllabus.map((test) => (
                        <option key={test} value={test}>{test}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Assessment Type</label>
                    <select name="assessmentType" className={inputClass} value={formData.assessmentType} onChange={handleInputChange}>
                      <option value="quiz">Quiz</option>
                      <option value="test">Test</option>
                      <option value="exam">Exam</option>
                      <option value="homework">Homework</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Difficulty</label>
                    <select name="difficulty" className={inputClass} value={formData.difficulty} onChange={handleInputChange}>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Number of Questions</label>
                  <select name="questionCount" className={inputClass} value={formData.questionCount} onChange={handleInputChange}>
                    <option value="5">5 questions</option>
                    <option value="10">10 questions</option>
                    <option value="15">15 questions</option>
                    <option value="20">20 questions</option>
                    <option value="25">25 questions</option>
                    <option value="30">30 questions</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Topic / Content Area</label>
                  <textarea name="topic" className={`${inputClass} resize-none`} rows={3} placeholder="Describe what topics this assessment should cover..." value={formData.topic} onChange={handleInputChange} />
                </div>

                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" name="includeAnswerKey" checked={formData.includeAnswerKey} onChange={handleCheckboxChange}
                    className="rounded border-white/20 text-[#0F172A] focus:ring-[#0F172A]/30 transition-colors" />
                  <span className="ml-2.5 text-sm text-[#0F172A]/60 group-hover:text-[#0F172A]/80 transition-colors">Include answer key and grading rubric</span>
                </label>

                <div className="flex justify-end gap-3 pt-4 border-t border-greyed-beige/60">
                  <button type="button" onClick={() => setShowCreateModal(false)} disabled={isGenerating}
                    className="px-4 py-2.5 border border-white/10 rounded-xl text-[#0F172A]/70 hover:bg-greyed-navy text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isGenerating}
                    className={`px-5 py-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-[#0F172A]/90 text-sm font-medium flex items-center transition-colors shadow-sm ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 size={15} className="mr-2" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Class Modal */}
      <ClassForm isOpen={showCreateClassModal} onClose={() => setShowCreateClassModal(false)} onSubmit={handleCreateClass} />

      {/* View/Edit Assessment Modal */}
      {selectedAssessment && (
        <AssessmentViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          assessment={selectedAssessment}
          questions={selectedQuestions}
          onSave={handleSaveAssessment}
          readOnly={selectedAssessment.status === 'completed'}
        />
      )}

      <div className="transition-[margin] duration-300" style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
        <Footer />
      </div>
    </>
  );
};

export default TeacherAssessmentsPage;
