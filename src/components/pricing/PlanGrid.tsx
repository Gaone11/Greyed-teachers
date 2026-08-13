import React, { useContext } from 'react';
import { BillingContext } from '../../context/BillingContext';
import { pricingPlans } from '../../data/pricingData';
import PlanCard from './PlanCard';

const PlanGrid: React.FC = () => {
  const { billingPeriod } = useContext(BillingContext);

  return (
    <section className="py-12 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-headline font-bold mb-3 text-greyed-navy">
            GreyEd Tiers
          </h2>
          <p className="max-w-2xl mx-auto text-greyed-navy/70">
            Every student, parent, and teacher starts on Basic. Upgrade when your hub needs more AI support, analytics, or organisation-level controls.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {pricingPlans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              badge={plan.badge}
              price={billingPeriod === 'monthly' ? plan.monthlyPriceGBP * 100 : plan.annualPriceGBP * 100}
              priceLabel={plan.priceLabel}
              features={plan.features}
              ctaLabel={plan.ctaLabel}
              ctaLink={plan.ctaLink}
              isPrimary={plan.isPrimary}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanGrid;
