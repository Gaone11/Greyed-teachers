import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CTABookDemo: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const { openTeacherSignup } = useRoleSelection();
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

  // Redirect to dashboard if logged in, otherwise open teacher signup
  const handleAction = () => {
    if (user) {
      navigate('/teachers/dashboard');
    } else {
      openTeacherSignup();
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
              className="p-8 md:p-12"
              variants={contentVariants}
            >
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6 text-greyed-white text-center">
                Ready to experience AI-powered teaching tools?
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleAction}
                  className="group bg-greyed-blue hover:bg-greyed-white text-greyed-navy font-medium py-3 px-6 rounded-full transition-colors flex items-center"
                >
                  {user ? (
                    <>
                      Go to Dashboard
                      <ChevronRight size={18} className="ml-2" />
                    </>
                  ) : (
                    <>
                      Start Your 14-Day Free Trial
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        className="ml-2"
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto bg-greyed-navy rounded-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6 text-greyed-white text-center">
                Ready to experience AI-powered teaching tools?
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleAction}
                  className="bg-greyed-blue hover:bg-greyed-white text-greyed-navy font-medium py-3 px-6 rounded-full transition-colors flex items-center"
                >
                  {user ? (
                    <>
                      Go to Dashboard
                      <ChevronRight size={18} className="ml-2" />
                    </>
                  ) : (
                    <>
                      Start Your 14-Day Free Trial
                      <span className="ml-2">
                        <ArrowRight size={18} />
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTABookDemo;