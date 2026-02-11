import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const HeroContact: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const headlineVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const subheadVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="min-h-[60vh] flex items-center justify-center relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-accent/50 z-0"></div>

      <div className="container mx-auto px-4 z-10 text-center py-20">
        {enabled ? (
          <>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-surface-white mb-6"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              We'd love to hear from you.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-accent max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            >
              Whether you're a student, parent, teacher or investor—reach out and we'll respond within 24 hours.
            </motion.p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-surface-white mb-6">
              We'd love to hear from you.
            </h1>
            
            <p className="text-xl md:text-2xl text-accent max-w-3xl mx-auto">
              Whether you're a student, parent, teacher or investor—reach out and we'll respond within 24 hours.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroContact;