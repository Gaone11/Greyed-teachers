import React, { useContext, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { AnimatedSection } from '../ui/AnimatedSection';
import { Check, X as XIcon } from 'lucide-react';

const WhyGreyEd: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const yBgTransform = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-surface-white relative overflow-hidden"
      id="why-greyed"
    >
      {/* Background gradient blob with parallax */}
      {enabled && (
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 blur-3xl"
          style={{ y: yBgTransform }}
        />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <p className="text-accent italic mb-3">"Isandla sihlamba esinye" — One hand washes the other</p>
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-primary">
            Why Cophetsheni Teachers Choose Siyafunda
          </h2>
          <p className="text-xl text-text/70 max-w-2xl mx-auto">
            From CAPS-aligned lesson plans to AI-powered assessments — everything you need to teach with confidence.
          </p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto space-y-4">
          <ComparisonCard
            title="CAPS-Aligned Lesson Plans"
            withGreyEd="AI generates plans aligned to the South African CAPS curriculum"
            without="Hours spent manually writing plans from scratch"
          />
          <ComparisonCard
            title="Smart Assessments"
            withGreyEd="Auto-generated tests and worksheets for any grade or subject"
            without="Repetitive test creation every term"
          />
          <ComparisonCard
            title="Neurodiversity Support"
            withGreyEd="Built-in accommodations for ADHD, dyslexia, and ASD learners"
            without="One-size-fits-all resources that leave learners behind"
          />
          <ComparisonCard
            title="Family Communication"
            withGreyEd="AI-powered weekly updates keep parents engaged in learning"
            without="Scattered WhatsApp messages with no structure"
          />
          <ComparisonCard
            title="Works on Any Device"
            withGreyEd="Optimized for low-data, works on phones, tablets, and desktops"
            without="Heavy platforms that need fast Wi-Fi and expensive devices"
          />
        </div>
      </div>
    </section>
  );
};

interface ComparisonCardProps {
  title: string;
  withGreyEd: string;
  without: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ title, withGreyEd, without }) => {
  const { enabled } = useContext(MotionContext);

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl border border-premium-neutral-200 bg-white hover:shadow-md transition-shadow"
      whileHover={enabled ? { y: -4 } : {}}
    >
      <div>
        <h3 className="font-headline font-semibold text-primary mb-3">{title}</h3>
        <div className="flex items-start gap-2 text-success">
          <Check className="mt-0.5 flex-shrink-0" size={16} />
          <span className="text-text">{withGreyEd}</span>
        </div>
      </div>
      <div className="flex items-start gap-2 md:pt-8 text-text-muted">
        <XIcon className="mt-0.5 flex-shrink-0 text-error/60" size={16} />
        <span className="italic">vs. {without}</span>
      </div>
    </motion.div>
  );
};

export default WhyGreyEd;
