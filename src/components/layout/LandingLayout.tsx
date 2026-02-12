import React, { ReactNode, useEffect } from 'react';
import { MotionProvider } from '../../context/MotionContext';

interface LandingLayoutProps {
  children: ReactNode;
  disableSnapScroll?: boolean;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({
  children,
  disableSnapScroll = false,
}) => {

  useEffect(() => {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');

    return () => {
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  return (
    <MotionProvider>
      <div className="font-display text-text">
        <main
          className={
            'scroll-smooth overflow-y-auto h-screen' +
            (disableSnapScroll ? '' : ' snap-y snap-mandatory')
          }
        >
          {children}
        </main>
      </div>
    </MotionProvider>
  );
};

export default LandingLayout;
