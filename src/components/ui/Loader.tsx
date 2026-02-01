import React from 'react';
import NavBar from '../layout/NavBar';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = true, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-premium-slate via-premium-slateLight to-premium-slateDark">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="mx-auto flex items-center justify-center animate-pulse-glow">
                <img
                  src="/favicon.svg"
                  alt="GreyEd"
                  className="h-24 w-auto"
                  loading="eager"
                />
              </div>
            </div>
            <p className="mt-6 text-greyed-navy font-bold text-lg">{message}</p>
            <p className="mt-2 text-greyed-navy/70 text-sm">Just a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="flex items-center justify-center animate-pulse">
          <img
            src="/favicon.svg"
            alt="GreyEd"
            className="h-12 w-auto"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;