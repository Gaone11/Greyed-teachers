import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const navigate = useNavigate();
  const { openTeacherSignup } = useRoleSelection();
  const { user } = useAuth();
  const [lottieData, setLottieData] = useState<any>(null);

  useEffect(() => {
    if (enabled) {
      // Dynamically import the Lottie JSON data
      const loadLottie = async () => {
        try {
          // This would be replaced with the actual import of a Lottie file
          // In a real implementation, you'd have a proper Lottie JSON file
          const dummyLottie = {
            v: "5.7.1",
            fr: 30,
            ip: 0,
            op: 90,
            w: 1920,
            h: 1080,
            nm: "Particles",
            layers: [
              {
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Particle",
                sr: 1,
                ks: {
                  o: { a: 0, k: 50, ix: 11 },
                  r: { a: 0, k: 0, ix: 10 },
                  p: { a: 0, k: [960, 540, 0], ix: 2 },
                  a: { a: 0, k: [0, 0, 0], ix: 1 },
                },
                shapes: [
                  {
                    ty: "gr",
                    it: [
                      {
                        d: 1,
                        ty: "el",
                        s: { a: 0, k: [20, 20], ix: 2 },
                        p: { a: 0, k: [0, 0], ix: 3 },
                      },
                      {
                        ty: "fl",
                        c: { a: 0, k: [0.129, 0.153, 0.329, 1], ix: 4 },
                        o: { a: 0, k: 100, ix: 5 },
                        r: 1,
                      },
                      {
                        ty: "tr",
                        p: { a: 0, k: [0, 0], ix: 2 },
                        a: { a: 0, k: [0, 0], ix: 1 },
                        s: { a: 0, k: [100, 100], ix: 3 },
                        r: { a: 0, k: 0, ix: 6 },
                        o: { a: 0, k: 100, ix: 7 },
                      },
                    ],
                    nm: "Particle 1",
                  },
                ],
              },
            ],
          };
          setLottieData(dummyLottie);
        } catch {
        }
      };
      
      loadLottie();
    }
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

  // Direct user to dashboard if logged in, otherwise open teacher signup
  const handleStartJourney = () => {
    if (user) {
      navigate('/teachers/dashboard');
    } else {
      openTeacherSignup();
    }
  };

  return (
    <section className="min-h-[100vh] flex items-center justify-center relative bg-greyed-navy snap-start snap-always">
      {/* Background particle animation */}
      {enabled && lottieData && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <Player
            autoplay
            loop
            src={lottieData}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 z-10 text-center py-20 mt-16 md:mt-0">
        {enabled ? (
          <>
            <motion.h1 
              className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-greyed-white mb-6 px-1"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              Siyafunda — We Are Learning
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-2xl text-greyed-blue max-w-3xl mx-auto mb-4 px-2"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              AI-Powered Teaching Tools for Cophetsheni Primary School, Mpumalanga
            </motion.p>

            <motion.p
              className="text-base md:text-lg text-greyed-white/70 max-w-2xl mx-auto mb-10 px-2 italic"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
            >
              "Indlela ibuzwa kwabaphambili" — The path is asked from those who have walked it before
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
              transition={{ duration: 0.35, delay: 0.3 }}
            >
              <button 
                onClick={handleStartJourney}
                className="w-full sm:w-auto bg-greyed-blue hover:bg-greyed-white text-greyed-navy px-8 py-3 rounded-full font-medium transition-colors text-lg flex items-center justify-center"
              >
                {user ? "Go to Dashboard" : "Start Your Free Trial"}
                {user && <ChevronRight size={20} className="ml-2" />}
              </button>
              <a 
                href="#how-it-works" 
                className="w-full sm:w-auto border border-greyed-white text-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors text-lg"
              >
                See How It Works
              </a>
            </motion.div>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-greyed-white mb-6 px-1">
              Siyafunda — We Are Learning
            </h1>
            
            <p className="text-lg md:text-2xl text-greyed-blue max-w-3xl mx-auto mb-4 px-2">
              AI-Powered Teaching Tools for Cophetsheni Primary School, Mpumalanga
            </p>

            <p className="text-base md:text-lg text-greyed-white/70 max-w-2xl mx-auto mb-10 px-2 italic">
              "Indlela ibuzwa kwabaphambili" — The path is asked from those who have walked it before
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleStartJourney}
                className="w-full sm:w-auto bg-greyed-blue hover:bg-greyed-white text-greyed-navy px-8 py-3 rounded-full font-medium transition-colors text-lg flex items-center justify-center"
              >
                {user ? "Go to Dashboard" : "Start Your Free Trial"}
                {user && <ChevronRight size={20} className="ml-2" />}
              </button>
              <a 
                href="#how-it-works" 
                className="w-full sm:w-auto border border-greyed-white text-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors text-lg"
              >
                See How It Works
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;