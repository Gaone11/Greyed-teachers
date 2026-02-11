import React, { useContext, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const PartnersStrip: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  // Partner logos (using Lucide icons for demo, would be actual partner logos in production)
  const partners = [
    {
      name: "Pencils of Promise",
      logo: "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Techstars",
      logo: "https://images.pexels.com/photos/8636623/pexels-photo-8636623.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "F6S",
      logo: "https://images.pexels.com/photos/986733/pexels-photo-986733.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Google for Education",
      logo: "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];
  
  // Automate marquee scroll
  useEffect(() => {
    if (!enabled || !marqueeRef.current) return;
    
    const marquee = marqueeRef.current;
    let animationId: number;
    let position = 0;
    
    const animate = () => {
      position -= 0.5;
      if (position <= -100) {
        position = 0;
      }
      
      marquee.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };
    
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };
    
    marquee.addEventListener('mouseenter', handleMouseEnter);
    marquee.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationId);
      marquee.removeEventListener('mouseenter', handleMouseEnter);
      marquee.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);
  
  const stripVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Duplicate partners to create a seamless marquee effect
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-10 bg-surface/30">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.h3 
            className="text-xl font-headline font-semibold mb-8 text-primary text-center"
            variants={stripVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our Partners
          </motion.h3>
        ) : (
          <h3 className="text-xl font-headline font-semibold mb-8 text-primary text-center">
            Our Partners
          </h3>
        )}
        
        {enabled ? (
          <motion.div
            variants={stripVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="overflow-hidden"
          >
            <div 
              ref={marqueeRef}
              className="flex items-center space-x-12"
              style={{ width: "max-content" }}
            >
              {duplicatedPartners.map((partner, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center h-16 bg-white rounded-lg px-6 shadow-sm"
                  title={partner.name}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="overflow-hidden">
            <div className="flex items-center justify-around">
              {partners.map((partner, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center h-16 bg-white rounded-lg px-6 shadow-sm"
                  title={partner.name}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersStrip;