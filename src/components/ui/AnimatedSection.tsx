import React, { useContext, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { useInView } from '../../hooks/useInView';

interface AnimatedSectionProps {
  className?: string;
  children: ReactNode;
  threshold?: number;
  variants?: any;
  delay?: number;
  once?: boolean;
  id?: string;
}

const defaultVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  className = '',
  children,
  threshold = 0.1,
  variants = defaultVariants,
  delay = 0,
  once = true,
  id,
}) => {
  const { enabled } = useContext(MotionContext);
  const { ref, inView } = useInView({ threshold, once });
  
  if (!enabled) {
    return (
      <section className={className} id={id}>
        {children}
      </section>
    );
  }
  
  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, delay }}
      id={id}
    >
      {children}
    </motion.section>
  );
};