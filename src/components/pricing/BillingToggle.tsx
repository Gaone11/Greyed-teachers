import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { BillingContext } from '../../context/BillingContext';

const BillingToggle: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const { billingPeriod, setBillingPeriod } = useContext(BillingContext);

  const toggleBilling = () => {
    setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly');
  };

  const toggleVariants = {
    monthly: { x: 0 },
    yearly: { x: 36 } // Adjust based on your design
  };

  return (
    <section className="py-8 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div 
            className="flex items-center gap-4 p-1 mb-4" 
            role="group"
            aria-label="Billing period selection"
          >
            <span className={`text-sm md:text-base font-medium ${billingPeriod === 'monthly' ? 'text-greyed-navy' : 'text-greyed-navy/60'}`}>
              Monthly
            </span>
            
            {/* Toggle Switch */}
            <button 
              role="switch"
              aria-checked={billingPeriod === 'yearly'}
              onClick={toggleBilling}
              className="relative w-16 h-8 bg-greyed-blue/30 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-greyed-blue focus:ring-opacity-50"
            >
              {enabled ? (
                <motion.div 
                  className="w-6 h-6 bg-greyed-blue rounded-full shadow-md"
                  variants={toggleVariants}
                  animate={billingPeriod}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div 
                  className={`w-6 h-6 bg-greyed-blue rounded-full shadow-md ${
                    billingPeriod === 'yearly' ? 'ml-auto' : ''
                  }`}
                />
              )}
            </button>
            
            <div className="flex items-center">
              <span className={`text-sm md:text-base font-medium ${billingPeriod === 'yearly' ? 'text-greyed-navy' : 'text-greyed-navy/60'}`}>
                Yearly
              </span>
              <span className="ml-2 bg-greyed-blue/20 text-greyed-navy text-xs py-1 px-2 rounded-full font-medium">
                Save 17%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillingToggle;