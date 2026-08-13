import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import TutoringPage from './pages/TutoringPage';
import ELLMPage from './pages/ELLMPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminKnowledgeBasePage from './pages/admin/AdminKnowledgeBasePage';
import ProtectedAdminRoute from './components/ui/ProtectedAdminRoute';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage';
import PersonalityTestRedirectPage from './pages/auth/PersonalityTestRedirectPage';
import PersonalityAssessmentPage from './pages/auth/PersonalityAssessmentPage';
// ActivateAccountPage removed — no subscription activation needed
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { RoleSelectionProvider, useRoleSelection } from './context/RoleSelectionContext';
import { ViewModeProvider } from './context/ViewModeContext';
import { WorkflowDemoProvider } from './context/WorkflowDemoContext';
import RoleSelectionModal from './components/ui/RoleSelectionModal';
import { LoadingProvider } from './context/LoadingContext';
import TeacherSignupModal from './components/ui/TeacherSignupModal';
import LoginModal from './components/ui/LoginModal';
import ProtectedTeacherRoute from './components/ui/ProtectedTeacherRoute';
import AdminLoginModal from './components/ui/AdminLoginModal';
import DyslexiaModeBadge from './components/accessibility/DyslexiaModeBadge';
import ProtectedStudentRoute from './components/ui/ProtectedStudentRoute';
import ProtectedParentRoute from './components/ui/ProtectedParentRoute';
import StudentDashboardPage from './pages/students/StudentDashboardPage';
import StudentKnowledgeGalaxyPage from './pages/students/StudentKnowledgeGalaxyPage';
import SmartTimetablePage from './pages/students/SmartTimetablePage';
import AssignmentsPage from './pages/students/AssignmentsPage';
import GradesProgressPage from './pages/students/GradesProgressPage';
import CommunicationCenterPage from './pages/students/CommunicationCenterPage';
import LearningGoalsPage from './pages/students/LearningGoalsPage';
import AIStudyAssistantPage from './pages/students/AIStudyAssistantPage';
import ExamsAssessmentsPage from './pages/students/ExamsAssessmentsPage';
import AchievementsPage from './pages/students/AchievementsPage';
import StudentSettingsPage from './pages/students/StudentSettingsPage';
// Parent Pages
import ParentDashboardPage from './pages/parents/ParentDashboardPage';
import ParentCommunicationPage from './pages/parents/ParentCommunicationPage';
import ParentTimetablePage from './pages/parents/ParentTimetablePage';
import ParentNotificationsPage from './pages/parents/ParentNotificationsPage';
import ConnectionsPage from './pages/connections/ConnectionsPage';
import Loader from './components/ui/Loader';

// Checkout pages removed — platform is free

// Teacher Pages
import TeacherDashboardPage from './pages/teachers/TeacherDashboardPage';
import TeacherClassesPage from './pages/teachers/TeacherClassesPage';
import TeacherClassDetailPage from './pages/teachers/TeacherClassDetailPage';
import TeacherKnowledgebasePage from './pages/teachers/TeacherKnowledgebasePage';
import TeacherStudentsPage from './pages/teachers/TeacherStudentsPage';
import TeacherAssignmentsPage from './pages/teachers/TeacherAssignmentsPage';
import TeacherCommunicationPage from './pages/teachers/TeacherCommunicationPage';
import TeacherAnalyticsPage from './pages/teachers/TeacherAnalyticsPage';
import TeacherTimetablePage from './pages/teachers/TeacherTimetablePage';
import TeacherLessonPlannerPage from './pages/teachers/TeacherLessonPlannerPage';
import TeacherLessonPlanGeneratorPage from './pages/teachers/TeacherLessonPlanGeneratorPage';
import TeacherAssessmentGeneratorPage from './pages/teachers/TeacherAssessmentGeneratorPage';
import TeacherAssessmentsPage from './pages/teachers/TeacherAssessmentsPage';
import AssessmentGradingPage from './pages/teachers/AssessmentGradingPage';
import TeacherTutorsPage from './pages/teachers/TeacherTutorsPage';
import TeacherSettingsPage from './pages/teachers/TeacherSettingsPage';
import ElAIAssistantPage from './pages/teachers/ElAIAssistantPage';
import TeacherGreyEdTAPage from './pages/teachers/TeacherGreyEdTAPage';
import TeacherCoursesPage from './pages/teachers/TeacherCoursesPage';
import TeacherCourseDetailPage from './pages/teachers/TeacherCourseDetailPage';
import KnowledgeGalaxyPage from './pages/teachers/KnowledgeGalaxyPage';


function App() {
  const location = useLocation();
  
  // Analytics tracking
  useEffect(() => {
    // Simple analytics tracking - would be replaced with actual analytics
    
    // Track features page view (once per session)
    if (location.pathname === '/features' && !sessionStorage.getItem('features_viewed')) {
      sessionStorage.setItem('features_viewed', 'true');
    }
    
    // Track tutoring page view
    if (location.pathname === '/tutoring' && !sessionStorage.getItem('tutoring_viewed')) {
      sessionStorage.setItem('tutoring_viewed', 'true');
    }
    
    // Track ellm page view
    if (location.pathname === '/ellm' && !sessionStorage.getItem('ellm_viewed')) {
      sessionStorage.setItem('ellm_viewed', 'true');
    }
    
    // Track about page view
    if (location.pathname === '/about' && !sessionStorage.getItem('about_viewed')) {
      sessionStorage.setItem('about_viewed', 'true');
    }
    
    // Track contact page view
    if (location.pathname === '/contact' && !sessionStorage.getItem('contact_viewed')) {
      sessionStorage.setItem('contact_viewed', 'true');
    }
    
    // Track admin login page view
    if (location.pathname === '/admin/login' && !sessionStorage.getItem('admin_login_viewed')) {
      sessionStorage.setItem('admin_login_viewed', 'true');
    }
    
    // Track admin dashboard view
    if (location.pathname === '/admin/dashboard' && !sessionStorage.getItem('admin_dashboard_viewed')) {
      sessionStorage.setItem('admin_dashboard_viewed', 'true');
    }
    
    // Track auth pages
    if (location.pathname === '/auth/login' && !sessionStorage.getItem('login_viewed')) {
      sessionStorage.setItem('login_viewed', 'true');
    }
    
    if (location.pathname === '/auth/signup' && !sessionStorage.getItem('signup_viewed')) {
      sessionStorage.setItem('signup_viewed', 'true');
    }
    
    // Track forgot password page
    if (location.pathname === '/auth/forgot-password' && !sessionStorage.getItem('forgot_password_viewed')) {
      sessionStorage.setItem('forgot_password_viewed', 'true');
    }
    
    // Track update password page
    if (location.pathname === '/auth/update-password' && !sessionStorage.getItem('update_password_viewed')) {
      sessionStorage.setItem('update_password_viewed', 'true');
    }
    
    // Track teacher pages
    if (location.pathname.startsWith('/teachers') && !sessionStorage.getItem('teachers_viewed')) {
      sessionStorage.setItem('teachers_viewed', 'true');
    }
    

    // Track El AI Assistant page
    if (location.pathname === '/teachers/el-ai' && !sessionStorage.getItem('el_ai_viewed')) {
      sessionStorage.setItem('el_ai_viewed', 'true');
    }
    
  }, [location]);

  return (
    <AuthProvider>
      <RoleProvider>
        <RoleSelectionProvider>
          <LoadingProvider>
            <ViewModeProvider>
              <WorkflowDemoProvider>
                <AppContent />
              </WorkflowDemoProvider>
            </ViewModeProvider>
          </LoadingProvider>
        </RoleSelectionProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

// Separate component to use context inside
const AppContent = () => {
  const { showSignupModal, closeSignupModal, showLoginModal, closeLoginModal, openLoginModal } = useRoleSelection();
  const { user } = useAuth();
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      document.body.classList.add('auth-user-logged-in');
    } else {
      document.body.classList.remove('auth-user-logged-in');
    }

    return () => {
      document.body.classList.remove('auth-user-logged-in');
    };
  }, [user]);

  const openAdminLoginModal = () => setShowAdminLoginModal(true);
  const closeAdminLoginModal = () => setShowAdminLoginModal(false);
  
  return (
    <>
      <DyslexiaModeBadge />
      <Routes>
        <Route path="/" element={<LandingPage openLoginModal={openLoginModal} openAdminLoginModal={openAdminLoginModal} />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage openAdminLoginModal={openAdminLoginModal} />} />
        <Route path="/tutoring" element={<TutoringPage />} />
        <Route path="/ellm" element={<ELLMPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/knowledge-base" element={<ProtectedAdminRoute><AdminKnowledgeBasePage /></ProtectedAdminRoute>} />
        <Route path="/auth/login" element={<Navigate to="/" replace />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
        <Route path="/auth/personality-test" element={<PersonalityTestRedirectPage />} />
        <Route path="/auth/personality-assessment/*" element={<PersonalityAssessmentPage />} />
        <Route path="/auth/activate-account" element={<Navigate to="/teachers/dashboard" replace />} />
        
        {/* Checkout routes redirect — platform is free */}
        <Route path="/checkout/success" element={<Navigate to="/teachers/dashboard" replace />} />
        <Route path="/checkout/canceled" element={<Navigate to="/teachers/dashboard" replace />} />
        
        {/* Teacher Routes - Protected with subscription check */}
        <Route path="/teachers/dashboard" element={
          <ProtectedTeacherRoute>
            <TeacherDashboardPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/classes" element={
          <ProtectedTeacherRoute>
            <TeacherClassesPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/classes/:classId" element={
          <ProtectedTeacherRoute>
            <TeacherClassDetailPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/lesson-planner" element={
          <ProtectedTeacherRoute>
            <TeacherLessonPlannerPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/lesson-planner/generate" element={
          <ProtectedTeacherRoute>
            <TeacherLessonPlanGeneratorPage />
          </ProtectedTeacherRoute>
        } />

        <Route path="/teachers/assessments/generate" element={
          <ProtectedTeacherRoute>
            <TeacherAssessmentGeneratorPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/assessments" element={
          <ProtectedTeacherRoute>
            <TeacherAssessmentsPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/assessment-grading" element={
          <ProtectedTeacherRoute>
            <AssessmentGradingPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/tutors" element={
          <ProtectedTeacherRoute>
            <TeacherTutorsPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/settings" element={
          <ProtectedTeacherRoute>
            <TeacherSettingsPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/students" element={
          <ProtectedTeacherRoute>
            <TeacherStudentsPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/assignments" element={
          <ProtectedTeacherRoute>
            <TeacherAssignmentsPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/messages" element={
          <ProtectedTeacherRoute>
            <TeacherCommunicationPage />
          </ProtectedTeacherRoute>
        } />

        <Route path="/teachers/connections" element={
          <ProtectedTeacherRoute>
            <ConnectionsPage role="teacher" />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/analytics" element={
          <ProtectedTeacherRoute>
            <TeacherAnalyticsPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/timetable" element={
          <ProtectedTeacherRoute>
            <TeacherTimetablePage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/el-ai" element={
          <ProtectedTeacherRoute>
            <ElAIAssistantPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/grey-ed-ta" element={
          <ProtectedTeacherRoute>
            <TeacherGreyEdTAPage />
          </ProtectedTeacherRoute>
        } />

        <Route path="/teachers/courses" element={
          <ProtectedTeacherRoute>
            <TeacherCoursesPage />
          </ProtectedTeacherRoute>
        } />

        <Route path="/teachers/courses/:courseId" element={
          <ProtectedTeacherRoute>
            <TeacherCourseDetailPage />
          </ProtectedTeacherRoute>
        } />

        <Route path="/teachers/knowledge" element={
          <ProtectedTeacherRoute>
            <KnowledgeGalaxyPage />
          </ProtectedTeacherRoute>
        } />

        {/* Redirect dashboard to appropriate role dashboard */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Student Routes */}
        <Route path="/students/dashboard" element={
          <ProtectedStudentRoute>
            <StudentDashboardPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/timetable" element={
          <ProtectedStudentRoute>
            <SmartTimetablePage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/assignments" element={
          <ProtectedStudentRoute>
            <AssignmentsPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/grades" element={
          <ProtectedStudentRoute>
            <GradesProgressPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/messages" element={
          <ProtectedStudentRoute>
            <CommunicationCenterPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/connections" element={
          <ProtectedStudentRoute>
            <ConnectionsPage role="student" />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/goals" element={
          <ProtectedStudentRoute>
            <LearningGoalsPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/knowledge" element={
          <ProtectedStudentRoute>
            <StudentKnowledgeGalaxyPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/ai-assistant" element={
          <ProtectedStudentRoute>
            <AIStudyAssistantPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/exams" element={
          <ProtectedStudentRoute>
            <ExamsAssessmentsPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/achievements" element={
          <ProtectedStudentRoute>
            <AchievementsPage />
          </ProtectedStudentRoute>
        } />
        <Route path="/students/settings" element={
          <ProtectedStudentRoute>
            <StudentSettingsPage />
          </ProtectedStudentRoute>
        } />

        {/* Parent Routes */}
        <Route path="/parents/dashboard" element={
          <ProtectedParentRoute>
            <ParentDashboardPage />
          </ProtectedParentRoute>
        } />
        <Route path="/parents/communication" element={
          <ProtectedParentRoute>
            <ParentCommunicationPage />
          </ProtectedParentRoute>
        } />
        <Route path="/parents/connections" element={
          <ProtectedParentRoute>
            <ConnectionsPage role="parent" />
          </ProtectedParentRoute>
        } />
        <Route path="/parents/timetable" element={
          <ProtectedParentRoute>
            <ParentTimetablePage />
          </ProtectedParentRoute>
        } />
        <Route path="/parents/notifications" element={
          <ProtectedParentRoute>
            <ParentNotificationsPage />
          </ProtectedParentRoute>
        } />

        {/* Catch-all for removed routes - redirect to home */}
        <Route path="/waitlist" element={<Navigate404 />} />
      </Routes>
      <RoleSelectionModal />
      <TeacherSignupModal 
        isOpen={showSignupModal} 
        onClose={closeSignupModal} 
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
      />
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={closeAdminLoginModal}
      />
    </>
  );
};

// Component to redirect to appropriate dashboard based on role
const DashboardRedirect = () => {
  const { user } = useAuth();
  const { role, isLoading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait until role finishes loading

    if (!user) {
      navigate('/auth/login');
      return;
    }

    // Redirect based on role
    if (role === 'teacher') {
      navigate('/teachers/dashboard');
    } else if (role === 'student') {
      navigate('/students/dashboard');
    } else if (role === 'parent') {
      navigate('/parents/dashboard');
    } else {
      // Default to login if role is not recognized
      navigate('/auth/login');
    }
  }, [user, role, isLoading, navigate]);

  return <Loader />;
};

// Component to handle removed routes
const Navigate404 = () => {
  return <Navigate to="/" replace />;
};

export default App;
