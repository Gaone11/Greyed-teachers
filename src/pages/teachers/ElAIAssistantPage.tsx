import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Loader,
  Snowflake,
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  ClipboardCheck,
  Calendar,
  Settings,
  FileText,
  GraduationCap
} from 'lucide-react';
import ElAIChat from '../../components/teachers/ElAIChat';

const ElAIAssistantPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);
  
  // Set document title
  useEffect(() => {
    document.title = "El AI Assistant | GreyEd Teachers";
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-greyed-white">
        <Loader className="w-12 h-12 text-greyed-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-greyed-beige/5">
      {/* Menu overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMenu(false)}
        ></div>
      )}

      {/* Slide-out menu */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        showMenu ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline font-semibold text-black">Navigation</h2>
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 hover:bg-greyed-navy/10 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center mb-6 pb-4 border-b border-greyed-navy/10">
            <div className="w-10 h-10 bg-greyed-blue/20 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-greyed-navy" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-black">
                {user?.user_metadata?.first_name || 'Teacher'}
              </p>
              <p className="text-xs text-greyed-navy/70">Teacher Account</p>
            </div>
          </div>

          <nav className="space-y-1">
            <MenuNavItem href="/teachers/dashboard" icon={<Home size={18} />} label="Dashboard" onClick={() => setShowMenu(false)} />
            <MenuNavItem href="/teachers/classes" icon={<Users size={18} />} label="Classes" onClick={() => setShowMenu(false)} />
            <MenuNavItem href="/teachers/lesson-planner" icon={<Calendar size={18} />} label="Lesson Planner" onClick={() => setShowMenu(false)} />
            <MenuNavItem href="/teachers/assessments" icon={<ClipboardCheck size={18} />} label="Assessments" onClick={() => setShowMenu(false)} />
            <MenuNavItem href="/teachers/families" icon={<Users size={18} />} label="Families" onClick={() => setShowMenu(false)} />

            <div className="pt-4 mt-4 border-t border-greyed-navy/10">
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Chat container - Full screen */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal top bar */}
        <div className="bg-white border-b border-greyed-navy/10 p-3 flex items-center">
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 hover:bg-greyed-navy/10 rounded-lg transition-colors mr-2"
          >
            <Menu size={20} className="text-greyed-navy" />
          </button>
          <div className="w-8 h-8 rounded-full bg-greyed-blue/20 flex items-center justify-center mr-2">
            <Snowflake size={18} className="text-greyed-navy" />
          </div>
          <div className="flex-1">
            <h2 className="font-headline font-semibold text-black text-sm">El AI Teacher Assistant</h2>
          </div>
        </div>

        {/* Chat component */}
        <ElAIChat isFullPage={true} />
      </div>
    </div>
  );
};

// Menu navigation item component
interface MenuNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MenuNavItem: React.FC<MenuNavItemProps> = ({ href, icon, label, onClick }) => {
  const navigate = useNavigate();

  return (
    <button
      className="w-full flex items-center px-3 py-2 rounded-lg transition-colors text-greyed-navy/70 hover:bg-greyed-navy/5 hover:text-greyed-navy"
      onClick={() => {
        navigate(href);
        onClick();
      }}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

export default ElAIAssistantPage;