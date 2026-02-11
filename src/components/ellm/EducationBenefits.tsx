import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { PersonStanding, Brain, Heart } from 'lucide-react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const EducationBenefits: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const benefits = [
    {
      icon: <PersonStanding className="w-10 h-10" />,
      title: "1. Personalised Learning",
      description: "Adapts content, pace and style by reading each student's emotional cues."
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "2. Critical Thinking & Creativity",
      description: "Swaps strategies the moment it senses confusion, nudging students toward 'what-if?' questions and fresh perspectives."
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "3. Emotional Well-being",
      description: "Flags stress early, suggests breaks or encouragement, and keeps study vibes positive."
    }
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold mb-12 text-surface-white text-center">
          Educational Benefits
        </h2>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, index }) => {
  const { enabled } = useContext(MotionContext);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: index * 0.2 }
    }
  };

  return (
    enabled ? (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        whileHover={{ y: -10 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-surface-white hover:bg-white/15 transition-all"
      >
        <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4 text-surface-white">
          {icon}
        </div>
        <h3 className="text-xl font-headline font-semibold mb-3 text-center">{title}</h3>
        <p className="text-surface-white/80 text-center">{description}</p>
      </motion.div>
    ) : (
      <div
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-surface-white hover:bg-white/15 transition-all hover:-translate-y-2"
      >
        <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4 text-surface-white">
          {icon}
        </div>
        <h3 className="text-xl font-headline font-semibold mb-3 text-center">{title}</h3>
        <p className="text-surface-white/80 text-center">{description}</p>
      </div>
    )
  );
};

export default EducationBenefits;