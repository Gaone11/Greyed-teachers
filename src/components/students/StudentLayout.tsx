import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import StudentSidebar from './StudentSidebar';
import MobileBottomNavigation from '../dashboard/MobileBottomNavigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { X } from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'timetable' | 'assignments' | 'grades' | 'messages' | 'goals' | 'ai-assistant' | 'exams' | 'achievements' | 'settings' | 'knowledge';
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children, activePage }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('studentSidebarCollapsed') === 'true');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('studentSidebarCollapsed', String(next));
      return next;
    });
  };

  const toggleMobileMenu = () => setShowMobileMenu(prev => !prev);

  return (
    <div className="min-h-screen bg-greyed-navy flex flex-col">
      <NavBar
        sidebarCollapsed={sidebarCollapsed}
        actionButton={
          <div className="hidden sm:inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-greyed-card border border-white/10 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#212754] to-[#2a2f6e] flex flex-col items-center justify-center shadow-sm">
              <span className="text-[7px] font-bold text-white/80 uppercase leading-none tracking-wider">
                {new Date().toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="text-xs font-bold text-white leading-none mt-0.5">
                {new Date().getDate()}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-greyed-navy leading-tight">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
              <div className="text-[10px] text-greyed-beige/50 font-medium">
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        }
      />

      <div className="flex-1 pt-[72px] bg-greyed-white flex">
        {/* Mobile menu overlay */}
        {showMobileMenu && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setShowMobileMenu(false)} />
        )}

        {/* Left sidebar */}
        <div className={`bg-greyed-card border-r border-white/5 shadow-sm ${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform duration-300 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <StudentSidebar
            activePage={activePage}
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />
          {showMobileMenu && isMobile && (
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-greyed-navy/50 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 pb-20 md:pb-6 transition-all duration-300 flex flex-col min-h-screen"
          style={{ marginLeft: isMobile ? 0 : sidebarCollapsed ? '4rem' : '16rem' }}>
          
          <main className="flex-1 px-4 sm:px-6 lg:px-10 w-full mx-auto pt-6 pb-8">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNavigation onMenuClick={toggleMobileMenu} />
    </div>
  );
};

export default StudentLayout;
