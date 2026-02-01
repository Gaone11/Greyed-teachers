import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

interface ProtectedTeacherRouteProps {
  children: ReactNode;
}

/**
 * A simple component that renders children directly since there's no authentication
 */
const ProtectedTeacherRoute: React.FC<ProtectedTeacherRouteProps> = ({ children }) => {
  const { loading } = useAuth();

  // Show loading if still initializing
  if (loading) {
    return <Loader />;
  }

  // Render the protected content directly (no auth checks)
  return <>{children}</>;
};

export default ProtectedTeacherRoute;