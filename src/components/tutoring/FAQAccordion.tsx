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
      id: 'who-is-it-for',
      question: 'Who is GreyEd tutoring for?',
      answer: 'GreyEd is for private tutors who want to work more closely with their students and keep parents informed. Parents and students can also use GreyEd alongside their tutor.'
    },
    {
      id: 'find-students',
      question: 'Can I find new students on GreyEd?',
      answer: 'Not at the moment. GreyEd does not offer a tutor marketplace. It is designed to help you work with the students and families you already tutor.'
    },
    {
      id: 'what-subjects',
      question: 'Which curricula are supported?',
      answer: 'GreyEd supports NERDC (Nigeria), CAPS (South Africa), BGCSE and JCE (Botswana), as well as IGCSE, GCSE and A Level. The Learning Hub covers 9 STEM subjects.'
    },
    {
      id: 'role-of-el',
      question: 'What does El do?',
      answer: 'El is the GreyEd AI assistant, powered by the Uhuru 3 LLM and GreyEd\'s eLLM (emotional large language model). Students can ask El questions and get explanations between sessions, while you remain the guide for their learning.'
    },
    {
      id: 'pricing',
      question: 'How much does it cost?',
      answer: 'GreyEd offers Basic (free), Standard, Premium and Enterprise plans. See the pricing page for what each plan includes.'
    },
    {
      id: 'privacy',
      question: 'How is student data protected?',
      answer: 'We take the privacy of students and families seriously. Our Privacy Policy explains how GreyEd collects, uses and protects personal data. For questions, contact support@greyed.org.'
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
