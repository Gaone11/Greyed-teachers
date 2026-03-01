import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
// PricingPage removed — platform is free
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
import RoleSelectionModal from './components/ui/RoleSelectionModal';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import TeacherSignupModal from './components/ui/TeacherSignupModal';
import LoginModal from './components/ui/LoginModal';
import ProtectedTeacherRoute from './components/ui/ProtectedTeacherRoute';
import Loader from './components/ui/Loader';
import AdminLoginModal from './components/ui/AdminLoginModal';
import DyslexiaModeBadge from './components/accessibility/DyslexiaModeBadge';

// Checkout pages removed — platform is free

// Teacher Pages
import TeacherDashboardPage from './pages/teachers/TeacherDashboardPage';
import TeacherClassesPage from './pages/teachers/TeacherClassesPage';
import TeacherClassDetailPage from './pages/teachers/TeacherClassDetailPage';
import TeacherLessonPlannerPage from './pages/teachers/TeacherLessonPlannerPage';
import TeacherLessonPlanGeneratorPage from './pages/teachers/TeacherLessonPlanGeneratorPage';
import TeacherAssessmentGeneratorPage from './pages/teachers/TeacherAssessmentGeneratorPage';
import TeacherAssessmentsPage from './pages/teachers/TeacherAssessmentsPage';
import AssessmentGradingPage from './pages/teachers/AssessmentGradingPage';
import TeacherFamiliesPage from './pages/teachers/TeacherFamiliesPage';
import TeacherSettingsPage from './pages/teachers/TeacherSettingsPage';
import ElAIAssistantPage from './pages/teachers/ElAIAssistantPage';
import TeacherGreyEdTAPage from './pages/teachers/TeacherGreyEdTAPage';
import TeacherCoursesPage from './pages/teachers/TeacherCoursesPage';
import TeacherCourseDetailPage from './pages/teachers/TeacherCourseDetailPage';
import TeacherKnowledgeBasePage from './pages/teachers/TeacherKnowledgeBasePage';


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
              <AppContent />
            </ViewModeProvider>
          </LoadingProvider>
        </RoleSelectionProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

// Separate component to use context inside
const AppContent = () => {
  const { showTeacherSignup, closeTeacherSignup } = useRoleSelection();
  const { user } = useAuth();
  const { isLoading, setIsLoading } = useLoading();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const location = useLocation();
  
  // Add a class to the body when user is logged in to help with styling
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

  // Handle page transitions — fast, fluid, premium feel
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    // Only show transition loader when navigating between major sections
    const isTeacherNav = prevPath.current.startsWith('/teachers') && location.pathname.startsWith('/teachers');
    const isSameSection = prevPath.current === location.pathname;
    prevPath.current = location.pathname;

    if (isSameSection) return;

    // Shorter duration for in-dashboard navigation, slightly longer for cross-section
    const duration = isTeacherNav ? 250 : 400;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), duration);
    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading]);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  
  const openAdminLoginModal = () => setShowAdminLoginModal(true);
  const closeAdminLoginModal = () => setShowAdminLoginModal(false);
  
  return (
    <>
      {isLoading && <Loader fullScreen={true} />}
      <DyslexiaModeBadge />
      <Routes>
        <Route path="/" element={<LandingPage openLoginModal={openLoginModal} openAdminLoginModal={openAdminLoginModal} />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<Navigate to="/" replace />} />
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
        
        <Route path="/teachers/families" element={
          <ProtectedTeacherRoute>
            <TeacherFamiliesPage />
          </ProtectedTeacherRoute>
        } />
        
        <Route path="/teachers/settings" element={
          <ProtectedTeacherRoute>
            <TeacherSettingsPage />
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

        <Route path="/teachers/knowledgebase" element={
          <ProtectedTeacherRoute>
            <TeacherKnowledgeBasePage />
          </ProtectedTeacherRoute>
        } />

        {/* Redirect dashboard to appropriate role dashboard */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Catch-all for removed routes - redirect to home */}
        <Route path="/students/*" element={<Navigate404 />} />
        <Route path="/waitlist" element={<Navigate404 />} />
      </Routes>
      <RoleSelectionModal />
      <TeacherSignupModal 
        isOpen={showTeacherSignup} 
        onClose={closeTeacherSignup} 
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
  const { role } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    // Redirect based on role
    if (role === 'teacher') {
      navigate('/teachers/dashboard');
    } else {
      // Default to login if role is not teacher
      navigate('/auth/login');
    }
  }, [user, role, navigate]);

  return <Loader />;
};

// Component to handle removed routes
const Navigate404 = () => {
  return <Navigate to="/" replace />;
};

export default App;