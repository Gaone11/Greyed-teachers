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
                    alt="Cophetsheni Primary School, Mpumalanga" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-greyed-navy/70 p-4">
                    <p className="text-greyed-white font-headline font-semibold">Cophetsheni Primary School</p>
                    <p className="text-greyed-blue text-sm">Mpumalanga Province, South Africa</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="text-lg italic text-greyed-navy/70 mb-6">
                  "Umuntfu ngumuntfu ngabantfu" — A person is a person through other people.
                </p>
                <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                  It started with a vision.
                </h2>
                <p className="text-greyed-black/80 mb-4">
                  At Cophetsheni Primary School in rural Mpumalanga, teachers faced an all-too-common challenge: delivering quality education with limited resources. Large class sizes, scarce teaching materials, and connectivity gaps made it difficult to give every learner the attention they deserved.
                </p>
                <p className="text-greyed-black/80 mb-4">
                  The school recognised that rural Mpumalanga teachers needed AI-powered tools to deliver quality CAPS-aligned education despite these resource constraints. Siyafunda — siSwati for "We are learning" — was born from this vision, leveraging technology to empower teachers in under-resourced communities.
                </p>
                <p className="text-greyed-black/80">
                  Siyafunda AI now supports teachers across Mpumalanga with lesson planning, learner assessments, and personalised learning pathways — all aligned to the South African CAPS curriculum. What began at one school is now uplifting entire communities, guided by the Ubuntu philosophy that binds us together.
                </p>
              </motion.div>
            </>
          ) : (
            <>
              <div className="h-full flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Cophetsheni Primary School, Mpumalanga" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-greyed-navy/70 p-4">
                    <p className="text-greyed-white font-headline font-semibold">Cophetsheni Primary School</p>
                    <p className="text-greyed-blue text-sm">Mpumalanga Province, South Africa</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-lg italic text-greyed-navy/70 mb-6">
                  "Umuntfu ngumuntfu ngabantfu" — A person is a person through other people.
                </p>
                <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                  It started with a vision.
                </h2>
                <p className="text-greyed-black/80 mb-4">
                  At Cophetsheni Primary School in rural Mpumalanga, teachers faced an all-too-common challenge: delivering quality education with limited resources. Large class sizes, scarce teaching materials, and connectivity gaps made it difficult to give every learner the attention they deserved.
                </p>
                <p className="text-greyed-black/80 mb-4">
                  The school recognised that rural Mpumalanga teachers needed AI-powered tools to deliver quality CAPS-aligned education despite these resource constraints. Siyafunda — siSwati for "We are learning" — was born from this vision, leveraging technology to empower teachers in under-resourced communities.
                </p>
                <p className="text-greyed-black/80">
                  Siyafunda AI now supports teachers across Mpumalanga with lesson planning, learner assessments, and personalised learning pathways — all aligned to the South African CAPS curriculum. What began at one school is now uplifting entire communities, guided by the Ubuntu philosophy that binds us together.
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