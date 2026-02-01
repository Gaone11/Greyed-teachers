import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserSubscription } from '../../lib/stripe';
import { stripeProducts } from '../../stripe-config';

interface SubscriptionBadgeProps {
  iconOnly?: boolean;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ iconOnly = false }) => {
  const { user } = useAuth();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentTier, setCurrentTier] = useState<'Free' | 'Standard' | 'Premium'>('Standard');

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setHasSubscription(false);
        setIsLoading(false);
        return;
      }

      try {
        const subscriptionData = await getUserSubscription();

        if (!subscriptionData) {
          setHasSubscription(false);
          setCurrentTier('Standard');
          setIsLoading(false);
          return;
        }

        const isActive =
          subscriptionData &&
          subscriptionData.subscription_status === 'active' &&
          subscriptionData.price_id === stripeProducts[0].priceId;

        setHasSubscription(isActive);
        setCurrentTier(isActive ? 'Premium' : 'Standard');
      } catch {
        setHasSubscription(false);
        setCurrentTier('Standard');
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return null;
  }

  const tiers = [
    { name: 'Free', icon: '🆓', color: 'bg-gray-100 text-gray-700' },
    { name: 'Standard', icon: '⭐', color: 'bg-blue-100 text-blue-700' },
    { name: 'Premium', icon: '👑', color: 'bg-purple-100 text-purple-700' }
  ];

  const activeTier = tiers.find(t => t.name === currentTier) || tiers[1];

  if (iconOnly) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-greyed-navy/10 text-greyed-navy hover:bg-greyed-navy/20"
          title={currentTier}
        >
          <span className="text-lg">{activeTier.icon}</span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {tiers.map((tier) => (
              <button
                key={tier.name}
                onClick={() => {
                  setCurrentTier(tier.name as 'Free' | 'Standard' | 'Premium');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  tier.name === currentTier ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tier.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{tier.name}</span>
                </div>
                {tier.name === currentTier && (
                  <CheckCircle size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-greyed-blue/20 text-greyed-navy text-xs py-1 px-2 rounded-full flex items-center ml-2">
      <CheckCircle size={10} className="mr-1" />
      <span>{currentTier}</span>
    </div>
  );
};

export default SubscriptionBadge;