import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import HeroPricing from '../components/pricing/HeroPricing';
import BillingToggle from '../components/pricing/BillingToggle';
import IndividualPlanBuilder from '../components/pricing/IndividualPlanBuilder';
import PlanGrid from '../components/pricing/PlanGrid';
import FeatureMatrix from '../components/pricing/FeatureMatrix';
import FAQAccordion from '../components/pricing/FAQAccordion';
import CTAJoin from '../components/pricing/CTAJoin';
import { BillingProvider } from '../context/BillingContext';

interface PricingPageProps {
  openAdminLoginModal?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ openAdminLoginModal }) => {
  // Set document title and meta description for SEO
  useEffect(() => {
    document.title = "Pricing | GreyEd Tiers";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Compare GreyEd Basic, Standard, Premium, and Enterprise tiers for students, parents, teachers, schools, and organisations.');
    }
  }, []);

  return (
    <BillingProvider>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroPricing />
        <BillingToggle />
        <IndividualPlanBuilder />
        <PlanGrid />
        <FeatureMatrix />
        <FAQAccordion />
        <CTAJoin />
      </LandingLayout>
    </BillingProvider>
  );
};

export default PricingPage;
