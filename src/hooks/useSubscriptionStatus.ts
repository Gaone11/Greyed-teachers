import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSubscription } from '../lib/stripe';
import { stripeProducts } from '../stripe-config';

/**
 * React hook to check the subscription status of the current user
 * Returns isLoading, hasActiveSubscription, and subscription data
 */
export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setHasActiveSubscription(false);
        setSubscriptionData(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get subscription data from Supabase
        const subscription = await getUserSubscription();
        setSubscriptionData(subscription);
        
        if (!subscription) {
          setHasActiveSubscription(false);
          return;
        }

        // Check for a valid teacher subscription
        // Active status AND matching the teacher product price ID
        const teacherProduct = stripeProducts.find(p => p.name === 'GreyEd Teachers');
        
        const isActive = 
          subscription.subscription_status === 'active' || 
          subscription.subscription_status === 'trialing';
          
        const isTeacherProduct = subscription.price_id === teacherProduct?.priceId;
        
        setHasActiveSubscription(isActive && isTeacherProduct);
      } catch {
        setError(error as Error);
        setHasActiveSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return { isLoading, hasActiveSubscription, subscriptionData, error };
};