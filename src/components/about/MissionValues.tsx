import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { GraduationCap, Shield, Users, BarChart } from 'lucide-react';

interface ObjectiveTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const MissionValues: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const objectives = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Educator Enablement",
      description: "Equipping teachers with AI-powered tools and training so they can deliver quality, CAPS-aligned education."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Learner Support",
      description: "Providing personalised learning pathways and human tutoring support to help every learner succeed."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safeguarding",
      description: "Maintaining strict child protection, data privacy and safety measures throughout the programme."
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Evidence & Learning",
      description: "Measuring impact through structured monitoring, evaluation and learning to guide future decisions."
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
                Programme Objectives
              </h2>
              <p className="text-xl text-greyed-navy/90 max-w-3xl mx-auto">
                The pilot aims to validate the GreyEd solution in a South African public-school context, building evidence for what works and laying the foundation for broader impact.
              </p>
            </motion.div>
          ) : (
            <div className="mb-16">
              <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                Programme Objectives
              </h2>
              <p className="text-xl text-greyed-navy/90 max-w-3xl mx-auto">
                The pilot aims to validate the GreyEd solution in a South African public-school context, building evidence for what works and laying the foundation for broader impact.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj, index) => (
              <ObjectiveTile
                key={index}
                icon={obj.icon}
                title={obj.title}
                description={obj.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ObjectiveTile: React.FC<ObjectiveTileProps> = ({ icon, title, description, index }) => {
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
        className="bg-white rounded-xl p-6 shadow-sm text-left"
      >
        <div className="w-14 h-14 bg-greyed-blue/20 rounded-full flex items-center justify-center text-greyed-navy mb-4">
          {icon}
        </div>
        <h4 className="font-headline font-semibold text-greyed-navy mb-2 text-lg">{title}</h4>
        <p className="text-greyed-navy/80">{description}</p>
      </motion.div>
    ) : (
      <div className="bg-white rounded-xl p-6 shadow-sm text-left">
        <div className="w-14 h-14 bg-greyed-blue/20 rounded-full flex items-center justify-center text-greyed-navy mb-4">
          {icon}
        </div>
        <h4 className="font-headline font-semibold text-greyed-navy mb-2 text-lg">{title}</h4>
        <p className="text-greyed-navy/80">{description}</p>
      </div>
    )
  );
};

export default MissionValues;
