import React, { useContext, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { AnimatedSection } from '../ui/AnimatedSection';
import { Check } from 'lucide-react';

const WhyGreyEd: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect for the background blob
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const yBgTransform = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-greyed-white relative overflow-hidden snap-start"
      id="why-greyed"
    >
      {/* Background gradient blob with parallax */}
      {enabled && (
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-greyed-blue/30 to-greyed-blue/5 blur-3xl"
          style={{ y: yBgTransform }}
        />
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <p className="text-greyed-blue italic mb-3">"Isandla sihlamba esinye" — One hand washes the other</p>
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-greyed-navy">
            Why Cophetsheni Teachers Choose Siyafunda
          </h2>
          <p className="text-xl text-greyed-black/70 max-w-2xl mx-auto">
            From CAPS-aligned lesson plans to AI-powered assessments — everything you need to teach with confidence.
          </p>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto">
          <TableRow
            title="CAPS-Aligned Lesson Plans"
            description="AI generates plans aligned to the South African CAPS curriculum"
            compared="Hours spent manually writing plans from scratch"
          />
          <TableRow
            title="Smart Assessments"
            description="Auto-generated tests and worksheets for any grade or subject"
            compared="Repetitive test creation every term"
          />
          <TableRow
            title="Neurodiversity Support"
            description="Built-in accommodations for ADHD, dyslexia, and ASD learners"
            compared="One-size-fits-all resources that leave learners behind"
          />
          <TableRow
            title="Tutor Communication"
            description="AI-powered weekly updates keep tutors engaged in learning"
            compared="Scattered WhatsApp messages with no structure"
          />
          <TableRow
            title="Works on Any Device"
            description="Optimized for low-data, works on phones, tablets, and desktops"
            compared="Heavy platforms that need fast Wi-Fi and expensive devices"
          />
        </div>
      </div>
    </section>
  );
};

interface TableRowProps {
  title: string;
  description: string;
  compared: string;
}

const TableRow: React.FC<TableRowProps> = ({ title, description, compared }) => {
  const { enabled } = useContext(MotionContext);
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 border-b border-greyed-navy/10 py-6 hover:bg-greyed-blue/5 rounded-lg transition-all px-4"
      whileHover={enabled ? { y: -6, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" } : {}}
    >
      <div className="font-headline font-semibold text-greyed-navy mb-2 md:mb-0">
        {title}
      </div>
      <div className="flex items-start text-greyed-black">
        <Check className="text-green-500 mt-1 mr-2 flex-shrink-0" size={16} />
        <span>{description}</span>
      </div>
      <div className="text-greyed-black/60 mt-2 md:mt-0 md:text-right italic">
        vs. {compared}
      </div>
    </motion.div>
  );
};

export default WhyGreyEd;