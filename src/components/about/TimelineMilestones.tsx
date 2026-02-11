import React, { useContext, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

interface MilestoneCardProps {
  year: string;
  milestone: string;
  index: number;
  active: boolean;
  onClick: () => void;
}

const TimelineMilestones: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const milestones = [
    {
      year: "2023",
      milestone: "Idea sketched at Stanbic event"
    },
    {
      year: "2024",
      milestone: "First pilots in Botswana (urban, rural, special-needs schools)"
    },
    {
      year: "2024 Q4",
      milestone: "Ranked Top 65 AI Startup on F6S"
    },
    {
      year: "2025 Q1",
      milestone: "eLLM v1 launch; UK expansion roadmap"
    },
    {
      year: "2025 Q2",
      milestone: "Pencils of Promise Ghana deployment"
    }
  ];
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Observe which milestone is in the center of viewport
  useEffect(() => {
    if (!enabled || !timelineRef.current || isMobile) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
          }
        });
      },
      { 
        root: timelineRef.current,
        rootMargin: '0px',
        threshold: 0.75
      }
    );
    
    const cards = timelineRef.current.querySelectorAll('.milestone-card');
    cards.forEach(card => observer.observe(card));
    
    return () => observer.disconnect();
  }, [enabled, isMobile]);
  
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-surface-white relative">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.h2 
            className="text-3xl font-headline font-bold mb-12 text-primary text-center"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our Journey
          </motion.h2>
        ) : (
          <h2 className="text-3xl font-headline font-bold mb-12 text-primary text-center">
            Our Journey
          </h2>
        )}
        
        {isMobile ? (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-accent/30"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="flex mb-8">
                  <div className="relative">
                    <div className="w-[74px] text-right pr-4 font-headline font-semibold text-primary">
                      {milestone.year}
                    </div>
                    <div className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 ${index === activeIndex ? 'bg-accent border-primary' : 'bg-surface-white border-accent'}`}></div>
                  </div>
                  <div 
                    className={`flex-1 bg-white p-4 rounded-lg shadow-sm ml-4 ${index === activeIndex ? 'border-l-4 border-accent' : ''}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <p className="text-text/80">{milestone.milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div 
            ref={timelineRef}
            className="relative max-w-6xl mx-auto overflow-x-auto pb-8 hide-scrollbar"
          >
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-accent/30 transform -translate-y-1/2"></div>
            
            <div className="flex space-x-8 px-8 min-w-max">
              {milestones.map((milestone, index) => (
                <MilestoneCard
                  key={index}
                  year={milestone.year}
                  milestone={milestone.milestone}
                  index={index}
                  active={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

const MilestoneCard: React.FC<MilestoneCardProps> = ({ 
  year, 
  milestone, 
  index, 
  active, 
  onClick 
}) => {
  const { enabled } = useContext(MotionContext);
  
  const cardVariants = {
    inactive: { y: 0 },
    active: { y: -10 }
  };
  
  const dotVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.5, backgroundColor: '#D4A843' } // accent token
  };

  return (
    enabled ? (
      <motion.div
        className="milestone-card flex flex-col items-center w-56"
        data-index={index}
        animate={active ? "active" : "inactive"}
        onClick={onClick}
      >
        <div className="order-1 mt-4">
          <motion.div 
            className={`w-64 p-4 rounded-lg shadow-sm ${active ? 'bg-white border-b-4 border-accent' : 'bg-surface-white'}`}
            variants={cardVariants}
            transition={{ duration: 0.3 }}
          >
            <p className="text-text/80">{milestone}</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="w-6 h-6 rounded-full border-2 border-primary bg-surface-white z-10"
          variants={dotVariants}
          transition={{ duration: 0.3 }}
        ></motion.div>
        
        <div className="font-headline font-semibold text-primary mt-2">
          {year}
        </div>
      </motion.div>
    ) : (
      <div
        className="milestone-card flex flex-col items-center w-56"
        data-index={index}
        onClick={onClick}
      >
        <div className="order-1 mt-4">
          <div 
            className={`w-64 p-4 rounded-lg shadow-sm ${active ? 'bg-white border-b-4 border-accent' : 'bg-surface-white'}`}
          >
            <p className="text-text/80">{milestone}</p>
          </div>
        </div>
        
        <div 
          className={`w-6 h-6 rounded-full border-2 border-primary ${active ? 'bg-accent' : 'bg-surface-white'} z-10`}
        ></div>
        
        <div className="font-headline font-semibold text-primary mt-2">
          {year}
        </div>
      </div>
    )
  );
};

export default TimelineMilestones;