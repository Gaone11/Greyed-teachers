import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { AnimatedSection } from '../ui/AnimatedSection';

const CurriculumGrid: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const subjects = [
    { name: "Mathematics", available: true },
    { name: "Home Language (siSwati)", available: true },
    { name: "First Additional Language (English)", available: true },
    { name: "Life Skills", available: true },
    { name: "Natural Sciences", available: true },
    { name: "Social Sciences", available: true },
    { name: "Technology", available: true },
    { name: "Economic & Management Sciences", available: true },
    { name: "Creative Arts", available: true },
    { name: "Life Orientation", available: true },
    { name: "Physical Education", available: true },
    { name: "Second Additional Language", available: true }
  ];
  
  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.03 * i,
        duration: 0.3
      }
    })
  };
  
  // CSS animation for shaking the "coming soon" chips
  const shakeAnimation = enabled 
    ? "animate-[shake_4s_ease-in-out_infinite]" 
    : "";
  
  // Custom shake animation for the "coming soon" chips
  const shakeKeyframes = `
    @keyframes shake {
      0%, 100% { transform: translateY(0); }
      25% { transform: translateY(2px); }
      75% { transform: translateY(-2px); }
    }
  `;

  return (
    <section className="py-20 bg-greyed-white snap-start" id="curriculum">
      <style>{shakeKeyframes}</style>
      
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-headline font-bold mb-4 text-greyed-navy">
            CAPS Curriculum Coverage
          </h2>
          <p className="text-base md:text-xl text-greyed-black/70 max-w-2xl mx-auto">
            Full alignment with the South African Curriculum and Assessment Policy Statement (CAPS) for Foundation, Intermediate, and Senior phases.
          </p>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {subjects.map((subject, index) => (
            enabled ? (
              <motion.div
                key={index}
                custom={index}
                variants={gridItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`bg-white rounded-lg py-2 md:py-3 px-2 md:px-4 shadow-sm flex items-center justify-center relative ${
                  !subject.available ? "bg-greyed-white border border-dashed border-greyed-navy/30" : ""
                }`}
              >
                <span className={`text-center text-sm md:text-base ${subject.available ? "text-greyed-navy" : "text-greyed-navy/50"}`}>
                  {subject.name}
                </span>
              </motion.div>
            ) : (
              <div
                key={index}
                className={`bg-white rounded-lg py-2 md:py-3 px-2 md:px-4 shadow-sm flex items-center justify-center relative ${
                  !subject.available ? "bg-greyed-white border border-dashed border-greyed-navy/30" : ""
                }`}
              >
                <span className={`text-center text-sm md:text-base ${subject.available ? "text-greyed-navy" : "text-greyed-navy/50"}`}>
                  {subject.name}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumGrid;