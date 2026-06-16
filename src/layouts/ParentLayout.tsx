import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import ParentSidebar from '../components/parents/ParentSidebar';
import MobileBottomNavigation from '../components/dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ParentLayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'communication' | 'timetable' | 'notifications' | 'settings';
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children, activePage }) => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('parentSidebarCollapsed') === 'true');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

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

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('parentSidebarCollapsed', String(newState));
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-greyed-black">
      {/* Sidebar Navigation */}
      <div 
        className={`fixed top-0 left-0 bottom-0 z-50 transition-all duration-300
        ${isMobile ? `${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} w-72` : (sidebarCollapsed ? 'w-20' : 'w-64')}
        shadow-lg border-r border-greyed-navy/5`}
        style={{ willChange: 'transform' }}
      >
        <ParentSidebar 
          activePage={activePage} 
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
          isOpen={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && isMobile && (
        <div 
          className="fixed inset-0 bg-greyed-navy/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowMobileMenu(false)}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Main Content Area */}
      <div 
        className="min-h-screen transition-all duration-300 flex flex-col"
        style={{ 
          marginLeft: isMobile ? 0 : sidebarCollapsed ? '5rem' : '16rem',
        }}
      >
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation onMenuClick={toggleMobileMenu} />
    </div>
  );
};

export default ParentLayout;
