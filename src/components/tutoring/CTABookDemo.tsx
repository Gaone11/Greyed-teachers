import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTABookDemo: React.FC = () => {
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
    <section className="py-16 bg-greyed-beige snap-start" id="demo">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.div
            className="max-w-4xl mx-auto bg-greyed-navy rounded-xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="p-8 md:p-12 text-center"
              variants={contentVariants}
            >
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-greyed-white">
                Want to learn more?
              </h2>
              <p className="text-greyed-blue mb-8 max-w-2xl mx-auto">
                If you are a parent, guardian or community member and would like to know more about the tutoring programme at GreyEd, please get in touch.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center bg-greyed-blue hover:bg-greyed-white text-greyed-navy font-medium py-3 px-6 rounded-full transition-colors"
              >
                <Mail size={18} className="mr-2" />
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto bg-greyed-navy rounded-xl overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-greyed-white">
                Want to learn more?
              </h2>
              <p className="text-greyed-blue mb-8 max-w-2xl mx-auto">
                If you are a parent, guardian or community member and would like to know more about the tutoring programme at GreyEd, please get in touch.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center bg-greyed-blue hover:bg-greyed-white text-greyed-navy font-medium py-3 px-6 rounded-full transition-colors"
              >
                <Mail size={18} className="mr-2" />
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTABookDemo;
