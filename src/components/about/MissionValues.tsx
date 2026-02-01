import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Scale, Heart, UserCheck, Lightbulb } from 'lucide-react';

interface ValueTileProps {
  icon: React.ReactNode;
  title: string;
  index: number;
}

const MissionValues: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const values = [
    {
      icon: <Scale className="w-8 h-8" />,
      title: "Equity"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Empathy"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Personalisation"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Continuous Learning"
    }
  ];
  
  const missionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-greyed-beige snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          {enabled ? (
            <motion.div
              variants={missionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                Our Mission
              </h2>
              <p className="text-2xl text-greyed-navy/90 max-w-3xl mx-auto">
                "Democratise quality learning through empathic AI that adapts as fast as students do."
              </p>
            </motion.div>
          ) : (
            <div className="mb-16">
              <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                Our Mission
              </h2>
              <p className="text-2xl text-greyed-navy/90 max-w-3xl mx-auto">
                "Democratise quality learning through empathic AI that adapts as fast as students do."
              </p>
            </div>
          )}
          
          <h3 className="text-2xl font-headline font-semibold mb-10 text-greyed-navy">
            Core Values
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueTile
                key={index}
                icon={value.icon}
                title={value.title}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ValueTile: React.FC<ValueTileProps> = ({ icon, title, index }) => {
  const { enabled } = useContext(MotionContext);
  
  const tileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: 0.1 * index }
    }
  };

  return (
    enabled ? (
      <motion.div
        variants={tileVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center text-greyed-navy mb-4">
          {icon}
        </div>
        <h4 className="font-headline font-semibold text-greyed-navy">{title}</h4>
      </motion.div>
    ) : (
      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
        <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center text-greyed-navy mb-4">
          {icon}
        </div>
        <h4 className="font-headline font-semibold text-greyed-navy">{title}</h4>
      </div>
    )
  );
};

export default MissionValues;