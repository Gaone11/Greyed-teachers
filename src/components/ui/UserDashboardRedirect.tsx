import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface UserDashboardRedirectProps {
  children: React.ReactNode;
}

const UserDashboardRedirect: React.FC<UserDashboardRedirectProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in and the loading is complete, redirect to dashboard
    if (user && !loading) {
      navigate('/teachers/dashboard');
    }
  }, [user, loading, navigate]);

  // Show children if user is not logged in or still loading
  if (!user || loading) {
    return <>{children}</>;
  }

  // This will typically not render as the redirect will happen
  return null;
};

export default UserDashboardRedirect;