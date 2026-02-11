import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MotionContext } from '../../context/MotionContext';

interface AccordionItemProps {
  question: string;
  answer: string;
  id: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQAccordion: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const isMobile = window.innerWidth < 768;
  
  // FAQ data
  const faqItems = [
    {
      id: 'emotion-detection',
      question: 'How is emotion detected?',
      answer: 'Prosody + lexical cues, no facial recognition required.'
    },
    {
      id: 'teacher-replacement',
      question: 'Does eLLM replace teachers?',
      answer: 'No, it augments teachers with data insights.'
    },
    {
      id: 'model-updates',
      question: 'How often is the model updated?',
      answer: 'Weekly minor, quarterly major.'
    },
    {
      id: 'on-prem',
      question: 'Can schools run it on-prem?',
      answer: 'Private cloud & on-prem options available.'
    }
  ];
  
  // Initialize with first item open on desktop
  useEffect(() => {
    if (!isMobile && faqItems.length > 0) {
      setOpenItems(new Set([faqItems[0].id]));
    }
  }, [isMobile]);
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev);
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        newOpenItems.add(id);
      }
      return newOpenItems;
    });
  };

  return (
    <section className="py-16 bg-surface-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-center text-primary mb-10">
            Frequently Asked Questions
          </h2>
          
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  question, 
  answer, 
  id, 
  isOpen, 
  onToggle
}) => {
  const { enabled } = useContext(MotionContext);
  
  const contentVariants = {
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    },
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        height: { duration: 0.3 },
        opacity: { duration: 0.25, delay: 0.1 }
      }
    }
  };
  
  // Reduced motion alternative
  const reducedMotionVariants = {
    closed: { 
      opacity: 0,
      transition: { 
        duration: 0.1
      }
    },
    open: { 
      opacity: 1,
      transition: { 
        duration: 0.1
      }
    }
  };

  return (
    <div 
      className="border-b border-primary/10 py-4"
      id={`faq-item-${id}`}
    >
      <h3>
        <button
          className="flex justify-between items-center w-full text-left py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded font-headline font-semibold text-lg"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
        >
          {question}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 ml-2"
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>
      </h3>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`panel-${id}`}
            role="region"
            aria-labelledby={`faq-item-${id}`}
            variants={enabled ? contentVariants : reducedMotionVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="py-4 text-text/80">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQAccordion;