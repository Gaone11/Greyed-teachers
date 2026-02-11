import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MotionContext } from '../../context/MotionContext';

const HeroFeatures: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const Wrapper = enabled ? motion.div : ('div' as any);

  const fadeUp = enabled
    ? { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: 'easeOut' } }
    : {};

  const fadeUpDelay = enabled
    ? { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: 'easeOut', delay: 0.2 } }
    : {};

  return (
    <section className="min-h-[70vh] flex items-center justify-center relative bg-primary overflow-hidden">
      {/* CSS animated background blobs */}
      {enabled && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />
        </div>
      )}

      {/* Back to home link */}
      <div className="absolute top-24 left-0 w-full z-10">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-surface-white/80 hover:text-accent transition-colors"
            title="Back to Home"
          >
            <img src="/favicon.svg" alt="GreyEd" className="w-7 h-7" loading="eager" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center py-20 mt-12 md:mt-0">
        <Wrapper className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-surface-white mb-6" {...fadeUp}>
          Every feature built to help you learn faster.
        </Wrapper>

        <Wrapper className="text-lg md:text-2xl text-accent max-w-3xl mx-auto" {...fadeUpDelay}>
          From emotion-aware tutoring to automatic Smart Notes, here&apos;s what&apos;s inside GreyEd.
        </Wrapper>
      </div>
    </section>
  );
};

export default HeroFeatures;
