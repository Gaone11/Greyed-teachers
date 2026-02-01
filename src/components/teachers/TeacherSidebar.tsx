import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Snowflake,
  MessageSquare,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import DyslexiaModeToggle from '../accessibility/DyslexiaModeToggle';

interface TeacherSidebarProps {
  activePage: 'dashboard' | 'classes' | 'lesson-planner' | 'assessments' | 'families' | 'settings' | 'el-ai' | 'grey-ed-ta' | 'courses';
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  activePage,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
  isOpen = false,
  onClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (!isMobile) {
      const savedState = localStorage.getItem('teacherSidebarCollapsed');
      if (savedState !== null) {
        setIsCollapsed(savedState === 'true');
      }
    }
  }, [isMobile]);

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem('teacherSidebarCollapsed', String(newState));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isMobile || !onClose) return;
    if (touchStart - touchEnd > 75) {
      onClose();
    }
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/teachers/dashboard',
      color: 'from-greyed-navy to-greyed-navy',
      activeColor: 'bg-greyed-blue/20 text-greyed-navy border-greyed-blue/30'
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: Users,
      path: '/teachers/classes',
      color: 'from-greyed-navy to-greyed-navy',
      activeColor: 'bg-greyed-blue/20 text-greyed-navy border-greyed-blue/30'
    },
    {
      id: 'lesson-planner',
      label: 'Lesson Planner',
      icon: BookOpen,
      path: '/teachers/lesson-planner',
      color: 'from-greyed-blue to-greyed-blue',
      activeColor: 'bg-greyed-blue/20 text-greyed-navy border-greyed-blue/30'
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: FileText,
      path: '/teachers/assessments',
      color: 'from-greyed-beige to-greyed-beige',
      activeColor: 'bg-greyed-beige/40 text-greyed-black border-greyed-beige/50'
    },
    {
      id: 'families',
      label: 'Family Updates',
      icon: MessageSquare,
      path: '/teachers/families',
      color: 'from-greyed-navy to-greyed-navy',
      activeColor: 'bg-greyed-blue/20 text-greyed-navy border-greyed-blue/30'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: GraduationCap,
      path: '/teachers/courses',
      color: 'from-greyed-beige to-greyed-beige',
      activeColor: 'bg-greyed-beige/40 text-greyed-black border-greyed-beige/50'
    },
    {
      id: 'el-ai',
      label: 'El AI Assistant',
      icon: Snowflake,
      path: '/teachers/el-ai',
      color: 'from-greyed-navy to-greyed-navy',
      activeColor: 'bg-greyed-blue/20 text-greyed-navy border-greyed-blue/30',
      special: true
    },
    {
      id: 'grey-ed-ta',
      label: 'GreyEd TA',
      icon: Sparkles,
      path: '/teachers/grey-ed-ta',
      color: 'from-greyed-blue to-greyed-blue',
      activeColor: 'bg-greyed-blue/20 text-greyed-navy border-greyed-blue/30',
      special: true
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`bg-gradient-to-b from-premium-neutral-100 via-white to-premium-neutral-50 flex flex-col transition-all duration-300 shadow-premiumLg ${
        isMobile ? 'w-72' : (isCollapsed ? 'w-14' : 'w-52')
      } h-screen ${isMobile ? 'fixed' : 'sticky'} top-0 overflow-hidden z-50`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toggle Button - Desktop only */}
      {!isMobile && (
        <div className="absolute -right-3 top-24 z-50">
          <button
            onClick={handleToggleCollapse}
            className="bg-white border-2 border-premium-neutral-200 rounded-full p-1.5 shadow-premium hover:bg-premium-neutral-50 transition-all duration-300 hover:scale-110"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-premium-navy" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-premium-navy" />
            )}
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto pt-20 md:pt-3 py-3 px-2 space-y-0.5">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleLinkClick}
              className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3' : 'px-2 py-2'} rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-white backdrop-blur-sm border-2 border-premium-neutral-200 shadow-premium'
                  : 'hover:bg-white/60 active:bg-white/80 border-2 border-transparent hover:border-premium-neutral-200'
              } animate-slide-up touch-manipulation`}
              style={{ animationDelay: `${index * 50}ms` }}
              title={isCollapsed && !isMobile ? item.label : undefined}
            >
              {isActive && !isCollapsed && !isMobile && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-greyed-blue/10 to-transparent animate-pulse"></div>
              )}

              <div className={`relative flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-6 h-6'} rounded-lg bg-gradient-to-br ${item.color} shadow-premium ${!isCollapsed || isMobile ? 'mr-2' : 'mr-0'} ${isActive ? 'scale-110' : 'group-hover:scale-110 group-active:scale-105'} transition-transform duration-300`}>
                <Icon className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-white`} />
                {item.special && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-greyed-beige rounded-full border border-white animate-pulse"></div>
                )}
              </div>

              {(!isCollapsed || isMobile) && (
                <div className="flex-1 relative">
                  <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'} ${isActive ? 'text-premium-navy' : 'text-premium-neutral-600 group-hover:text-premium-navy'} transition-colors duration-200`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-gradient-to-r from-premium-accent to-transparent rounded-full"></div>
                  )}
                </div>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-2"></div>

        {/* Settings */}
        <Link
          to="/teachers/settings"
          onClick={handleLinkClick}
          className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3' : 'px-2 py-2'} rounded-xl transition-all duration-300 ${
            activePage === 'settings'
              ? 'bg-white backdrop-blur-sm border-2 border-premium-neutral-200 shadow-premium'
              : 'hover:bg-white/60 active:bg-white/80 border-2 border-transparent hover:border-premium-neutral-200'
          } touch-manipulation`}
          title={isCollapsed && !isMobile ? "Settings" : undefined}
        >
          <div className={`relative flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-6 h-6'} rounded-lg bg-gradient-to-br from-premium-neutral-600 to-premium-neutral-700 shadow-premium ${!isCollapsed || isMobile ? 'mr-2' : 'mr-0'} ${activePage === 'settings' ? 'scale-110' : 'group-hover:scale-110 group-active:scale-105'} transition-transform duration-300`}>
            <Settings className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-white`} />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'} ${activePage === 'settings' ? 'text-premium-navy' : 'text-premium-neutral-600 group-hover:text-premium-navy'} transition-colors duration-200`}>
              Settings
            </span>
          )}
        </Link>
      </nav>

      {/* Accessibility Section */}
      {!isCollapsed && (
        <div className={`${isMobile ? 'px-4 pb-2' : 'px-2 pb-2'}`}>
          <div className="flex items-center justify-center mb-2">
            <DyslexiaModeToggle />
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className={`${isMobile ? 'p-4' : 'p-2'}`}>
        <button
          onClick={onLogout}
          className={`group w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3' : 'px-2 py-2'} rounded-xl bg-greyed-navy/10 hover:bg-greyed-navy/20 active:bg-greyed-navy/30 border border-greyed-navy/20 hover:border-greyed-navy/30 transition-all duration-300 hover:shadow-premium touch-manipulation`}
          title={isCollapsed && !isMobile ? "Logout" : undefined}
        >
          <div className={`flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-6 h-6'} rounded-lg bg-gradient-to-br from-greyed-navy to-greyed-navy shadow-premium ${!isCollapsed || isMobile ? 'mr-2' : 'mr-0'} group-hover:scale-110 group-active:scale-105 transition-transform duration-300`}>
            <LogOut className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-white`} />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'} text-greyed-navy group-hover:text-greyed-navy transition-colors duration-200`}>
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;