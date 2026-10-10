import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { AI_DAILY_LIMITS, Tier, canAccessPath, normalizeTier, tierAtLeast } from '../lib/tiers';

interface TierContextType {
  tier: Tier;
  loading: boolean;
  aiLimit: number;
  hasTier: (required: Tier) => boolean;
  canAccess: (pathname: string) => boolean;
  refresh: () => Promise<void>;
}

const TierContext = createContext<TierContextType>({
  tier: 'basic',
  loading: false,
  aiLimit: AI_DAILY_LIMITS.basic,
  hasTier: (required) => required === 'basic',
  canAccess: () => true,
  refresh: async () => {},
});

export const useTier = () => useContext(TierContext);

export const TierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tier, setTier] = useState<Tier>('basic');
  const [loading, setLoading] = useState(true);

  // The plan comes from profiles, not user_metadata: users can edit their own metadata,
  // while profiles.plan is protected by a database trigger.
  const refresh = useCallback(async () => {
    if (!user) {
      setTier('basic');
      setLoading(false);
      return;
    }

    if (user.id.startsWith('demo-')) {
      setTier(normalizeTier(user.user_metadata?.plan));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle();
      setTier(normalizeTier(data?.plan));
    } catch {
      setTier('basic');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <TierContext.Provider
      value={{
        tier,
        loading,
        aiLimit: AI_DAILY_LIMITS[tier],
        hasTier: (required) => tierAtLeast(tier, required),
        canAccess: (pathname) => canAccessPath(tier, pathname),
        refresh,
      }}
    >
      {children}
    </TierContext.Provider>
  );
};
