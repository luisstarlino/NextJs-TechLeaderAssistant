
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';

interface TransitionContextProps {
  isTransitioning: boolean;
  startTransition: () => void;
}

const TransitionContext = createContext<TransitionContextProps | undefined>(
  undefined
);

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  useEffect(() => {
    // End transition whenever the pathname changes
    if (isTransitioning) {
        // A small timeout to let the new page render before hiding the loader
        const timer = setTimeout(() => setIsTransitioning(false), 100);
        return () => clearTimeout(timer);
    }
  }, [pathname, isTransitioning]);

  const value = {
    isTransitioning,
    startTransition,
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};
