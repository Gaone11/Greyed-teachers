import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { TIER_LABELS, Tier } from '../../lib/tiers';
import { useTier } from '../../context/TierContext';

interface TierLockedScreenProps {
  requiredTier: Tier;
  dashboardPath: string;
}

const TierLockedScreen: React.FC<TierLockedScreenProps> = ({ requiredTier, dashboardPath }) => {
  const { tier } = useTier();

  return (
    <div className="min-h-screen flex items-center justify-center bg-greyed-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-greyed-navy/10 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-greyed-blue/20">
          <Lock className="h-6 w-6 text-greyed-navy" />
        </div>
        <h1 className="text-xl font-headline font-bold text-greyed-navy">
          This feature is part of {TIER_LABELS[requiredTier]}
        </h1>
        <p className="mt-2 text-sm text-greyed-navy/70">
          You are on the {TIER_LABELS[tier]} tier. Upgrade to {TIER_LABELS[requiredTier]} or higher to use it.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/pricing"
            className="rounded-full bg-greyed-navy px-5 py-2.5 text-sm font-semibold text-greyed-white hover:bg-greyed-navy/90"
          >
            See plans
          </Link>
          <Link
            to={dashboardPath}
            className="rounded-full border border-greyed-navy/20 px-5 py-2.5 text-sm font-semibold text-greyed-navy hover:bg-greyed-navy/5"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TierLockedScreen;
