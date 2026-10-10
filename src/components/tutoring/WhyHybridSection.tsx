import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { BarChart as ChartBar, HeartHandshake, BookOpen } from 'lucide-react';

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

  const approaches = [
    {
      icon: <ChartBar className="w-5 h-5 text-greyed-blue" />,
      title: "Progress updates for families",
      text: "Share regular updates with parents covering the topics you worked on, homework and assessments, so families always know how their child is doing."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-greyed-blue" />,
      title: "Human tutors, AI support",
      text: "You bring the encouragement and judgement that only a person can give. Between sessions, students can keep learning with El and the Learning Hub."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-greyed-blue" />,
      title: "Multi-curriculum",
      text: "GreyEd supports NERDC, CAPS, BGCSE and JCE, as well as IGCSE, GCSE and A Level, so you can tutor students on the curriculum they are studying."
    }
  ];

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-headline font-bold mb-4 text-greyed-navy text-center">
            How Tutors Use GreyEd
          </h2>
          <p className="text-greyed-navy/70 text-center mb-12 max-w-2xl mx-auto">
            GreyEd gives private tutors one place to work with their students and keep parents informed, with El, our AI assistant, supporting learning along the way.
          </p>

          <div className="space-y-8">
            {approaches.map((item, index) => (
              enabled ? (
                <motion.div
                  key={index}
                  custom={index}
                  variants={listItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start bg-greyed-beige/30 rounded-xl p-6"
                >
                  <div className="mr-5 bg-greyed-blue/20 p-3 rounded-full flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-headline font-semibold text-greyed-navy mb-1">{item.title}</h3>
                    <p className="text-greyed-navy/80">{item.text}</p>
                  </div>
                </motion.div>
              ) : (
                <div key={index} className="flex items-start bg-greyed-beige/30 rounded-xl p-6">
                  <div className="mr-5 bg-greyed-blue/20 p-3 rounded-full flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-headline font-semibold text-greyed-navy mb-1">{item.title}</h3>
                    <p className="text-greyed-navy/80">{item.text}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyHybridSection;
