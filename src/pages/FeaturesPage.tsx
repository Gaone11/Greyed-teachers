import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import HeroFeatures from '../components/features/HeroFeatures';
import FeaturesAccordion from '../components/features/FeaturesAccordion';
import DeepDiveCards from '../components/features/DeepDiveCards';
import HybridSection from '../components/features/HybridSection';
import SafetyStrip from '../components/features/SafetyStrip';
import CTAJoin from '../components/features/CTAJoin';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface FeaturesPageProps {
  openAdminLoginModal?: () => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ openAdminLoginModal }) => {
  // Set document title and meta description for SEO
  useEffect(() => {
    document.title = "Features | GreyEd – Hyper-personalised AI Learning";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Discover how GreyEd\'s hyper-personalised AI tutoring adapts to your unique learning style, with features like emotion-aware feedback and smart notes to help you excel in your exams.');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroFeatures />
        <FeaturesAccordion />
        <DeepDiveCards />
        <HybridSection />
        <SafetyStrip />
        <CTAJoin />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default FeaturesPage;