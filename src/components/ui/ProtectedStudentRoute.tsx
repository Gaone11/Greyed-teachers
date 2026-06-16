import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

interface ProtectedStudentRouteProps {
  children: ReactNode;
}

const ProtectedStudentRoute: React.FC<ProtectedStudentRouteProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default ProtectedStudentRoute;
