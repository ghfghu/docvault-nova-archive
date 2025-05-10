
import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '@/translations';
import type { LanguageContextType } from '@/types/language';
import type { LanguageCode } from '@/translations';

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Function to translate text
  const t = useCallback((key: string) => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
