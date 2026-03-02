import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 110 
      }
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-greyed-navy snap-start">
      {/* Hero background image */}
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
              className="text-5xl md:text-6xl font-headline font-bold text-greyed-white mb-6"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              Human tutors. AI super-powers.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto mb-10"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              Certified educators plus El AI insights = faster 'I get it!' moments.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
              transition={{ duration: 0.35, delay: 0.3 }}
            >
              <a 
                href="#demo" 
                className="bg-greyed-blue hover:bg-greyed-white text-greyed-navy px-8 py-3 rounded-full font-medium transition-colors"
                
              >
                Book a Demo Call
              </a>
              <Link 
                to="/features" 
                className="border border-greyed-white text-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-greyed-white mb-6">
              Human tutors. AI super-powers.
            </h1>
            
            <p className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto mb-10">
              Certified educators plus El AI insights = faster 'I get it!' moments.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#demo" 
                className="bg-greyed-blue hover:bg-greyed-white text-greyed-navy px-8 py-3 rounded-full font-medium transition-colors"
                
              >
                Book a Demo Call
              </a>
              <Link 
                to="/features" 
                className="border border-greyed-white text-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroTutoring;