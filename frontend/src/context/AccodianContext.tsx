import { AccordionVariants } from '@/components/TodoAccordion';
import { createContext, useContext, ReactNode } from 'react';

type AccordionContextType = {
  variant: AccordionVariants;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

type AccordionProviderProps = {
  children: ReactNode;
  variant: AccordionVariants;
};

export const AccordionProvider = ({ children, variant }: AccordionProviderProps) => {
  return (
    <AccordionContext.Provider value={{ variant }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordionContext must be used within an AccordionProvider");
  }
  return context;
};
