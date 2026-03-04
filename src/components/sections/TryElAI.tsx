import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { PersonStanding, Brain, Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import { useAuth } from '../../context/AuthContext';

const TryElAI: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const navigate = useNavigate();
  const { openTeacherSignup } = useRoleSelection();
  const { user } = useAuth();
  
  const checklistVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 * i,
        duration: 0.3
      }
    })
  };
  
  const badgeVariants = {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.08, 1],
      transition: { 
        delay: 0.3,
        duration: 0.5,
        times: [0, 0.5, 1]
      }
    }
  };

  // Redirect to dashboard if logged in, otherwise open teacher signup
  const handleStartFree = () => {
    if (user) {
      navigate('/teachers/dashboard');
    } else {
      openTeacherSignup();
    }
  };

  const features = [
    "Unlimited CAPS-aligned AI lesson plans",
    "Auto-graded assessments & worksheets",
    "Weekly tutor updates",
    "Student management dashboard",
    "Government template compliance",
    "Cancel anytime"
  ];

  return (
    <section className="py-20 bg-greyed-navy text-greyed-white snap-start" id="try-elai">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            Siyafunda Pro for Teachers
          </h2>
          <p className="text-xl text-greyed-blue">
            AI-powered tools to support your teaching journey.
          </p>
          <p className="text-sm text-greyed-white/60 mt-2 italic">
            "Umntwana akakhuliswa ngumuntu munye" — A child is not raised by one person alone
          </p>
        </div>
        
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-8 relative overflow-hidden">
          {/* Price Badge */}
          {enabled ? (
            <motion.div 
              className="absolute top-6 right-6 bg-greyed-blue text-greyed-navy font-bold py-2 px-4 rounded-full"
              variants={badgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              GET STARTED
            </motion.div>
          ) : (
            <div className="absolute top-6 right-6 bg-greyed-blue text-greyed-navy font-bold py-2 px-4 rounded-full">
              GET STARTED
            </div>
          )}
          
          <h3 className="text-2xl font-headline font-semibold mb-6 text-center">
            Teacher Plan
          </h3>
          
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              enabled ? (
                <motion.li 
                  key={index}
                  custom={index}
                  variants={checklistVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-5 h-5 rounded-full bg-greyed-blue/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-greyed-blue"></div>
                  </div>
                  <span>{feature}</span>
                </motion.li>
              ) : (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-greyed-blue/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-greyed-blue"></div>
                  </div>
                  <span>{feature}</span>
                </li>
              )
            ))}
          </ul>
          
          <div className="text-center mb-6">
            <div className="text-2xl font-bold">R199<span className="text-sm font-normal">/month</span></div>
            <div className="text-sm text-greyed-white/70 mt-1">per month</div>
          </div>
          
          <button 
            onClick={handleStartFree}
            className="block w-full bg-greyed-blue hover:bg-greyed-white text-greyed-navy font-medium py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center"
          >
            {user ? (
              <>
                Go to Dashboard
                <ChevronRight size={16} className="ml-2" />
              </>
            ) : (
              "Get Started"
            )}
          </button>
          
          <div className="mt-4 text-center text-xs text-greyed-white/70">
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryElAI;