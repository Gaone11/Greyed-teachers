import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ViewModeContextType {
  viewMode: 'teacher' | 'student';
  setViewMode: (mode: 'teacher' | 'student') => void;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
  viewMode: 'teacher',
  setViewMode: () => {},
  toggleViewMode: () => {},
});

export const useViewMode = () => useContext(ViewModeContext);

interface ViewModeProviderProps {
  children: ReactNode;
}

export const ViewModeProvider: React.FC<ViewModeProviderProps> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<'teacher' | 'student'>(() => {
    const saved = localStorage.getItem('greyedViewMode');
    return (saved as 'teacher' | 'student') || 'teacher';
  });

  const setViewMode = (mode: 'teacher' | 'student') => {
    setViewModeState(mode);
    localStorage.setItem('greyedViewMode', mode);
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'teacher' ? 'student' : 'teacher';
    setViewMode(newMode);
  };

  useEffect(() => {
    localStorage.setItem('greyedViewMode', viewMode);
  }, [viewMode]);

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};
