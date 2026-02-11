import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const FeaturedOn: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  return (
    <section className="py-16 bg-surface-white">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.h2 
            className="text-2xl font-headline font-semibold mb-10 text-center text-primary"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            As Recognised By
          </motion.h2>
        ) : (
          <h2 className="text-2xl font-headline font-semibold mb-10 text-center text-primary">
            As Recognised By
          </h2>
        )}
        
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {enabled ? (
            <motion.div 
              className="w-full max-w-3xl"
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img
                src="/f6s-badge.svg"
                alt="F6S #65 Top AI Company April 2025"
                className="w-full h-auto"
                loading="lazy"
              />
            </motion.div>
          ) : (
            <div className="w-full max-w-3xl">
              <img
                src="/f6s-badge.svg"
                alt="F6S #65 Top AI Company April 2025"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedOn;