import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroAbout: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Background image collage animation
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    
    // Animation is handled via CSS keyframes
  }, [enabled]);

  const headlineVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const subheadVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // CSS animation for background image collage
  const backgroundKeyframes = `
    @keyframes fadeCollage {
      0%, 100% { opacity: 0.7; }
      33% { opacity: 0.3; }
      66% { opacity: 0.5; }
    }
  `;

  return (
    <section 
      ref={containerRef} 
      className="min-h-[70vh] flex items-center justify-center relative bg-greyed-navy overflow-hidden snap-start"
    >
      <style>{backgroundKeyframes}</style>
      
      {/* Background image collage with CSS animation */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            animation: enabled ? "fadeCollage 12s infinite" : "none"
          }}
        ></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            animation: enabled ? "fadeCollage 12s infinite 4s" : "none"
          }}
        ></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/8471831/pexels-photo-8471831.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            animation: enabled ? "fadeCollage 12s infinite 8s" : "none"
          }}
        ></div>
        <div className="absolute inset-0 bg-greyed-navy/60"></div>
      </div>

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
              From Mpumalanga, for every classroom.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto mb-10"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              Siyafunda was born at Cophetsheni Primary School with a belief: every teacher in rural South Africa deserves AI-powered tools to deliver quality, CAPS-aligned education.
            </motion.p>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link 
                to="/features" 
                className="inline-flex items-center text-greyed-white border border-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
              >
                Explore our products
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-greyed-white mb-6">
              From Mpumalanga, for every classroom.
            </h1>
            
            <p className="text-xl md:text-2xl text-greyed-blue max-w-3xl mx-auto mb-10">
              Siyafunda was born at Cophetsheni Primary School with a belief: every teacher in rural South Africa deserves AI-powered tools to deliver quality, CAPS-aligned education.
            </p>
            
            <div>
              <Link 
                to="/features" 
                className="inline-flex items-center text-greyed-white border border-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
              >
                Explore our products
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroAbout;