import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { deepDiveCardsData } from '../../data/featuresData';
import { ShieldCheck, WifiOff, Eye } from 'lucide-react';

const DeepDiveCards: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  // Get the appropriate icon component based on the name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck size={24} />;
      case 'WifiOff':
        return <WifiOff size={24} />;
      case 'Eye':
        return <Eye size={24} />;
      default:
        return null;
    }
  };
  
  // Animation variants for the cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.3
      }
    })
  };

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-greyed-navy mb-12 text-center">
            Built with your needs in mind
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deepDiveCardsData.map((card, index) => (
              enabled ? (
                <motion.div
                  key={card.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-3">
                      {getIconComponent(card.icon)}
                    </div>
                    <h3 className="font-headline font-semibold text-greyed-navy">{card.title}</h3>
                  </div>
                  <p className="text-greyed-black/70">{card.description}</p>
                </motion.div>
              ) : (
                <div
                  key={card.id}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-3">
                      {getIconComponent(card.icon)}
                    </div>
                    <h3 className="font-headline font-semibold text-greyed-navy">{card.title}</h3>
                  </div>
                  <p className="text-greyed-black/70">{card.description}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeepDiveCards;