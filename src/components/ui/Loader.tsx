import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = true, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-greyed-navy">
        {/* Subtle radial gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#212754] via-[#2a2f6e] to-[#212754]" />

        {/* Animated ring */}
        <div className="absolute w-28 h-28 rounded-full border-2 border-[#bbd7eb]/20 animate-[loaderRing_2.4s_ease-in-out_infinite]" />
        <div className="absolute w-36 h-36 rounded-full border border-[#bbd7eb]/10 animate-[loaderRing_2.4s_ease-in-out_infinite_0.4s]" />

        <div className="relative text-center animate-fade-in">
          {/* Logo with premium glow */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-[#3B82F6]/10 blur-xl animate-[loaderGlow_2s_ease-in-out_infinite]" />
            <div className="relative animate-pulse-glow">
              <img src="/logo.png" alt="GreyEd" className="h-16 w-auto brightness-0 invert drop-shadow-lg" />
            </div>
          </div>

          {/* Premium loading bar */}
          <div className="mt-8 w-48 h-[2px] bg-[#334155]/50 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#bbd7eb] via-[#d4e9f5] to-[#bbd7eb] rounded-full animate-[loaderBar_1.4s_ease-in-out_infinite]" />
          </div>

          <p className="mt-4 text-[#efeae4] font-headline font-semibold text-sm tracking-wide">{message}</p>
        </div>

        {/* Inline keyframes via style tag */}
        <style>{`
          @keyframes loaderRing {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.08); opacity: 0.6; }
          }
          @keyframes loaderGlow {
            0%, 100% { opacity: 0.4; transform: scale(0.9); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          @keyframes loaderBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  // Inline/compact loader
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative flex flex-col items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-[#3B82F6]/10 blur-lg animate-pulse" />
          <span className="font-headline font-bold text-lg text-[#bbd7eb] animate-pulse-glow relative">G</span>
        </div>
        <div className="w-24 h-[2px] bg-[#dedbc2]/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#bbd7eb] to-[#d4e9f5] rounded-full animate-[loaderBar_1.4s_ease-in-out_infinite]" />
        </div>
        <style>{`
          @keyframes loaderBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;
