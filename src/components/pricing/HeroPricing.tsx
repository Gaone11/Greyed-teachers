import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MotionContext } from '../../context/MotionContext';

const HeroPricing: React.FC = () => {
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
    <section className="min-h-[50vh] flex items-center justify-center relative bg-greyed-navy snap-start">
      {/* Back to home link - visible at the top */}
      <div className="absolute top-24 left-0 w-full z-10">
        <div className="container mx-auto px-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-greyed-white/80 hover:text-greyed-blue transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center py-20">
        {enabled ? (
          <>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-greyed-white mb-6"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              Pick a plan, level-up your learning.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              From a forever-free AI tutor to full hybrid support, there's a GreyEd plan for every goal.
            </motion.p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-greyed-white mb-6">
              Pick a plan, level-up your learning.
            </h1>
            
            <p className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto">
              From a forever-free AI tutor to full hybrid support, there's a GreyEd plan for every goal.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroPricing;