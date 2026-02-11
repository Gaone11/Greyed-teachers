import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import NavBarUserMenu from './NavBarUserMenu';

interface NavBarProps {
  openLoginModal?: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

/** Route-based theming — replaces fragile DOM background-color detection */
const useLightBackground = (pathname: string): boolean => {
  // Public pages with dark hero sections use light text
  const darkBgRoutes = ['/', '/features', '/pricing', '/about', '/contact', '/tutoring', '/ellm'];
  return !darkBgRoutes.includes(pathname);
};

const NavBar: React.FC<NavBarProps> = ({ openLoginModal, sidebarCollapsed }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role } = useRole();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { openTeacherSignup } = useRoleSelection();

  const isTeacherPage = location.pathname.startsWith('/teachers');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAppPage = isTeacherPage || isAdminPage;

  // Route-based light bg detection (replaces DOM querySelectorAll approach)
  const isLightBg = useLightBackground(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  }, [location]);

  const getTeacherPageInfo = (): { title: string; subtitle: string } | null => {
    const path = location.pathname;
    if (path === '/teachers/dashboard') {
      return {
        title: `Welcome back, ${user?.user_metadata?.first_name || user?.user_metadata?.name || 'Teacher'}`,
        subtitle: "Here's what's happening with your classes today",
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

  // Route-based text colors
  const useLight = isAppPage || isLightBg;
  const textColorClass = useLight ? 'text-text' : (isScrolled ? 'text-text' : 'text-surface-white');
  const textHoverClass = useLight ? 'hover:text-primary' : (isScrolled ? 'hover:text-primary' : 'hover:text-accent');
  const logoTextClass = textColorClass;
  const mobileMenuButtonClass = textColorClass;

  const publicLinks = [
    { to: '/features', label: 'Features' },
    { to: '/tutoring', label: 'Tutoring' },
    { to: '/ellm', label: 'eLLM' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const navLinks = user ? (role === 'teacher' ? [] : publicLinks) : publicLinks;
  const showNavMenu = role !== 'teacher';

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
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-4 py-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-0">
          {!isTeacherPage ? (
            <Link to="/" className={`hidden md:block ${logoTextClass}`}>
              <img src="/favicon.svg" alt="Cophetsheni Primary School" className="h-8 w-auto" loading="eager" />
            </Link>
          ) : teacherPageInfo ? (
            <div className="hidden md:block">
              <h1 className="text-lg font-headline font-bold text-primary tracking-tight leading-tight whitespace-nowrap">
                {teacherPageInfo.title}
              </h1>
              <p className="text-text-muted text-opacity-70 text-xs font-medium whitespace-nowrap">
                {teacherPageInfo.subtitle}
              </p>
            </div>
          ) : null}
        </div>

        {/* Center section: Logo (mobile only, not on teacher pages) */}
        {!isTeacherPage && (
          <Link to="/" className={`md:hidden absolute left-1/2 transform -translate-x-1/2 ${logoTextClass}`}>
            <img src="/favicon.svg" alt="Cophetsheni Primary School" className="h-8 w-auto" loading="eager" />
          </Link>
        )}

        {/* Right section: nav links + auth */}
        <div className="flex items-center gap-4">
          {/* Desktop nav links */}
          {showNavMenu && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium ${textColorClass} ${textHoverClass} transition-colors ${
                    location.pathname === link.to ? 'font-bold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth buttons */}
          {!user && !isAppPage && (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleLogin}
                className={`text-sm font-medium ${textColorClass} ${textHoverClass} transition-colors`}
              >
                Log In
              </button>
              <button
                onClick={openTeacherSignup}
                className="text-sm font-medium bg-accent text-primary px-4 py-2 rounded-full hover:bg-accent-light transition-colors"
              >
                Sign Up Free
              </button>
            </div>
          )}

          {user && <NavBarUserMenu />}

          {/* Mobile menu toggle */}
          {showNavMenu && (
            <button
              className={`md:hidden ${mobileMenuButtonClass}`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && showNavMenu && (
        <div className="md:hidden bg-primary fixed inset-0 z-50 overflow-y-auto pt-20">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-surface-white hover:text-accent transition-colors py-3 text-xl font-medium ${
                  location.pathname === link.to || location.pathname.startsWith(link.to + '/') ? 'text-accent' : ''
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
                    <p className="text-surface-white text-lg font-semibold">
                      {user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-surface-white/70 text-sm truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate(role === 'teacher' ? '/teachers/settings' : '/profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center bg-surface-white/10 text-surface-white px-5 py-3 rounded-full font-medium hover:bg-surface-white/20 transition-colors text-center text-xl"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center bg-error/20 text-surface-white px-5 py-3 rounded-full font-medium hover:bg-error/30 transition-colors text-center text-xl"
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
                  className="w-full bg-accent text-primary px-5 py-3 rounded-full font-medium hover:bg-surface-white transition-colors text-center text-xl"
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
