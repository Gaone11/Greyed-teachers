import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader, Search, Filter, PlusCircle, AlertCircle, Wand2, Edit2, FileText, X, Eye, Download, RefreshCw, Upload, Brain } from 'lucide-react';
import TeacherPageLayout from '../../components/teachers/TeacherPageLayout';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import ClassForm from '../../components/teachers/ClassForm';
import AssessmentViewModal from '../../components/teachers/AssessmentViewModal';
import { fetchAssessments, fetchTeacherClasses, generateAssessment, hasActiveSubscription, getTeacherLimits, createClass } from '../../lib/api/teacher-api';
import { Class } from '../../types/teacher';

// Map of syllabus to required tests
const syllabusRequiredTests: Record<string, string[]> = {
  'Cambridge IGCSE': [
    'End of Unit Test',
    'Mid-Term Assessment',
    'Mock Examination',
    'Practical Assessment',
    'Final Examination'
  ],
  'Cambridge A Level': [
    'AS Level Test',
    'A2 Level Test',
    'Practical Assessment',
    'Mock Examination',
    'Final Examination'
  ],
  'Botswana BGCSE': [
    'Continuous Assessment',
    'Term Test',
    'BGCSE Mock Examination',
    'Final Examination'
  ],
  'Botswana JSE': [
    'Monthly Test',
    'Term Assessment',
    'Project Evaluation',
    'Mock Examination',
    'Final Examination'
  ]
};

const TeacherAssessmentsPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [limits, setLimits] = useState({
    lessonPlans: 5,
    assessments: 5,
    usedAssessments: 0
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [requiredTestsForSyllabus, setRequiredTestsForSyllabus] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form data for creating assessment
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

        // Get limits
        const userLimits = await getTeacherLimits(user.id);
        setLimits(userLimits);

        // Fetch assessments from API
        const assessmentData = await fetchAssessments(user.id);
        setAssessments(assessmentData);

        // Fetch classes from API
        const classData = await fetchTeacherClasses(user.id);
        setClasses(classData);

        // If there's at least one class, pre-select it for the form
        if (classData.length > 0) {
          const firstClass = classData[0];
          setFormData(prev => ({
            ...prev,
            classId: firstClass.id
          }));

          // Set required tests for the first class's syllabus if available
          if (firstClass.syllabus && syllabusRequiredTests[firstClass.syllabus]) {
            setRequiredTestsForSyllabus(syllabusRequiredTests[firstClass.syllabus]);
          } else {
            setRequiredTestsForSyllabus([]);
          }
        }
      } catch {
        setError('Failed to load assessments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }

    // Load sidebar collapsed state from localStorage
    try {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed');
      if (savedCollapsed === 'true') {
        setSidebarCollapsed(true);
      }
    } catch {
      // localStorage unavailable (private browsing)
    }
  }, [user, authLoading, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    try {
      localStorage.setItem('sidebarCollapsed', String(newState));
    } catch {
      /* private browsing */
    }
  };

  // Filter assessments by search term and status
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assessment.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || assessment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // If classId is 'new_class', show the class creation modal
    if (name === 'classId' && value === 'new_class') {
      setShowCreateClassModal(true);
      return;
    }

    if (name === 'classId') {
      // Find the selected class to get its syllabus
      const selectedClass = classes.find(cls => cls.id === value);
      if (selectedClass && selectedClass.syllabus && syllabusRequiredTests[selectedClass.syllabus]) {
        // Update required tests based on the class's syllabus
        setRequiredTestsForSyllabus(syllabusRequiredTests[selectedClass.syllabus]);
      } else {
        // Reset if no syllabus or no tests for this syllabus
        setRequiredTestsForSyllabus([]);
      }

      // Reset the selected required test when changing class
      setFormData(prev => ({
        ...prev,
        [name]: value,
        requiredTest: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Create assessment
  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Clear previous errors
    setFormErrors({});

    // Validate form
    if (!formData.title) {
      setFormErrors(prev => ({ ...prev, title: 'Please enter an assessment title' }));
      return;
    }

    if (!formData.classId) {
      setFormErrors(prev => ({ ...prev, classId: 'Please select a class' }));
      return;
    }

    // Check if the user is not subscribed and has no remaining assessments
    if (!isSubscribed && limits.assessments <= limits.usedAssessments) {
      setError("You've reached your limit of free assessments. Please upgrade to continue.");
      setShowCreateModal(false);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate the assessment via API
      const result = await generateAssessment({
        title: formData.title,
        classId: formData.classId,
        assessmentType: formData.assessmentType,
        difficulty: formData.difficulty,
        questionCount: parseInt(formData.questionCount),
        includeAnswerKey: formData.includeAnswerKey,
        topic: formData.topic,
        requiredTest: formData.requiredTest // Add the required test to the API call
      });

      // Add the assessment to state
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

      // Reset form and close modal
      setFormData({
        title: '',
        classId: '',
        assessmentType: 'quiz',
        difficulty: 'medium',
        questionCount: '5',
        includeAnswerKey: true,
        topic: '',
        requiredTest: ''
      });
      setShowCreateModal(false);

      // Set selected assessment to view the new assessment
      setSelectedAssessment(newAssessment);
      setSelectedQuestions(result.questions);
      setShowViewModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle creating a new class
  const handleCreateClass = async (classData: {
    name: string;
    subject: string;
    grade: string;
    description: string;
  }) => {
    if (!user) return;

    try {
      setError(null);

      // Create the class via API
      const newClass = await createClass({
        teacher_id: user.id,
        name: classData.name,
        subject: classData.subject,
        grade: classData.grade,
        description: classData.description
      });

      // Add the new class to state
      setClasses(prevClasses => [...prevClasses, newClass]);

      // Select the new class in the form
      setFormData(prev => ({
        ...prev,
        classId: newClass.id
      }));

      // Close the modal
      setShowCreateClassModal(false);

      return newClass;
    } catch (err: any) {
      throw err; // Re-throw to be handled by the form component
    }
  };

  // View assessment details
  const handleViewAssessment = async (assessment: any) => {
    try {
      setLoading(true);

      // In a real app, we would fetch assessment details from the API
      // Simulating an API call to get assessment questions
      // Replace this with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set up questions for this assessment
      // This is normally where you'd fetch from the database
      const mockQuestions = generateMockQuestions(assessment.questionCount, assessment.title);

      // Set the selected assessment and questions
      setSelectedAssessment(assessment);
      setSelectedQuestions(mockQuestions);

      // Open the view modal
      setShowViewModal(true);
    } catch {
      setError('Failed to load assessment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock questions for demo purposes
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
        question.options = [
          'The first option related to the topic',
          'The second option that might be correct',
          'The third option with different wording',
          'The fourth option that could distract'
        ];
        question.answer = question.options[1]; // Second option is correct
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

  // Save assessment changes
  const handleSaveAssessment = async (updatedAssessment: any, updatedQuestions: any[]) => {
    try {
      // In a real app, we would save the assessment to the API
      // Simulating an API call to save assessment
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update the assessment in state
      setAssessments(assessments.map(a =>
        a.id === updatedAssessment.id ? {...a, ...updatedAssessment} : a
      ));

      // Update the selected assessment
      setSelectedAssessment({...selectedAssessment, ...updatedAssessment});
      setSelectedQuestions(updatedQuestions);

      return true;
    } catch {
      throw new Error('Failed to save assessment. Please try again.');
    }
  };

  // Create assessment modal
  const CreateAssessmentModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-headline font-bold">Create Assessment</h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-500 touch-target"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreateAssessment} className="p-5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Title</label>
              <input
                type="text"
                name="title"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary touch-target"
                placeholder="e.g. End of Unit Physics Test"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              {formErrors.title && <p className="mt-1 text-xs text-error">{formErrors.title}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <div className="relative">
                <select
                  name="classId"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10 touch-target"
                  value={formData.classId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.subject})
                    </option>
                  ))}
                  <option value="new_class" className="font-medium text-primary">
                    + Create New Class
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.classId && <p className="mt-1 text-xs text-error">{formErrors.classId}</p>}
              {formData.classId === 'new_class' && (
                <button
                  type="button"
                  className="mt-2 inline-flex items-center text-sm text-primary hover:text-primary"
                  onClick={() => setShowCreateClassModal(true)}
                >
                  <PlusCircle size={14} className="mr-1" />
                  Create New Class
                </button>
              )}
            </div>

            {/* Required Test dropdown - only show if there are required tests for the selected class's syllabus */}
            {requiredTestsForSyllabus.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Test (from syllabus)</label>
                <select
                  name="requiredTest"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none touch-target"
                  value={formData.requiredTest}
                  onChange={handleInputChange}
                >
                  <option value="">Select a required test...</option>
                  {requiredTestsForSyllabus.map((test) => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Type</label>
                <select
                  name="assessmentType"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none touch-target"
                  value={formData.assessmentType}
                  onChange={handleInputChange}
                >
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="exam">Exam</option>
                  <option value="homework">Homework</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none touch-target"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed Levels</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
              <select
                name="questionCount"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none touch-target"
                value={formData.questionCount}
                onChange={handleInputChange}
              >
                <option value="5">5 questions</option>
                <option value="10">10 questions</option>
                <option value="15">15 questions</option>
                <option value="20">20 questions</option>
                <option value="25">25 questions</option>
                <option value="30">30 questions</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic/Content Area</label>
              <textarea
                name="topic"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary touch-target"
                rows={3}
                placeholder="Describe what topics this assessment should cover..."
                value={formData.topic}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="includeAnswerKey"
                  checked={formData.includeAnswerKey}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-gray-700">Include answer key and grading rubric</span>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 touch-target"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center touch-target ${
                  isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader size={14} className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={14} className="mr-2" />
                    Generate Assessment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <TeacherPageLayout
      activePage="assessments"
      onLogout={handleLogout}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
      loading={authLoading || (loading && !!user)}
      loadingMessage="Loading your assessments..."
    >
      <PageHeader
        title="Assessments"
        subtitle="Create, manage, and grade assessments."
        actions={
          <>
            <Link
              to="/teachers/assessment-grading"
              className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Upload size={16} className="mr-2" />
              <span className="hidden md:inline">AI Auto-Grading</span>
              <span className="md:hidden">Auto-Grade</span>
            </Link>

            <button
              onClick={() => navigate('/teachers/assessments/generate')}
              className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              <span className="hidden md:inline">Create Assessment</span>
              <span className="md:hidden">Create</span>
            </button>
          </>
        }
      />

      {error && (
        <div className="bg-accent/20 border border-primary/20 text-text px-4 py-3 rounded-lg mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!isSubscribed && (
        <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">You're using the free version</p>
              <p className="mt-1">You have {limits.assessments - limits.usedAssessments} free assessments remaining this month. Upgrade for unlimited assessments.</p>
              <Link
                to="/teachers/settings#subscription"
                className="mt-2 inline-block bg-primary text-white px-4 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      )}


      {/* Search and filters */}
      <Card padding="sm" className="mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 p-1">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assessments list */}
      {filteredAssessments.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No assessments found"
            description={
              searchTerm || filterStatus
                ? "Try adjusting your search or filters to see more results."
                : "You haven't created any assessments yet. Create your first assessment to get started."
            }
            action={
              !searchTerm && !filterStatus ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create Your First Assessment
                </button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <Card padding="none" variant="elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-primary/5">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Assessment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Class</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Submissions</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Avg. Score</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-primary/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-text hover:text-primary cursor-pointer" onClick={() => handleViewAssessment(assessment)}>
                        {assessment.title}
                      </div>
                      <div className="text-xs text-text-muted">{assessment.questionCount} questions</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text">
                      {assessment.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text">
                      {formatDate(assessment.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={assessment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text">
                      {assessment.submissionRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text">
                      {assessment.averageScore !== null ? `${assessment.averageScore}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-primary hover:text-primary p-1 rounded hover:bg-primary/5 transition-colors"
                          onClick={() => handleViewAssessment(assessment)}
                          title="View assessment"
                        >
                          <Eye size={18} />
                        </button>

                        {assessment.status === 'draft' && (
                          <button
                            className="text-primary hover:text-primary p-1 rounded hover:bg-primary/5 transition-colors"
                            onClick={() => handleViewAssessment(assessment)}
                            title="Edit assessment"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}

                        <button
                          className="text-primary hover:text-primary p-1 rounded hover:bg-primary/5 transition-colors"
                          onClick={() => handleViewAssessment(assessment)}
                          title="Download assessment"
                        >
                          <Download size={18} />
                        </button>

                        {assessment.status === 'completed' && (
                          <button
                            className="text-primary hover:text-primary p-1 rounded hover:bg-primary/5 transition-colors"
                            onClick={() => handleViewAssessment(assessment)}
                            title="View results"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Feature callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-l-4 border-primary relative overflow-hidden">
          {!isSubscribed && (
            <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-xs font-medium rounded-bl-md">
              Premium
            </div>
          )}
          <div className="flex items-start">
            <div className="mr-4 bg-primary/10 p-3 rounded-full">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-text text-lg mb-3">AI Auto-Grading</h3>
              <p className="text-text-muted text-sm mb-4">
                Save hours of marking time with our intelligent auto-grading system. Works with multiple choice, short answer, and even long-form responses.
              </p>
              <Link to="/teachers/assessment-grading" className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors inline-flex items-center">
                <Upload size={14} className="mr-1" />
                Grade Assessments
              </Link>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-accent">
          <h3 className="font-medium text-text text-lg mb-3">Student Performance Insights</h3>
          <p className="text-text-muted text-sm mb-4">
            Get detailed analytics on student performance, identify knowledge gaps, and automatically generate targeted intervention materials.
          </p>
          <Link to="/teachers/assessment-grading" className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors">
            View Sample Report
          </Link>
        </Card>
      </div>

      {/* Usage limit info */}
      {!isSubscribed && (
        <div className="mt-8 text-center text-sm text-text-muted">
          <p>You have {limits.assessments - limits.usedAssessments} out of 5 free assessments remaining this month.</p>
          <p>Need unlimited assessments? <Link to="/teachers/settings#subscription" className="text-primary hover:underline">Upgrade your plan</Link></p>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showCreateModal && <CreateAssessmentModal />}

      {/* Create Class Modal */}
      <ClassForm
        isOpen={showCreateClassModal}
        onClose={() => setShowCreateClassModal(false)}
        onSubmit={handleCreateClass}
      />

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
    </TeacherPageLayout>
  );
};

export default TeacherAssessmentsPage;
