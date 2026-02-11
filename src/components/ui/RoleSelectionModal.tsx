import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserRound, School } from 'lucide-react';
import { useRoleSelection } from '../../context/RoleSelectionContext';

const RoleSelectionModal: React.FC = () => {
  const { isOpen, closeRoleSelection, selectRole } = useRoleSelection();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, delay: 0.1 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  };

  // Always select 'teacher' role regardless of what the user clicks
  const handleRoleSelection = () => {
    selectRole('teacher');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 backdrop-blur-sm px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeRoleSelection}
        >
          <motion.div
            className="relative bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-xl"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors"
              onClick={closeRoleSelection}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary mb-2">
                Join GreyEd Teachers
              </h2>
              <p className="text-primary/70 text-sm sm:text-base">
                Start your 14-day free trial today
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleRoleSelection}
                className="flex flex-col items-center p-6 rounded-xl border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-all"
              >
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <School size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-headline font-semibold text-primary">GreyEd Teachers</h3>
                <p className="text-sm text-primary/70 mt-2 text-center">
                  Access AI-powered lesson plans, assessments, and family updates
                </p>
                <div className="mt-4 bg-primary/10 px-3 py-1 rounded-full text-xs text-primary font-medium">
                  14-day free trial
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 text-center text-xs text-primary/60 border-t border-primary/10">
              <p>£8/month after free trial (~BWP150, $11, R199)</p>
              <p className="mt-1">Cancel anytime during your trial period</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelectionModal;