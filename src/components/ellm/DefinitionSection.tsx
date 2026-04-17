import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Brain, BarChart, Clock } from 'lucide-react';

const DefinitionSection: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const leftColumnVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const rightColumnVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };
  
  const listItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2 + (i * 0.1),
        duration: 0.3
      }
    })
  };

  const features = [
    {
      icon: <Brain className="w-5 h-5 text-greyed-blue" />,
      text: "Built on Transformers trained on text and audio."
    },
    {
      icon: <Clock className="w-5 h-5 text-greyed-blue" />,
      text: "Detects user frustration, boredom, or confidence in < 1 s."
    },
    {
      icon: <BarChart className="w-5 h-5 text-greyed-blue" />,
      text: "Adds an emotional layer on top of classic language understanding."
    }
  ];

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {enabled ? (
            <>
              <motion.div
                variants={leftColumnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                  What is an eLLM?
                </h2>
                <p className="text-lg mb-8 text-greyed-black/80">
                  AI that reads tone, rhythm and prosody to infer emotion, then tailors its response.
                </p>
                
                <ul className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      custom={index}
                      variants={listItemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <div className="mr-4 bg-greyed-blue/20 p-2 rounded-full">
                        {feature.icon}
                      </div>
                      <span className="text-greyed-black/80">{feature.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                variants={rightColumnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <div className="w-full max-w-md bg-greyed-navy rounded-xl p-6 font-mono text-sm overflow-hidden">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-8000"></div>
                    <div className="ml-4 text-greyed-white/70 text-xs">ellm-response.json</div>
                  </div>
                  <pre className="text-greyed-white/90 overflow-x-auto">
{`{
  "analysis": {
    "intent": "solve_equation",
    "mood": "frustrated",
    "confidence": 0.87
  },
  "response": {
    "tone": "encouraging",
    "template": "explanation_v2",
    "content": "Let's take a step back..."
  }
}`}
                  </pre>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy">
                  What is an eLLM?
                </h2>
                <p className="text-lg mb-8 text-greyed-black/80">
                  AI that reads tone, rhythm and prosody to infer emotion, then tailors its response.
                </p>
                
                <ul className="space-y-6">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start"
                    >
                      <div className="mr-4 bg-greyed-blue/20 p-2 rounded-full">
                        {feature.icon}
                      </div>
                      <span className="text-greyed-black/80">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md bg-greyed-navy rounded-xl p-6 font-mono text-sm overflow-hidden">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-8000"></div>
                    <div className="ml-4 text-greyed-white/70 text-xs">ellm-response.json</div>
                  </div>
                  <pre className="text-greyed-white/90 overflow-x-auto">
{`{
  "analysis": {
    "intent": "solve_equation",
    "mood": "frustrated",
    "confidence": 0.87
  },
  "response": {
    "tone": "encouraging",
    "template": "explanation_v2",
    "content": "Let's take a step back..."
  }
}`}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DefinitionSection;