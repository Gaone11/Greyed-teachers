import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { BookOpen, ChevronRight, GraduationCap, School, UsersRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import { useAuth } from '../../context/AuthContext';

const hubPlans = [
  {
    role: 'student',
    title: 'Student Hub',
    icon: GraduationCap,
    price: 'Basic: Free',
    description: 'Timetable, assignments, Knowledge Galaxy, progress tracking, and study support.',
    highlights: ['Core learning dashboard', 'Basic AI study support', 'Upgrade for advanced tools']
  },
  {
    role: 'teacher',
    title: 'Teacher Hub',
    icon: School,
    price: 'Basic: Free',
    description: 'Class management, planning workflows, assessments, communication, and teaching support.',
    highlights: ['Core teaching dashboard', 'Basic AI teaching support', 'Upgrade for advanced workflows']
  },
  {
    role: 'parent',
    title: 'Parent Hub',
    icon: UsersRound,
    price: 'Basic: Free',
    description: 'Child progress, communication, timetable access, notifications, and connected updates.',
    highlights: ['Core parent portal', 'Progress and updates', 'Upgrade for deeper insights']
  }
] as const;

const TryElAI: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const navigate = useNavigate();
  const { openRoleSelection } = useRoleSelection();
  const { user } = useAuth();

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.12 * i,
        duration: 0.35
      }
    })
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
      return;
    }

    openRoleSelection('signup');
  };

  return (
    <section className="py-20 bg-greyed-navy text-greyed-white snap-start" id="pricing-preview">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-greyed-blue/15 text-greyed-blue text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" />
            Pricing for every hub
          </div>
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            Start on Basic, upgrade when you need more.
          </h2>
          <p className="text-xl text-greyed-blue">
            Students, teachers, and parents each get a Basic tier by default. Standard, Premium, and Enterprise unlock more capability across the GreyEd platform.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {hubPlans.map((plan, index) => {
            const Icon = plan.icon;
            const card = (
              <div className="h-full bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col">
                <div className="w-11 h-11 rounded-lg bg-greyed-blue/20 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-greyed-blue" />
                </div>
                <h3 className="text-2xl font-headline font-semibold mb-2">
                  {plan.title}
                </h3>
                <p className="text-2xl font-bold mb-3">
                  {plan.price}
                </p>
                <p className="text-sm text-greyed-white/75 leading-relaxed mb-5">
                  {plan.description}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start text-sm text-greyed-white/85">
                      <span className="w-2 h-2 rounded-full bg-greyed-blue mt-2 mr-3 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-greyed-blue hover:bg-greyed-white text-greyed-navy font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {user ? 'Go to Dashboard' : 'Get Started'}
                  <ChevronRight size={16} className="ml-2" />
                </button>
              </div>
            );

            return enabled ? (
              <motion.div
                key={plan.role}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
              >
                {card}
              </motion.div>
            ) : (
              <div key={plan.role}>{card}</div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-greyed-blue/70 text-greyed-blue hover:bg-greyed-blue hover:text-greyed-navy transition-colors font-semibold"
          >
            View Basic, Standard, Premium, and Enterprise
            <ChevronRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TryElAI;
