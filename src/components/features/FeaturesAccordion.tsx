import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MotionContext } from '../../context/MotionContext';
import { featuresAccordionData } from '../../data/featuresData';

interface AccordionItemProps {
  title: string;
  content: string;
  id: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FeaturesAccordion: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const isMobile = window.innerWidth < 768;
  
  // Initialize with first item open on desktop
  useEffect(() => {
    if (!isMobile && featuresAccordionData.length > 0) {
      setOpenItems(new Set([featuresAccordionData[0].id]));
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
    <section className="py-20 bg-surface-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {featuresAccordionData.map((item, index) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.body_md}
              isOpen={openItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  content, 
  id, 
  isOpen, 
  onToggle,
  index 
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
      id={`accordion-item-${id}`}
    >
      <h3>
        <button
          className="flex justify-between items-center w-full text-left py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded font-headline font-semibold text-lg"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
        >
          {title}
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
            aria-labelledby={`accordion-item-${id}`}
            variants={enabled ? contentVariants : reducedMotionVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="py-4 text-text/80">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturesAccordion;