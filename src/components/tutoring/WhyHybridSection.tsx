import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { BarChart as ChartBar, HeartHandshake, FileText } from 'lucide-react';

const WhyHybridSection: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 * i,
        duration: 0.3
      }
    })
  };
  
  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const benefits = [
    { 
      icon: <ChartBar className="w-5 h-5 text-accent" />, 
      text: "Instant insight from El AI data"
    },
    { 
      icon: <HeartHandshake className="w-5 h-5 text-accent" />, 
      text: "Real empathy & encouragement"
    },
    { 
      icon: <FileText className="w-5 h-5 text-accent" />, 
      text: "Personalised study plan after each session"
    }
  ];

  return (
    <section className="py-20 bg-surface-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-6 text-primary">
              Why a human + AI?
            </h2>
            
            <ul className="space-y-6">
              {benefits.map((benefit, index) => (
                enabled ? (
                  <motion.li
                    key={index}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <div className="mr-4 bg-accent/20 p-2 rounded-full">
                      {benefit.icon}
                    </div>
                    <span className="text-lg">{benefit.text}</span>
                  </motion.li>
                ) : (
                  <li key={index} className="flex items-start">
                    <div className="mr-4 bg-accent/20 p-2 rounded-full">
                      {benefit.icon}
                    </div>
                    <span className="text-lg">{benefit.text}</span>
                  </li>
                )
              ))}
            </ul>
          </div>
          
          {enabled ? (
            <motion.div
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              {/* Mock-up of El AI dashboard */}
              <div className="border border-primary/10 rounded-lg p-4">
                <div className="bg-primary/5 p-3 rounded-lg mb-4">
                  <h3 className="font-headline font-semibold text-primary mb-2">Student Summary</h3>
                  <div className="h-4 w-3/4 bg-primary/10 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-primary/10 rounded"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <div className="h-4 w-3/4 bg-accent/30 rounded mb-2"></div>
                    <div className="h-10 w-full bg-accent/30 rounded"></div>
                  </div>
                  <div className="bg-surface/30 p-3 rounded-lg">
                    <div className="h-4 w-3/4 bg-surface/50 rounded mb-2"></div>
                    <div className="h-10 w-full bg-surface/50 rounded"></div>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="h-4 w-1/2 bg-primary/10 rounded mb-2"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-primary/20 rounded-full"></div>
                    <div className="h-8 flex-1 bg-primary/10 rounded-lg"></div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3 text-sm text-primary/60">
                El AI Dashboard: Student Learning Profile
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-4">
              {/* Mock-up of El AI dashboard */}
              <div className="border border-primary/10 rounded-lg p-4">
                <div className="bg-primary/5 p-3 rounded-lg mb-4">
                  <h3 className="font-headline font-semibold text-primary mb-2">Student Summary</h3>
                  <div className="h-4 w-3/4 bg-primary/10 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-primary/10 rounded"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <div className="h-4 w-3/4 bg-accent/30 rounded mb-2"></div>
                    <div className="h-10 w-full bg-accent/30 rounded"></div>
                  </div>
                  <div className="bg-surface/30 p-3 rounded-lg">
                    <div className="h-4 w-3/4 bg-surface/50 rounded mb-2"></div>
                    <div className="h-10 w-full bg-surface/50 rounded"></div>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="h-4 w-1/2 bg-primary/10 rounded mb-2"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-primary/20 rounded-full"></div>
                    <div className="h-8 flex-1 bg-primary/10 rounded-lg"></div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3 text-sm text-primary/60">
                El AI Dashboard: Student Learning Profile
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhyHybridSection;