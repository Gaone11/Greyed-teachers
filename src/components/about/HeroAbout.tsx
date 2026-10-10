import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const HeroAbout: React.FC = () => {
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
    <section className="min-h-[70vh] flex items-center justify-center relative bg-greyed-navy overflow-hidden snap-start">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1600')"
          }}
        ></div>
        <div className="absolute inset-0 bg-greyed-navy/60"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center py-20">
        {enabled ? (
          <>
            <motion.h1
              className="text-4xl md:text-6xl font-headline font-bold text-greyed-white mb-6"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              Africa-Rooted AI for Learning
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              GreyEd is an AI-native learning platform, operated by OrionX, built to unleash the African imagination and democratize quality learning.
            </motion.p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-greyed-white mb-6">
              Africa-Rooted AI for Learning
            </h1>

            <p className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto">
              GreyEd is an AI-native learning platform, operated by OrionX, built to unleash the African imagination and democratize quality learning.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroAbout;
