import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { UserCheck, BookOpen, HeartHandshake } from 'lucide-react';

const TutorBenefits: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const benefits = [
    {
      icon: <UserCheck className="w-10 h-10" />,
      title: "A shared view of progress",
      description: "Tutors, students and parents can all see how learning is going, so nobody has to wait for the next session to find out."
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Curriculum-aligned",
      description: "Support for NERDC, CAPS, BGCSE, JCE, IGCSE, GCSE and A Level means students practise on the curriculum they are studying."
    },
    {
      icon: <HeartHandshake className="w-10 h-10" />,
      title: "Support between sessions",
      description: "El and the Learning Hub give students explanations, flashcards and quizzes whenever they need them, alongside their tutor."
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.15 }
    })
  };

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold mb-12 text-greyed-navy text-center">
          What Tutors and Families Gain
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            enabled ? (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                className="bg-white rounded-lg p-6 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-greyed-navy">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{benefit.title}</h3>
                <p className="text-greyed-navy/80">{benefit.description}</p>
              </motion.div>
            ) : (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-greyed-navy">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{benefit.title}</h3>
                <p className="text-greyed-navy/80">{benefit.description}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorBenefits;
