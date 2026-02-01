import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface MotionContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const MotionContext = createContext<MotionContextType>({ 
  enabled: true, 
  setEnabled: () => {} 
});

interface MotionProviderProps {
  children: ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const [enabled, setEnabled] = useState(!prefersReduced);
  
  // Update enabled state when prefersReduced changes
  useEffect(() => {
    setEnabled(!prefersReduced);
  }, [prefersReduced]);
  
  return (
    <MotionContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </MotionContext.Provider>
  );
};