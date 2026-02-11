import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { useNavigate } from 'react-router-dom';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const navigate = useNavigate();
  const { openTeacherSignup } = useRoleSelection();
  const { user } = useAuth();

  const handleStartJourney = () => {
    if (user) {
      navigate('/teachers/dashboard');
    } else {
      openTeacherSignup();
    }
  };

  // Conditional motion wrapper — single content path, no duplication
  const Wrapper = enabled ? motion.div : ('div' as any);
  const fadeUp = enabled
    ? { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: 'easeOut' } }
    : {};
  const fadeUpDelay = (delay: number) =>
    enabled
      ? { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: 'easeOut', delay } }
      : {};
  const scaleIn = enabled
    ? { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { type: 'spring', stiffness: 110, delay: 0.3 } }
    : {};

  return (
    <section className="min-h-[100vh] flex items-center justify-center relative bg-primary overflow-hidden">
      {/* CSS-based animated background — replaces Lottie */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary-light/20 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center py-20 mt-16 md:mt-0">
        <Wrapper {...fadeUp}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-surface-white mb-6 px-1">
            Siyafunda — We Are Learning
          </h1>
        </Wrapper>

        <Wrapper {...fadeUpDelay(0.15)}>
          <p className="text-lg md:text-2xl text-accent max-w-3xl mx-auto mb-4 px-2">
            AI-Powered Teaching Tools for Cophetsheni Primary School, Mpumalanga
          </p>
        </Wrapper>

        <Wrapper {...fadeUpDelay(0.25)}>
          <p className="text-base md:text-lg text-surface-white/70 max-w-2xl mx-auto mb-10 px-2 italic">
            "Indlela ibuzwa kwabaphambili" — The path is asked from those who have walked it before
          </p>
        </Wrapper>

        <Wrapper {...scaleIn}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartJourney}
              className="w-full sm:w-auto bg-accent hover:bg-surface-white text-primary px-8 py-3 rounded-full font-medium transition-colors text-lg flex items-center justify-center"
            >
              {user ? 'Go to Dashboard' : 'Start Free'}
              {user && <ChevronRight size={20} className="ml-2" />}
            </button>
            <a
              href="#why-greyed"
              className="w-full sm:w-auto border border-surface-white text-surface-white hover:bg-surface-white/10 px-8 py-3 rounded-full font-medium transition-colors text-lg"
            >
              See How It Works
            </a>
          </div>
        </Wrapper>
      </div>
    </section>
  );
};

export default Hero;
