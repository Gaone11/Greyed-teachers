import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { BillingContext } from '../../context/BillingContext';
import { stripeProducts } from '../../stripe-config';
import { pricingPlans } from '../../data/pricingData';
import PlanCard from './PlanCard';

const PlanGrid: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const { billingPeriod } = useContext(BillingContext);

  // Filter student plans and teacher plans
  const studentPlans = pricingPlans.filter(plan => plan.id !== 'teacher');
  const teacherPlans = pricingPlans.filter(plan => plan.id === 'teacher');

  // Filter products based on billing period
  const filteredStudentPlans = studentPlans.filter(plan => {
    if (billingPeriod === 'monthly') {
      return plan.id !== 'yearly-premium';
    } else {
      return plan.id !== 'premium';
    }
  });

  return (
    <section className="py-12 bg-surface-white">
      <div className="container mx-auto px-4">
        {/* Student Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-headline font-bold mb-8 text-primary text-center">
            Student Plans
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {filteredStudentPlans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                badge={plan.badge}
                priceId={plan.stripePriceId || ''}
                price={billingPeriod === 'monthly' ? plan.monthlyPriceGBP * 100 : plan.annualPriceGBP * 100}
                features={plan.features}
                ctaLabel={plan.ctaLabel}
                isPrimary={plan.isPrimary}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Teacher Plans */}
        <div id="teachers" className="pt-8 border-t border-primary/10">
          <h2 className="text-2xl font-headline font-bold mb-8 text-primary text-center">
            Teacher Plans
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {teacherPlans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                badge={plan.badge}
                priceId={plan.stripePriceId || ''}
                price={plan.monthlyPriceGBP * 100}
                features={plan.features}
                ctaLabel={plan.ctaLabel}
                isPrimary={true}
                index={index}
              />
            ))}
            <div className="bg-white rounded-xl p-6 border border-primary/10 shadow-md flex flex-col justify-center items-center text-center md:col-span-2">
              <h3 className="text-xl font-headline font-semibold mb-4 text-primary">
                Multi-currency Support
              </h3>
              <p className="text-primary/80 mb-4">
                GreyEd Teachers is available in multiple currencies to support educators worldwide:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                <div className="bg-surface-alt/20 p-3 rounded-lg">
                  <span className="font-medium text-primary">£8 GBP</span>
                  <p className="text-xs text-primary/70">United Kingdom</p>
                </div>
                <div className="bg-surface-alt/20 p-3 rounded-lg">
                  <span className="font-medium text-primary">$11 USD</span>
                  <p className="text-xs text-primary/70">United States</p>
                </div>
                <div className="bg-surface-alt/20 p-3 rounded-lg">
                  <span className="font-medium text-primary">P150 BWP</span>
                  <p className="text-xs text-primary/70">Botswana</p>
                </div>
                <div className="bg-surface-alt/20 p-3 rounded-lg">
                  <span className="font-medium text-primary">R199 ZAR</span>
                  <p className="text-xs text-primary/70">South Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanGrid;