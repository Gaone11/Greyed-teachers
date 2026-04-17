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
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const isMobile = window.innerWidth < 768;

  const faqItems = [
    {
      id: 'who-are-tutors',
      question: 'Who are the tutors?',
      answer: 'Our tutors are trained individuals who work with the GreyEd platform to support learners at GreyEd. They are screened and supervised as part of the programme\'s safeguarding requirements.'
    },
    {
      id: 'what-subjects',
      question: 'What subjects are covered?',
      answer: 'Tutoring sessions are aligned to the South African CAPS curriculum and focus on the subjects and topics where learners need the most support, as identified through the GreyEd platform.'
    },
    {
      id: 'how-structured',
      question: 'How are sessions structured?',
      answer: 'Before each session, the tutor reviews learner data on GreyEd to prepare. Sessions take place one-on-one or in small groups. Afterwards, session insights are recorded so classroom teachers can follow each learner\'s progress.'
    },
    {
      id: 'safety',
      question: 'How is learner safety ensured?',
      answer: 'Learner safety is a top priority. The programme follows strict safeguarding protocols, including tutor screening, supervision, and data protection measures in compliance with South African law (POPIA).'
    }
  ];

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
    <section className="py-16 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-center text-greyed-navy mb-10">
            Common Questions
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

  const reducedMotionVariants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.1 }
    },
    open: {
      opacity: 1,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div
      className="border-b border-greyed-navy/10 py-4"
      id={`faq-item-${id}`}
    >
      <h3>
        <button
          type="button"
          className="flex justify-between items-center w-full text-left py-2 text-greyed-navy focus:outline-none focus:ring-2 focus:ring-greyed-blue rounded font-semibold text-lg"
          onClick={onToggle}
          aria-expanded={isOpen ? "true" : "false"}
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

export default FAQAccordion;
