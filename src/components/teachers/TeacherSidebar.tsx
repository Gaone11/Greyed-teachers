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
  GraduationCap,
  Database,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TeacherSidebarProps {
  activePage: 'dashboard' | 'classes' | 'lesson-planner' | 'assessments' | 'tutors' | 'settings' | 'el-ai' | 'grey-ed-ta' | 'courses' | 'admin-kb' | 'knowledgebase';
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
      id: 'tutors',
      label: 'Tutor Updates',
      icon: MessageSquare,
      path: '/teachers/tutors',
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
      label: 'Siyafunda AI',
      icon: Snowflake,
      path: '/teachers/el-ai',
      color: 'from-greyed-navy to-greyed-navy',
      activeColor: 'bg-greyed-blue/20 text-greyed-navy border-greyed-blue/30',
      special: true
    },
    {
      id: 'grey-ed-ta',
      label: 'Teaching Assistant',
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
      className={`bg-gradient-to-b from-premium-neutral-100 via-white to-premium-neutral-50 flex flex-col transition-all duration-300 shadow-premiumLg w-full h-full overflow-y-auto`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo/Brand Section */}
      {(!isCollapsed || isMobile) && (
        <div className={`${isMobile ? 'pt-6 px-4 pb-4' : 'pt-4 px-4 pb-4'} border-b border-premium-neutral-200`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-greyed-navy to-greyed-blue shadow-premium">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-premium-navy">Cophetsheni PS</h2>
              <p className="text-xs text-premium-neutral-500">Siyafunda — We are learning</p>
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
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-greyed-navy to-greyed-blue shadow-premium">
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

        {/* Knowledgebase — only visible for specific emails */}
        {(() => {
          const KB_EMAILS = ['pax@greyed.org', 'gaone@orionx.xyz'];
          const { user: kbUser } = useAuth();
          const hasKbAccess = KB_EMAILS.includes(kbUser?.email || '');
          if (!hasKbAccess) return null;
          return (
            <Link
              to="/teachers/knowledgebase"
              onClick={handleLinkClick}
              className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3.5' : 'px-3 py-3'} rounded-lg transition-all duration-300 ${
                activePage === 'knowledgebase'
                  ? 'bg-gradient-to-r from-greyed-blue/10 to-transparent border-l-4 border-greyed-navy shadow-sm'
                  : 'hover:bg-premium-neutral-50 active:bg-premium-neutral-100 border-l-4 border-transparent'
              } touch-manipulation`}
              title={isCollapsed && !isMobile ? 'CAPS Knowledgebase' : undefined}
            >
              <div className={`relative flex items-center justify-center ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'}`}>
                <Database className={`w-5 h-5 ${activePage === 'knowledgebase' ? 'text-greyed-navy' : 'text-premium-neutral-600 group-hover:text-greyed-navy'} transition-colors duration-200`} />
              </div>
              {(!isCollapsed || isMobile) && (
                <span className={`font-semibold text-sm ${activePage === 'knowledgebase' ? 'text-greyed-navy' : 'text-premium-neutral-700 group-hover:text-greyed-navy'} transition-colors duration-200 truncate block`}>
                  CAPS Knowledgebase
                </span>
              )}
            </Link>
          );
        })()}

        {/* Admin Section — only visible for authorized emails */}
        {(() => {
          const ADMIN_EMAILS = ['monti@orionx.xyz', 'gaone@orionx.xyz'];
          const { user } = useAuth();
          const isAdmin = ADMIN_EMAILS.includes(user?.email || '');
          if (!isAdmin) return null;
          return (
            <>
              <div className={`my-2 ${!isCollapsed || isMobile ? 'mx-2' : ''}`}>
                {(!isCollapsed || isMobile) && (
                  <div className="flex items-center gap-1.5 px-2 mb-1">
                    <Shield className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Admin</span>
                  </div>
                )}
                <div className="border-t border-red-200/50"></div>
              </div>
              <Link
                to="/admin/knowledge-base"
                onClick={handleLinkClick}
                className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} ${isMobile ? 'px-4 py-3.5' : 'px-3 py-3'} rounded-lg transition-all duration-300 ${
                  activePage === 'admin-kb'
                    ? 'bg-gradient-to-r from-red-50 to-transparent border-l-4 border-red-400 shadow-sm'
                    : 'hover:bg-red-50/50 active:bg-red-50 border-l-4 border-transparent'
                } touch-manipulation`}
                title={isCollapsed && !isMobile ? 'AI Knowledge Base' : undefined}
              >
                <div className={`relative flex items-center justify-center ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'}`}>
                  <Database className={`w-5 h-5 ${activePage === 'admin-kb' ? 'text-red-600' : 'text-red-400 group-hover:text-red-600'} transition-colors duration-200`} />
                </div>
                {(!isCollapsed || isMobile) && (
                  <span className={`font-semibold text-sm ${activePage === 'admin-kb' ? 'text-red-700' : 'text-red-500 group-hover:text-red-700'} transition-colors duration-200 truncate block`}>
                    AI Knowledge Base
                  </span>
                )}
              </Link>
            </>
          );
        })()}

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

export default TeacherSidebar;