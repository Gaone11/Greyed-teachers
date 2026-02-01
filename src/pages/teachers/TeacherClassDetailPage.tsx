import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Loader, 
  ArrowLeft,
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
import LandingLayout from '../../components/layout/LandingLayout';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import ClassroomDocuments from '../../components/teachers/ClassroomDocuments';
import ClassSettingsModal from '../../components/teachers/ClassSettingsModal';
import ClassNotesManager from '../../components/teachers/ClassNotesManager';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('teacherSidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

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
      
    } catch {
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
      
    } catch {
      throw err; // Re-throw to be handled by the modal component
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <LandingLayout disableSnapScroll={true}>
        <NavBar />
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-greyed-white">
          <div className="text-center">
            <Loader className="w-12 h-12 text-greyed-blue mx-auto animate-spin" />
            <p className="mt-4 text-black font-semibold">Loading class details...</p>
          </div>
        </div>
        <Footer />
      </LandingLayout>
    );
  }

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-16 bg-gradient-to-br from-premium-slate via-premium-slateLight to-premium-slateDark flex">
        {/* Left sidebar navigation */}
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

        {/* Main content area - Dynamic spacing based on sidebar state */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0 md:ml-0' : 'ml-0 md:ml-0'} pt-6`}>
          <div className="max-w-6xl mx-auto px-3 md:px-4 py-4">
            {error && (
              <div className="bg-greyed-beige/30 border border-greyed-navy/20 text-greyed-black px-4 py-3 rounded-lg mb-4 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          
            {/* Breadcrumb & Back - reduced bottom margin */}
            <div className="mb-3">
              <button 
                onClick={() => navigate('/teachers/classes')}
                className="inline-flex items-center text-greyed-navy/70 hover:text-greyed-navy transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Classes
              </button>
            </div>
            
            {/* Class header - reduced padding and margin */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-headline font-bold text-black">
                    {classData?.name || 'Class Details'}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className="bg-greyed-blue/20 text-greyed-navy px-2 py-1 rounded text-sm">
                      {classData?.subject || 'Subject'}
                    </span>
                    <span className="bg-greyed-navy/10 text-greyed-navy px-2 py-1 rounded text-sm">
                      {classData?.grade || 'Grade'}
                    </span>
                    {classData?.syllabus && (
                      <span className="bg-greyed-beige/30 text-greyed-navy px-2 py-1 rounded text-sm">
                        {classData.syllabus}
                      </span>
                    )}
                    <span className="text-black/70 text-sm flex items-center">
                      <Users size={14} className="mr-1" />
                      {classData?.student_count || 0} students
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90 transition-colors flex items-center shadow-sm"
                  >
                    <Settings size={16} className="mr-2" />
                    Class Settings
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabs - reduced margin */}
            <div className="bg-white rounded-xl shadow-sm mb-4">
              <div className="border-b border-greyed-navy/10">
                <nav className="flex overflow-x-auto">
                  <a 
                    href="#documents"
                    className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'documents' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('documents')}
                  >
                    <div className="flex items-center">
                      <Folder size={16} className="mr-2" />
                      Documents
                    </div>
                    {activeTab === 'documents' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </a>
                  
                  <a 
                    href="#lesson-plans"
                    className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'lesson-plans' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('lesson-plans')}
                  >
                    <div className="flex items-center">
                      <BookMarked size={16} className="mr-2" />
                      Lesson Plans
                    </div>
                    {activeTab === 'lesson-plans' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </a>
                  
                  <a 
                    href="#assessments"
                    className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'assessments' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('assessments')}
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2" />
                      Assessments
                    </div>
                    {activeTab === 'assessments' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </a>
                  
                  <a 
                    href="#analytics"
                    className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'analytics' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('analytics')}
                  >
                    <div className="flex items-center">
                      <BarChart size={16} className="mr-2" />
                      Analytics
                    </div>
                    {activeTab === 'analytics' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </a>
                  
                  <a 
                    href="#notes"
                    className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'notes' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('notes')}
                  >
                    <div className="flex items-center">
                      <BookMarked size={16} className="mr-2" />
                      Class Notes
                    </div>
                    {activeTab === 'notes' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </a>
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
                          to="/teachers/lesson-planner"
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
                          to="/teachers/lesson-planner"
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
                                    plan.status === 'ready' ? 'bg-green-100 text-green-800' :
                                    plan.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
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
                          to="/teachers/assessments"
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
                          to="/teachers/assessments"
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
                                    assessment.status === 'published' ? 'bg-green-100 text-green-800' :
                                    assessment.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
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
                        <div className="mt-2 text-xs text-green-600">+3% from previous unit</div>
                      </div>
                      
                      <div className="bg-white shadow-sm border border-greyed-navy/10 rounded-lg p-4">
                        <h3 className="font-medium text-sm text-black/70 mb-1">Engagement Rate</h3>
                        <p className="text-2xl font-bold text-black">{analytics?.engagementRate || 0}%</p>
                        <div className="mt-2 text-xs text-green-600">High participation</div>
                      </div>
                      
                      <div className="bg-white shadow-sm border border-greyed-navy/10 rounded-lg p-4">
                        <h3 className="font-medium text-sm text-black/70 mb-1">Homework Completion</h3>
                        <p className="text-2xl font-bold text-black">{analytics?.homeworkCompletion || 0}%</p>
                        <div className="mt-2 text-xs text-yellow-600">-2% from last week</div>
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
          </div>
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
      
      <Footer />
    </LandingLayout>
  );
};

export default TeacherClassDetailPage;