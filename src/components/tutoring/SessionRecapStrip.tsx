import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { ShieldCheck } from 'lucide-react';

const SessionRecapStrip: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="py-12 bg-greyed-navy text-greyed-white relative overflow-hidden snap-start">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <ShieldCheck className="w-40 h-40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {enabled ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">
              Every Session Counts
            </h2>
            <p className="text-xl text-greyed-blue">
              After each tutoring session, insights are recorded in GreyEd so classroom teachers stay informed and learners receive consistent support.
            </p>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">
              Every Session Counts
            </h2>
            <p className="text-xl text-greyed-blue">
              After each tutoring session, insights are recorded in GreyEd so classroom teachers stay informed and learners receive consistent support.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SessionRecapStrip;
