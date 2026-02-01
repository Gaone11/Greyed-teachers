import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import HeroContact from '../components/contact/HeroContact';
import ContactOptions from '../components/contact/ContactOptions';
import ContactForm from '../components/contact/ContactForm';
import OfficeLocations from '../components/contact/OfficeLocations';
import SupportFAQ from '../components/contact/SupportFAQ';
import CTAJoin from '../components/features/CTAJoin';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface ContactPageProps {
  openAdminLoginModal?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ openAdminLoginModal }) => {
  // Set document title and meta description for SEO
  useEffect(() => {
    document.title = "Contact Us | GreyEd";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Questions about GreyEd? Need help choosing the right plan? Reach our team by chat, email, phone or the form below.');
    }
    
    // Track page view
    if (!sessionStorage.getItem('contact_viewed')) {
      sessionStorage.setItem('contact_viewed', 'true');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroContact />
        <ContactOptions />
        <ContactForm />
        <OfficeLocations />
        <SupportFAQ />
        <CTAJoin />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default ContactPage;