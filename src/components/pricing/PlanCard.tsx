import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { BillingContext } from '../../context/BillingContext';
import { Check, ArrowRight, Loader, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { redirectToCheckout } from '../../lib/stripe';
import { useNavigate } from 'react-router-dom';
import { useRoleSelection } from '../../context/RoleSelectionContext';

interface PlanCardProps {
  id: string;
  name: string;
  badge: string;
  priceId: string;
  price: number;
  features: string[];
  ctaLabel: string;
  isPrimary?: boolean;
  index: number;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  id,
  name, 
  badge, 
  priceId,
  price, 
  features, 
  ctaLabel,
  isPrimary,
  index
}) => {
  const { enabled } = useContext(MotionContext);
  const { billingPeriod } = useContext(BillingContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openTeacherSignup } = useRoleSelection();
  const [isLoading, setIsLoading] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(price);

  // Animate price change when billing period changes
  useEffect(() => {
    if (displayPrice !== price && enabled) {
      const animationInterval = setInterval(() => {
        setDisplayPrice(prev => {
          if (prev < price) {
            return Math.min(prev + (price - prev) / 10 + 0.01, price);
          } else if (prev > price) {
            return Math.max(prev - (prev - price) / 10 - 0.01, price);
          }
          return price;
        });
      }, 20);
      
      return () => clearInterval(animationInterval);
    } else {
      setDisplayPrice(price);
    }
  }, [price, enabled]);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.3
      }
    })
  };
  
  const badgeVariants = {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.08, 1],
      transition: { 
        delay: 0.3 * index,
        duration: 0.5,
        times: [0, 0.5, 1]
      }
    }
  };

  // Format price to show 2 decimal places and add currency symbol
  const formattedPrice = `£${(displayPrice / 100).toFixed(2)}`;
  
  // Add "per month" or "per year" text
  const priceText = `${formattedPrice}${billingPeriod === 'monthly' ? '/mo' : '/yr'}`;

  // Check if this is a teacher plan
  const isTeacherPlan = id === 'teacher';
  
  // Handle plan selection
  const handlePlanClick = async () => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/teachers/dashboard');
      return;
    }
    
    // For free plan, direct to role selection
    if (price === 0) {
      openTeacherSignup();
      return;
    }
    
    // For teacher plan, open signup modal
    if (isTeacherPlan) {
      openTeacherSignup();
      return;
    }
    
    // For all other paid plans
    openTeacherSignup();
  };

  return (
    enabled ? (
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        whileHover={{ y: -8, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
        className={`relative rounded-xl p-6 ${
          isPrimary 
            ? 'bg-greyed-navy text-greyed-white shadow-lg border-2 border-greyed-blue' 
            : 'bg-white text-greyed-navy border border-greyed-navy/10 shadow-md'
        }`}
      >
        <motion.div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
            isPrimary ? 'bg-greyed-blue text-greyed-navy' : 'bg-greyed-navy/10 text-greyed-navy'
          }`}
          variants={badgeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-label={`${badge} plan`}
        >
          {badge}
        </motion.div>
        
        <h3 className="font-headline font-bold text-2xl mb-2 mt-6">{name}</h3>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{formattedPrice}</span>
            <span className="ml-1 text-sm opacity-80">{billingPeriod === 'monthly' ? '/month' : '/year'}</span>
          </div>
          {price === 0 && (
            <p className="text-sm mt-1 opacity-80">No credit card required</p>
          )}
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className={`mr-2 mt-1 flex-shrink-0 ${isPrimary ? 'text-greyed-blue' : 'text-greyed-blue/80'}`} size={16} />
              <span className="text-sm sm:text-base">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handlePlanClick}
          disabled={isLoading}
          className={`block w-full py-2 px-4 rounded-full text-center transition-colors ${
            isPrimary 
              ? 'bg-greyed-blue text-greyed-navy hover:bg-greyed-white font-medium'
              : 'bg-greyed-navy/10 text-greyed-navy hover:bg-greyed-navy/20 font-medium'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Processing...
            </span>
          ) : user ? (
            <span className="flex items-center justify-center">
              Go to Dashboard
              <ChevronRight size={16} className="ml-2" />
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {ctaLabel}
              {isPrimary && <ArrowRight size={16} className="ml-2" />}
            </span>
          )}
        </button>
      </motion.div>
    ) : (
      <div
        className={`relative rounded-xl p-6 ${
          isPrimary 
            ? 'bg-greyed-navy text-greyed-white shadow-lg border-2 border-greyed-blue' 
            : 'bg-white text-greyed-navy border border-greyed-navy/10 shadow-md'
        }`}
      >
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
            isPrimary ? 'bg-greyed-blue text-greyed-navy' : 'bg-greyed-navy/10 text-greyed-navy'
          }`}
          aria-label={`${badge} plan`}
        >
          {badge}
        </div>
        
        <h3 className="font-headline font-bold text-2xl mb-2 mt-6">{name}</h3>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{formattedPrice}</span>
            <span className="ml-1 text-sm opacity-80">{billingPeriod === 'monthly' ? '/month' : '/year'}</span>
          </div>
          {price === 0 && (
            <p className="text-sm mt-1 opacity-80">No credit card required</p>
          )}
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className={`mr-2 mt-1 flex-shrink-0 ${isPrimary ? 'text-greyed-blue' : 'text-greyed-blue/80'}`} size={16} />
              <span className="text-sm sm:text-base">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handlePlanClick}
          disabled={isLoading}
          className={`block w-full py-2 px-4 rounded-full text-center transition-colors ${
            isPrimary 
              ? 'bg-greyed-blue text-greyed-navy hover:bg-greyed-white font-medium'
              : 'bg-greyed-navy/10 text-greyed-navy hover:bg-greyed-navy/20 font-medium'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Processing...
            </span>
          ) : user ? (
            <span className="flex items-center justify-center">
              Go to Dashboard
              <ChevronRight size={16} className="ml-2" />
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {ctaLabel}
              {isPrimary && <ArrowRight size={16} className="ml-2" />}
            </span>
          )}
        </button>
      </div>
    )
  );
};

export default PlanCard;