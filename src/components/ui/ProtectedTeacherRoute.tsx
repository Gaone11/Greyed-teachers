import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTier } from '../../context/TierContext';
import { requiredTierForPath } from '../../lib/tiers';
import TierLockedScreen from '../tiers/TierLockedScreen';
import Loader from './Loader';

interface ProtectedTeacherRouteProps {
  children: ReactNode;
}

/**
 * Renders teacher pages, or an upgrade prompt when the page is above the user's tier
 */
const ProtectedTeacherRoute: React.FC<ProtectedTeacherRouteProps> = ({ children }) => {
  const { loading } = useAuth();
  const { loading: tierLoading, hasTier } = useTier();
  const { pathname } = useLocation();
  const requiredTier = requiredTierForPath(pathname);

  // Show loading if still initializing
  if (loading || tierLoading) {
    return <Loader />;
  }

  // Pages above the user's tier show an upgrade prompt instead
  if (!hasTier(requiredTier)) {
    return <TierLockedScreen requiredTier={requiredTier} dashboardPath="/teachers/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedTeacherRoute;