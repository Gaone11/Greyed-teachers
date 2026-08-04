import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Target,
  Bot,
  GraduationCap,
  Award,
  Telescope,
  UserPlus
} from 'lucide-react';
import { getSidebarCollapsedPreference, setSidebarCollapsedPreference } from '../../lib/sidebar-preferences';

interface StudentSidebarProps {
  activePage: 'dashboard' | 'timetable' | 'assignments' | 'grades' | 'messages' | 'goals' | 'ai-assistant' | 'exams' | 'achievements' | 'settings' | 'knowledge' | 'connections';
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activePage,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
  onClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (!isMobile) {
      setIsCollapsed(getSidebarCollapsedPreference('student'));
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
      setSidebarCollapsedPreference('student', newState);
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
      path: '/students/dashboard',
    },
    {
      id: 'timetable',
      label: 'Smart Timetable',
      icon: Calendar,
      path: '/students/timetable',
    },
    {
      id: 'assignments',
      label: 'Homework & Assessments',
      icon: FileText,
      path: '/students/assignments',
    },
    {
      id: 'grades',
      label: 'Grades & Progress',
      icon: TrendingUp,
      path: '/students/grades',
    },
    {
      id: 'messages',
      label: 'Communication Center',
      icon: MessageSquare,
      path: '/students/messages',
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: UserPlus,
      path: '/students/connections',
    },
    {
      id: 'goals',
      label: 'Learning Goals',
      icon: Target,
      path: '/students/goals',
    },
    {
      id: 'knowledge',
      label: 'Knowledge Galaxy',
      icon: Telescope,
      path: '/students/knowledge',
    },
    {
      id: 'ai-assistant',
      label: 'AI Study Assistant',
      icon: Bot,
      path: '/students/ai-assistant',
    },
    {
      id: 'exams',
      label: 'Exams & Assessments',
      icon: GraduationCap,
      path: '/students/exams',
    },
    {
      id: 'achievements',
      label: 'Achievement System',
      icon: Award,
      path: '/students/achievements',
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`bg-gradient-to-b from-premium-neutral-100 via-white to-premium-neutral-50 flex flex-col transition-all duration-300 shadow-premiumLg w-full h-full overflow-y-auto`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo/Brand Section */}
      {(!isCollapsed || isMobile) && (
        <div className={`${isMobile ? 'pt-6 px-4 pb-4' : 'pt-4 px-4 pb-4'} border-b border-premium-neutral-200`}>
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="GreyEd" className="h-8 w-auto flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-greyed-navy text-sm leading-tight">Student Hub</p>
            </div>
            {!isMobile && (
              <button
                onClick={handleToggleCollapse}
                className="text-premium-navy hover:text-greyed-navy transition-colors duration-300"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {isCollapsed && !isMobile && (
        <div className="pt-4 px-2 pb-4 border-b border-premium-neutral-200 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e2d6b] to-[#3B82F6] shadow-premium">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <button
            onClick={handleToggleCollapse}
            className="text-premium-navy hover:text-greyed-navy transition-colors duration-300"
            title="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5" />
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
              <div className={`relative flex items-center justify-center ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'}`}>
                <Icon className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} ${isActive ? 'text-greyed-navy' : 'text-premium-neutral-600 group-hover:text-greyed-navy'} transition-colors duration-200`} />
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
          to="/students/settings"
          onClick={handleLinkClick}
          className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3.5' : 'px-3 py-3'} rounded-lg transition-all duration-300 ${
            activePage === 'settings'
              ? 'bg-gradient-to-r from-greyed-blue/10 to-transparent border-l-4 border-greyed-navy shadow-sm'
              : 'hover:bg-premium-neutral-50 active:bg-premium-neutral-100 border-l-4 border-transparent'
          } touch-manipulation`}
          title={isCollapsed && !isMobile ? "Settings" : undefined}
        >
          <div className={`relative flex items-center justify-center ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'}`}>
            <Settings className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} ${activePage === 'settings' ? 'text-greyed-navy' : 'text-premium-neutral-600 group-hover:text-greyed-navy'} transition-colors duration-200`} />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm'} ${activePage === 'settings' ? 'text-greyed-navy' : 'text-premium-neutral-700 group-hover:text-greyed-navy'} transition-colors duration-200 truncate block`}>
              Settings
            </span>
          )}
        </Link>
      </nav>

      {/* Logout Button */}
      <div className={`${isMobile ? 'p-4' : 'p-3'} border-t border-premium-neutral-200`}>
        <button
          onClick={onLogout}
          className={`group w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3.5' : 'px-3 py-3'} rounded-lg bg-greyed-navy/5 hover:bg-greyed-navy/10 active:bg-greyed-navy/15 border border-greyed-navy/10 hover:border-greyed-navy/20 transition-all duration-300 hover:shadow-sm touch-manipulation`}
          title={isCollapsed && !isMobile ? "Logout" : undefined}
        >
          <div className={`flex items-center justify-center ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'}`}>
            <LogOut className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-greyed-navy transition-colors duration-200`} />
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

export default StudentSidebar;
