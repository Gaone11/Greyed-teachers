import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// Logo used as back navigation
import { Link } from 'react-router-dom';
import { MotionContext } from '../../context/MotionContext';
import { Player } from '@lottiefiles/react-lottie-player';

const HeroFeatures: React.FC = () => {
  const { enabled } = useContext(MotionContext);
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
            nm: "Brain Books",
            layers: [
              {
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Brain Circle",
                sr: 1,
                ks: {
                  o: { a: 0, k: 80, ix: 11 },
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
                        s: { a: 0, k: [400, 400], ix: 2 },
                        p: { a: 0, k: [0, 0], ix: 3 },
                      },
                      {
                        ty: "fl",
                        c: { a: 0, k: [0.733, 0.847, 0.922, 1], ix: 4 },
                        o: { a: 0, k: 40, ix: 5 },
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
                    nm: "Brain Circle",
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

  return (
    <section className="min-h-[70vh] flex items-center justify-center relative bg-primary">
      {/* Back to home link - visible at the top */}
      <div className="absolute top-24 left-0 w-full z-10">
        <div className="container mx-auto px-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-surface-white/80 hover:text-accent transition-colors"
            title="Back to Home"
          >
            <img src="/favicon.svg" alt="GreyEd" className="w-7 h-7" />
          </Link>
        </div>
      </div>
      
      {/* Background animation */}
      {enabled && lottieData && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Player
            autoplay
            loop
            src={lottieData}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 z-10 text-center py-20 mt-12 md:mt-0">
        {enabled ? (
          <>
            <motion.h1 
              className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-surface-white mb-6"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              Every feature built to help you learn faster.
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-2xl text-accent max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              From emotion-aware tutoring to automatic Smart Notes, here's what's inside GreyEd.
            </motion.p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-surface-white mb-6">
              Every feature built to help you learn faster.
            </h1>
            
            <p className="text-lg md:text-2xl text-accent max-w-3xl mx-auto">
              From emotion-aware tutoring to automatic Smart Notes, here's what's inside GreyEd.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroFeatures;