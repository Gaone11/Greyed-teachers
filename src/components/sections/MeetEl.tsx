import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Bot, Brain, Calendar, Zap } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

const MeetEl: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const [activeCard, setActiveCard] = useState(0);
  
  const features = [
    {
      icon: <Bot size={24} />,
      title: "Personality-Matched",
      description: "El AI adapts its teaching style to match your personality and learning preferences, making learning more engaging and effective."
    },
    {
      icon: <Brain size={24} />,
      title: "Brain-Optimized",
      description: "Lessons are structured according to cognitive science principles, with optimal spacing, retrieval practice, and interleaving techniques."
    },
    {
      icon: <Calendar size={24} />,
      title: "Schedule-Aware",
      description: "El AI learns your best study times and energy patterns, suggesting optimal moments for different types of learning activities."
    },
    {
      icon: <Zap size={24} />,
      title: "Mood-Responsive",
      description: "On tough days, El AI adjusts its approach to be more supportive and breaks content into smaller chunks to maintain motivation."
    }
  ];

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-greyed-navy">
            Meet El – Your AI Tutor
          </h2>
          <p className="text-xl text-greyed-black/70 max-w-2xl mx-auto">
            El AI doesn't just know the curriculum – it gets to know you.
          </p>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isActive={activeCard === index}
              onClick={() => setActiveCard(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  isActive,
  onClick
}) => {
  const { enabled } = useContext(MotionContext);
  
  const cardVariants = {
    inactive: { scale: 1, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" },
    active: { 
      scale: 1.02, 
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      backgroundColor: "rgba(187, 215, 235, 0.2)"
    }
  };

  if (!enabled) {
    return (
      <div
        className={`p-6 rounded-lg bg-white cursor-pointer transition-all duration-300 ${
          isActive ? "ring-2 ring-greyed-blue bg-greyed-blue/10" : "shadow-sm hover:shadow"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-3">
            {icon}
          </div>
          <h3 className="font-headline font-semibold text-greyed-navy">{title}</h3>
        </div>
        <p className="text-greyed-black/70">{description}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      animate={isActive ? "active" : "inactive"}
      whileHover={{ y: -5 }}
      className="p-6 rounded-lg bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-3">
          {icon}
        </div>
        <h3 className="font-headline font-semibold text-greyed-navy">{title}</h3>
      </div>
      <p className="text-greyed-black/70">{description}</p>
    </motion.div>
  );
};

export default MeetEl;