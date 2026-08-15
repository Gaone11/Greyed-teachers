import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    name?: string;
    role?: string;
    plan?: string;
    country?: string;
    education_level?: string;
    school_stage?: string;
    grade_level?: string;
    university_major?: string;
    academic_profile?: Record<string, string>;
  };
}

interface SignupUserData {
  first_name?: string;
  last_name?: string;
  name?: string;
  role?: string;
  plan?: string;
  country?: string;
  education_level?: string;
  school_stage?: string;
  grade_level?: string;
  university_major?: string;
  academic_profile?: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: unknown }>;
  signUp: (email: string, password: string, userData: SignupUserData) => Promise<{ error?: unknown }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  signOut: async () => {},
  signIn: async () => ({}),
  signUp: async () => ({}),
  loading: false,
});

export const useAuth = () => useContext(AuthContext);

const isLocalPreviewAuth = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return import.meta.env.DEV && (
    supabaseUrl.includes('localhost') ||
    supabaseAnonKey === 'local-preview-anon-key'
  );
};

const getDemoRole = (email: string) => {
  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail.includes('student') || normalizedEmail === 'gaone@uhuruai.co') {
    return 'student';
  }

  if (normalizedEmail.includes('parent') || normalizedEmail === 'hildagmolefi@gmail.com') {
    return 'parent';
  }

  return 'teacher';
};

const createDemoUser = (email: string): User => {
  const role = getDemoRole(email);

  return {
    id: `demo-${role}`,
    email,
    user_metadata: {
      first_name: role === 'student' ? 'Hilda' : role === 'parent' ? 'Parent' : 'Teacher',
      name: role === 'student' ? 'Hilda' : role === 'parent' ? 'Parent Demo' : 'Teacher Demo',
      role,
      plan: 'basic',
    },
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 10) {
    errors.push('Password must be at least 10 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one capital letter');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLocalPreviewAuth()) {
      const storedDemoUser = localStorage.getItem('greyedDemoUser');
      if (storedDemoUser) {
        try {
          setUser(JSON.parse(storedDemoUser));
        } catch {
          // Ignore invalid preview auth data and reset it.
          localStorage.removeItem('greyedDemoUser');
        }
      }

      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata
          });
        }
      } catch {
        // Ignore session bootstrap failures; the UI will remain logged out.
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata
          });
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: unknown }> => {
    try {
      setLoading(true);

      if (isLocalPreviewAuth()) {
        const demoUser = createDemoUser(email);
        setUser(demoUser);
        localStorage.setItem('greyedDemoUser', JSON.stringify(demoUser));
        return {};
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return { error: signInError };
      }

      return {};
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: SignupUserData): Promise<{ error?: unknown }> => {
    try {
      setLoading(true);

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return {
          error: {
            message: passwordValidation.errors.join('. '),
            code: 'password_validation_failed'
          }
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: userData.role || 'teacher',
            plan: userData.plan || 'basic',
            academic_profile: userData.academic_profile,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            email: email,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            role: userData.role || 'teacher',
            plan: userData.plan || 'basic',
            country: userData.country || null,
            education_level: userData.education_level || null,
            school_stage: userData.school_stage || null,
            grade_level: userData.grade_level || null,
            university_major: userData.university_major || null,
            academic_profile: userData.academic_profile || {},
          }]);

        if (profileError) {
          return { error: profileError };
        }
      }

      return {};
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);

      if (isLocalPreviewAuth()) {
        localStorage.removeItem('greyedDemoUser');
        setUser(null);
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        // Supabase sign-out errors should not leave local state stale.
      }

      setUser(null);
    } catch {
      // Keep sign-out idempotent for the UI.
    } finally {
      setLoading(false);
    }
  };

  const handleSetUser = (userData: User | null) => {
    setUser(userData);
  };

  const value = {
    user,
    setUser: handleSetUser,
    signOut,
    signIn,
    signUp,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
