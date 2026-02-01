import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const OriginStory: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const imageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {enabled ? (
            <>
              <motion.div
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="h-full flex items-center justify-center"
              >
                <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Monti Kgengwenyane, Founder" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-greyed-navy/70 p-4">
                    <p className="text-greyed-white font-headline font-semibold">Monti Kgengwenyane</p>
                    <p className="text-greyed-blue text-sm">Founder & CEO</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                  It started with a challenge.
                </h2>
                <p className="text-greyed-black/80 mb-4">
                  Growing up with dyslexia in Gaborone, Monti struggled with traditional education. Teachers labeled him "slow" despite his creative problem-solving abilities. After developing a personalized learning system that helped him excel, Monti realized other students could benefit from similar adaptations.
                </p>
                <p className="text-greyed-black/80 mb-4">
                  In 2023, he sketched the initial concept for GreyEd at a Stanbic Bank innovation event—an AI tutor that could adapt to different learning styles, just as he had done manually for himself.
                </p>
                <p className="text-greyed-black/80">
                  The first pilots launched in Botswana schools in early 2024, showing remarkable results in both urban and rural settings. Now, GreyEd is expanding globally with a mission to ensure every student receives the personalized education they deserve.
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <div className="h-full flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Monti Kgengwenyane, Founder" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-greyed-navy/70 p-4">
                    <p className="text-greyed-white font-headline font-semibold">Monti Kgengwenyane</p>
                    <p className="text-greyed-blue text-sm">Founder & CEO</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                  It started with a challenge.
                </h2>
                <p className="text-greyed-black/80 mb-4">
                  Growing up with dyslexia in Gaborone, Monti struggled with traditional education. Teachers labeled him "slow" despite his creative problem-solving abilities. After developing a personalized learning system that helped him excel, Monti realized other students could benefit from similar adaptations.
                </p>
                <p className="text-greyed-black/80 mb-4">
                  In 2023, he sketched the initial concept for GreyEd at a Stanbic Bank innovation event—an AI tutor that could adapt to different learning styles, just as he had done manually for himself.
                </p>
                <p className="text-greyed-black/80">
                  The first pilots launched in Botswana schools in early 2024, showing remarkable results in both urban and rural settings. Now, GreyEd is expanding globally with a mission to ensure every student receives the personalized education they deserve.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OriginStory;