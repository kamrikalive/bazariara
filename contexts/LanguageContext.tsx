'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ruTranslations from '@/lib/translations/ru.json';
import enTranslations from '@/lib/translations/en.json';

type Language = 'ru' | 'en';

type Translations = typeof ruTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load language from localStorage or default to 'ru'
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'ru' || savedLanguage === 'en') {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isClient) {
      localStorage.setItem('language', lang);
      // Update html lang attribute
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (isClient) {
      document.documentElement.lang = language;
    }
  }, [language, isClient]);

  const getTranslation = (key: string, params?: Record<string, string | number>): string => {
    const translations = language === 'en' ? enTranslations : ruTranslations;
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    if (typeof value !== 'string') return key;

    // Replace placeholders like {amount} with actual values
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: getTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
