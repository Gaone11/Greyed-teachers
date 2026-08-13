import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Check, X } from 'lucide-react';
import { featureMatrix } from '../../data/pricingData';

const tierColumns = [
  { key: 'basic', label: 'Basic' },
  { key: 'standard', label: 'Standard' },
  { key: 'premium', label: 'Premium' },
  { key: 'enterprise', label: 'Enterprise' },
] as const;

const FeatureMatrix: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const tableVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const matrix = (
    <div className="max-w-6xl mx-auto overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-greyed-navy/10">
            <th className="text-left py-4 pl-4 pr-8 sticky left-0 bg-greyed-white">Feature</th>
            {tierColumns.map((tier) => (
              <th key={tier.key} className="px-6 py-4 text-center font-semibold">
                {tier.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureMatrix.map((feature, index) => (
            <tr key={feature.id} className={index % 2 === 0 ? 'bg-greyed-white' : 'bg-greyed-beige/20'}>
              <td
                className="py-3 pl-4 pr-8 sticky left-0 font-medium"
                style={{ backgroundColor: index % 2 === 0 ? 'var(--greyed-white)' : 'rgba(222, 219, 194, 0.2)' }}
              >
                {feature.name}
              </td>
              {tierColumns.map((tier) => (
                <td key={tier.key} className="px-6 py-3 text-center">
                  {feature.availableIn[tier.key] ? (
                    <Check size={16} className="mx-auto text-cyan-500" />
                  ) : (
                    <X size={16} className="mx-auto text-greyed-beige" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="py-16 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-center text-greyed-navy mb-10">
          Compare All Features
        </h2>

        {enabled ? (
          <motion.div
            variants={tableVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            {matrix}
          </motion.div>
        ) : (
          matrix
        )}
      </div>
    </section>
  );
};

export default FeatureMatrix;
