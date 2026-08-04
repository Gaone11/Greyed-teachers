import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ParentSidebarProps {
  activePage: 'dashboard' | 'communication' | 'timetable' | 'notifications' | 'settings' | 'connections';
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const ParentSidebar: React.FC<ParentSidebarProps> = ({ 
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
      const savedState = localStorage.getItem('parentSidebarCollapsed');
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
      localStorage.setItem('parentSidebarCollapsed', String(newState));
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
      label: 'Child Dashboard', 
      icon: LayoutDashboard, 
      path: '/parents/dashboard' 
    },
    { 
      id: 'communication', 
      label: 'Communication', 
      icon: MessageSquare, 
      path: '/parents/communication' 
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: UserPlus,
      path: '/parents/connections'
    },
    { 
      id: 'timetable', 
      label: 'Timetable Access', 
      icon: Calendar, 
      path: '/parents/timetable' 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      path: '/parents/notifications' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/parents/settings' 
    }
  ];

  return (
    <div 
      ref={sidebarRef}
      className="bg-white flex flex-col transition-all duration-300 w-full h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo/Brand Section */}
      {(!isCollapsed || isMobile) && (
        <div className="pt-6 px-4 pb-4 border-b border-greyed-navy/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-greyed-navy" />
            <div>
              <p className="font-headline font-bold text-greyed-navy text-lg leading-tight">GreyEd</p>
              <p className="text-xs text-greyed-navy/60 font-semibold uppercase tracking-wider">Parent Portal</p>
            </div>
          </div>
          {!isMobile && (
            <button 
              onClick={handleToggleCollapse}
              className="text-greyed-navy/40 hover:text-greyed-navy transition-colors duration-300 bg-greyed-navy/5 p-1 rounded-lg"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {isCollapsed && !isMobile && (
        <div className="pt-6 px-2 pb-4 border-b border-greyed-navy/10 flex flex-col items-center gap-4">
          <Shield className="w-8 h-8 text-greyed-navy" />
          <button 
            onClick={handleToggleCollapse}
            className="text-greyed-navy/40 hover:text-greyed-navy transition-colors duration-300 bg-greyed-navy/5 p-1 rounded-lg mt-2"
            title="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto pt-6 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleLinkClick}
              className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-greyed-navy text-white shadow-sm' 
                  : 'text-greyed-navy/70 hover:bg-greyed-navy/5 hover:text-greyed-navy'
              } touch-manipulation`}
              title={isCollapsed && !isMobile ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'}`} />
              
              {(!isCollapsed || isMobile) && (
                <span className="font-semibold text-sm">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-greyed-navy/10">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''} px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold transition-colors`}
          title={isCollapsed && !isMobile ? "Logout" : undefined}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed || isMobile ? 'mr-3' : 'mr-0'}`} />
          {(!isCollapsed || isMobile) && (
            <span className="text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ParentSidebar;
