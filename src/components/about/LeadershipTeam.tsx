import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Linkedin } from 'lucide-react';

interface TeamMemberCardProps {
  image: string;
  name: string;
  role: string;
  highlight: string;
  index: number;
}

const LeadershipTeam: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const teamMembers = [
    {
      image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Monti Kgengwenyane",
      role: "Founder & CEO",
      highlight: "Dyslexia advocate, Forbes Africa 30U30 nominee."
    },
    {
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Alex Crane",
      role: "Operations Lead",
      highlight: "Ex-Silicon Valley scaler, ex-XYZ ed-tech."
    },
    {
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Dr. James Chen",
      role: "Chief Technology Officer",
      highlight: "10 yrs ML infra, ex-Google Brain."
    },
    {
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800",
      name: "Dr. Sarah Okonjo",
      role: "Chief Pedagogy Officer",
      highlight: "Former Cambridge examiner, special-needs specialist."
    }
  ];
  
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-greyed-navy text-greyed-white snap-start">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.h2 
            className="text-3xl font-headline font-bold mb-12 text-center"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Leadership Team
          </motion.h2>
        ) : (
          <h2 className="text-3xl font-headline font-bold mb-12 text-center">
            Leadership Team
          </h2>
        )}
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              image={member.image}
              name={member.name}
              role={member.role}
              highlight={member.highlight}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  image, 
  name, 
  role, 
  highlight, 
  index 
}) => {
  const { enabled } = useContext(MotionContext);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: index * 0.1 }
    }
  };

  return (
    enabled ? (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        whileHover={{ rotateY: 5, y: -5 }}
        tabIndex={0}
        aria-label={`${name}, ${role}`}
        className="bg-white/10 rounded-xl overflow-hidden shadow-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
      >
        <div className="aspect-[3/4] relative overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-greyed-navy/80 to-transparent flex items-end">
            <div className="p-4 w-full">
              <h3 className="font-headline font-semibold text-lg">{name}</h3>
              <p className="text-greyed-blue text-sm mb-1">{role}</p>
              <p className="text-greyed-white/80 text-xs">{highlight}</p>
              
              <div className="mt-3">
                <a 
                  href="#" 
                  className="inline-flex items-center text-xs text-greyed-blue hover:text-greyed-white transition-colors"
                  aria-label={`${name}'s LinkedIn profile`}
                >
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ) : (
      <div
        tabIndex={0}
        aria-label={`${name}, ${role}`}
        className="bg-white/10 rounded-xl overflow-hidden shadow-md hover:-translate-y-1 transition-transform focus:outline-none focus:ring-2 focus:ring-greyed-blue"
      >
        <div className="aspect-[3/4] relative overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-greyed-navy/80 to-transparent flex items-end">
            <div className="p-4 w-full">
              <h3 className="font-headline font-semibold text-lg">{name}</h3>
              <p className="text-greyed-blue text-sm mb-1">{role}</p>
              <p className="text-greyed-white/80 text-xs">{highlight}</p>
              
              <div className="mt-3">
                <a 
                  href="#" 
                  className="inline-flex items-center text-xs text-greyed-blue hover:text-greyed-white transition-colors"
                  aria-label={`${name}'s LinkedIn profile`}
                >
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default LeadershipTeam;