import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Menu,
  Snowflake
} from 'lucide-react';

interface MobileBottomNavigationProps {
  onMenuClick: () => void;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({ 
  onMenuClick
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/teachers/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-inset-bottom">
      <div className="flex justify-around items-stretch h-16">
        <Link
          to="/teachers/dashboard"
          className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 touch-manipulation relative ${
            isActive('/teachers/dashboard')
              ? 'text-greyed-navy'
              : 'text-premium-neutral-400 active:text-premium-neutral-500'
          }`}
          aria-label="Dashboard"
        >
          {isActive('/teachers/dashboard') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-greyed-navy rounded-full" />
          )}
          <LayoutDashboard size={22} strokeWidth={isActive('/teachers/dashboard') ? 2.5 : 2} />
          <span className={`text-[11px] mt-1 font-medium ${isActive('/teachers/dashboard') ? 'font-semibold' : ''}`}>
            Dashboard
          </span>
        </Link>

        <Link
          to="/teachers/classes"
          className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 touch-manipulation relative ${
            isActive('/teachers/classes')
              ? 'text-greyed-navy'
              : 'text-premium-neutral-400 active:text-premium-neutral-500'
          }`}
          aria-label="Classes"
        >
          {isActive('/teachers/classes') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-greyed-navy rounded-full" />
          )}
          <Users size={22} strokeWidth={isActive('/teachers/classes') ? 2.5 : 2} />
          <span className={`text-[11px] mt-1 font-medium ${isActive('/teachers/classes') ? 'font-semibold' : ''}`}>
            Classes
          </span>
        </Link>

        <Link
          to="/teachers/el-ai"
          className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 touch-manipulation relative ${
            isActive('/teachers/el-ai')
              ? 'text-greyed-blue'
              : 'text-premium-neutral-400 active:text-premium-neutral-500'
          }`}
          aria-label="El AI"
        >
          {isActive('/teachers/el-ai') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-greyed-blue rounded-full" />
          )}
          <Snowflake size={22} strokeWidth={isActive('/teachers/el-ai') ? 2.5 : 2} />
          <span className={`text-[11px] mt-1 font-medium ${isActive('/teachers/el-ai') ? 'font-semibold' : ''}`}>
            El AI
          </span>
        </Link>

        <Link
          to="/teachers/lesson-planner"
          className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 touch-manipulation relative ${
            isActive('/teachers/lesson-planner')
              ? 'text-greyed-navy'
              : 'text-premium-neutral-400 active:text-premium-neutral-500'
          }`}
          aria-label="Lessons"
        >
          {isActive('/teachers/lesson-planner') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-greyed-navy rounded-full" />
          )}
          <BookOpen size={22} strokeWidth={isActive('/teachers/lesson-planner') ? 2.5 : 2} />
          <span className={`text-[11px] mt-1 font-medium ${isActive('/teachers/lesson-planner') ? 'font-semibold' : ''}`}>
            Lessons
          </span>
        </Link>

        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center flex-1 text-premium-neutral-400 active:text-premium-neutral-500 transition-all duration-200 touch-manipulation"
          aria-label="Menu"
        >
          <Menu size={22} strokeWidth={2} />
          <span className="text-[11px] mt-1 font-medium">More</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;