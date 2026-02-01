import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { BookOpen, MessageCircle, Sparkles } from 'lucide-react';

const tabs = [
  {
    id: 'tutor',
    label: 'Tutor',
    icon: <MessageCircle className="w-5 h-5" />,
    content: "GreyEd's AI tutor adjusts tone and examples on the fly, giving frustrated learners simpler analogies and confident learners deeper challenges."
  },
  {
    id: 'textbooks',
    label: 'Textbooks',
    icon: <BookOpen className="w-5 h-5" />,
    content: "Ask a live question inside any eTextbook; eLLM replies with empathetic, syllabus-aligned answers."
  },
  {
    id: 'creative',
    label: 'Creative Modules',
    icon: <Sparkles className="w-5 h-5" />,
    content: "Students brainstorm with an eLLM 'co-creator' that praises good ideas, gently critiques weak ones and keeps morale high."
  }
];

const GreyEdImplementation: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  const getActiveTabIndex = () => {
    return tabs.findIndex(tab => tab.id === activeTab);
  };
  
  const underlineVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-headline font-bold mb-10 text-greyed-navy text-center">
            How GreyEd Implements eLLM
          </h2>
          
          {/* Tabs */}
          <div className="flex border-b border-greyed-navy/10 mb-8" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={`flex items-center py-3 px-6 relative focus:outline-none focus:ring-2 focus:ring-greyed-blue rounded-t ${
                  activeTab === tab.id ? 'text-greyed-navy font-medium' : 'text-greyed-navy/60 hover:text-greyed-navy/80'
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                
                {activeTab === tab.id && enabled && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"
                    layoutId="underline"
                    variants={underlineVariants}
                    initial="hidden"
                    animate="visible"
                  />
                )}
                
                {activeTab === tab.id && !enabled && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue" />
                )}
              </button>
            ))}
          </div>
          
          {/* Tab content */}
          <div className="min-h-[150px] bg-greyed-blue/10 rounded-lg p-6">
            {enabled ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  id={`panel-${activeTab}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeTab}`}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-greyed-blue/30 flex items-center justify-center text-greyed-navy mr-3">
                      {tabs.find(tab => tab.id === activeTab)?.icon}
                    </div>
                    <h3 className="text-xl font-headline font-semibold text-greyed-navy">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h3>
                  </div>
                  <p className="text-greyed-black/80 ml-13">
                    {tabs.find(tab => tab.id === activeTab)?.content}
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="h-full"
              >
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-greyed-blue/30 flex items-center justify-center text-greyed-navy mr-3">
                    {tabs.find(tab => tab.id === activeTab)?.icon}
                  </div>
                  <h3 className="text-xl font-headline font-semibold text-greyed-navy">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h3>
                </div>
                <p className="text-greyed-black/80 ml-13">
                  {tabs.find(tab => tab.id === activeTab)?.content}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreyEdImplementation;