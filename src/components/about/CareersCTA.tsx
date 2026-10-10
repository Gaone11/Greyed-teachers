import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-greyed-white">
                Want to work with GreyEd?
              </h2>
              <p className="text-greyed-blue mb-8 max-w-2xl mx-auto">
                Whether you are interested in joining the team, bringing GreyEd to your school or organisation, or partnering with us, we would like to hear from you. Get in touch through our contact page or email{' '}
                <a href="mailto:hello@greyed.org" className="underline hover:text-greyed-white">hello@greyed.org</a>.
              </p>
              
              <div className="flex justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center text-greyed-white border border-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
                >
                  <Mail size={18} className="mr-2" />
                  Contact us
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="ml-2"
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-greyed-white">
                Want to work with GreyEd?
              </h2>
              <p className="text-greyed-blue mb-8 max-w-2xl mx-auto">
                Whether you are interested in joining the team, bringing GreyEd to your school or organisation, or partnering with us, we would like to hear from you. Get in touch through our contact page or email{' '}
                <a href="mailto:hello@greyed.org" className="underline hover:text-greyed-white">hello@greyed.org</a>.
              </p>
              
              <div className="flex justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center text-greyed-white border border-greyed-white hover:bg-greyed-white/10 px-8 py-3 rounded-full font-medium transition-colors"
                >
                  <Mail size={18} className="mr-2" />
                  Contact us
                  <span className="ml-2">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareersCTA;