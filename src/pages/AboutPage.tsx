import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import HeroAbout from '../components/about/HeroAbout';
import OriginStory from '../components/about/OriginStory';
import MissionValues from '../components/about/MissionValues';
import CareersCTA from '../components/about/CareersCTA';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface AboutPageProps {
  openAdminLoginModal?: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ openAdminLoginModal }) => {
  useEffect(() => {
    document.title = "About GreyEd | Africa-Rooted AI for Learning";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'GreyEd is an AI-native learning platform operated by OrionX, democratizing quality learning for students, teachers, parents and tutors across African and international curricula.');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroAbout />
        <OriginStory />
        <MissionValues />
        <CareersCTA />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default AboutPage;
