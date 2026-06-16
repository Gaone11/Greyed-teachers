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
          className="fixed inset-0 z-50 flex items-center justify-center bg-greyed-navy/70 backdrop-blur-sm px-4"
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
              className="absolute top-4 right-4 text-greyed-navy/60 hover:text-greyed-navy transition-colors"
              onClick={closeRoleSelection}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-greyed-navy mb-2">
                Join GreyEd
              </h2>
              <p className="text-greyed-navy/70 text-sm sm:text-base">
                Select your role to get started
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => selectRole('student')}
                className="flex items-center p-4 rounded-xl border-2 border-greyed-navy/10 hover:border-greyed-blue bg-white hover:bg-greyed-blue/5 transition-all text-left"
              >
                <div className="w-12 h-12 bg-greyed-blue/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <UserRound size={24} className="text-greyed-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-semibold text-greyed-navy">Student</h3>
                  <p className="text-xs text-greyed-navy/70 mt-1">
                    Access your dashboard, timetable, notes, and Knowledge Galaxy
                  </p>
                </div>
              </button>

              <button
                onClick={() => selectRole('teacher')}
                className="flex items-center p-4 rounded-xl border-2 border-greyed-navy/10 hover:border-greyed-blue bg-white hover:bg-greyed-blue/5 transition-all text-left"
              >
                <div className="w-12 h-12 bg-greyed-blue/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <School size={24} className="text-greyed-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-semibold text-greyed-navy">Teacher / Tutor</h3>
                  <p className="text-xs text-greyed-navy/70 mt-1">
                    Access AI-powered lesson plans, assessments, and updates
                  </p>
                </div>
              </button>

              <button
                onClick={() => selectRole('parent')}
                className="flex items-center p-4 rounded-xl border-2 border-greyed-navy/10 hover:border-greyed-blue bg-white hover:bg-greyed-blue/5 transition-all text-left"
              >
                <div className="w-12 h-12 bg-greyed-blue/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <UserRound size={24} className="text-greyed-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-semibold text-greyed-navy">Parent</h3>
                  <p className="text-xs text-greyed-navy/70 mt-1">
                    Track performance, communicate with teachers, and more
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 text-center text-xs text-greyed-navy/60 border-t border-greyed-navy/10">
              <p>Experience the power of AI in education</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelectionModal;