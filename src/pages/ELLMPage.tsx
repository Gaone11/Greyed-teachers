import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import HeroELLM from '../components/ellm/HeroELLM';
import IntroOverview from '../components/ellm/IntroOverview';
import DefinitionSection from '../components/ellm/DefinitionSection';
import EducationBenefits from '../components/ellm/EducationBenefits';
import GreyEdImplementation from '../components/ellm/GreyEdImplementation';
import DataInsights from '../components/ellm/DataInsights';
import TechDiagram from '../components/ellm/TechDiagram';
import SafetyBenchmarks from '../components/ellm/SafetyBenchmarks';
import FAQAccordion from '../components/ellm/FAQAccordion';
import CTAStartFree from '../components/ellm/CTAStartFree';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface ELLMPageProps {
  openAdminLoginModal?: () => void;
}

const ELLMPage: React.FC<ELLMPageProps> = ({ openAdminLoginModal }) => {
  // Set document title and meta description for SEO
  useEffect(() => {
    document.title = "eLLM | GreyEd";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Discover how GreyEd\'s emotion-aware language model personalises learning, boosts creativity and protects student wellbeing.');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroELLM />
        <IntroOverview />
        <DefinitionSection />
        <EducationBenefits />
        <GreyEdImplementation />
        <DataInsights />
        <TechDiagram />
        <SafetyBenchmarks />
        <FAQAccordion />
        <CTAStartFree />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default ELLMPage;