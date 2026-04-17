import React, { useContext } from 'react';
import { motion, useViewportScroll } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Lock, Shield } from 'lucide-react';

const SafetyBanner: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const bannerVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.35 }
    }
  };
  
  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.9, ease: "easeInOut" }
    }
  };

  return (
    <section className="py-12 bg-greyed-navy/5 snap-start">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.div 
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row items-center gap-6"
            variants={bannerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
          >
            <div className="flex-shrink-0 w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center">
              <div className="relative w-8 h-8">
                <Lock className="w-8 h-8 text-greyed-navy absolute inset-0" />
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-greyed-blue absolute inset-0"
                >
                  <motion.rect
                    variants={drawVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  />
                  <motion.path
                    variants={drawVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                  />
                </motion.svg>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-headline font-semibold text-greyed-navy mb-2">
                Safety & Privacy First
              </h3>
              <p className="text-greyed-black/70">
                El AI is designed with student privacy at its core. We never sell data, use it for ads, or share it with third parties. All interactions are encrypted, and we comply with GDPR, FERPA, and COPPA regulations.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-greyed-navy" />
            </div>
            
            <div>
              <h3 className="text-xl font-headline font-semibold text-greyed-navy mb-2">
                Safety & Privacy — POPIA Compliant
              </h3>
              <p className="text-greyed-black/70">
                GreyEd's platform is built with learner and teacher privacy at its core. We comply with South Africa's Protection of Personal Information Act (POPIA), as well as GDPR standards. All data is encrypted and never shared with third parties.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SafetyBanner;