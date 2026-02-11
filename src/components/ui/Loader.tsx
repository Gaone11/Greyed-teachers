import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = true, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-premium-slate via-premium-slateLight to-premium-slateDark" role="status" aria-label={message} aria-busy="true">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="mx-auto flex items-center justify-center animate-pulse-glow">
              <img
                src="/favicon.svg"
                alt=""
                className="h-24 w-auto"
                loading="eager"
              />
            </div>
          </div>
          <p className="mt-6 text-primary font-bold text-lg">{message}</p>
          <p className="mt-2 text-primary/70 text-sm">Just a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label={message} aria-busy="true">
      <div className="relative">
        <div className="flex items-center justify-center animate-pulse">
          <img
            src="/favicon.svg"
            alt=""
            className="h-12 w-auto"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
