import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { supabase } from '../../lib/supabase';
// SubscriptionBadge removed — platform is free

const NavBarUserMenu = () => {
  const { user, signOut } = useAuth();
  const { role } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setIsLoading(true);
        setFetchError(null);
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url, role')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            setFetchError('Failed to load profile data');
          } else if (data) {
            setProfileData(data);
          }
        } catch {
          setFetchError('Network error: Unable to connect to database');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  const userName = profileData
    ? `${profileData.first_name || ''} ${profileData.last_name || ''}`
    : user.user_metadata?.name || 'User';

  const avatarUrl = profileData?.avatar_url;
  const initials = userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();

  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-greyed-blue/20 flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <span className="text-xs text-greyed-navy animate-pulse">...</span>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-greyed-navy">{initials}</span>
            )}
          </div>
          <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-greyed-navy/10">
          <div className="px-4 py-2 border-b border-greyed-navy/10">
            <p className="text-sm font-medium text-greyed-navy truncate">{userName}</p>
            <p className="text-xs text-greyed-navy/70 truncate">{user.email}</p>
            {fetchError && (
              <div className="mt-1 flex items-center text-xs text-red-500">
                <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                <span className="truncate">{fetchError}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              navigate(isTeacher ? '/teachers/settings' : isStudent ? '/students/profile' : '/profile');
            }}
            className="w-full text-left px-4 py-2 text-sm text-greyed-navy hover:bg-greyed-navy/5 flex items-center"
          >
            <Settings size={16} className="mr-2" />
            {isTeacher ? 'Teacher Settings' : isStudent ? 'Profile & Settings' : 'Edit Profile'}
          </button>
          
          {isTeacher && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/teachers/dashboard');
              }}
              className="w-full text-left px-4 py-2 text-sm text-greyed-navy hover:bg-greyed-navy/5 flex items-center"
            >
              <User size={16} className="mr-2" />
              Teacher Dashboard
            </button>
          )}
          
          {isStudent && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/students/dashboard');
              }}
              className="w-full text-left px-4 py-2 text-sm text-greyed-navy hover:bg-greyed-navy/5 flex items-center"
            >
              <User size={16} className="mr-2" />
              Student Dashboard
            </button>
          )}
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBarUserMenu;