import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { ClipboardList, Users, TrendingUp } from 'lucide-react';

const BookingProcess: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Connect with your students and families",
      description: "Bring the students you already tutor, and their parents, onto GreyEd so everyone works from the same picture of progress."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Teach, with El alongside",
      description: "Run your sessions as you normally would. Between sessions, students can ask El questions and revise in the Learning Hub."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Share progress with parents",
      description: "Send progress updates covering topics, homework and assessments, so parents can follow their child's learning."
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: i * 0.15 }
    })
  };

  return (
    <section className="py-20 bg-greyed-beige/30 snap-start">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold mb-10 text-greyed-navy text-center">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {steps.map((step, index) => (
            enabled ? (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                className="bg-greyed-beige rounded-2xl p-6 flex-1 shadow-sm"
              >
                <div className="w-12 h-12 bg-greyed-navy text-greyed-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <div className="mb-4 text-greyed-navy">
                  {step.icon}
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{step.title}</h3>
                <p className="text-greyed-navy/80">{step.description}</p>
              </motion.div>
            ) : (
              <div
                key={index}
                className="bg-greyed-beige rounded-2xl p-6 flex-1 shadow-sm"
              >
                <div className="w-12 h-12 bg-greyed-navy text-greyed-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <div className="mb-4 text-greyed-navy">
                  {step.icon}
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{step.title}</h3>
                <p className="text-greyed-navy/80">{step.description}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingProcess;
