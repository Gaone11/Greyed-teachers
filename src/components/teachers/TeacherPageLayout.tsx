import React, { ReactNode, useState } from 'react';
import { X, Loader as LoaderIcon } from 'lucide-react';
import LandingLayout from '../layout/LandingLayout';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import TeacherSidebar from './TeacherSidebar';
import MobileBottomNavigation from '../dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';

type ActivePage = 'dashboard' | 'classes' | 'lesson-planner' | 'assessments' | 'families' | 'settings' | 'el-ai' | 'grey-ed-ta' | 'courses';

interface TeacherPageLayoutProps {
  children: ReactNode;
  activePage: ActivePage;
  onLogout: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  loading?: boolean;
  loadingMessage?: string;
}

const TeacherPageLayout: React.FC<TeacherPageLayoutProps> = ({
  children,
  activePage,
  onLogout,
  sidebarCollapsed,
  onToggleSidebar,
  loading = false,
  loadingMessage = 'Loading...',
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  if (loading) {
    return (
      <LandingLayout disableSnapScroll={true}>
        <NavBar sidebarCollapsed={sidebarCollapsed} />
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-surface-muted">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-primary mx-auto flex items-center justify-center shadow-sm animate-pulse">
                <LoaderIcon className="w-10 h-10 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-2xl animate-pulse"></div>
            </div>
            <p className="mt-6 text-primary font-bold text-base">{loadingMessage}</p>
            <p className="mt-2 text-text-muted text-opacity-70 text-sm">Just a moment</p>
          </div>
        </div>
        <Footer />
      </LandingLayout>
    );
  }

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar sidebarCollapsed={sidebarCollapsed} />

      <div className="min-h-screen pt-16 bg-surface-muted flex">
        {/* Mobile menu overlay */}
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}></div>
        )}

        {/* Left sidebar navigation */}
        <div className={`${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage={activePage}
            onLogout={onLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={onToggleSidebar}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />

          {/* Close button for mobile menu */}
          {showMobileMenu && isMobile && (
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-primary/50 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Main content area */}
        <div className={`flex-1 pt-0 pb-16 md:pb-0 transition-all duration-300 ${
          isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
        }`}>
          <main className="px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNavigation onMenuClick={toggleMobileMenu} />

      <Footer />
    </LandingLayout>
  );
};

export default TeacherPageLayout;
