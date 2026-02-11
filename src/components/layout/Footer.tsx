import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Github as GitHub } from 'lucide-react';
import { MotionContext } from '../../context/MotionContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  openAdminLoginModal?: () => void;
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: 0.05 * i, duration: 0.3 },
  }),
};

/** Extracted FooterLink — eliminates the enabled ? motion.li : li duplication */
const FooterLink: React.FC<{
  to: string;
  children: React.ReactNode;
  index: number;
  onClick?: () => void;
}> = ({ to, children, index, onClick }) => {
  const { enabled } = useContext(MotionContext);
  const Li = enabled ? motion.li : ('li' as any);
  const motionProps = enabled
    ? { custom: index, variants: itemVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true } }
    : {};

  if (onClick) {
    return (
      <Li {...motionProps}>
        <button onClick={onClick} className="text-surface-white/80 hover:text-accent transition-colors">
          {children}
        </button>
      </Li>
    );
  }

  return (
    <Li {...motionProps}>
      <Link to={to} className="text-surface-white/80 hover:text-accent transition-colors">
        {children}
      </Link>
    </Li>
  );
};

const Footer: React.FC<FooterProps> = ({ openAdminLoginModal }) => {
  const { enabled } = useContext(MotionContext);
  const { user } = useAuth();
  const A = enabled ? motion.a : ('a' as any);

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <GitHub size={20} />, href: '#', label: 'GitHub' },
  ];

  const bottomLinks = [
    { text: 'About Us', href: '/about' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms of Service', href: '/terms' },
    { text: 'Refund Policy', href: '/refund-policy' },
    { text: 'Contact', href: '/contact' },
  ];

  if (user) return null;

  return (
    <footer className="py-12 bg-primary text-surface-white">
      <div className="container mx-auto px-4">
        {/* siSwati Proverb Banner */}
        <div className="text-center mb-8 pb-6 border-b border-white/10">
          <p className="text-accent italic font-headline text-lg">"Umuntfu ngumuntfu ngabantfu"</p>
          <p className="text-surface-white/60 text-sm mt-1">A person is a person through other people — Ubuntu Philosophy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="mb-6">
              <img src="/favicon.svg" alt="Cophetsheni Primary School" className="h-10 w-auto mb-2" loading="lazy" />
              <p className="text-accent font-headline font-semibold">Cophetsheni Primary School</p>
              <p className="text-surface-white/70 text-sm">Siyafunda — We are learning</p>
            </div>

            <div className="flex space-x-4 mb-6">
              {socialLinks.map((link, index) => {
                const motionProps = enabled
                  ? { custom: index, variants: itemVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true } }
                  : {};
                return (
                  <A
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                    {...motionProps}
                  >
                    {link.icon}
                  </A>
                );
              })}
            </div>

            <p className="text-surface-white/60 text-sm">
              Cophetsheni Primary School<br />
              Mpumalanga Province<br />
              South Africa
            </p>
          </div>

          {/* Links columns */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-headline font-semibold mb-4 text-accent">Products</h4>
                <ul className="space-y-2">
                  {['Lesson Planner', 'Assessments', 'Class Manager', 'Family Updates'].map((item, i) => (
                    <FooterLink key={i} to="/features" index={i}>{item}</FooterLink>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-headline font-semibold mb-4 text-accent">Resources</h4>
                <ul className="space-y-2">
                  {[
                    { name: 'About', to: '/about' },
                    { name: 'eLLM Research', to: '/ellm' },
                    { name: 'Tutoring', to: '/tutoring' },
                    { name: 'FAQs', to: '/contact' },
                  ].map((item, i) => (
                    <FooterLink key={i} to={item.to} index={i}>{item.name}</FooterLink>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-headline font-semibold mb-4 text-accent">Company</h4>
                <ul className="space-y-2">
                  <FooterLink to="/about" index={0}>About</FooterLink>
                  <FooterLink to="/contact" index={1}>Contact</FooterLink>
                  <FooterLink to="/pricing" index={2}>Pricing</FooterLink>
                  {openAdminLoginModal && (
                    <FooterLink to="#" index={3} onClick={openAdminLoginModal}>Admin</FooterLink>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-surface-white/60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Cophetsheni Primary School. Siyafunda — We are learning.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {bottomLinks.map((link, index) => (
              <Link key={index} to={link.href} className="text-sm text-surface-white/60 hover:text-accent transition-colors">
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
