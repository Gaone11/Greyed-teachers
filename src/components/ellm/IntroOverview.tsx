import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const IntroOverview: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-2xl md:text-3xl text-greyed-navy font-headline">
              Empathic Large Language Models (eLLMs) bring emotional intelligence to AI.
              <br />
              <span className="text-greyed-navy/80">
                GreyEd uses eLLM to personalise lessons, spark creativity and watch over student wellbeing.
              </span>
            </p>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl md:text-3xl text-greyed-navy font-headline">
              Empathic Large Language Models (eLLMs) bring emotional intelligence to AI.
              <br />
              <span className="text-greyed-navy/80">
                GreyEd uses eLLM to personalise lessons, spark creativity and watch over student wellbeing.
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default IntroOverview;