import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { MessageCircle, Mail, Phone } from 'lucide-react';

interface ContactOptionCardProps {
  icon: React.ReactNode;
  title: string;
  details: string;
  index: number;
  onClick?: () => void;
}

const ContactOptions: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const options = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      details: "Click the speech-bubble bottom-right.",
      onClick: () => {}
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email",
      details: "hello@greyed.org",
      onClick: () => {}
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call",
      details: "+447949711307 (09:00-17:00 CAT)",
      onClick: () => {}
    }
  ];

  return (
    <section className="py-12 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
          {options.map((option, index) => (
            <ContactOptionCard
              key={index}
              icon={option.icon}
              title={option.title}
              details={option.details}
              index={index}
              onClick={option.onClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactOptionCard: React.FC<ContactOptionCardProps> = ({
  icon,
  title,
  details,
  index,
  onClick
}) => {
  const { enabled } = useContext(MotionContext);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: index * 0.15 }
    }
  };

  return enabled ? (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all flex-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-greyed-navy">
        {icon}
      </div>
      <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{title}</h3>
      <p className="text-greyed-navy/80">{details}</p>
    </motion.div>
  ) : (
    <div
      className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all flex-1 cursor-pointer hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 text-greyed-navy">
        {icon}
      </div>
      <h3 className="text-xl font-headline font-semibold mb-2 text-greyed-navy">{title}</h3>
      <p className="text-greyed-navy/80">{details}</p>
    </div>
  );
};

export default ContactOptions;