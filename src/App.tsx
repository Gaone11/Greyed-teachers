import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { RoleSelectionProvider, useRoleSelection } from './context/RoleSelectionContext';
import { ViewModeProvider } from './context/ViewModeContext';
import { LoadingProvider } from './context/LoadingContext';
import RoleSelectionModal from './components/ui/RoleSelectionModal';
import TeacherSignupModal from './components/ui/TeacherSignupModal';
import LoginModal from './components/ui/LoginModal';
import ProtectedTeacherRoute from './components/ui/ProtectedTeacherRoute';
import Loader from './components/ui/Loader';
import AdminLoginModal from './components/ui/AdminLoginModal';
import DyslexiaModeBadge from './components/accessibility/DyslexiaModeBadge';

// --- Lazy-loaded pages ---
// Public pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const TutoringPage = lazy(() => import('./pages/TutoringPage'));
const ELLMPage = lazy(() => import('./pages/ELLMPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));

// Auth pages
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const UpdatePasswordPage = lazy(() => import('./pages/auth/UpdatePasswordPage'));
const PersonalityTestRedirectPage = lazy(() => import('./pages/auth/PersonalityTestRedirectPage'));
const PersonalityAssessmentPage = lazy(() => import('./pages/auth/PersonalityAssessmentPage'));
const ActivateAccountPage = lazy(() => import('./pages/auth/ActivateAccountPage'));

// Checkout pages
const SuccessPage = lazy(() => import('./pages/checkout/SuccessPage'));
const CanceledPage = lazy(() => import('./pages/checkout/CanceledPage'));

// Teacher pages
const TeacherDashboardPage = lazy(() => import('./pages/teachers/TeacherDashboardPage'));
const TeacherClassesPage = lazy(() => import('./pages/teachers/TeacherClassesPage'));
const TeacherClassDetailPage = lazy(() => import('./pages/teachers/TeacherClassDetailPage'));
const TeacherLessonPlannerPage = lazy(() => import('./pages/teachers/TeacherLessonPlannerPage'));
const TeacherLessonPlanGeneratorPage = lazy(() => import('./pages/teachers/TeacherLessonPlanGeneratorPage'));
const TeacherAssessmentGeneratorPage = lazy(() => import('./pages/teachers/TeacherAssessmentGeneratorPage'));
const TeacherAssessmentsPage = lazy(() => import('./pages/teachers/TeacherAssessmentsPage'));
const AssessmentGradingPage = lazy(() => import('./pages/teachers/AssessmentGradingPage'));
const TeacherFamiliesPage = lazy(() => import('./pages/teachers/TeacherFamiliesPage'));
const TeacherSettingsPage = lazy(() => import('./pages/teachers/TeacherSettingsPage'));
const ElAIAssistantPage = lazy(() => import('./pages/teachers/ElAIAssistantPage'));
const TeacherGreyEdTAPage = lazy(() => import('./pages/teachers/TeacherGreyEdTAPage'));
const TeacherCoursesPage = lazy(() => import('./pages/teachers/TeacherCoursesPage'));
const TeacherCourseDetailPage = lazy(() => import('./pages/teachers/TeacherCourseDetailPage'));


function App() {
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

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

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const openAdminLoginModal = () => setShowAdminLoginModal(true);
  const closeAdminLoginModal = () => setShowAdminLoginModal(false);

  return (
    <>
      <DyslexiaModeBadge />
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage openLoginModal={openLoginModal} openAdminLoginModal={openAdminLoginModal} />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/tutoring" element={<TutoringPage />} />
          <Route path="/ellm" element={<ELLMPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
          <Route path="/auth/personality-test" element={<PersonalityTestRedirectPage />} />
          <Route path="/auth/personality-assessment/*" element={<PersonalityAssessmentPage />} />
          <Route path="/auth/activate-account" element={<ActivateAccountPage />} />

          {/* Checkout Routes */}
          <Route path="/checkout/success" element={<SuccessPage />} />
          <Route path="/checkout/canceled" element={<CanceledPage />} />

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

          {/* Redirect dashboard to appropriate role dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Catch-all for removed routes */}
          <Route path="/students/*" element={<Navigate to="/" replace />} />
          <Route path="/waitlist" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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
      navigate('/');
      return;
    }

    if (role === 'teacher') {
      navigate('/teachers/dashboard');
    } else {
      navigate('/');
    }
  }, [user, role, navigate]);

  return <Loader />;
};

// Protects admin routes — redirects unauthenticated users to admin login
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default App;
