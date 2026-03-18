import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserSubscription } from '../../lib/stripe';
import { stripeProducts } from '../../stripe-config';

const SubscriptionBadge: React.FC = () => {
  const { user } = useAuth();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setHasSubscription(false);
        setIsLoading(false);
        return;
      }

      try {
        // Get subscription data from Supabase
        const subscriptionData = await getUserSubscription();
        
        if (!subscriptionData) {
          setHasSubscription(false);
          setIsLoading(false);
          return;
        }
        
        // Check if user has active teacher account
        const isActive = 
          subscriptionData && 
          subscriptionData.subscription_status === 'active' &&
          subscriptionData.price_id === stripeProducts[0].priceId;
        
        setHasSubscription(isActive);
      } catch {
        setHasSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  // Don't show anything while loading or if user doesn't have an active account
  if (isLoading || !hasSubscription) {
    return null;
  }

  return (
    <div className="bg-greyed-blue/20 text-greyed-navy text-xs py-1 px-2 rounded-full flex items-center ml-2">
      <CheckCircle size={10} className="mr-1" />
      <span>Pro</span>
    </div>
  );
};

export default SubscriptionBadge;