import React, { useContext, useState } from 'react';
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

const SupportFAQ: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['reply-speed']));
  
  // FAQ data
  const faqItems = [
    {
      id: 'reply-speed',
      question: 'How fast will you reply?',
      answer: 'Within one business day.'
    },
    {
      id: 'live-chat',
      question: 'Do you provide live chat support?',
      answer: 'Yes, 09:00-22:00 GMT.'
    },
    {
      id: 'report-bug',
      question: 'Where can I report a bug?',
      answer: 'Via the form or email support@greyed.org.'
    },
    {
      id: 'under-16',
      question: "I'm under 16—can I contact you directly?",
      answer: 'Please ask a guardian/teacher to fill the form.'
    }
  ];
  
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
    <section className="py-16 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-center text-greyed-navy mb-10">
            Support FAQs
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
      className="border-b border-greyed-navy/10 py-4"
      id={`faq-item-${id}`}
    >
      <h3>
        <button
          className="flex justify-between items-center w-full text-left py-2 text-greyed-navy focus:outline-none focus:ring-2 focus:ring-greyed-blue rounded font-headline font-semibold text-lg"
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
            <div className="py-4 text-greyed-black/80">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportFAQ;