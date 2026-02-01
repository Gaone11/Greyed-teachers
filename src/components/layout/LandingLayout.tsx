import React, { ReactNode, useEffect } from 'react';
import { MotionProvider } from '../../context/MotionContext';
import { useAuth } from '../../context/AuthContext';
import Footer from './Footer';

interface LandingLayoutProps {
  children: ReactNode;
  disableSnapScroll?: boolean;
  footerProps?: {
    openAdminLoginModal?: () => void;
  };
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ 
  children, 
  disableSnapScroll = false,
  footerProps
}) => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Add viewport meta tag to ensure proper mobile rendering
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    
    return () => {
      // Restore default viewport when component unmounts
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  return (
    <MotionProvider>
      <div className="font-display text-greyed-black">
        <main className={`scroll-smooth ${disableSnapScroll ? '' : 'snap-mandatory snap-y'} overflow-y-auto h-screen`}>
          {children}
        </main>
      </div>
    </MotionProvider>
  );
};

export default LandingLayout;