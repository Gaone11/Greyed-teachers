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
        isMobile ? 'w-72' : (isCollapsed ? 'w-16' : 'w-64')
      } h-screen fixed top-0 left-0 overflow-hidden z-50`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo/Brand Section */}
      {(!isCollapsed || isMobile) && (
        <div className={`${isMobile ? 'pt-6 px-4 pb-4' : 'pt-6 px-4 pb-4'} border-b border-premium-neutral-200`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-greyed-navy to-greyed-blue shadow-premium">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-premium-navy">GreyEd</h2>
              <p className="text-xs text-premium-neutral-500">Teacher Portal</p>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && !isMobile && (
        <div className="pt-6 px-2 pb-4 border-b border-premium-neutral-200 flex justify-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-greyed-navy to-greyed-blue shadow-premium">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

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
      <nav className="flex-1 overflow-y-auto pt-4 py-3 px-3 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleLinkClick}
              className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3.5' : 'px-3 py-3'} rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-greyed-blue/10 to-transparent border-l-4 border-greyed-navy shadow-sm'
                  : 'hover:bg-premium-neutral-50 active:bg-premium-neutral-100 border-l-4 border-transparent'
              } animate-slide-up touch-manipulation`}
              style={{ animationDelay: `${index * 50}ms` }}
              title={isCollapsed && !isMobile ? item.label : undefined}
            >
              <div className={`relative flex items-center justify-center ${isMobile ? 'w-9 h-9' : 'w-8 h-8'} rounded-lg bg-gradient-to-br ${item.color} shadow-md ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'} ${isActive ? 'scale-105' : 'group-hover:scale-105 group-active:scale-100'} transition-transform duration-300`}>
                <Icon className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
                {item.special && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-greyed-beige rounded-full border-2 border-white animate-pulse shadow-sm"></div>
                )}
              </div>

              {(!isCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm'} ${isActive ? 'text-greyed-navy' : 'text-premium-neutral-700 group-hover:text-greyed-navy'} transition-colors duration-200 truncate block`}>
                    {item.label}
                  </span>
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
          className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3.5' : 'px-3 py-3'} rounded-lg transition-all duration-300 ${
            activePage === 'settings'
              ? 'bg-gradient-to-r from-greyed-blue/10 to-transparent border-l-4 border-greyed-navy shadow-sm'
              : 'hover:bg-premium-neutral-50 active:bg-premium-neutral-100 border-l-4 border-transparent'
          } touch-manipulation`}
          title={isCollapsed && !isMobile ? "Settings" : undefined}
        >
          <div className={`relative flex items-center justify-center ${isMobile ? 'w-9 h-9' : 'w-8 h-8'} rounded-lg bg-gradient-to-br from-premium-neutral-600 to-premium-neutral-700 shadow-md ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'} ${activePage === 'settings' ? 'scale-105' : 'group-hover:scale-105 group-active:scale-100'} transition-transform duration-300`}>
            <Settings className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm'} ${activePage === 'settings' ? 'text-greyed-navy' : 'text-premium-neutral-700 group-hover:text-greyed-navy'} transition-colors duration-200 truncate block`}>
              Settings
            </span>
          )}
        </Link>
      </nav>

      {/* Accessibility Section */}
      {!isCollapsed && (
        <div className={`${isMobile ? 'px-4 pb-3' : 'px-3 pb-3'}`}>
          <div className="flex items-center justify-center">
            <DyslexiaModeToggle />
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className={`${isMobile ? 'p-4' : 'p-3'} border-t border-premium-neutral-200`}>
        <button
          onClick={onLogout}
          className={`group w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3.5' : 'px-3 py-3'} rounded-lg bg-greyed-navy/5 hover:bg-greyed-navy/10 active:bg-greyed-navy/15 border border-greyed-navy/10 hover:border-greyed-navy/20 transition-all duration-300 hover:shadow-sm touch-manipulation`}
          title={isCollapsed && !isMobile ? "Logout" : undefined}
        >
          <div className={`flex items-center justify-center ${isMobile ? 'w-9 h-9' : 'w-8 h-8'} rounded-lg bg-gradient-to-br from-greyed-navy to-greyed-navy shadow-md ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'} group-hover:scale-105 group-active:scale-100 transition-transform duration-300`}>
            <LogOut className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm'} text-greyed-navy transition-colors duration-200`}>
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;