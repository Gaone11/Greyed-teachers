import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

interface ProtectedTeacherRouteProps {
  children: ReactNode;
}

/**
 * Protects teacher routes — redirects unauthenticated users to home page
 */
const ProtectedTeacherRoute: React.FC<ProtectedTeacherRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading if still initializing
  if (loading) {
    return <Loader />;
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedTeacherRoute;
