import React, { createContext, useState, ReactNode } from 'react';

type BillingPeriod = 'monthly' | 'yearly';

interface BillingContextType {
  billingPeriod: BillingPeriod;
  setBillingPeriod: (billingPeriod: BillingPeriod) => void;
}

export const BillingContext = createContext<BillingContextType>({
  billingPeriod: 'monthly',
  setBillingPeriod: () => {},
});

interface BillingProviderProps {
  children: ReactNode;
}

export const BillingProvider: React.FC<BillingProviderProps> = ({ children }) => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  return (
    <BillingContext.Provider value={{ billingPeriod, setBillingPeriod }}>
      {children}
    </BillingContext.Provider>
  );
};