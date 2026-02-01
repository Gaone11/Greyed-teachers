import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { CheckCircle, Gauge, HeartHandshake } from 'lucide-react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const TutorBenefits: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const benefits = [
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Certified experts",
      description: "Background-checked, syllabus masters."
    },
    {
      icon: <Gauge className="w-10 h-10" />,
      title: "Faster progress",
      description: "Pilot data: +15% homework completion."
    },
    {
      icon: <HeartHandshake className="w-10 h-10" />,
      title: "Confidence boost",
      description: "Higher self-efficacy scores in 4 weeks."
    }
  ];

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold mb-12 text-greyed-navy text-center">
          The benefits of human tutoring
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: index * 0.15 }
    }
  };

  return (
    enabled ? (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        whileHover={{ y: -8 }}
        className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all"
      >
        <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-greyed-navy">
          {icon}
        </div>
        <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{title}</h3>
        <p className="text-greyed-navy/80">{description}</p>
      </motion.div>
    ) : (
      <div
        className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-2"
      >
        <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-greyed-navy">
          {icon}
        </div>
        <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{title}</h3>
        <p className="text-greyed-navy/80">{description}</p>
      </div>
    )
  );
};

export default TutorBenefits;