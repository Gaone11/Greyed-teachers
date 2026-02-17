import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ADMIN_EMAILS = ['monti@orionx.xyz', 'gaone@orionx.xyz'];

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

/**
 * Route guard that blocks access for non-admin users.
 * Only monti@orionx.xyz and gaone@orionx.xyz can access admin routes.
 */
const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!ADMIN_EMAILS.includes(user.email || '')) {
    return <Navigate to="/teachers/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
