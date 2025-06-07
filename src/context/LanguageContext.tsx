
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '@/translations';
import type { LanguageContextType } from '@/types/language';
import type { LanguageCode } from '@/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectDeviceLanguage = (): LanguageCode => {
  const deviceLang = navigator.language.split('-')[0].toLowerCase();
  console.log('Device language detected:', deviceLang);
  
  // Only support Arabic and English
  if (deviceLang === 'ar') {
    return 'ar';
  }
  
  // Default to English for all other languages
  return 'en';
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('language') as LanguageCode;
    if (saved && (saved === 'en' || saved === 'ar')) {
      return saved;
    }
    return detectDeviceLanguage();
  });

  // Set document direction and language attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string) => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  }, [language]);

  const changeLanguage = useCallback((newLanguage: LanguageCode) => {
    if (newLanguage === 'en' || newLanguage === 'ar') {
      setLanguage(newLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
