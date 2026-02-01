import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { AnimatedSection } from '../ui/AnimatedSection';

const PersonalityCTA: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const containerVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <section className="py-14 bg-greyed-white snap-start" id="how-it-works">
      {enabled ? (
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={containerVariants}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-center text-greyed-navy">
            Why thousands of students start here: Faster grades, zero cringe tutoring, data safe.
          </h2>
        </motion.div>
      ) : (
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-greyed-navy">
            Why thousands of students start here: Faster grades, zero cringe tutoring, data safe.
          </h2>
        </div>
      )}

      <AnimatedSection 
        className="container mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        threshold={0.4}
      >
        <Card
          number="01"
          title="Personality-based learning"
          description="El AI adapts to your learning style, mood, and how your brain processes information."
          delay={0}
        />
        <Card
          number="02"
          title="Exam-ready material"
          description="Every lesson is mapped to GCSE, IGCSE & A Level curriculum requirements."
          delay={0.15}
        />
        <Card
          number="03"
          title="Progress tracking"
          description="See where you're improving and where you need more focus with smart analytics."
          delay={0.3}
        />
      </AnimatedSection>
    </section>
  );
};

interface CardProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

const Card: React.FC<CardProps> = ({ number, title, description, delay }) => {
  const { enabled } = useContext(MotionContext);

  const cardVariants = {
    hidden: { rotateX: -40, opacity: 0 },
    visible: { 
      rotateX: 0, 
      opacity: 1,
      transition: { duration: 0.5, delay } 
    }
  };

  if (!enabled) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="text-3xl font-bold text-greyed-blue mb-4">{number}</div>
        <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{title}</h3>
        <p className="text-greyed-black/80">{description}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-md"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <div className="text-3xl font-bold text-greyed-blue mb-4">{number}</div>
      <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{title}</h3>
      <p className="text-greyed-black/80">{description}</p>
    </motion.div>
  );
};

export default PersonalityCTA;