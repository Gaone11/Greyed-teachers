import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// Define role types
export type UserRole = 'teacher' | 'admin' | null;

// Role context interface
interface RoleContextProps {
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  updateRole: (newRole: UserRole) => Promise<void>;
}

// Create the context with default values
const RoleContext = createContext<RoleContextProps>({
  role: null,
  isLoading: true,
  error: null,
  updateRole: async () => {},
});

// Custom hook for using the role context
export const useRole = () => useContext(RoleContext);

// Provider component
interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First, check user metadata for role
        if (user.user_metadata?.role) {
          setRole(user.user_metadata.role as UserRole);
          setIsLoading(false);
          return;
        }

        // If no role in metadata, check the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data && data.role) {
          setRole(data.role as UserRole);
        } else {
          setRole(null);
        }
      } catch {
        setError('Failed to determine user role');
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Update a user's role
  const updateRole = async (newRole: UserRole) => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setRole(newRole);
    } catch {
      setError('Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleContext.Provider value={{ role, isLoading, error, updateRole }}>
      {children}
    </RoleContext.Provider>
  );
};