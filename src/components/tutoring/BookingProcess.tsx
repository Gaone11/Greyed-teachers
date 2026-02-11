import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Calendar, Video, FileText } from 'lucide-react';

interface ProcessCardProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const BookingProcess: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const steps = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Pick a slot",
      description: "Choose a time in your dashboard calendar."
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Join in-browser",
      description: "No installs—works on mobile & desktop."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Get a recap",
      description: "AI-generated notes + tutor tips delivered instantly."
    }
  ];

  return (
    <section className="py-20 bg-surface/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold mb-10 text-primary text-center">
          How it works
        </h2>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {steps.map((step, index) => (
            <ProcessCard
              key={index}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCard: React.FC<ProcessCardProps> = ({ number, icon, title, description, index }) => {
  const { enabled } = useContext(MotionContext);
  const [displayNumber, setDisplayNumber] = useState(0);
  
  // Animate number counting up
  useEffect(() => {
    if (enabled) {
      let startTime: number;
      let animationFrameId: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / 1000; // progress in seconds
        
        // Calculate current number based on progress (complete in 1.5 seconds)
        const currentNumber = Math.min(number * (progress / 1.5), number);
        setDisplayNumber(Math.floor(currentNumber));
        
        if (progress < 1.5) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setDisplayNumber(number);
        }
      };
      
      // Start animation when component is in view
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animationFrameId = requestAnimationFrame(animate);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      
      const element = document.getElementById(`process-card-${index}`);
      if (element) {
        observer.observe(element);
      }
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        observer.disconnect();
      };
    } else {
      setDisplayNumber(number);
    }
  }, [number, enabled, index]);
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, delay: index * 0.15 }
    }
  };

  return (
    enabled ? (
      <motion.div
        id={`process-card-${index}`}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        whileHover={{ translateY: -4 }}
        className="bg-surface rounded-2xl p-6 flex-1 shadow-sm hover:shadow-md transition-all"
      >
        <div className="w-12 h-12 bg-primary text-surface-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
          {displayNumber}
        </div>
        <div className="mb-4 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{title}</h3>
        <p className="text-primary/80">{description}</p>
      </motion.div>
    ) : (
      <div
        id={`process-card-${index}`}
        className="bg-surface rounded-2xl p-6 flex-1 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
      >
        <div className="w-12 h-12 bg-primary text-surface-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
          {number}
        </div>
        <div className="mb-4 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{title}</h3>
        <p className="text-primary/80">{description}</p>
      </div>
    )
  );
};

export default BookingProcess;