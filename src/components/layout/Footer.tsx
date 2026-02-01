import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Github as GitHub } from 'lucide-react';
import { MotionContext } from '../../context/MotionContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  openAdminLoginModal?: () => void;
}

const Footer: React.FC<FooterProps> = ({ openAdminLoginModal }) => {
  const { enabled } = useContext(MotionContext);
  const { user } = useAuth();
  
  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    { icon: <GitHub size={20} />, href: "#", label: "GitHub" }
  ];
  
  const footerLinks = [
    { text: "About Us", href: "/about" },
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Terms of Service", href: "/terms" },
    { text: "Refund Policy", href: "/refund-policy" },
    { text: "Contact", href: "/contact" }
  ];
  
  const socialItemVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: 0.1 * i, duration: 0.3 }
    })
  };
  
  const navItemVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: 0.05 * i, duration: 0.3 }
    })
  };
  
  // CSS animation for pulsing the chatbot button
  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.9; }
    }
  `;

  // If user is logged in, don't render the footer (it will be hidden by CSS)
  if (user) {
    return null;
  }

  return (
    <footer className="py-12 bg-greyed-navy text-greyed-white snap-start">
      <style>{pulseKeyframes}</style>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="mb-6">
              <img
                src="/Logo PNG copy.png"
                alt="GreyEd Logo"
                className="h-10 w-auto mb-2"
                loading="lazy"
              />
              <p className="text-greyed-blue">Personalized AI tutoring</p>
            </div>
            
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((link, index) => (
                enabled ? (
                  <motion.a
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    custom={index}
                    variants={socialItemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-greyed-blue hover:text-greyed-navy transition-colors"
                  >
                    {link.icon}
                  </motion.a>
                ) : (
                  <a
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-greyed-blue hover:text-greyed-navy transition-colors"
                  >
                    {link.icon}
                  </a>
                )
              ))}
            </div>
            
            <p className="text-greyed-white/60 text-sm">
              GreyEd, Inc.<br />
              690 Saratoga Ave<br />
              San Jose, CA 95129
            </p>
          </div>
          
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-headline font-semibold mb-4 text-greyed-blue">Products</h4>
                <ul className="space-y-2">
                  {["El AI Tutor", "Study Planner", "Practice Tests", "Exam Prep"].map((item, index) => (
                    enabled ? (
                      <motion.li
                        key={index}
                        custom={index}
                        variants={navItemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <a href="#" className="text-greyed-white/80 hover:text-greyed-blue transition-colors">
                          {item}
                        </a>
                      </motion.li>
                    ) : (
                      <li key={index}>
                        <a href="#" className="text-greyed-white/80 hover:text-greyed-blue transition-colors">
                          {item}
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-headline font-semibold mb-4 text-greyed-blue">Resources</h4>
                <ul className="space-y-2">
                  {["Blog", "Student Stories", "Research", "FAQs"].map((item, index) => (
                    enabled ? (
                      <motion.li
                        key={index}
                        custom={index}
                        variants={navItemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <a href="#" className="text-greyed-white/80 hover:text-greyed-blue transition-colors">
                          {item}
                        </a>
                      </motion.li>
                    ) : (
                      <li key={index}>
                        <a href="#" className="text-greyed-white/80 hover:text-greyed-blue transition-colors">
                          {item}
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-headline font-semibold mb-4 text-greyed-blue">Company</h4>
                <ul className="space-y-2">
                  {[
                    { name: "About", path: "/about" },
                    { name: "Careers", path: "#" },
                    { name: "Press", path: "#" },
                    { name: "Contact", path: "/contact" },
                    { name: "Admin", path: "#", onClick: openAdminLoginModal }
                  ].map((item, index) => (
                    enabled ? (
                      <motion.li
                        key={index}
                        custom={index}
                        variants={navItemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        {item.onClick ? (
                          <button 
                            onClick={item.onClick}
                            className="text-greyed-white/80 hover:text-greyed-blue transition-colors"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link to={item.path} className="text-greyed-white/80 hover:text-greyed-blue transition-colors">
                            {item.name}
                          </Link>
                        )}
                      </motion.li>
                    ) : (
                      <li key={index}>
                        {item.onClick ? (
                          <button 
                            onClick={item.onClick}
                            className="text-greyed-white/80 hover:text-greyed-blue transition-colors"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link to={item.path} className="text-greyed-white/80 hover:text-greyed-blue transition-colors">
                            {item.name}
                          </Link>
                        )}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-greyed-white/60 mb-4 md:mb-0">
            © 2024 GreyEd. All rights reserved.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {footerLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.href}
                className="text-sm text-greyed-white/60 hover:text-greyed-blue transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;