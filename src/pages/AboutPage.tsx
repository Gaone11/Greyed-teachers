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
    document.title = "About Us | GreyEd";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Learn how GreyEd began in Botswana, grew into a global ed-tech innovator, and why our mission is to deliver empathic, personalised education for every learner.');
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