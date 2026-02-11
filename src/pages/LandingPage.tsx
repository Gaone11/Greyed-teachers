import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import FeaturedOn from '../components/sections/FeaturedOn';
import WhyGreyEd from '../components/sections/WhyGreyEd';
import PersonalityCTA from '../components/sections/PersonalityCTA';
import TryElAI from '../components/sections/TryElAI';
import CurriculumGrid from '../components/sections/CurriculumGrid';
import SafetyBanner from '../components/sections/SafetyBanner';
import Testimonials from '../components/sections/Testimonials';
import MeetEl from '../components/sections/MeetEl';
import Newsletter from '../components/sections/Newsletter';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface LandingPageProps {
  openLoginModal?: () => void;
  openAdminLoginModal?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ openLoginModal, openAdminLoginModal }) => {
  return (
    <UserDashboardRedirect>
      <LandingLayout>
        <NavBar openLoginModal={openLoginModal} />
        {/* New section order: Hero → Social Proof → Problem/Solution → Features → Curriculum → Safety → Testimonials → Meet El → CTA */}
        <Hero />
        <FeaturedOn />
        <WhyGreyEd />
        <PersonalityCTA />
        <TryElAI />
        <CurriculumGrid />
        <SafetyBanner />
        <Testimonials />
        <MeetEl />
        <Newsletter />
        <Footer openAdminLoginModal={openAdminLoginModal} />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default LandingPage;
