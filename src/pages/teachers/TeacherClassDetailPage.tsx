import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Folder,
  BookMarked,
  FileText,
  BarChart,
  PlusCircle,
  AlertCircle,
  Users,
  Settings,
  MapPin
} from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import ClassroomDocuments from '../../components/teachers/ClassroomDocuments';
import ClassSettingsModal from '../../components/teachers/ClassSettingsModal';
import ClassNotesManager from '../../components/teachers/ClassNotesManager';
import LoaderComponent from '../../components/ui/Loader';
import { 
  fetchClassById, 
  fetchLessonPlans,
  fetchAssessments,
  getClassAnalytics,
  updateClass,
  deleteClass
} from '../../lib/api/teacher-api';

const TeacherClassDetailPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('documents');
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('teacherSidebarCollapsed') === 'true');

  useEffect(() => {
    // Set active tab based on location hash if present
    const hash = location.hash.replace('#', '');
    if (hash && ['documents', 'lesson-plans', 'assessments', 'analytics', 'notes'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location]);

  useEffect(() => {
    document.title = "Class Details | GreyEd Teachers";
    
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }
    
    const fetchClassData = async () => {
      if (!user || !classId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch class details
        const classInfo = await fetchClassById(classId);
        setClassData(classInfo);
        
        // Fetch lesson plans
        const lessonPlanData = await fetchLessonPlans(classId);
        setLessonPlans(lessonPlanData);
        
        // Fetch assessments
        const assessmentData = await fetchAssessments(user.id, classId);
        setAssessments(assessmentData);
        
        // Fetch analytics
        const analyticsData = await getClassAnalytics(classId);
        setAnalytics(analyticsData);
      } catch {
        setError('Failed to load class data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && classId) {
      fetchClassData();
    }
  }, [user, authLoading, navigate, classId]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle updating class
  const handleUpdateClass = async (updatedClassData: {
    name: string;
    subject: string;
    grade: string;
    description: string;
    syllabus: string;
  }) => {
    if (!user || !classId) return;
    
    try {
      setError(null);
      
      // Update class via API
      await updateClass(classId, updatedClassData);
      
      // Update local state
      setClassData({
        ...classData,
        ...updatedClassData
      });
      
    } catch (err) {
      throw err; // Re-throw to be handled by the modal component
    }
  };

  // Handle class deletion
  const handleDeleteClass = async () => {
    if (!user || !classId) return;

    try {
      setError(null);

      // Delete class via API
      await deleteClass(classId);

      // Redirect to classes page after successful deletion
      navigate('/teachers/classes');

    } catch (err) {
      throw err; // Re-throw to be handled by the modal component
    }
  };

  if (authLoading || (loading && user)) {
    return <LoaderComponent fullScreen message="Loading class details..." />;
  }

  return (
    <>
      <NavBar sidebarCollapsed={sidebarCollapsed} />
      
      <div className="min-h-screen pt-[72px] bg-slate-50 flex">
        {/* Left sidebar navigation */}
        <div className={`bg-white border-r border-white/5 shadow-sm fixed top-0 left-0 bottom-0 z-40 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="classes"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              const newState = !sidebarCollapsed;
              setSidebarCollapsed(newState);
              localStorage.setItem('teacherSidebarCollapsed', String(newState));
            }}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300"
          style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}>
          <main className="px-4 sm:px-6 lg:px-8">
            {error && (
              <div className="bg-greyed-beige/30 border border-greyed-navy/20 text-greyed-black px-4 py-3 rounded-lg mb-4 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          
            {/* Class header — premium styling */}
            <div className="bg-white rounded-2xl border border-[#e8e6e0] shadow-sm p-5 mb-4 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-headline font-bold text-[#212754]">
                    {classData?.name || 'Class Details'}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2 mt-3">
                    <span className="bg-[#bbd7eb]/20 text-[#212754] px-3 py-1 rounded-lg text-sm font-semibold">
                      {classData?.subject || 'Subject'}
                    </span>
                    <span className="bg-[#212754]/8 text-[#212754] px-3 py-1 rounded-lg text-sm font-semibold">
                      {classData?.grade || 'Grade'}
                    </span>
                    {classData?.syllabus && (
                      <span className="bg-[#dedbc2]/40 text-[#212754] px-3 py-1 rounded-lg text-sm font-semibold">
                        {classData.syllabus}
                      </span>
                    )}
                    <span className="text-[#292828]/60 text-sm flex items-center font-medium">
                      <Users size={14} className="mr-1" />
                      {classData?.student_count || 0} learners
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="px-4 py-2.5 bg-[#212754] text-white rounded-xl hover:bg-[#2a2f6e] transition-all duration-200 flex items-center shadow-sm hover:shadow-md text-sm font-semibold"
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabs — premium styling */}
            <div className="bg-white rounded-2xl border border-[#e8e6e0] shadow-sm mb-4 animate-slide-up">
              <div className="border-b border-[#e8e6e0]">
                <nav className="flex overflow-x-auto px-1 gap-1 scrollbar-hide">
                  {[
                    { id: 'documents', icon: Folder, label: 'Documents' },
                    { id: 'lesson-plans', icon: BookMarked, label: 'Lesson Plans' },
                    { id: 'assessments', icon: FileText, label: 'Assessments' },
                    { id: 'analytics', icon: BarChart, label: 'Analytics' },
                    { id: 'notes', icon: BookMarked, label: 'Class Notes' },
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold relative whitespace-nowrap transition-colors duration-200 ${
                          isActive ? 'text-[#212754]' : 'text-[#292828]/50 hover:text-[#212754]/70'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon size={16} />
                        {tab.label}
                        {isActive && (
                          <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#bbd7eb] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Tab content - reduced padding */}
              <div className="p-4">
                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <ClassroomDocuments 
                    classId={classId || ''} 
                    className={classData?.name || 'Class'} 
                  />
                )}
                
                {/* Lesson Plans Tab */}
                {activeTab === 'lesson-plans' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-black">Lesson Plans</h2>
                      <div className="flex space-x-2">
                        <Link
                          to={`/teachers/lesson-planner/generate?classId=${classId}`}
                          className="px-3 py-1.5 bg-greyed-navy text-white rounded hover:bg-greyed-navy/90 text-sm transition-colors flex items-center"
                        >
                          <PlusCircle size={14} className="mr-1" />
                          Generate New Plan
                        </Link>
                        <button className="px-3 py-1.5 bg-greyed-navy/10 text-greyed-navy rounded hover:bg-greyed-navy/20 text-sm transition-colors">
                          Import Plan
                        </button>
                      </div>
                    </div>
                    
                    {lessonPlans.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-greyed-navy/10 rounded-lg">
                        <BookMarked className="w-12 h-12 text-greyed-navy/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-black mb-2">No lesson plans yet</h3>
                        <p className="text-black/70 max-w-md mx-auto mb-4">
                          Generate AI-powered lesson plans based on your curriculum and teaching style.
                        </p>
                        <Link 
                          to={`/teachers/lesson-planner/generate?classId=${classId}`}
                          className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors inline-flex items-center"
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Generate First Lesson Plan
                        </Link>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr className="bg-greyed-navy/5">
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Topic</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {lessonPlans.map((plan) => (
                              <tr key={plan.id} className="hover:bg-greyed-navy/5">
                                <td className="px-4 py-3 whitespace-nowrap text-black">
                                  {formatDate(plan.date)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <a
                                    href={plan.md_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-greyed-blue hover:text-greyed-navy cursor-pointer"
                                  >
                                    {plan.topic}
                                  </a>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    plan.status === 'ready' ? 'bg-slate-700 text-slate-200' :
                                    plan.status === 'draft' ? 'bg-slate-700 text-slate-200' :
                                    'bg-greyed-blue/20 text-greyed-navy'
                                  }`}>
                                    {plan.status === 'ready' ? 'Ready to teach' :
                                     plan.status === 'draft' ? 'Draft' :
                                     'Taught'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                  <a
                                    href={plan.md_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-greyed-blue hover:text-greyed-navy mx-1"
                                  >
                                    View
                                  </a>
                                  <button className="text-greyed-blue hover:text-greyed-navy mx-1">Edit</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Assessments Tab */}
                {activeTab === 'assessments' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-black">Assessments</h2>
                      <div className="flex space-x-2">
                        <Link
                          to={`/teachers/assessments/generate?classId=${classId}`}
                          className="px-3 py-1.5 bg-greyed-navy text-white rounded hover:bg-greyed-navy/90 text-sm transition-colors flex items-center"
                        >
                          <PlusCircle size={14} className="mr-1" />
                          Create Assessment
                        </Link>
                      </div>
                    </div>
                    
                    {assessments.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-greyed-navy/10 rounded-lg">
                        <FileText className="w-12 h-12 text-greyed-navy/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-black mb-2">No assessments yet</h3>
                        <p className="text-black/70 max-w-md mx-auto mb-4">
                          Create auto-graded assessments aligned with your curriculum and teaching objectives.
                        </p>
                        <Link 
                          to={`/teachers/assessments/generate?classId=${classId}`}
                          className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors inline-flex items-center"
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Create First Assessment
                        </Link>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr className="bg-greyed-navy/5">
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Title</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">AI Generated</th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {assessments.map((assessment) => (
                              <tr key={assessment.id} className="hover:bg-greyed-navy/5">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="font-medium text-greyed-blue hover:text-greyed-navy cursor-pointer">
                                    {assessment.title}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-black">
                                  {formatDate(assessment.created)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    assessment.status === 'published' ? 'bg-slate-700 text-slate-200' :
                                    assessment.status === 'draft' ? 'bg-slate-700 text-slate-200' :
                                    'bg-greyed-blue/20 text-greyed-navy'
                                  }`}>
                                    {assessment.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-black">
                                  {assessment.generated ? 'Yes' : 'No'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                  <button className="text-greyed-blue hover:text-greyed-navy mx-1">View</button>
                                  <button className="text-greyed-blue hover:text-greyed-navy mx-1">Results</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-black">Class Analytics</h2>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1.5 bg-greyed-navy/10 text-greyed-navy rounded hover:bg-greyed-navy/20 text-sm transition-colors">
                          Download Report
                        </button>
                      </div>
                    </div>
                    
                    {/* Analytics content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white shadow-sm border border-greyed-navy/10 rounded-lg p-4">
                        <h3 className="font-medium text-sm text-black/70 mb-1">Average Grade</h3>
                        <p className="text-2xl font-bold text-black">{analytics?.averageGrade || 0}%</p>
                        <div className="mt-2 text-xs text-cyan-400">+3% from previous unit</div>
                      </div>
                      
                      <div className="bg-white shadow-sm border border-greyed-navy/10 rounded-lg p-4">
                        <h3 className="font-medium text-sm text-black/70 mb-1">Engagement Rate</h3>
                        <p className="text-2xl font-bold text-black">{analytics?.engagementRate || 0}%</p>
                        <div className="mt-2 text-xs text-cyan-400">High participation</div>
                      </div>
                      
                      <div className="bg-white shadow-sm border border-greyed-navy/10 rounded-lg p-4">
                        <h3 className="font-medium text-sm text-black/70 mb-1">Homework Completion</h3>
                        <p className="text-2xl font-bold text-black">{analytics?.homeworkCompletion || 0}%</p>
                        <div className="mt-2 text-xs text-slate-300">-2% from last week</div>
                      </div>
                    </div>
                    
                    <div className="bg-white shadow-sm border border-greyed-navy/10 rounded-lg p-4 mt-4">
                      <h3 className="font-medium text-black mb-4">Knowledge Mastery</h3>
                      <div className="h-52 flex items-center justify-center">
                        <p className="text-greyed-navy/60">
                          Interactive charts will display here showing student performance across curriculum topics.
                        </p>
                      </div>
                    </div>
                    
                    {/* AI Insights */}
                    <div className="mt-4 bg-greyed-beige/20 p-4 rounded-lg border-l-4 border-greyed-blue">
                      <h3 className="font-medium text-black mb-1">AI Insights</h3>
                      <p className="text-sm text-black/70 mb-3">
                        Based on class performance, El AI suggests focusing on the following areas:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-black/80">
                        {analytics?.knowledgeGaps?.map((gap: string, index: number) => (
                          <li key={index}>Reinforce concepts of {gap} with more practical examples</li>
                        ))}
                        <li>Students are excelling in calculations but struggling with theoretical applications</li>
                        <li>Consider additional support for 5 students scoring below 60% consistently</li>
                      </ul>
                      <button className="mt-3 px-3 py-1.5 bg-greyed-navy text-white rounded text-sm hover:bg-greyed-navy/90 transition-colors">
                        Generate Detailed Report
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <ClassNotesManager classId={classId || ''} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Class Settings Modal */}
      {showSettingsModal && classData && (
        <ClassSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onUpdate={handleUpdateClass}
          onDelete={handleDeleteClass}
          classData={classData}
        />
      )}
      
      {/* Footer with sidebar offset */}
      <div className="transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}>
        <Footer />
      </div>
    </>
  );
};

export default TeacherClassDetailPage;