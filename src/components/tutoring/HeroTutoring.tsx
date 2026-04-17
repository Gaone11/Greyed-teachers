import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const HeroTutoring: React.FC = () => {
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
    <section className="relative min-h-[70vh] flex items-center justify-center bg-greyed-navy snap-start">
      <div
        className="absolute inset-0 z-0 bg-black/30"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/5212665/pexels-photo-5212665.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)"
        }}
      ></div>

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
              Tutoring at GreyEd
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              Human tutors, supported by the GreyEd platform, helping learners in Mpumalanga build confidence and achieve more.
            </motion.p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-greyed-white mb-6">
              Tutoring at GreyEd
            </h1>

            <p className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto">
              Human tutors, supported by the GreyEd platform, helping learners in Mpumalanga build confidence and achieve more.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroTutoring;
