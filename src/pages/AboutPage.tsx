import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import HeroAbout from '../components/about/HeroAbout';
import OriginStory from '../components/about/OriginStory';
import MissionValues from '../components/about/MissionValues';
import TimelineMilestones from '../components/about/TimelineMilestones';
import LeadershipTeam from '../components/about/LeadershipTeam';
import GlobalFootprint from '../components/about/GlobalFootprint';
import PartnersStrip from '../components/about/PartnersStrip';
import CareersCTA from '../components/about/CareersCTA';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface AboutPageProps {
  openAdminLoginModal?: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ openAdminLoginModal }) => {
  // Set document title and meta description for SEO
  useEffect(() => {
    document.title = "About Us | Siyafunda — Cophetsheni Primary School";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Learn how Siyafunda was born at Cophetsheni Primary School in Mpumalanga, South Africa — empowering rural teachers with AI-powered, CAPS-aligned tools to deliver quality education in under-resourced communities.');
    }
    
    // Track page view
    if (!sessionStorage.getItem('about_viewed')) {
      sessionStorage.setItem('about_viewed', 'true');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroAbout />
        <OriginStory />
        <MissionValues />
        <TimelineMilestones />
        <LeadershipTeam />
        <GlobalFootprint />
        <PartnersStrip />
        <CareersCTA />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default AboutPage;