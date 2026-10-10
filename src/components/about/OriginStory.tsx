import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

const hubs = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Student Hub",
    description: "Ask El, the Learning Hub topic explorer across 9 STEM subjects, goals, achievements, timetable and homework."
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Teacher Hub",
    description: "Classes, an AI lesson planner, AI test maker, AI auto-grading, analytics, timetable and communication."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Parent Hub",
    description: "A child dashboard, communication with teachers, timetable and notifications."
  }
];

const OriginStory: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const leftVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const storyContent = (
    <>
      <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
        About GreyEd
      </h2>
      <p className="text-lg text-greyed-navy/90 mb-4">
        GreyEd is an AI-native learning platform operated by <strong>OrionX</strong>. We build Africa-rooted AI for learning, so that every learner can access quality support that reflects their curriculum and context.
      </p>
      <p className="text-lg text-greyed-navy/90 mb-4">
        GreyEd serves students, teachers, parents and private tutors. Schools and organisations can bring the whole platform to their communities through GreyEd Enterprise.
      </p>
      <p className="text-lg text-greyed-navy/90 mb-4">
        At the centre of GreyEd is <strong>El</strong>, our AI assistant, powered by the Uhuru 3 LLM and GreyEd's eLLM (emotional large language model).
      </p>
      <p className="text-lg text-greyed-navy/90">
        GreyEd is pan-African and multi-curriculum, supporting NERDC (Nigeria), CAPS (South Africa), BGCSE and JCE (Botswana), as well as IGCSE, GCSE and A Level.
      </p>
    </>
  );

  const hubsContent = (
    <div className="space-y-4">
      <h3 className="text-xl font-headline font-semibold text-greyed-navy mb-2">
        Three connected hubs
      </h3>
      {hubs.map((hub) => (
        <div key={hub.title} className="flex items-start bg-greyed-beige/30 rounded-xl p-5">
          <div className="mr-4 bg-greyed-blue/20 p-3 rounded-full flex-shrink-0 text-greyed-navy">
            {hub.icon}
          </div>
          <div>
            <h4 className="font-headline font-semibold text-greyed-navy mb-1">{hub.title}</h4>
            <p className="text-greyed-navy/80">{hub.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {enabled ? (
            <>
              <motion.div
                variants={leftVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {storyContent}
              </motion.div>
              <motion.div
                variants={rightVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {hubsContent}
              </motion.div>
            </>
          ) : (
            <>
              <div>{storyContent}</div>
              <div>{hubsContent}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OriginStory;
