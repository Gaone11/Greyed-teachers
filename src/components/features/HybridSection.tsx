import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Check } from 'lucide-react';

const HybridSection: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.45 }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.45 }
    }
  };

  return (
    <section className="py-20 bg-primary text-surface-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {enabled ? (
            <>
              <motion.div
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
              >
                {/* Mock UI for video call with tutor */}
                <div className="aspect-video relative bg-surface-white/10 rounded-lg mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-surface-white/30 text-xs">Video Call Interface Mockup</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-24 h-24 bg-primary/60 rounded-lg">
                    <div className="h-full flex items-center justify-center">
                      <span className="text-surface-white/70 text-xs">You</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 bg-surface-white/10 rounded-lg p-3">
                    <div className="h-4 w-3/4 bg-surface-white/20 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-surface-white/20 rounded"></div>
                  </div>
                  <div className="w-32 bg-accent/30 rounded-lg flex items-center justify-center text-xs text-primary font-medium">
                    Chat Panel
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
              >
                <h2 className="text-3xl font-headline font-bold mb-4">
                  Human tutors, super-powered by AI.
                </h2>
                <p className="text-accent mb-6">
                  Book live sessions with certified tutors who see your El AI insights before the call—so every minute counts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-accent mr-3 mt-1 flex-shrink-0" />
                    <span>Book in two clicks</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-accent mr-3 mt-1 flex-shrink-0" />
                    <span>Session recap auto-generated</span>
                  </li>
                </ul>
              </motion.div>
            </>
          ) : (
            <>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                {/* Mock UI for video call with tutor */}
                <div className="aspect-video relative bg-surface-white/10 rounded-lg mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-surface-white/30 text-xs">Video Call Interface Mockup</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-24 h-24 bg-primary/60 rounded-lg">
                    <div className="h-full flex items-center justify-center">
                      <span className="text-surface-white/70 text-xs">You</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 bg-surface-white/10 rounded-lg p-3">
                    <div className="h-4 w-3/4 bg-surface-white/20 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-surface-white/20 rounded"></div>
                  </div>
                  <div className="w-32 bg-accent/30 rounded-lg flex items-center justify-center text-xs text-primary font-medium">
                    Chat Panel
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-headline font-bold mb-4">
                  Human tutors, super-powered by AI.
                </h2>
                <p className="text-accent mb-6">
                  Book live sessions with certified tutors who see your El AI insights before the call—so every minute counts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-accent mr-3 mt-1 flex-shrink-0" />
                    <span>Book in two clicks</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-accent mr-3 mt-1 flex-shrink-0" />
                    <span>Session recap auto-generated</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HybridSection;