import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MotionContext } from '../../context/MotionContext';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import NavBarUserMenu from './NavBarUserMenu';
import DyslexiaModeToggle from '../accessibility/DyslexiaModeToggle';
import { supabase } from '../../lib/supabase';

interface NavBarProps {
  openLoginModal?: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ openLoginModal, sidebarCollapsed, onToggleSidebar, showSidebarToggle = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverLight, setIsOverLight] = useState(false);
  const { role } = useRole();
  const { enabled, setEnabled } = useContext(MotionContext);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { openTeacherSignup } = useRoleSelection();

  // Check if user is a teacher
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        // First check user metadata which is faster
        if (user.user_metadata?.role) {
          // role is already set by RoleContext
          return;
        }
      }
    };
    
    checkUserRole();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      
      // Check if we're on the homepage
      if (location.pathname === '/') {
        // Get the navbar element
        const navbar = document.querySelector('header');
        if (!navbar) return;
        
        const navbarRect = navbar.getBoundingClientRect();
        const navbarBottom = navbarRect.bottom;
        
        // Elements with light backgrounds that should trigger dark text
        const lightSections = document.querySelectorAll(
          '.bg-greyed-white, .bg-greyed-beige, .bg-greyed-beige\\/30, section[class*="bg-greyed-white"], section[class*="bg-greyed-beige"]'
        );
        
        // Check if navbar overlaps with any light section
        let overlapsLight = false;
        
        lightSections.forEach(section => {
          const rect = section.getBoundingClientRect();
          // If any part of the navbar is over this section
          if (rect.top <= navbarBottom && rect.bottom >= 0) {
            overlapsLight = true;
          }
        });
        
        setIsOverLight(overlapsLight);
      } else {
        setIsOverLight(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Run once on mount to set initial state
    setTimeout(handleScroll, 100); // Small delay to ensure DOM is ready
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleAnimations = () => {
    setEnabled(!enabled);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // If opening the menu, prevent scrolling on the body
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Close mobile menu when location changes
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  }, [location]);
  
  // Determine if we are in a teacher page
  const isTeacherPage = location.pathname.startsWith('/teachers');

  // Get teacher page title/subtitle for the top bar
  const getTeacherPageInfo = (): { title: string; subtitle: string } | null => {
    const path = location.pathname;
    if (path === '/teachers/dashboard') {
      return {
        title: `Welcome back, ${user?.user_metadata?.first_name || user?.user_metadata?.name || 'Teacher'}`,
        subtitle: "Here's what's happening with your classes today"
      };
    }
    if (path === '/teachers/families') return { title: 'Family Communications', subtitle: 'Send updates and communicate with parents' };
    if (path === '/teachers/assessments') return { title: 'Assessments', subtitle: 'Create, manage and grade assessments' };
    if (path === '/teachers/classes') return { title: 'Manage Classes', subtitle: 'Create and manage your teaching classes' };
    if (/^\/teachers\/classes\/.+/.test(path)) return { title: 'Class Details', subtitle: 'View and manage your class' };
    if (path === '/teachers/lesson-planner') return { title: 'Lesson Planner', subtitle: 'Create and manage lesson plans' };
    if (/^\/teachers\/lesson-planner\/.+/.test(path)) return { title: 'Generate Lesson Plan', subtitle: 'Create an AI-powered lesson plan' };
    if (path === '/teachers/settings') return { title: 'Settings', subtitle: 'Manage your account and preferences' };
    if (path === '/teachers/grey-ed-ta') return { title: 'GreyEd Teaching Assistant', subtitle: 'AI-powered virtual teaching support' };
    if (path === '/teachers/courses') return { title: 'Professional Development', subtitle: 'Enhance your skills with training courses' };
    if (/^\/teachers\/courses\/.+/.test(path)) return { title: 'Course Details', subtitle: 'Continue your professional development' };
    if (path === '/teachers/assessment-grading') return { title: 'AI Auto-Grading', subtitle: 'Upload and grade assessments with AI' };
    if (path === '/teachers/el-ai') return { title: 'Siyafunda AI', subtitle: 'Your intelligent teaching assistant' };
    return null;
  };

  const teacherPageInfo = isTeacherPage ? getTeacherPageInfo() : null;
  const sidebarOffset = sidebarCollapsed ? 'md:left-16' : 'md:left-64';

  // Determine text color class based on scroll position and section background
  const textColorClass = isTeacherPage || location.pathname.startsWith('/admin')
    ? 'text-black'
    : isOverLight
      ? 'text-greyed-navy'
      : 'text-greyed-white';

  const textHoverClass = isTeacherPage || location.pathname.startsWith('/admin')
    ? 'hover:text-black/70'
    : isOverLight
      ? 'hover:text-greyed-navy/70'
      : 'hover:text-greyed-beige';

  const logoTextClass = isTeacherPage || location.pathname.startsWith('/admin')
    ? 'text-black'
    : isOverLight
      ? 'text-greyed-navy'
      : 'text-greyed-white';

  const mobileMenuButtonClass = isTeacherPage || location.pathname.startsWith('/admin')
    ? 'text-black'
    : isOverLight
      ? 'text-greyed-navy'
      : 'text-greyed-white';

  // Public navigation links
  const publicLinks = [
    { to: "/features", label: "Features" },
    { to: "/tutoring", label: "Tutoring" },
    { to: "/ellm", label: "eLLM" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];
  
  // Teacher links
  const teacherLinks = [
    { to: "/teachers/dashboard", label: "Dashboard" },
    { to: "/teachers/classes", label: "Classes" },
    { to: "/teachers/lesson-planner", label: "Lesson Planner" },
    { to: "/teachers/assessments", label: "Assessments" },
    { to: "/teachers/families", label: "Family Updates" },
  ];

  // Choose which links to display based on auth status and role
  // Teachers don't show any links in the main nav (they use the sidebar)
  const navLinks = user
    ? role === 'teacher' ? [] : publicLinks
    : publicLinks;

  // Determine if we should show the navigation menu
  const showNavMenu = role !== 'teacher';
  
  // Handle login button click - open login modal
  const handleLogin = () => {
    if (openLoginModal) {
      openLoginModal();
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <motion.header
      className={`fixed top-0 right-0 z-50 transition-all duration-300 ${
        isTeacherPage ? `left-0 ${sidebarOffset}` : 'left-0'
      } ${
        isScrolled ? (isOverLight ? 'bg-white/90 backdrop-blur-md' : 'bg-greyed-navy/90 backdrop-blur-md') : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-4 pl-4 pr-4 py-4 flex items-center justify-between">
        {/* Left section: Logo or page title for teacher pages */}
        <div className="flex items-center gap-2 min-w-0">
          {!isTeacherPage ? (
            <Link to="/" className={`hidden md:block ${logoTextClass}`}>
              <img
                src="/favicon.svg"
                alt="Cophetsheni Primary School"
                className="h-8 w-auto"
              />
            </Link>
          ) : teacherPageInfo ? (
            <div className="hidden md:block">
              <h1 className="text-lg font-headline font-bold text-[#1B4332] tracking-tight leading-tight whitespace-nowrap">
                {teacherPageInfo.title}
              </h1>
              <p className="text-[#292828] text-opacity-70 text-xs font-medium whitespace-nowrap">
                {teacherPageInfo.subtitle}
              </p>
            </div>
          ) : null}
        </div>

        {/* Center section: GreyEd Logo (mobile only, not on teacher pages) */}
        {!isTeacherPage && (
          <Link to="/" className={`md:hidden absolute left-1/2 transform -translate-x-1/2 ${logoTextClass}`}>
            <img
              src="/favicon.svg"
              alt="Cophetsheni Primary School"
              className="h-8 w-auto"
              loading="eager"
            />
          </Link>
        )}

      </div>

      {/* Mobile Menu - Fullscreen overlay when open - Hidden for teachers */}
      {isMenuOpen && showNavMenu && (
        <div className="md:hidden bg-greyed-navy fixed inset-0 z-50 overflow-y-auto pt-20">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`text-greyed-white hover:text-greyed-beige transition-colors py-3 text-xl font-medium ${
                  location.pathname === link.to || location.pathname.startsWith(link.to + '/') ? 'text-greyed-blue' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            
            <div className="pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="px-4 py-3 bg-white/10 rounded-lg">
                    <p className="text-greyed-white text-lg font-semibold">
                      {user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-greyed-white/70 text-sm truncate">{user.email}</p>
                  </div>
                
                  <button
                    onClick={() => {
                      navigate(role === 'teacher' ? '/teachers/settings' : '/profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center bg-greyed-white/10 text-greyed-white px-5 py-3 rounded-full font-medium hover:bg-greyed-white/20 transition-colors text-center text-xl"
                  >
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      // This will be handled by NavBarUserMenu in a real implementation
                      location.href = '/';
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center bg-red-500/20 text-greyed-white px-5 py-3 rounded-full font-medium hover:bg-red-500/30 transition-colors text-center text-xl"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-greyed-blue text-greyed-navy px-5 py-3 rounded-full font-medium hover:bg-greyed-white transition-colors text-center text-xl"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default NavBar;