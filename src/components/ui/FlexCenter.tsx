import React, { ReactNode } from 'react';

interface FlexCenterProps {
  children: ReactNode;
  className?: string;
}

export const FlexCenter: React.FC<FlexCenterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};
