import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

interface ProtectedParentRouteProps {
  children: ReactNode;
}

const ProtectedParentRoute: React.FC<ProtectedParentRouteProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default ProtectedParentRoute;
