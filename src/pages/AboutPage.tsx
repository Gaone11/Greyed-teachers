import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import HeroAbout from '../components/about/HeroAbout';
import OriginStory from '../components/about/OriginStory';
import MissionValues from '../components/about/MissionValues';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface AboutPageProps {
  openAdminLoginModal?: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ openAdminLoginModal }) => {
  useEffect(() => {
    document.title = "About — OrionX × SkyVerse888 | GreyEd at GreyEd";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Learn about the partnership between OrionX and SkyVerse888 Foundation bringing the GreyEd AI education platform to GreyEd in Mpumalanga, South Africa.');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroAbout />
        <OriginStory />
        <MissionValues />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default AboutPage;
