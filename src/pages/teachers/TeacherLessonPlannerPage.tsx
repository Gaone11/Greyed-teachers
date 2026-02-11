import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader, Search, PlusCircle, AlertCircle, BookOpen, Calendar, Edit2, Trash2, Download, Brain, Menu, X, CheckCircle, Filter, ChevronDown, Wand2 } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../../components/dashboard/MobileBottomNavigation';
import {
  fetchTeacherClasses,
  generateLessonPlan,
  hasActiveSubscription,
  getTeacherLimits
} from '../../lib/api/teacher-api';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { format, parseISO } from 'date-fns';
import { supabase } from '../../lib/supabase';

// Define curriculum data - subjects and their topics
const primarySchoolCurriculum: Record<string, string[]> = {
  'Mathematics': [
    'Numbers and Place Value - Intro',
    'Numbers and Place Value - Main',
    'Addition and Subtraction - Intro',
    'Addition and Subtraction - Main',
    'Multiplication and Division - Intro',
    'Multiplication and Division - Main',
    'Fractions - Intro',
    'Fractions - Main',
    'Measurement - Intro',
    'Measurement - Main',
    'Geometry - Intro',
    'Geometry - Main',
    'Statistics - Intro',
    'Statistics - Main'
  ],
  'English': [
    'Reading Comprehension - Intro',
    'Reading Comprehension - Main',
    'Writing Skills - Intro',
    'Writing Skills - Main',
    'Grammar - Intro',
    'Grammar - Main',
    'Vocabulary - Intro',
    'Vocabulary - Main',
    'Punctuation - Intro',
    'Punctuation - Main',
    'Spelling - Intro',
    'Spelling - Main',
    'Speaking and Listening - Intro',
    'Speaking and Listening - Main'
  ],
  'Science': [
    'Living Things - Intro',
    'Living Things - Main',
    'Materials - Intro',
    'Materials - Main',
    'Physical Processes - Intro',
    'Physical Processes - Main',
    'Earth and Space - Intro',
    'Earth and Space - Main',
    'Forces and Motion - Intro',
    'Forces and Motion - Main',
    'Electricity - Intro',
    'Electricity - Main',
    'Sound and Light - Intro',
    'Sound and Light - Main'
  ],
  'History': [
    'Ancient Civilizations - Intro',
    'Ancient Civilizations - Main',
    'Local History - Intro',
    'Local History - Main',
    'World History - Intro',
    'World History - Main',
    'Historical Figures - Intro',
    'Historical Figures - Main',
    'Historical Events - Intro',
    'Historical Events - Main'
  ],
  'Geography': [
    'Map Skills - Intro',
    'Map Skills - Main',
    'Physical Geography - Intro',
    'Physical Geography - Main',
    'Human Geography - Intro',
    'Human Geography - Main',
    'Environmental Geography - Intro',
    'Environmental Geography - Main',
    'Local Geography - Intro',
    'Local Geography - Main'
  ],
  'Art': [
    'Drawing - Intro',
    'Drawing - Main',
    'Painting - Intro',
    'Painting - Main',
    'Sculpture - Intro',
    'Sculpture - Main',
    'Collage - Intro',
    'Collage - Main',
    'Art History - Intro',
    'Art History - Main'
  ],
  'Music': [
    'Singing - Intro',
    'Singing - Main',
    'Instruments - Intro',
    'Instruments - Main',
    'Composition - Intro',
    'Composition - Main',
    'Music Appreciation - Intro',
    'Music Appreciation - Main',
    'Musical Notation - Intro',
    'Musical Notation - Main'
  ],
  'Physical Education': [
    'Ball Games - Intro',
    'Ball Games - Main',
    'Gymnastics - Intro',
    'Gymnastics - Main',
    'Athletics - Intro',
    'Athletics - Main',
    'Dance - Intro',
    'Dance - Main',
    'Team Sports - Intro',
    'Team Sports - Main'
  ],
  'Design and Technology': [
    'Materials and Structures - Intro',
    'Materials and Structures - Main',
    'Mechanisms - Intro',
    'Mechanisms - Main',
    'Food Technology - Intro',
    'Food Technology - Main',
    'Textiles - Intro',
    'Textiles - Main',
    'Product Design - Intro',
    'Product Design - Main'
  ],
  'Computing': [
    'Algorithms - Intro',
    'Algorithms - Main',
    'Programming - Intro',
    'Programming - Main',
    'Digital Literacy - Intro',
    'Digital Literacy - Main',
    'E-Safety - Intro',
    'E-Safety - Main',
    'Data Handling - Intro',
    'Data Handling - Main'
  ],
  'Religious Education': [
    'Christianity - Intro',
    'Christianity - Main',
    'Islam - Intro',
    'Islam - Main',
    'Judaism - Intro',
    'Judaism - Main',
    'Hinduism - Intro',
    'Hinduism - Main',
    'Buddhism - Intro',
    'Buddhism - Main',
    'Sikhism - Intro',
    'Sikhism - Main',
    'World Religions - Intro',
    'World Religions - Main'
  ]
};

const TeacherLessonPlannerPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{ markdown: string; meta: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [limits, setLimits] = useState({
    lessonPlans: 3,
    usedLessonPlans: 0
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setSidebarCollapsed(savedState === 'true');
      }
    } catch {
      // localStorage unavailable (private browsing)
    }
  }, []);

  useEffect(() => {
    document.title = "Lesson Planner | GreyEd Teachers";
    
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check subscription status
        const subscriptionActive = await hasActiveSubscription();
        setIsSubscribed(subscriptionActive);
        
        // Get teacher limits
        const teacherLimits = await getTeacherLimits(user.id);
        setLimits(teacherLimits);
        
        // Fetch classes
        const classData = await fetchTeacherClasses(user.id);
        setClasses(classData);
        
        // If there's at least one class, pre-select it
        if (classData.length > 0) {
          // Initialize any state if needed
        }
        
        // Fetch lesson plans for all classes
        const fetchLessonPlans = async () => {
          // Use Supabase to fetch all lesson plans
          const { data, error } = await supabase
            .from('lesson_plans')
            .select(`*, classes(name, subject, grade)`)
            .order('created_at', { ascending: false });
          
          if (error) {
            throw error;
          }
          
          // Transform data to include class name
          const transformedData = data.map(plan => ({
            ...plan,
            className: plan.classes?.name || 'Unknown',
            subject: plan.classes?.subject || '',
            grade: plan.classes?.grade || ''
          }));
          
          setLessonPlans(transformedData);
        };
        
        await fetchLessonPlans();
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

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Filter lesson plans
  const filteredLessonPlans = lessonPlans.filter(plan => {
    const matchesTerm = 
      plan.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.className?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || plan.class_id === filterClass;
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    return matchesTerm && matchesClass && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };
  
  // Update lesson plan status
  const handleUpdateStatus = async (planId: string, status: 'draft' | 'ready' | 'taught') => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('lesson_plans')
        .update({ status })
        .eq('id', planId);
      
      if (error) throw error;
      
      // Update local state
      setLessonPlans(plans => 
        plans.map(plan => 
          plan.id === planId ? { ...plan, status } : plan
        )
      );
      
      // Show success message
      setSuccess('Lesson plan status updated!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update lesson plan status. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete lesson plan
  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this lesson plan?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', planId);
      
      if (error) throw error;
      
      // Update local state
      setLessonPlans(plans => plans.filter(plan => plan.id !== planId));
      
      // Show success message
      setSuccess('Lesson plan deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to delete lesson plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to parse markdown bold into TextRuns
  const parseMarkdownToTextRuns = (text: string, defaultBold: boolean = false) => {
    const children: TextRun[] = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
  
    while ((match = boldRegex.exec(text)) !== null) {
      // Add preceding plain text
      if (match.index > lastIndex) {
        children.push(new TextRun({ text: text.substring(lastIndex, match.index), bold: defaultBold }));
      }
      // Add bold text
      children.push(new TextRun({ text: match[1], bold: true }));
      lastIndex = boldRegex.lastIndex;
    }
    // Add any remaining plain text
    if (lastIndex < text.length) {
      children.push(new TextRun({ text: text.substring(lastIndex), bold: defaultBold }));
    }
    return children;
  };

  // Download lesson plan as markdown
  const handleDownloadPlan = (plan: any) => {
    try {
      const children = [
        new Paragraph({
          children: [
            new TextRun({
              text: plan.topic, // Headings are always bold
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 200,
          },
        }),
      ];
      
      // Process markdown content into paragraphs
      const lines = plan.md_path.split('\n');
      for (const line of lines) {
        if (!line.trim()) {
          children.push(new Paragraph({}));
          continue;
        }
        
        if (line.startsWith('# ')) {
          children.push(
            new Paragraph({
              children: [
                ...parseMarkdownToTextRuns(line.substring(2), true), // Apply bold to heading text
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
            })
          );
        } else if (line.startsWith('## ')) {
          children.push(
            new Paragraph({
              children: [
                ...parseMarkdownToTextRuns(line.substring(3), true), // Apply bold to heading text
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 120 },
            })
          );
        } else if (line.startsWith('- ')) {
          children.push(
            new Paragraph({
              children: [
                ...parseMarkdownToTextRuns(line.substring(2)), // Apply bold to bullet text
              ],
              bullet: { level: 0 },
              spacing: { after: 80 },
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [
                ...parseMarkdownToTextRuns(line), // Apply bold to regular text
              ],
              spacing: { after: 80 },
            })
          );
        }
      }
      
      // Create document with all paragraphs
      const doc = new Document({
        sections: [{
          properties: {},
          children: children
        }]
      });
      
      // Generate and save document
      Packer.toBlob(doc).then(blob => {
        const filename = `${plan.topic.replace(/\s+/g, '_')}_lesson_plan.docx`;
        saveAs(blob, filename);
      });
    } catch {
      setError('Failed to download as Word document. Please try again.');
    }
  };

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar sidebarCollapsed={sidebarCollapsed} />
      
      <div className="min-h-screen pt-16 bg-[#f8f8f6] flex overflow-x-hidden">
        {/* Mobile menu overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}></div>
        )}
        
        {/* Left sidebar navigation */}
        <div className={`${
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
              try { localStorage.setItem('sidebarCollapsed', String(newState)); } catch { /* private browsing */ }
            }}
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
        <div className={`flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300 ${
          isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
        } overflow-x-hidden`}>
          <main className="px-4 sm:px-6 lg:px-8">
            {/* Action bar */}
            <div className="flex items-center justify-end mb-2">
              <button
                className="md:hidden mr-auto p-2 rounded-lg hover:bg-greyed-navy/10"
                onClick={toggleMobileMenu}
              >
                <Menu size={20} />
              </button>
              <div>
                <button
                  onClick={() => navigate('/teachers/lesson-planner/generate')}
                  className="inline-flex items-center bg-greyed-navy text-white px-4 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Generate New Plan
                </button>
              </div>
            </div>

            {/* Success message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-greyed-beige/30 border border-greyed-navy/20 text-greyed-black px-4 py-3 rounded-lg mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!isSubscribed && (
              <div className="bg-greyed-blue/10 border border-greyed-blue/30 text-greyed-navy px-4 py-3 rounded-lg mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">You're using the free version</p>
                    <p className="mt-1">You have created {limits.usedLessonPlans} of {limits.lessonPlans} free lesson plans. Upgrade for unlimited lesson plans.</p>
                    <button
                      onClick={() => navigate('/teachers/settings#subscription')}
                      className="mt-2 bg-greyed-navy text-white px-4 py-1 rounded text-sm hover:bg-greyed-navy/90 transition-colors"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                    placeholder="Search lesson plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none bg-white"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="relative md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="ready">Ready to teach</option>
                    <option value="taught">Taught</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lesson plans list */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-greyed-blue animate-spin" />
              </div>
            ) : filteredLessonPlans.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-greyed-navy" />
                </div>
                <h2 className="text-xl font-headline font-semibold text-black mb-2">No lesson plans found</h2>
                <p className="text-black/70 max-w-md mx-auto mb-6">
                  {searchTerm || filterClass || filterStatus 
                    ? "Try adjusting your search or filters to see more results." 
                    : "You haven't created any lesson plans yet. Generate your first lesson plan to get started."}
                </p>
                {!searchTerm && !filterClass && !filterStatus && (
                  <button 
                    onClick={() => setShowGenerateModal(true)}
                    className="inline-flex items-center bg-greyed-navy text-white px-4 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Generate Your First Lesson Plan
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-greyed-navy/5">
                        <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Topic</th>
                        <th scope="col" className="hidden md:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Class</th>
                        <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                        <th scope="col" className="hidden lg:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Duration</th>
                        <th scope="col" className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLessonPlans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-greyed-navy/5">
                          <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-black">
                            {formatDate(plan.date)}
                          </td>
                          <td className="px-2 sm:px-4 py-4">
                            <div className="font-medium text-sm text-greyed-blue hover:text-greyed-navy cursor-pointer truncate max-w-xs"
                                 onClick={() => {
                                   setGeneratedPlan({
                                     markdown: plan.md_path,
                                     meta: plan.meta
                                   });
                                 }}>
                              {plan.topic}
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-black">
                            {plan.className}
                          </td>
                          <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                plan.status === 'draft' 
                                  ? 'bg-gray-100 text-gray-800' 
                                  : plan.status === 'ready' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-greyed-blue/20 text-greyed-navy'
                              }`}>
                                {plan.status === 'draft' ? 'Draft' : plan.status === 'ready' ? 'Ready' : 'Taught'}
                              </span>
                              
                              <div className="ml-2 relative group">
                                <button className="p-1 text-greyed-blue hover:text-greyed-navy hover:bg-greyed-navy/5 rounded">
                                  <ChevronDown size={16} />
                                </button>
                                <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden hidden group-hover:block z-10 w-36">
                                  <button 
                                    onClick={() => handleUpdateStatus(plan.id, 'draft')}
                                    className={`w-full px-3 py-1.5 text-left text-sm ${plan.status === 'draft' ? 'bg-greyed-navy/5 font-medium' : 'hover:bg-greyed-navy/5'}`}
                                  >
                                    Draft
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(plan.id, 'ready')}
                                    className={`w-full px-3 py-1.5 text-left text-sm ${plan.status === 'ready' ? 'bg-greyed-navy/5 font-medium' : 'hover:bg-greyed-navy/5'}`}
                                  >
                                    Ready to teach
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(plan.id, 'taught')}
                                    className={`w-full px-3 py-1.5 text-left text-sm ${plan.status === 'taught' ? 'bg-greyed-navy/5 font-medium' : 'hover:bg-greyed-navy/5'}`}
                                  >
                                    Taught
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-black">
                            {plan.meta?.duration || 60} min
                          </td>
                          <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-1 sm:space-x-2">
                              <button
                                onClick={() => {
                                  setGeneratedPlan({
                                    markdown: plan.md_path,
                                    meta: plan.meta
                                  });
                                }}
                                className="p-1 text-greyed-blue hover:text-greyed-navy hover:bg-greyed-navy/5 rounded"
                                title="View plan"
                              >
                                <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                              <button
                                onClick={() => handleDownloadPlan(plan)}
                                className="p-1 text-greyed-blue hover:text-greyed-navy hover:bg-greyed-navy/5 rounded"
                                title="Download as markdown"
                              >
                                <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                              <button
                                onClick={() => handleDeletePlan(plan.id)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-greyed-beige/30 rounded"
                                title="Delete plan"
                              >
                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Help card */}
            <div className="bg-white rounded-xl shadow-sm p-5 mt-8">
              <div className="flex items-start">
                <div className="mr-4 bg-greyed-blue/20 p-3 rounded-full">
                  <Brain className="w-6 h-6 text-greyed-blue" />
                </div>
                <div>
                  <h3 className="font-medium text-black text-lg mb-2">AI-Powered Lesson Planning</h3>
                  <p className="text-black/70 mb-4">
                    Our AI creates comprehensive, curriculum-aligned lesson plans in seconds, freeing up your time for what matters most: teaching. Each plan includes objectives, activities, assessments, and differentiation strategies.
                  </p>
                  <button className="px-3 py-1.5 bg-greyed-navy text-white rounded text-sm hover:bg-greyed-navy/90 transition-colors inline-flex items-center">
                    <Wand2 size={14} className="mr-1" />
                    Learn About Our Approach
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      
      <Footer />
    </LandingLayout>
  );
};

export default TeacherLessonPlannerPage;