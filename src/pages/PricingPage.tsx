import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import HeroPricing from '../components/pricing/HeroPricing';
import BillingToggle from '../components/pricing/BillingToggle';
import PlanGrid from '../components/pricing/PlanGrid';
import FeatureMatrix from '../components/pricing/FeatureMatrix';
import FAQAccordion from '../components/pricing/FAQAccordion';
import CTAJoin from '../components/pricing/CTAJoin';
import { BillingProvider } from '../context/BillingContext';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface PricingPageProps {
  openAdminLoginModal?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ openAdminLoginModal }) => {
  // Set document title and meta description for SEO
  useEffect(() => {
    document.title = "Pricing | GreyEd — Siyafunda Plans for Teachers";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Choose the Siyafunda plan that fits your teaching needs — from CAPS-aligned lesson plans to full AI-powered classroom management.');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <BillingProvider>
        <LandingLayout footerProps={{ openAdminLoginModal }}>
          <NavBar />
          <HeroPricing />
          <BillingToggle />
          <PlanGrid />
          <FeatureMatrix />
          <FAQAccordion />
          <CTAJoin />
        </LandingLayout>
      </BillingProvider>
    </UserDashboardRedirect>
  );
};

export default PricingPage;