import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader, ArrowLeft, Search, PlusCircle, CreditCard as Edit2, Mail, Eye, RefreshCw, Calendar as CalendarIcon, CheckCircle, AlertTriangle, AlertCircle, X, Menu, Wand2, FileText, ChevronRight, Download, ExternalLink, Trash2, Users, CircleUser as UserCircle, Filter, School } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import FamilyUpdateForm from '../../components/families/FamilyUpdateForm';
import FamilyUpdateEditor from '../../components/families/FamilyUpdateEditor';
import FamilyUpdatePreview from '../../components/families/FamilyUpdatePreview';
import FamilyUpdateListItem from '../../components/families/FamilyUpdateListItem';
import FamilyUpdateStats from '../../components/families/FamilyUpdateStats';
import StorageBucketErrorModal from '../../components/ui/StorageBucketErrorModal';
import StudentList from '../../components/families/StudentList';
import StudentProfileView from '../../components/families/StudentProfileView';
import { fetchTeacherClasses, fetchFamilyUpdates, generateFamilyUpdate, sendFamilyUpdate, hasActiveSubscription, getTeacherLimits, createClass } from '../../lib/api/teacher-api';
import { Class } from '../../types/teacher';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { supabase } from '../../lib/supabase';

// Mock data for students in a class
const mockStudents = [
  {
    id: 's1',
    name: 'Emma Thompson',
    grade: 'A',
    parent_name: 'Sarah Thompson',
    parent_email: 'sarah.thompson@example.com',
    parent_phone: '+1234567890',
    lastUpdate: '2025-06-20T10:30:00',
    updates: [
      {
        id: 'u1',
        student_id: 's1',
        content: 'Emma has been making excellent progress in class. She\'s particularly strong in algebra and has been helping her classmates understand the concepts.',
        created_at: '2025-06-20T10:30:00',
        sent: true,
        sent_via: 'email'
      },
      {
        id: 'u2',
        student_id: 's1',
        content: 'Emma scored 95% on the recent test. Her problem-solving skills are exceptional.',
        created_at: '2025-06-10T14:20:00',
        sent: true,
        sent_via: 'whatsapp'
      }
    ]
  },
  {
    id: 's2',
    name: 'James Wilson',
    grade: 'B+',
    parent_name: 'Robert Wilson',
    parent_email: 'robert.wilson@example.com',
    parent_phone: '+1987654321',
    lastUpdate: '2025-06-15T09:15:00',
    updates: [
      {
        id: 'u3',
        student_id: 's2',
        content: 'James is showing improvement in his understanding of geometric concepts. He needs to practice more with word problems.',
        created_at: '2025-06-15T09:15:00',
        sent: true,
        sent_via: 'email'
      }
    ]
  },
  {
    id: 's3',
    name: 'Sofia Garcia',
    grade: 'A-',
    parent_name: 'Maria Garcia',
    parent_email: 'maria.garcia@example.com',
    parent_phone: '+1567891234',
    updates: []
  },
  {
    id: 's4',
    name: 'Michael Chen',
    grade: 'B',
    parent_name: 'David Chen',
    parent_email: 'david.chen@example.com',
    parent_phone: '+1456789012',
    lastUpdate: '2025-06-05T16:45:00',
    updates: [
      {
        id: 'u4',
        student_id: 's4',
        content: 'Michael needs to focus more in class. He has potential but gets distracted easily.',
        created_at: '2025-06-05T16:45:00',
        sent: true,
        sent_via: 'email'
      }
    ]
  }
];

const TeacherFamiliesPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [updates, setUpdates] = useState<any[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [limits, setLimits] = useState({
    familyUpdates: 2,
    usedFamilyUpdates: 0
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showStorageBucketError, setShowStorageBucketError] = useState(false);
  const [bucketName, setBucketName] = useState('uploads');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // State for update preview/edit modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [updateContent, setUpdateContent] = useState('');
  const [updateMode, setUpdateMode] = useState<'view' | 'edit'>('view');
  const [isUpdating, setIsUpdating] = useState(false);

  // State for active view mode (class updates vs student profiles)
  const [activeView, setActiveView] = useState<'updates' | 'students'>('updates');
  
  // State for student profile view
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isSavingStudentUpdate, setIsSavingStudentUpdate] = useState(false);
  
  useEffect(() => {
    document.title = "Family Updates | GreyEd Teachers";
    
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/auth/login');
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
        setLimits({
          familyUpdates: userLimits.familyUpdates,
          usedFamilyUpdates: userLimits.usedFamilyUpdates
        });
        
        // Fetch classes from API
        const classData = await fetchTeacherClasses(user.id);
        setClasses(classData);
        
        // If classes are available, select the first class by default
        if (classData.length > 0) {
          setSelectedClass(classData[0].id);
          
          // In a real app, fetch students for this class
          // For now, use mock data
          setStudents(mockStudents);
        }
        
        // Fetch family updates from API
        const updateData = await fetchFamilyUpdates(user.id);
        
        // Process update data to add className from class ID
        const processedUpdates = updateData.map((update: any) => {
          const relatedClass = classData.find(c => c.id === update.class_id);
          return {
            ...update,
            className: relatedClass ? relatedClass.name : 'Unknown Class',
            classId: update.class_id,
            status: update.sent ? 'sent' : 'draft',
            weekStart: update.week_start,
            weekEnd: (() => {
              const start = new Date(update.week_start);
              const end = new Date(start);
              end.setDate(end.getDate() + 6);
              return end.toISOString().split('T')[0];
            })(),
            sentDate: update.sent_date,
            openRate: `${update.open_count}/${relatedClass ? relatedClass.student_count || 0 : 0}`,
            openPercentage: relatedClass && relatedClass.student_count ? 
              Math.round((update.open_count / relatedClass.student_count) * 100) : 0,
            html_path: update.html_path
          };
        });
        
        setUpdates(processedUpdates);
      } catch {
        setError('Failed to load family updates. Please try again later.');
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };
  
  // Filter updates by search term and class
  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === '' || update.classId === selectedClass;
    return matchesSearch && matchesClass;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format week range
  const formatWeekRange = (start: string, end: string) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };
  
  // Generate and create family update
  const handleGenerateUpdate = async (formData: {
    classId: string;
    weekStart: string;
    includeProgressReport: boolean;
    includeUpcomingContent: boolean;
    includeHomework: boolean;
    includeResourceLinks: boolean;
    additionalNotes: string;
  }) => {
    if (!user) return;
    
    // Free users are allowed to send family updates but at a limited amount
    if (!isSubscribed) {
      // In a real app, check the number of updates sent this month
      const updatesThisMonth = updates.filter(update => {
        const updateDate = new Date(update.weekStart);
        const now = new Date();
        return updateDate.getMonth() === now.getMonth() &&
               updateDate.getFullYear() === now.getFullYear();
      });
      
      // If they've reached the limit (2 per month for free users)
      if (updatesThisMonth.length >= limits.familyUpdates) {
        setError(`You've reached your free limit of ${limits.familyUpdates} family updates per month. Please upgrade for unlimited updates.`);
        setShowComposeModal(false);
        return;
      }
    }
    
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Get the selected class
      const selectedClass = classes.find(c => c.id === formData.classId);
      if (!selectedClass) {
        throw new Error('Selected class not found');
      }
      
      // Generate the family update via API
      const result = await generateFamilyUpdate({
        classId: formData.classId,
        weekStart: formData.weekStart,
        topics: ['Student progress', 'Upcoming lessons', 'Homework'],
        includeHomework: formData.includeHomework,
        includeAssessments: formData.includeProgressReport
      });
      
      // Create week end date (7 days after start)
      const weekStart = new Date(formData.weekStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // Add the update to state
      const newUpdate = {
        id: result.id,
        classId: formData.classId,
        className: selectedClass.name,
        weekStart: formData.weekStart,
        weekEnd: weekEnd.toISOString().split('T')[0],
        status: 'draft',
        sentDate: null,
        openRate: `0/${selectedClass.student_count || 0}`,
        openPercentage: 0,
        html_path: result.html_path
      };
      
      setUpdates([newUpdate, ...updates]);
      setSuccess('Family update generated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      // Close the modal
      setShowComposeModal(false);
    } catch (err: any) {
      
      // Check if it's a storage bucket error
      if (err.message && err.message.includes('storage bucket does not exist')) {
        // Try to extract the bucket name from the error message
        const bucketNameMatch = err.message.match(/['"]([^'"]+)['"]/);
        if (bucketNameMatch && bucketNameMatch[1]) {
          setBucketName(bucketNameMatch[1]);
        } else {
          setBucketName('uploads');
        }
        setShowStorageBucketError(true);
      } else {
        setError(err.message || 'Failed to generate family update. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Send a draft update
  const handleSendUpdate = async (updateId: string) => {
    setIsSending(updateId);
    setError(null);
    setSuccess(null);
    
    try {
      // Send the update via API
      await sendFamilyUpdate(updateId);
      
      // Update the state
      const updatedUpdates = updates.map(update => {
        if (update.id === updateId) {
          const now = new Date();
          return {
            ...update,
            status: 'sent',
            sentDate: now.toISOString()
          };
        }
        return update;
      });
      
      setUpdates(updatedUpdates);
      setSuccess('Family update sent successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send family update. Please try again.');
    } finally {
      setIsSending(null);
    }
  };
  
  // Delete a family update
  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this family update?')) {
      return;
    }
    
    setIsDeleting(updateId);
    setError(null);
    setSuccess(null);
    
    try {
      // Delete from database
      const { error } = await supabase
        .from('family_updates')
        .delete()
        .eq('id', updateId);
      
      if (error) throw error;
      
      // Update the state
      setUpdates(updates.filter(update => update.id !== updateId));
      setSuccess('Family update deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete family update. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };
  
  // View update
  const handleViewUpdate = async (update: any) => {
    setSelectedUpdate(update);
    setUpdateMode('view');
    
    try {
      // Fetch the HTML content from the path
      // In a real app, this would fetch from storage
      // For demo, we'll create a sample HTML content
      
      // Simulating loading content
      setUpdateContent('Loading content...');
      setShowUpdateModal(true);
      
      // Simulate API call to get content
      setTimeout(() => {
        const sampleContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Weekly Update - ${update.className}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #212754; }
              h2 { color: #212754; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              .section { margin-bottom: 30px; }
              .highlight { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #bbd7eb; }
              .footer { margin-top: 40px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <h1>Weekly Class Update - ${update.className}</h1>
            <p>Week of ${formatDate(update.weekStart)} to ${formatDate(update.weekEnd)}</p>
            
            <div class="section">
              <h2>This Week's Progress</h2>
              <p>Dear Parents and Guardians,</p>
              <p>I hope this update finds you well. Here's a summary of what we've covered this week in class:</p>
              <ul>
                <li>Completed our unit on algebraic expressions</li>
                <li>Students worked on group projects applying these concepts</li>
                <li>Conducted a practice quiz on Friday with good results overall</li>
              </ul>
              <p>Most students are showing good progress, with particular strength in equation solving.</p>
            </div>
            
            <div class="section">
              <h2>Coming Up Next Week</h2>
              <p>Next week, we will be focusing on:</p>
              <ul>
                <li>Introduction to linear equations</li>
                <li>Graphing on the coordinate plane</li>
                <li>Word problem applications</li>
              </ul>
              <p class="highlight">Note: We will have a quiz on Friday covering these topics. Students should review their notes and practice problems.</p>
            </div>
            
            <div class="section">
              <h2>Homework & Assignments</h2>
              <ul>
                <li><strong>Due Monday:</strong> Worksheet on algebraic expressions (handed out Friday)</li>
                <li><strong>Due Wednesday:</strong> Online practice problems (links sent via email)</li>
                <li><strong>Due Friday:</strong> Prepare for quiz on linear equations</li>
              </ul>
            </div>
            
            <div class="section">
              <h2>Helpful Resources</h2>
              <ul>
                <li><a href="#">Khan Academy - Linear Equations</a></li>
                <li><a href="#">Class Resource Portal - Practice Problems</a></li>
                <li><a href="#">Study Guide - Unit 3</a></li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Thank you for your continued support. If you have any questions or concerns, please don't hesitate to contact me.</p>
              <p>Best regards,<br>Your Teacher</p>
            </div>
          </body>
          </html>
        `;
        
        setUpdateContent(sampleContent);
      }, 800);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load family update content. Please try again.');
      setShowUpdateModal(false);
    }
  };
  
  // Edit update
  const handleEditUpdate = (update: any) => {
    setSelectedUpdate(update);
    setUpdateMode('edit');
    
    // Fetch content for editing - same mock as for viewing
    setTimeout(() => {
      const sampleContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Weekly Update - ${update.className}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #212754; }
            h2 { color: #212754; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .section { margin-bottom: 30px; }
            .highlight { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #bbd7eb; }
            .footer { margin-top: 40px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Weekly Class Update - ${update.className}</h1>
          <p>Week of ${formatDate(update.weekStart)} to ${formatDate(update.weekEnd)}</p>
          
          <div class="section">
            <h2>This Week's Progress</h2>
            <p>Dear Parents and Guardians,</p>
            <p>I hope this update finds you well. Here's a summary of what we've covered this week in class:</p>
            <ul>
              <li>Completed our unit on algebraic expressions</li>
              <li>Students worked on group projects applying these concepts</li>
              <li>Conducted a practice quiz on Friday with good results overall</li>
            </ul>
            <p>Most students are showing good progress, with particular strength in equation solving.</p>
          </div>
          
          <div class="section">
            <h2>Coming Up Next Week</h2>
            <p>Next week, we will be focusing on:</p>
            <ul>
              <li>Introduction to linear equations</li>
              <li>Graphing on the coordinate plane</li>
              <li>Word problem applications</li>
            </ul>
            <p class="highlight">Note: We will have a quiz on Friday covering these topics. Students should review their notes and practice problems.</p>
          </div>
          
          <div class="section">
            <h2>Homework & Assignments</h2>
            <ul>
              <li><strong>Due Monday:</strong> Worksheet on algebraic expressions (handed out Friday)</li>
              <li><strong>Due Wednesday:</strong> Online practice problems (links sent via email)</li>
              <li><strong>Due Friday:</strong> Prepare for quiz on linear equations</li>
            </ul>
          </div>
          
          <div class="section">
            <h2>Helpful Resources</h2>
            <ul>
              <li><a href="#">Khan Academy - Linear Equations</a></li>
              <li><a href="#">Class Resource Portal - Practice Problems</a></li>
              <li><a href="#">Study Guide - Unit 3</a></li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Thank you for your continued support. If you have any questions or concerns, please don't hesitate to contact me.</p>
            <p>Best regards,<br>Your Teacher</p>
          </div>
        </body>
        </html>
      `;
      
      setUpdateContent(sampleContent);
    }, 800);
    
    setShowUpdateModal(true);
  };
  
  // Save edited update
  const handleSaveUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real app, you would save the updated content to storage
      // and update the database record
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the state (in real app, you'd fetch the updated data)
      setShowUpdateModal(false);
      setSuccess('Family update saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save family update. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle class selection
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    
    // In a real app, fetch students for this class
    // For now, we're using mock data
    setStudents(mockStudents);
  };
  
  // View student profile
  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setShowStudentProfile(true);
  };
  
  // Save student update
  const handleSaveStudentUpdate = async (content: string) => {
    if (!selectedStudent || !content.trim()) return;
    
    setIsSavingStudentUpdate(true);
    setError(null);
    
    try {
      // In a real app, save to database
      // For demo, we'll update the state
      
      // Create new update
      const newUpdate = {
        id: `u${Date.now()}`,
        student_id: selectedStudent.id,
        content,
        created_at: new Date().toISOString(),
        sent: false
      };
      
      // Update the student's updates array
      const updatedStudent = {
        ...selectedStudent,
        updates: [newUpdate, ...(selectedStudent.updates || [])],
        lastUpdate: new Date().toISOString()
      };
      
      // Update the students array with the updated student
      setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s));
      
      // Update the selected student
      setSelectedStudent(updatedStudent);
      
      setSuccess('Student update saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to save student update');
    } finally {
      setIsSavingStudentUpdate(false);
    }
  };
  
  // Send student update
  const handleSendStudentUpdate = async (updateId: string, method: 'email' | 'whatsapp') => {
    if (!selectedStudent) return;
    
    setIsSavingStudentUpdate(true);
    setError(null);
    
    try {
      // In a real app, send via API
      // For demo, just update the state
      
      // Find the update
      const studentUpdates = selectedStudent.updates || [];
      const updateIndex = studentUpdates.findIndex((u: any) => u.id === updateId);
      
      if (updateIndex === -1) {
        throw new Error('Update not found');
      }
      
      // Update the update object
      const updatedUpdates = [...studentUpdates];
      updatedUpdates[updateIndex] = {
        ...updatedUpdates[updateIndex],
        sent: true,
        sent_via: method
      };
      
      // Update the student
      const updatedStudent = {
        ...selectedStudent,
        updates: updatedUpdates
      };
      
      // Update the students array
      setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s));
      
      // Update selected student
      setSelectedStudent(updatedStudent);
      
      setSuccess(`Update sent successfully via ${method}!`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err: any) {
      setError(err.message || `Failed to send update via ${method}`);
    } finally {
      setIsSavingStudentUpdate(false);
    }
  };
  
  // Filter students based on search term
  const filteredStudents = studentSearchTerm
    ? students.filter(student =>
        student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        (student.parent_name && student.parent_name.toLowerCase().includes(studentSearchTerm.toLowerCase()))
      )
    : students;

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-16 bg-gradient-to-br from-premium-slate via-premium-slateLight to-premium-slateDark flex">
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
            activePage="families"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
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
        <div className={`flex-1 pt-2 pb-16 md:pb-0 transition-all duration-300 ${
          isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
        }`}>
          <main className="px-4 sm:px-6 lg:px-8 py-1">
            {/* Main header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center flex-1 min-w-0">
                <button
                  className="md:hidden mr-2 p-2 rounded-lg hover:bg-greyed-navy/10 flex-shrink-0"
                  onClick={toggleMobileMenu}
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-headline font-bold text-black">
                    Family Communications
                  </h1>
                  <p className="text-black hidden md:block">
                    Send updates to families and communicate with parents
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                  onClick={() => setShowComposeModal(true)}
                  className="inline-flex items-center bg-greyed-navy text-white px-4 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors"
                >
                  <PlusCircle size={18} className="mr-2" />
                  <span className="hidden sm:inline">Create Class Update</span>
                  <span className="sm:hidden">New Update</span>
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
                    <p className="mt-1">Free version allows {limits.familyUpdates} family updates per month. Upgrade for unlimited updates.</p>
                    <Link
                      to="/teachers/settings#subscription"
                      className="mt-2 inline-block bg-greyed-navy text-white px-4 py-1 rounded text-sm hover:bg-greyed-navy/90 transition-colors"
                    >
                      Upgrade Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            
            {/* Class selection */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <School className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none bg-white"
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name} - {cls.subject}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* View mode tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    className={`px-4 py-3 font-medium relative ${activeView === 'updates' ? 'text-greyed-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveView('updates')}
                  >
                    Class Updates
                    {activeView === 'updates' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </button>
                  <button
                    className={`px-4 py-3 font-medium relative ${activeView === 'students' ? 'text-greyed-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveView('students')}
                  >
                    Student Profiles
                    {activeView === 'students' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {activeView === 'updates' ? (
              <>
                {/* Class Updates View */}
                
                {/* Search and filters */}
                <div className="bg-white rounded-lg shadow-sm p-3 mb-5">
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                        placeholder="Search by class..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="relative w-full md:w-48">
                      <select
                        className="pl-3 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue appearance-none bg-white"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">All Classes</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Updates list */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-greyed-blue animate-spin" />
                  </div>
                ) : filteredUpdates.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-greyed-navy" />
                    </div>
                    <h2 className="text-xl font-headline font-semibold text-black mb-2">No updates found</h2>
                    <p className="text-black/70 max-w-md mx-auto mb-6">
                      {searchTerm || selectedClass 
                        ? "Try adjusting your search or filters to see more results." 
                        : "You haven't created any family updates yet."}
                    </p>
                    {!searchTerm && !selectedClass && (
                      <button 
                        onClick={() => setShowComposeModal(true)}
                        className="inline-flex items-center bg-greyed-navy text-white px-4 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors"
                      >
                        <PlusCircle size={18} className="mr-2" />
                        Create Your First Update
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUpdates.map(update => (
                      <FamilyUpdateListItem
                        key={update.id}
                        update={update}
                        onView={() => handleViewUpdate(update)}
                        onEdit={() => handleEditUpdate(update)}
                        onSend={() => handleSendUpdate(update.id)}
                        onDelete={() => handleDeleteUpdate(update.id)}
                        isSending={isSending === update.id}
                        isDeleting={isDeleting === update.id}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Student Profiles View */}
                
                {/* Student search */}
                <div className="bg-white rounded-lg shadow-sm p-3 mb-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                      placeholder="Search students by name or parent name..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Student list */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-greyed-blue animate-spin" />
                  </div>
                ) : selectedClass ? (
                  <StudentList 
                    students={filteredStudents}
                    onViewStudent={handleViewStudent}
                    searchTerm={studentSearchTerm}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCircle className="w-8 h-8 text-greyed-navy" />
                    </div>
                    <h2 className="text-xl font-headline font-semibold text-black mb-2">Select a class to view students</h2>
                    <p className="text-black/70 max-w-md mx-auto mb-6">
                      Please select a class from the dropdown above to view and manage student profiles.
                    </p>
                  </div>
                )}
              </>
            )}
            
            {/* Weekly Update Reminder */}
            <div className="mt-6 bg-greyed-blue/10 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Weekly Update Reminder</h3>
                  <div className="mt-2 text-sm text-greyed-navy">
                    <p>
                      {classes.length > 0 
                        ? `You have ${classes.length - updates.filter(u => {
                            const weekStart = new Date();
                            weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // This week's Monday
                            const updateStart = new Date(u.weekStart);
                            return updateStart.getTime() >= weekStart.getTime();
                          }).length} classes without updates for the current week.`
                        : 'You have no classes set up yet. Create classes to start sending weekly updates.'}
                    </p>
                    {classes.length > 0 && (
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {classes
                          .filter(cls => !updates.some(u => {
                            const weekStart = new Date();
                            weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // This week's Monday
                            const updateStart = new Date(u.weekStart);
                            return u.classId === cls.id && updateStart.getTime() >= weekStart.getTime();
                          }))
                          .slice(0, 3)
                          .map(cls => (
                            <li key={cls.id}>{cls.name}</li>
                          ))
                        }
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature callout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-greyed-blue">
                <h3 className="font-medium text-black text-lg mb-3">Automated Content Generation</h3>
                <p className="text-black/70 text-sm mb-4">
                  El AI automatically summarizes class progress, upcoming content, and homework assignments based on your lesson plans and assessments.
                </p>
                <button className="px-3 py-1.5 bg-greyed-navy text-white rounded text-sm hover:bg-greyed-navy/90 transition-colors inline-flex items-center">
                  <Wand2 size={14} className="mr-1" />
                  Learn More
                </button>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-greyed-beige">
                <h3 className="font-medium text-black text-lg mb-3">Engagement Analytics</h3>
                <p className="text-black/70 text-sm mb-4">
                  Track which families are engaging with your updates and identify students who might need additional support.
                </p>
                <button className="px-3 py-1.5 bg-greyed-navy text-white rounded text-sm hover:bg-greyed-navy/90 transition-colors">
                  View Sample Report
                </button>
              </div>
            </div>
            
            {/* Free tier limits */}
            {!isSubscribed && (
              <div className="mt-6 text-center text-sm text-black/60">
                <p>Free users can send {limits.familyUpdates} family updates per month.</p>
                <p>Need unlimited family updates? <Link to="/teachers/settings#subscription" className="text-greyed-blue hover:underline">Upgrade for just £8/month</Link></p>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Family Update Form Modal */}
      <FamilyUpdateForm
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSubmit={handleGenerateUpdate}
        classes={classes}
      />
      
      {/* Update Preview/Edit Modal */}
      <FamilyUpdatePreview
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        updateId={selectedUpdate?.id}
        updateData={selectedUpdate}
      />
      
      {/* Storage Bucket Error Modal */}
      <StorageBucketErrorModal
        isOpen={showStorageBucketError}
        onClose={() => setShowStorageBucketError(false)}
        bucketName={bucketName}
      />
      
      {/* Student Profile Modal */}
      {showStudentProfile && selectedStudent && (
        <StudentProfileView
          student={selectedStudent}
          onClose={() => setShowStudentProfile(false)}
          onSaveUpdate={handleSaveStudentUpdate}
          onSendUpdate={handleSendStudentUpdate}
          isSending={isSavingStudentUpdate}
        />
      )}
    </LandingLayout>
  );
};

export default TeacherFamiliesPage;