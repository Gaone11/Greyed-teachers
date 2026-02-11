import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Lock } from 'lucide-react';

const SafetyStrip: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const lockIconVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <section className="py-8 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center text-primary">
          {enabled ? (
            <motion.div
              className="mr-3"
              variants={lockIconVariants}
              initial="initial"
              animate="pulse"
            >
              <Lock className="w-5 h-5" />
            </motion.div>
          ) : (
            <div className="mr-3">
              <Lock className="w-5 h-5" />
            </div>
          )}
          
          <div className="text-center">
            <span className="font-headline font-semibold">
              GreyEd eLLM: Safe, Audited, Explainable
            </span>
            <span className="hidden md:inline mx-2">—</span>
            <span className="block md:inline text-primary/70 text-sm md:text-base">
              Our proprietary model passes independent bias & safety tests every quarter.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyStrip;