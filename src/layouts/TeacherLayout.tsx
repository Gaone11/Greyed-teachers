import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import TeacherSidebar from '../components/teachers/TeacherSidebar';
import MobileBottomNavigation from '../components/dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface TeacherLayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'classes' | 'lesson-planner' | 'assessments' | 'families' | 'settings' | 'el-ai' | 'grey-ed-ta';
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children, activePage }) => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (showMobileMenu && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu, isMobile]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  if (authLoading || (authLoading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-greyed-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-greyed-white">
      {/* Left sidebar navigation - Fixed position */}
      <div className={`fixed top-0 left-0 bottom-0 z-50 transition-all duration-300 ${
        isMobile
          ? `${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} w-72`
          : (sidebarCollapsed ? 'w-16' : 'w-64')
      }`}>
        <TeacherSidebar
          activePage={activePage}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
          isOpen={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      </div>

      {/* Mobile menu overlay */}
      {showMobileMenu && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowMobileMenu(false)}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Main content area with proper left margin */}
      <div className={`min-h-screen transition-all duration-300 ${
        isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
      }`}>
        <main className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNavigation onMenuClick={toggleMobileMenu} />
    </div>
  );
};

export default TeacherLayout;
