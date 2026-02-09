import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { ExternalLink } from 'lucide-react';

const CareersCTA: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const containerVariants = {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { 
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 0.6 }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.4 }
    }
  };

  return (
    <section className="py-16 bg-greyed-navy snap-start">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center"
              variants={contentVariants}
            >
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6 text-greyed-white">
                Join Siyafunda — help empower Mpumalanga's teachers.
              </h2>
              
              <div className="flex justify-center">
                <a 
                  href="https://cophetsheni.edu.za/careers"
                  className="inline-flex items-center text-greyed-white border border-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
                  
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See open roles
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    className="ml-2"
                  >
                    <ExternalLink size={18} />
                  </motion.div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6 text-greyed-white">
                Join Siyafunda — help empower Mpumalanga's teachers.
              </h2>
              
              <div className="flex justify-center">
                <a 
                  href="https://cophetsheni.edu.za/careers"
                  className="inline-flex items-center text-greyed-white border border-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
                  
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See open roles
                  <span className="ml-2">
                    <ExternalLink size={18} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareersCTA;