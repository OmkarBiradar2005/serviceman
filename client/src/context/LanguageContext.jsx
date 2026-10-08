import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../locales/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language or default to English
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem('language', language);
    // Set document language attribute
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const getCurrentLanguage = () => {
    const languages = {
      en: 'English',
      hi: 'हिंदी',
      mr: 'मराठी'
    };
    return languages[language] || 'English';
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        getCurrentLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
